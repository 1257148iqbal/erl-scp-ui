import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { DAILY_PRODUCTION } from 'constants/ApiEndPoints/v1/dailyProduction';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_PRODUCTIONS } from 'constants/permissionsType';
import { ASC } from 'constants/SortedBy';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import { useDailyProductionListStyles } from '../styles';
import DailyProductionDetails from '../View/DailyProductionDetails';

const ArchiveDailyProductionList = props => {
  const classes = useDailyProductionListStyles();

  //#region States
  const [state, setState] = useState([]);

  const [activeDataLength, setActiveDataLength] = React.useState(0);

  const [confirmDialog, setConfirmDialog] = React.useState({
    title: '',
    content: '',
    isOpen: false
  });

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [sortedBy, setSortedBy] = useState(ASC);
  const [sortedColumn, setSortedColumn] = useState('Date');
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [details, setDetails] = useState(null);

  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetirievePermission = userPermission?.includes(DAILY_PRODUCTIONS.RETRIEVE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      isDisableSorting: false
    }
  ];
  //#endregion

  //#region UDF

  const getAllDailyProductions = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(`${DAILY_PRODUCTION.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const dailyProduction = res.data.data;
          setState(dailyProduction);
          setActiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllDailyProductions(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onSort = cellName => {
    const isAsc = sortedColumn === cellName && sortedBy === 'asc';
    setSortedBy(isAsc ? 'desc' : 'asc');
    setSortedColumn(cellName);
  };
  const onView = async row => {
    try {
      const details = await http.get(`${DAILY_PRODUCTION.get_single}/${row.key}`);
      setDetails(details.data.data);
      setOpenDetailsView(true);
    } catch ({ response: { data } }) {
      toastAlerts('error', data.Message);
    }
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DAILY_PRODUCTION.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllDailyProductions();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(activeDataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton={hasRetirievePermission}
                  onView={() => onView(row)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Restore Daily Prodcution?',
                      content: 'Are you sure to restore this daily prodcution??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
                  confirmButtonText="Delete"
                  cancelButtonText="Cancel"
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog
        open={openDetailsView}
        setOpen={setOpenDetailsView}
        title="Daily Production Details"
        fileName={`DaylyProduction`}
        document={<PDFView data={details} />}>
        <DailyProductionDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveDailyProductionList;

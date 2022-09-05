import { Box, Grid, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog, NewButton } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { DAILY_PRODUCTION } from 'constants/ApiEndPoints/v1/dailyProduction';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_PRODUCTIONS } from 'constants/permissionsType';
import { ASC } from 'constants/SortedBy';
import qs from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import { useDailyProductionListStyles } from '../styles';
import DailyProductionDetails from '../View/DailyProductionDetails';

const ActiveDailyProductionList = props => {
  const classes = useDailyProductionListStyles();
  const history = useHistory();
  const location = useLocation();

  //#region States
  const [state, setState] = useState([]);
  const [details, setDetails] = useState(null);

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

  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(DAILY_PRODUCTIONS.EDIT);
  const hasDeletePermission = userPermission?.includes(DAILY_PRODUCTIONS.DELETE);
  const hasCreatePermission = userPermission?.includes(DAILY_PRODUCTIONS.CREATE);
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

  const getAllDailyProductions = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(`${DAILY_PRODUCTION.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          const dailyProduction = res.data.data;
          setState(dailyProduction);
          setActiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllDailyProductions(), [rowPerPage, page, sortedColumn, sortedBy, getAllDailyProductions]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onNavigateNewForm = () => {
    history.push({ pathname: `${location.pathname}/create` });
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

  const onEdit = row => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: row.key
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${DAILY_PRODUCTION.delete}/${key}`)
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
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onNavigateNewForm} appeared={hasCreatePermission} />
          </Grid>
        </Grid>
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
                  appearedDeleteButton={hasDeletePermission}
                  appearedEditButton={hasEditPermission}
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Daily Prodcution?',
                      content: 'Are you sure to delete this daily prodcution??',
                      onConfirm: () => onDelete(row.key)
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

export default ActiveDailyProductionList;

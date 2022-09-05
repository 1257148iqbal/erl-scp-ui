import { Box, Collapse, Grid, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomTable,
  DetailsViewDialog,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { OPERATOR_DUTY_LOG_API } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { sleep } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import { useDecokingListStyles } from 'views/Application/MasterData/DecokingNumber/style';
import PDFView from '../Report/PDFView';
import AssignToDutyDetails from '../View/AssignToDutyDetails';

//#region Colums for Table
const columns = [
  {
    sortName: 'date',
    name: 'date',
    label: 'Date',
    minWidth: 200,
    isDisableSorting: false
  },
  {
    sortName: 'shiftName',
    name: 'shiftName',
    label: 'Shift',
    minWidth: 200,
    isDisableSorting: true
  },
  {
    sortName: 'operatorGroupName',
    name: 'operatorGroupName',
    label: 'Operator Group',
    minWidth: 200,
    isDisableSorting: true
  }
];
//#endregion

const ArchiveOperatorDutyLogList = props => {
  const classes = useDecokingListStyles();

  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [openFilter] = useState(false);
  const [filterState, setFilterState] = useState({
    dockingParameters: '',
    units: ''
  });

  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [rowDetails, setRowDetails] = useState({});
  //#endregion

  //#region UDF
  const fetchArchiveDutyLogs = async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    try {
      const res = await http.get(OPERATOR_DUTY_LOG_API.get_archive, { params: queryParam });
      const dutyLogs = res.data.data;
      setState(dutyLogs);
      setDataLength(res.data.totalNoOfRow);
    } catch (err) {
      toastAlerts('warning', err);
    }
  };
  //#endregion

  //#region Hooks
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchDutyLogs = async () => {
      const queryParam = {
        PageNumber: page,
        PageSize: rowPerPage
      };

      try {
        const res = await http.get(OPERATOR_DUTY_LOG_API.get_archive, { params: queryParam, signal: controller.signal });
        const dutyLogs = res.data.data;
        await sleep(500);
        if (isMounted) {
          setState(dutyLogs);
          setDataLength(res.data.totalNoOfRow);
        }
      } catch (err) {
        toastAlerts('warning', err);
      }
    };
    trackPromise(fetchDutyLogs());

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, rowPerPage]);
  //#endregion

  //#region Events

  //#region Events
  const onFilterInputChange = e => {
    const { name, value } = e.target;
    setFilterState({
      ...filterState,
      [name]: value
    });
  };

  //#endregion

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    setRowDetails(row);
    setOpenDetailsView(true);
  };

  const onRestore = async (key, archiveDutyLogCallback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const res = await http.put(`${OPERATOR_DUTY_LOG_API.restore}/${key}`);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        archiveDutyLogCallback();
      }
    } catch (err) {
      toastAlerts('warning', err);
    }
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Collapse in={openFilter}>
          <div className={classes.filteredItems}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Decoking Number"
                  name="decokingNumber"
                  className={classes.filterBoxBackground}
                  value={filterState.decokingNumber}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Details"
                  name="details"
                  className={classes.filterBoxBackground}
                  value={filterState.details}
                  onChange={onFilterInputChange}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <SearchButton className={classes.actionButton} onClick={() => {}} />
              <ResetButton className={classes.actionButton} onClick={() => {}} />
            </Grid>
          </div>
        </Collapse>

        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell>{row.shiftName}</StyledTableCell>
              <StyledTableCell>{row.operatorGroupName}</StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton
                  onView={() => onView(row)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Store duty log?',
                      content: 'Are you sure to re-store this record??',
                      onConfirm: () => onRestore(row.key, fetchArchiveDutyLogs)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
        <DetailsViewDialog
          open={openDetailsView}
          setOpen={setOpenDetailsView}
          title="Duty Operators Details"
          fileName={'DutyDetails'}
          document={<PDFView data={rowDetails} />}>
          <AssignToDutyDetails data={rowDetails} />
        </DetailsViewDialog>
      </Paper>

      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ArchiveOperatorDutyLogList, 'id');

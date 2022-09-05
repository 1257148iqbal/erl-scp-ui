import { Box, Button, Collapse, Grid, Paper } from '@material-ui/core';
import { Memory } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomTable,
  DetailsViewDialog,
  FabUnLock,
  NewButton,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { OPERATOR_DUTY_LOG_API } from 'constants/ApiEndPoints/v1';
import { OPERATOR_DUTY_LOG } from 'constants/permissionsType';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
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
  },
  {
    name: 'Locked',
    label: 'Locked',
    minWidth: 170,
    isDisableSorting: true
  }
];
//#endregion

const HistoryOperatorDutyLogList = props => {
  const { sortedColumn, sortedBy, onSort } = props;
  //#region hooks
  const classes = useDecokingListStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  const history = useHistory();
  const location = useLocation();
  //#endregion

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

  //#region Action Button Permission Check
  const hasUnlockPermission = userPermission?.includes(OPERATOR_DUTY_LOG.UNLOCK);
  const hasCreatePermission = userPermission?.includes(OPERATOR_DUTY_LOG.CREATE);
  //#endregion

  //#region UDF
  const fetchHsitoryDutyLogs = async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    try {
      const res = await http.get(OPERATOR_DUTY_LOG_API.get_history, { params: queryParam });
      const dutyLogs = res.data.data;
      setState(dutyLogs);
      setDataLength(res.data.totalNoOfRow);
    } catch (err) {
      toastAlerts('warning', err);
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchDutyLogs = async () => {
      const queryParam = {
        PageNumber: page,
        PageSize: rowPerPage
      };

      try {
        const res = await http.get(OPERATOR_DUTY_LOG_API.get_history, { params: queryParam, signal: controller.signal });
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
  const onNavigateNewPage = () => {
    history.push({
      pathname: `${location.pathname}/create`
    });
  };

  const onNavigateCreateSpecificForm = () => {
    history.push({
      pathname: `${location.pathname}/create-specific`
    });
  };

  const onFilterInputChange = e => {
    const { name, value } = e.target;
    setFilterState({
      ...filterState,
      [name]: value
    });
  };

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

  const onLockStatusChange = (key, historyDutyCallback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${OPERATOR_DUTY_LOG_API.unlock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            historyDutyCallback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onNavigateNewPage} appeared={hasCreatePermission} />
            <Button
              className={classes.btnSpecific}
              color="primary"
              variant="contained"
              endIcon={<Memory />}
              onClick={onNavigateCreateSpecificForm}>
              Create Specific
            </Button>
          </Grid>
          {/* <Grid item container justifyContent="flex-end" xs={6} sm={6} md={6} lg={6}>
            <Toolbar className={classes.toolbar}>
              <Tooltip title="Filter list">
                <IconButton onClick={() => setOpenFilter(filter => !filter)}>
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Grid> */}
        </Grid>

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
              <StyledTableCell>
                {hasUnlockPermission && (
                  <FabUnLock
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Unlock Duty Log?',
                        content: 'Do you want to unlock this record?',
                        onConfirm: () => onLockStatusChange(row.key, fetchHsitoryDutyLogs)
                      })
                    }
                  />
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup appearedViewButton onView={() => onView(row)} />
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

export default withSortBy(HistoryOperatorDutyLogList, 'id');

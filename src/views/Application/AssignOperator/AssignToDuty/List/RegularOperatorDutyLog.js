import { Box, Collapse, Grid, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomTable,
  DetailsViewDialog,
  FabLock,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { OPERATOR_DUTY_LOG_API } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { OPERATOR_DUTY_LOG } from 'constants/permissionsType';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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

const RegularOperatorDutyLogList = props => {
  const { sortedColumn, sortedBy, onSort } = props;
  //#region hooks
  const classes = useDecokingListStyles();
  const history = useHistory();
  const location = useLocation();
  //#endregion

  //#region States
  const [state, setState] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [openFilter] = useState(false);
  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [rowDetails, setRowDetails] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });
  const [filterState, setFilterState] = useState({
    dockingParameters: '',
    units: ''
  });
  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(OPERATOR_DUTY_LOG.EDIT);
  const hasDeletePermission = userPermission?.includes(OPERATOR_DUTY_LOG.DELETE);
  const hasLockPermission = userPermission?.includes(OPERATOR_DUTY_LOG.LOCK);
  //#endregion

  //#region UDF
  const fetchActiveDutyLogs = async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    try {
      const res = await http.get(OPERATOR_DUTY_LOG_API.get_active, { params: queryParam });
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
        const res = await http.get(OPERATOR_DUTY_LOG_API.get_active, { params: queryParam, signal: controller.signal });
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

  const onLockStatusChange = (key, activeDutyLogCallback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${OPERATOR_DUTY_LOG_API.lock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            activeDutyLogCallback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onView = row => {
    setRowDetails(row);
    setOpenDetailsView(true);
  };

  const onEdit = key => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: key
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${OPERATOR_DUTY_LOG_API.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          fetchActiveDutyLogs();
        }
      })
      .catch(err => toastAlerts('error', internalServerError));
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
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
                {hasLockPermission && (
                  <FabLock
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Lock Duty Lab',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, fetchActiveDutyLogs)
                      });
                    }}
                  />
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedEditButton={hasEditPermission}
                  appearedDeleteButton={hasDeletePermission}
                  editInProgress={row.editInProgress}
                  onView={() => onView(row)}
                  onEdit={() => onEdit(row.key)}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Decoking Number?',
                      content: 'Are you sure to delete this decoking number??',
                      onConfirm: () => onDelete(row.key)
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

export default withSortBy(RegularOperatorDutyLogList, 'id');

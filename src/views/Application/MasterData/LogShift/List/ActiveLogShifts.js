import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  NewButton,
  Switch
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { SHIFT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { SHIFTS } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import ShiftForm from '../Form/LogShiftForm';
import LogShiftDetails from '../View/LogShiftDetails';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  filteredItems: {
    padding: 10,
    backgroundColor: '#ECF0F6',
    borderRadius: 5,
    margin: 10
  },
  actionButton: {
    marginLeft: 5
  },
  filterBoxBackground: {
    backgroundColor: '#FFFFFF'
  }
}));

const ActiveShiftsList = props => {
  const classes = useStyles();

  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(SHIFTS.EDIT);
  const hasDeletePermission = userPermission?.includes(SHIFTS.DELETE);

  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [recordForEdit, setRecordForEdit] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [dataLength, setDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [logShiftKey, setLogShiftKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'ShiftName',
      name: 'shiftName',
      label: 'Shift Name',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      name: 'fromTime',
      label: 'Start Time',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'toTime',
      label: 'End Time',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      sortName: 'Alias',
      name: 'alias',
      label: 'Alias',
      isDisableSorting: false
    },
    {
      name: 'isActive',
      label: 'Status',
      format: value => (value ? 'Active' : 'In-Active'),
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getAllShift = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(`${SHIFT.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          const shifts = res.data.data;
          setState(shifts);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllShift(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    setLogShiftKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${SHIFT.get_single}/${key}`);
      if (res.data.succeeded) {
        setRecordForEdit(res.data.data);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (error) {
      toastAlerts('warning', error);
    }
  };

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${SHIFT.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllShift();
        } else {
          toastAlerts('error', res.data.message);
          getAllShift();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getAllShift();
      });
  };
  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${SHIFT.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllShift();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onSubmit = (e, formValue) => {
    setLoading(true);
    setOpenBackdrop(true);
    const id = formValue.id;
    const key = formValue.key;
    if (id > 0) {
      const data = {
        id: id,
        key: key,
        shiftName: formValue.shiftName,
        fromTime: formValue.fromTime,
        toTime: formValue.toTime,
        alias: formValue.alias,
        isActive: formValue.isActive,
        isEndNextDay: formValue.isEndNextDay
      };

      http
        .put(`${SHIFT.update}/${key}`, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllShift();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(SHIFT.create, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllShift();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    }
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={12} sm={12} md={12} lg={12}>
            <NewButton onClick={onDrawerOpen} appeared />
          </Grid>
        </Grid>
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
              <StyledTableCell>{row.shiftName}</StyledTableCell>
              <StyledTableCell>{row.fromTime}</StyledTableCell>
              <StyledTableCell>{row.toTime}</StyledTableCell>
              <StyledTableCell>{row.alias}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Shift?',
                      content: 'Are you sure to active this shift??',
                      onConfirm: () => onStatusChange(row)
                    });
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton={hasDeletePermission}
                  appearedEditButton={hasEditPermission}
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row.key);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Shift?',
                      content: 'Are you sure to delete this shift??',
                      onConfirm: () => onDelete(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Log Shift">
        <ShiftForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>

      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Log Shift Details">
        <LogShiftDetails itemKey={logShiftKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ActiveShiftsList, 'ShiftName');

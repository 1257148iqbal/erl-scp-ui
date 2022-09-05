import {
  Box,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  lighten,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomDrawer,
  CustomPagination,
  DetailsViewDialog,
  NewButton
} from 'components/CustomControls';
import { TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { TIME_SLOTS } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import TimeSlotForm from '../Form/TimeSlotForm';
import TimeSlotDetails from '../View/TimeSlotDetails';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 800
  },
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
  },
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#546E7A',
      '& > .MuiTableCell-root': {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
      }
    }
  },
  tableCell: {
    backgroundColor: '#37474F',
    color: '#FFFFFF'
  }
}));
const ActiveTimeSlotsList = () => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(TIME_SLOTS.EDIT);
  const hasDeletePermission = userPermission?.includes(TIME_SLOTS.DELETE);
  //#endregion

  const { setOpenBackdrop, setLoading } = useBackDrop();
  //#region States
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });

  const [recordForEdit, setRecordForEdit] = React.useState(null);

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [timeSlotKey, setTimeSlotKey] = React.useState(null);
  //#endregion

  //#region UDF

  const getAllTimeSlot = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${TIME_SLOT.get_all_by_operation_group}?${qs.stringify(queryParam)}`)
        .then(res => {
          const slots = res.data.data.map(slot => ({
            ...slot,
            open: false,
            inSideSlots: slot.timeSlots.length
          }));
          setState(slots);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  //#endregion

  ////#region  Hooks
  useEffect(() => getAllTimeSlot(), [rowPerPage, page]);

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onRowToggle = rowId => {
    const updatedSlots = state.map(item => {
      if (item.id === rowId) {
        item['open'] = !item.open;
      }
      return item;
    });
    setState(updatedSlots);
  };

  const onView = row => {
    setTimeSlotKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${TIME_SLOT.get_single}/${key}`);
      if (res.data.succeeded) {
        const timeSlot = res.data.data;
        setRecordForEdit(timeSlot);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${TIME_SLOT.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllTimeSlot();
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
        slotName: formValue.slotName,
        operationGroupId: formValue.operationGroupId,
        operationGroupName: formValue.operationGroupName,
        shiftId: formValue.shiftId,
        shiftName: formValue.shiftName,
        fromTime: formValue.fromTime,
        toTime: formValue.toTime,
        isEndNextDay: formValue.isEndNextDay,
        isActive: formValue.isActive
      };

      http
        .put(`${TIME_SLOT.update}/${key}`, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllTimeSlot();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(TIME_SLOT.create, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllTimeSlot();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('error', err);
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
        <TableContainer component={Paper} className={classes.root}>
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell} />
                <TableCell className={classes.tableCell}>Operation Group</TableCell>
                <TableCell className={classes.tableCell} align="center">
                  Total Slots Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow hover selected={row.open} className={classes.tableRow}>
                    <TableCell>
                      <IconButton size="small" onClick={() => onRowToggle(row.id)}>
                        {row.open ? <KeyboardArrowUp style={{ color: '#FFFFFF' }} /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell style={{ minWidth: 200 }}>{row.groupName}</TableCell>
                    <TableCell style={{ minWidth: 200 }} align="center">
                      {row.inSideSlots}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={row.open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Slot Name
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Shift
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Start Time
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  End Time
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#78909C', color: '#FFFFFF', minWidth: 170 }}>
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.timeSlots.map(tag => (
                                <TableRow key={tag.id} hover>
                                  <TableCell style={{ minWidth: 170 }}>{tag.slotName}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>{tag.shiftName}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>{tag.fromTime}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>{tag.toTime}</TableCell>
                                  <TableCell style={{ minWidth: 170 }}>
                                    <ActionButtonGroup
                                      appearedViewButton
                                      appearedDeleteButton={hasDeletePermission}
                                      appearedEditButton={hasEditPermission}
                                      onView={() => onView(tag)}
                                      onEdit={() => {
                                        onEdit(tag.key);
                                      }}
                                      onDelete={() => {
                                        setConfirmDialog({
                                          isOpen: true,
                                          title: 'Delete Tag?',
                                          content: 'Are you sure to delete this tag??',
                                          onConfirm: () => onDelete(tag.key)
                                        });
                                      }}
                                    />
                                    <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container style={{ padding: 10 }}>
          <Grid item container justifyContent="flex-start" xs={12} sm={6} md={6} lg={6}>
            <FormControl>
              <Typography>Row per page : {'\u00A0'}</Typography>
            </FormControl>
            <Select value={rowPerPage} onChange={onRowPerPageChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </Grid>
          <Grid item container justifyContent="flex-end" xs={12} sm={6} md={6} lg={6}>
            <CustomPagination count={Math.ceil(dataLength / rowPerPage)} onChange={onPageChange} />
          </Grid>
        </Grid>
      </Paper>
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Time Slot">
        <TimeSlotForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Time Slot Details">
        <TimeSlotDetails itemKey={timeSlotKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default ActiveTimeSlotsList;

import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TableCell,
  TableRow,
  Toolbar,
  Tooltip,
  withStyles
} from '@material-ui/core';
import { FilterList, Memory } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomTable,
  DetailsViewDialog,
  FabLock,
  NewButton,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import { SHIFT, SWITCH_LOG } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { SWITCH_LOGS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, isSameDate, serverDate, time24 } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import SwitchLogDetails from '../View/SwitchLogDetails';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    '&:hover': {
      backgroundColor: '#DAE9F8',
      cursor: 'pointer'
    }
  }
}))(TableRow);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.dark,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

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
  btnSpecific: {
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: 5
    }
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
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  },
  btnLockChild: {
    color: '#FF8C00'
  },
  btnLockParent: {
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FF8C00',
      '& $btnLockChild': {
        color: '#FFFFFF'
      }
    }
  }
}));

const initialFilterState = {
  name: '',
  alias: ''
};

const SwitchLogList = props => {
  const classes = useStyles();
  const { history, location } = props;

  //#region States
  const [openFilter, setOpenFilter] = React.useState(false);

  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);

  const [filterState, setFilterState] = React.useState(initialFilterState);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [details, setDetails] = React.useState(null);

  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(SWITCH_LOGS.EDIT);
  const hasDeletePermission = userPermission?.includes(SWITCH_LOGS.DELETE);
  const hasCreatePermission = userPermission?.includes(SWITCH_LOGS.CREATE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'date',
      label: 'Date',
      format: value => formattedDate(value),
      isDisableSorting: true
    },
    {
      name: 'shiftName',
      label: 'Shift',
      minWidth: 170,
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

  //#region UDF

  const getSwitchLogs = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${SWITCH_LOG.get_active}?${qs.stringify(queryParam)}`)
        .then(res => {
          const switchLogs = res.data.data;
          setState(switchLogs);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  const onNavigateNewForm = () => {
    history.push({
      pathname: `${location.pathname}/create`
    });
  };

  const onNavigateCreateSpecificForm = () => {
    history.push({
      pathname: `${location.pathname}/create-specific`
    });
  };

  //#endregion

  //#region Hooks
  useEffect(() => {
    getSwitchLogs();
  }, [rowPerPage, page]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onFilterInputChange = e => {
    const { name, value } = e.target;
    setFilterState({
      ...filterState,
      [name]: value
    });
  };

  const onFilterInputReset = () => {
    setFilterState(initialFilterState);
  };

  const onView = async row => {
    try {
      const res = await http.get(`${SWITCH_LOG.get_single}/${row.key}`);
      setDetails(res.data.data);
      setOpenDetailsView(true);
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  const onEdit = row => {
    const isLocked = row.isLocked;
    if (!isLocked) {
      history.push({
        pathname: `${location.pathname}/edit`,
        state: row.key
      });
    } else {
      const shiftId = row.shiftId;
      const date = serverDate(row.data);
      const currentDate = serverDate(new Date());
      if (isSameDate(serverDate(date), serverDate(currentDate))) {
        const queryParam = {
          CurrentTime: time24(new Date())
        };
        http.get(`${SHIFT.get_current_shift}?${qs.stringify(queryParam)}`).then(res => {
          const currentShift = res.data;

          if (currentShift.succeeded) {
            const id = currentShift.data.id;
            if (id === shiftId) {
              history.push({
                pathname: `${location.pathname}/edit`,
                state: row.key
              });
            } else {
              toastAlerts('error', 'Invalid time slot');
            }
          } else {
            toastAlerts('error', res.data.message);
          }
        });
      } else {
        toastAlerts('error', 'not current date');
      }
    }
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${SWITCH_LOG.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getSwitchLogs();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onLockStatusChange = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${SWITCH_LOG.lock_switch_log}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            getSwitchLogs();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };
  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <NewButton onClick={onNavigateNewForm} appeared={hasCreatePermission} />
              <Button
                className={classes.btnSpecific}
                color="primary"
                variant="contained"
                endIcon={<Memory />}
                onClick={onNavigateCreateSpecificForm}>
                Create Specific
              </Button>
            </Grid>
          </Grid>
          <Grid item container justifyContent="flex-end" xs={6} sm={6} md={6} lg={6}>
            <Toolbar className={classes.toolbar}>
              <Tooltip title="Filter list">
                <IconButton onClick={() => setOpenFilter(filter => !filter)}>
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Grid>
        </Grid>

        <Collapse in={openFilter}>
          <div className={classes.filteredItems}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Group Name"
                  name="name"
                  className={classes.filterBoxBackground}
                  value={filterState.name}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Alias"
                  name="alias"
                  className={classes.filterBoxBackground}
                  value={filterState.alias}
                  onChange={onFilterInputChange}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <SearchButton className={classes.actionButton} onClick={() => {}} />
              <ResetButton className={classes.actionButton} onClick={onFilterInputReset} />
            </Grid>
          </div>
        </Collapse>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell>{row.shiftName}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>
                {row.isLocked ? (
                  <Box className={classes.badgeRoot} component="span" bgcolor="#8DCD03">
                    Current
                  </Box>
                ) : (
                  <FabLock
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Locked Switch Log',
                        content: 'Do you want to locked Switch Log?',
                        onConfirm: () => onLockStatusChange(row.key)
                      });
                    }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton={hasDeletePermission}
                  appearedEditButton={hasEditPermission}
                  onView={() => {
                    onView(row);
                  }}
                  onEdit={() => {
                    onEdit(row);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Switch Log?',
                      content: 'Are you sure to delete this Switch Log??',
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
      <DetailsViewDialog
        open={openDetailsView}
        setOpen={setOpenDetailsView}
        title="Switch Log Details"
        fileName={`SwitchLog`}
        document={<PDFView data={details} />}>
        <SwitchLogDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default SwitchLogList;

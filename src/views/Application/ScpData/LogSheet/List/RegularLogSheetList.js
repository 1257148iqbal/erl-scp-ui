/*
  > Title: Log sheet List
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-08-18
*/

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
import { LOG_SHEET, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { LOG_SHEETS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, isSameDate, serverDate, time24 } from 'utils/dateHelper';
import LogSheet from '../Report/LogSheet';
import LogSheetDetails from '../View/LogSheetDetails';

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
  newButtons: {
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

const RegularLogSheetList = props => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { operationGroup } = useParams();
  const operationGroupId = operationGroup.split('-')[1];

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
  const hasEditPermission = userPermission?.includes(LOG_SHEETS.EDIT);
  const hasDeletePermission = userPermission?.includes(LOG_SHEETS.DELETE);
  const hasCreatePermission = userPermission?.includes(LOG_SHEETS.CREATE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'date',
      label: 'Date',
      minWidth: 170,
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
      name: 'slotName',
      label: 'Slot',
      minWidth: 170,
      isDisableSorting: true
    },
    {
      name: 'sectionName',
      label: 'Section',
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

  const getLogSheets = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      OperationGroupId: operationGroupId
    };

    trackPromise(
      http
        .get(LOG_SHEET.get_active, { params: queryParam })
        .then(res => {
          const logsheets = res.data.data;
          setState(logsheets);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getLogSheets();
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

  const onView = row => {
    if (row.key) {
      http
        .get(`${LOG_SHEET.get_single}/${row.key}`)
        .then(res => {
          if (res.data.succeeded) {
            setDetails(res.data.data);
          }
        })
        .catch(err => toastAlerts('error', err));
    }
    setOpenDetailsView(true);
  };

  const onEdit = row => {
    const isLocked = row.isLocked;
    const operationGroupId = row.operationGroupId;
    if (!isLocked) {
      history.push({
        pathname: `${location.pathname}/edit`,
        state: row.key
      });
    } else {
      const timeSlotId = row.timeSlotId;
      const date = serverDate(row.date);
      const currentDate = serverDate(new Date());
      if (isSameDate(serverDate(date), serverDate(currentDate))) {
        const queryParam = {
          OperationGroupId: operationGroupId,
          CurrentTime: time24(new Date())
        };
        http.get(`${TIME_SLOT.get_currentTimeSlot}?${qs.stringify(queryParam)}`).then(res => {
          if (res.data.succeeded) {
            const id = res.data.data.id;
            if (id === timeSlotId) {
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
      .delete(`${LOG_SHEET.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getLogSheets();
        }
      })
      .catch(err => toastAlerts('warning', err));
  };

  const onLockStatusChange = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${LOG_SHEET.lock_log_sheet}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            getLogSheets();
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
          <Grid item container justifyContent="flex-start" className={classes.newButtons} xs={6} sm={6} md={6} lg={6}>
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
              <SearchButton className={classes.actionButton} onClick={onFilterInputReset} />
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
              <StyledTableCell style={{ minWidth: 170 }}>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>{row.shiftName}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>{row.slotName}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>{row.sectionName}</StyledTableCell>
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
                        title: 'Locked Log Sheet',
                        content: 'Do you want to locked Log Sheet?',
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
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Log Sheet?',
                      content: 'Are you sure to delete this Log Sheet?',
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
        title="Log Sheet Details"
        fileName={`LogSheet`}
        document={<LogSheet data={details} />}>
        <LogSheetDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default RegularLogSheetList;

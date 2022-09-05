import { Box, Collapse, Grid, IconButton, Paper, Toolbar, Tooltip } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  NewButton,
  ResetButton,
  SearchButton,
  Switch,
  TextInput
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_NUMBERS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { DECOKING_NUMBER } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import DecokingNumberPage from '../Form/DecokingNumbersForm';
import { useDecokingListStyles } from '../style';
import DecokingNumberDetails from '../View/DecokingNumberDetails';

const ActiveDecokingNumber = props => {
  const classes = useDecokingListStyles();

  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [recordForEdit, setRecordForEdit] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterState, setFilterState] = React.useState({
    dockingParameters: '',
    units: ''
  });

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [parameterKey, setParemeterKey] = React.useState(null);
  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(DECOKING_NUMBER.EDIT);
  const hasDeletePermission = userPermission?.includes(DECOKING_NUMBER.DELETE);
  const hasCreatePermission = userPermission?.includes(DECOKING_NUMBER.CREATE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'DecokingNumber',
      name: 'decokingNumber',
      label: 'Decoking Number',
      minWidth: 200
    },
    {
      sortName: 'Details',
      name: 'details',
      label: 'Details',
      minWidth: 200
    },
    {
      sortName: 'FromDate',
      name: 'fromDate',
      label: 'From Date',
      minWidth: 150
    },
    {
      sortName: 'ToDate',
      name: 'toDate',
      label: 'To Date',
      minWidth: 150
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
  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const getActiveDecokingNumbers = () => {
    const queryParam = {
      PageNumber: 1,
      PageSize: 100
    };
    trackPromise(
      http
        .get(DECOKING_NUMBERS.get_all, { params: queryParam })
        .then(res => {
          if (res.data.succeeded) {
            setState(res.data.data.map(item => ({ ...item, editInProgress: false })));
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getActiveDecokingNumbers(), [rowPerPage, page]);
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

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${DECOKING_NUMBERS.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getActiveDecokingNumbers();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getActiveDecokingNumbers();
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
    setParemeterKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async row => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${DECOKING_NUMBERS.get_single}/${row.key}`);
      if (res.data.succeeded) {
        setRecordForEdit(res.data.data);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (err) {
      toastAlerts('warning', err);
    }
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${DECOKING_NUMBERS.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getActiveDecokingNumbers();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onSubmit = async (e, formValue) => {
    const { id, key, decokingNumber, details, fromDate, toDate, isActive } = formValue;
    setLoading(true);
    setOpenBackdrop(true);
    if (id > 0) {
      const data = {
        id,
        key,
        decokingNumber,
        details,
        fromDate,
        toDate,
        isActive
      };

      try {
        const res = await http.put(`${DECOKING_NUMBERS.update}/${key}`, data);
        toastAlerts('success', res.data.message);
        getActiveDecokingNumbers();
      } catch (error) {
        toastAlerts('warning', error);
      }
    } else {
      try {
        const res = await http.post(DECOKING_NUMBERS.create, formValue);
        toastAlerts('success', res.data.message);
        getActiveDecokingNumbers();
      } catch (error) {
        toastAlerts('warning', error);
      }
    }
    setDrawerOpen(false);
    setLoading(false);
    setOpenBackdrop(false);
  };
  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onDrawerOpen} appeared={hasCreatePermission} />
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
              <StyledTableCell>{row.decokingNumber}</StyledTableCell>
              <StyledTableCell>{row.details}</StyledTableCell>
              <StyledTableCell>{formattedDate(row.fromDate)}</StyledTableCell>
              <StyledTableCell>{row.toDate ? formattedDate(row.toDate) : 'None'}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active decoking number?',
                      content: 'Are you sure to active this record??',
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
                  editInProgress={row.editInProgress}
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row);
                  }}
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
      </Paper>

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Decoking Number">
        <DecokingNumberPage recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>

      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Decoking Number Details">
        <DecokingNumberDetails itemKey={parameterKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ActiveDecokingNumber, 'DecokingNumbers');

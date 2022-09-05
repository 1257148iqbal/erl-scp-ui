import { Box, Collapse, Grid, IconButton, makeStyles, Paper, Toolbar, Tooltip } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomTable,
  DetailsViewDialog,
  ResetButton,
  SearchButton,
  Switch,
  TextInput
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_PARAMETERS } from 'constants/ApiEndPoints/v1/decokingParameters';
import { internalServerError } from 'constants/ErrorMessages';
import { PARAMETER } from 'constants/permissionsType';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import DecokingParamerDetails from '../View/DecokingParameterDetails';

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
    backgroundColor: 'white'
  },
  formContainer: {
    padding: 15
  }
}));

const ArchiveDockingLogSheet = props => {
  const classes = useStyles();

  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
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
  const hasEditPermission = userPermission?.includes(PARAMETER.RETRIEVE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'OperationGroupName',
      name: 'operationGroupName',
      label: 'Operation Group Name',
      minWidth: 250
    },
    {
      sortName: 'DecokingParameters',
      name: 'decokingParameters',
      label: 'Decoking Parameters',
      minWidth: 270
    },
    {
      sortName: 'Units',
      name: 'units',
      label: 'Units',
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

  const getActiveDecokingParameters = () => {
    trackPromise(
      http
        .get(`${DECOKING_PARAMETERS.get_archive}`)
        .then(res => {
          if (res.data.succeeded) {
            const designations = res.data.data;
            setState(designations);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getActiveDecokingParameters(), [rowPerPage, page]);
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

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${DECOKING_PARAMETERS.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getActiveDecokingParameters();
        } else {
          toastAlerts('error', res.data.message);
          getActiveDecokingParameters();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getActiveDecokingParameters();
      });
  };

  const onView = row => {
    setParemeterKey(row.key);
    setOpenDetailsView(true);
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DECOKING_PARAMETERS.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getActiveDecokingParameters();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}></Grid>
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
                  label="Perameters"
                  name="dockingParameters"
                  className={classes.filterBoxBackground}
                  value={filterState.dockingParameters}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Units"
                  name="units"
                  className={classes.filterBoxBackground}
                  value={filterState.units}
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
              <StyledTableCell>{row.operationGroupName}</StyledTableCell>
              <StyledTableCell>{row.parameterName}</StyledTableCell>
              <StyledTableCell>{row.unitName}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Decoking Parameter?',
                      content: 'Are you sure to active this decoking parameter??',
                      onConfirm: () => onStatusChange(row)
                    });
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton={hasEditPermission}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Retreive Decoking Paramater?',
                      content: 'Are you sure to retreive this decoking paramater??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Decoking Parameter Details">
        <DecokingParamerDetails itemKey={parameterKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ArchiveDockingLogSheet, 'DecokingParameters');

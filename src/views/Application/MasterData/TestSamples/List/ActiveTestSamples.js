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
import { TEST_SAMPLE } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { TEST_SAMPLES } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import OperationGroupForm from '../Form/TestSampleForm';
import TestSampleDetails from '../View/TestSampleDetails';

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

const ActiveTestSamples = props => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(TEST_SAMPLES.EDIT);
  const hasDeletePermission = userPermission?.includes(TEST_SAMPLES.DELETE);
  //#endregion

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

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [testSampleKey, setTestSampleKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'labUnitName',
      label: 'Unit',
      isDisableSorting: true
    },
    {
      sortName: 'SampleName',
      name: 'sampleName',
      label: 'Sample',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      sortName: 'Density',
      name: 'density',
      label: 'Density',
      isDisableSorting: false
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
  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const getAllActiveTestSamples = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(`${TEST_SAMPLE.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const testSamples = res.data.data;
            setState(testSamples);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllActiveTestSamples(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${TEST_SAMPLE.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllActiveTestSamples();
        } else {
          toastAlerts('error', res.data.message);
          getAllActiveTestSamples();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getAllActiveTestSamples();
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
    setTestSampleKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${TEST_SAMPLE.get_single}/${key}`);
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
  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${TEST_SAMPLE.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllActiveTestSamples();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onSubmit = (e, formValue) => {
    setLoading(true);
    setOpenBackdrop(true);
    const id = formValue.id;
    const key = formValue.key;
    const data = { ...formValue, density: formValue.density ? formValue.density : 0 };

    if (id > 0) {
      http
        .put(`${TEST_SAMPLE.update}/${key}`, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllActiveTestSamples();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(TEST_SAMPLE.create, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllActiveTestSamples();
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
      <Paper>
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
              <StyledTableCell>{row.labUnitName}</StyledTableCell>
              <StyledTableCell>{row.sampleName}</StyledTableCell>
              <StyledTableCell>{row.density}</StyledTableCell>
              <StyledTableCell>{row.alias}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Sample?',
                      content: 'Are you sure to active this Sample??',
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
                      title: 'Delete Sample?',
                      content: 'Are you sure to delete this Sample??',
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

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Test Samples">
        <OperationGroupForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>

      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Test Sample Details">
        <TestSampleDetails itemKey={testSampleKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ActiveTestSamples, 'SampleName');

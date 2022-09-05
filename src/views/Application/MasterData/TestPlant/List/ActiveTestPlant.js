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
import { LAB_UNIT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { LAB_UNITS } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import OperatorGroupForm from '../Form/TestPlantForm';
import TestPlantDetails from '../View/TestPlantDetails';

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

const ActiveLabUnits = () => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(LAB_UNITS.EDIT);
  const hasDeletePermission = userPermission?.includes(LAB_UNITS.DELETE);
  //#endregion

  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region States
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [activeDataLength, setActiveDataLength] = React.useState(0);
  const [recordForEdit, setRecordForEdit] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({
    title: '',
    content: '',
    isOpen: false,
    confirmButtonText: '',
    cancelButtonText: ''
  });

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [testPlantKey, setTestPlantKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'unitName',
      label: 'Name',
      isDisableSorting: true
    },
    {
      name: 'alias',
      label: 'Alias',
      isDisableSorting: true
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

  const getAllActiveLabUnits = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${LAB_UNIT.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          const labunits = res.data.data;
          setState(labunits);
          setActiveDataLength(res.data.totalNoOfRow);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getAllActiveLabUnits(), [rowPerPage, page]);
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
    setTestPlantKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${LAB_UNIT.get_single}/${key}`);
      if (res.data.succeeded) {
        setRecordForEdit(res.data.data);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${LAB_UNIT.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
    getAllActiveLabUnits();
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${LAB_UNIT.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllActiveLabUnits();
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
      http
        .put(`${LAB_UNIT.update}/${key}`, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllActiveLabUnits();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(LAB_UNIT.create, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllActiveLabUnits();
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
          count={Math.ceil(activeDataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.unitName}</StyledTableCell>
              <StyledTableCell>{row.alias}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Department?',
                      content: 'Are you sure to active this department??',
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
                      title: 'Delete Department?',
                      content: 'Are you sure to delete this department??',
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
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Test Plant">
        <OperatorGroupForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Test Plant Details">
        <TestPlantDetails itemKey={testPlantKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default ActiveLabUnits;

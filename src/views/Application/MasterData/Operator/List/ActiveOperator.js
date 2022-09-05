import { Box, Collapse, Grid, makeStyles, Paper, Toolbar } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomAutoComplete,
  CustomBackDrop,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  FilterIcon,
  NewButton,
  ResetButton,
  SearchButton,
  Switch,
  TextInput
} from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { OPERATOR } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { OPERATORS } from 'constants/permissionsType';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useCallback, useEffect, useRef } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import OperatorForm from '../Form/OperatorForm';
import PDFView from '../Report/PDFView';
import OperatorDetails from '../View/OperatorDetails';

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

const ActiveOperatorList = props => {
  const classes = useStyles();
  const departmentRef = useRef();
  const designationRef = useRef();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(OPERATORS.EDIT);
  const hasDeletePermission = userPermission?.includes(OPERATORS.DELETE);
  //#endregion

  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [openFilter, setOpenFilter] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [department, setDepartment] = React.useState(null);
  const [departments, setDepartments] = React.useState([]);
  const [designation, setDesignation] = React.useState(null);
  const [designations, setDesignations] = React.useState([]);
  const [recordForEdit, setRecordForEdit] = React.useState(null);
  const [filterState, setFilterState] = React.useState({
    operatorName: '',
    operatorCode: ''
  });

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [operatorKey, setOperatorKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'OperatorCode',
      name: 'operatorCode',
      label: 'Employee Code',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      sortName: 'OperatorName',
      name: 'operatorName',
      label: 'Employee Name',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      sortName: 'operatorGroupName',
      name: 'operatorGroupName',
      label: 'Current Group',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'departmentName',
      label: 'Department',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'designationName',
      label: 'Designation',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'phoneNumber',
      label: 'Phone',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'email',
      label: 'Email',
      isDisableSorting: true,
      minWidth: 200
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

  const getAllOperators = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(`${OPERATOR.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          const operators = res.data.data;
          setState(operators);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllOperators(), [getAllOperators]);
  //#endregion

  //#region Events
  const onSearch = e => {};
  const onReset = e => {};

  const onDepartmentChange = (e, newValue) => {
    if (newValue) {
      setDepartment(newValue);
    } else {
      setDepartment(null);
    }
  };
  const onDesignationChange = (e, newValue) => {
    if (newValue) {
      setDesignation(newValue);
    } else {
      setDesignation(null);
    }
  };

  const onFilterToggle = e => {
    setOpenFilter(prevState => {
      if (!prevState) {
        // http call for departments
        setDepartments([
          { label: 'Department One', value: 1 },
          { label: 'Department Two', value: 2 }
        ]);
        return true;
      } else if (!prevState) {
        setDesignations([
          { label: 'Designation One', value: 1 },
          { label: 'Designation Two', value: 2 }
        ]);
        return true;
      } else {
        setDepartments([]);
        setDesignations([]);
      }
    });
  };
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

  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const onView = row => {
    setOperatorKey(row.key);
    setOpenDetailsView(true);
  };

  const onEdit = async key => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${OPERATOR.get_single}/${key}`);
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
      .put(`${OPERATOR.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllOperators();
        } else {
          toastAlerts('error', res.data.message);
          getAllOperators();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getAllOperators();
      });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${OPERATOR.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllOperators();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onSubmit = (e, formValue) => {
    const id = formValue.id;
    const key = formValue.key;
    setLoading(true);
    setOpenBackdrop(true);
    if (id > 0) {
      const data = {
        id,
        key,
        operatorCode: formValue.operatorCode,
        operatorName: formValue.operatorName,
        departmentId: formValue.departmentId,
        departmentName: formValue.departmentName,
        designationId: formValue.designationId,
        designationName: formValue.designationName,
        operatorGroupId: formValue.operatorGroupId,
        phoneNumber: formValue.phoneNumber,
        email: formValue.email,
        isActive: formValue.isActive
      };

      http
        .put(`${OPERATOR.update}/${key}`, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllOperators();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(OPERATOR.create, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
          } else {
            toastAlerts('error', res.data.message);
          }
          getAllOperators();
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
        <Grid container item xs={12}>
          <Grid item container justifyContent="flex-start" xs={6} style={{ alignItems: 'center' }}>
            <Grid className={classes.newBtn} item>
              <NewButton onClick={onDrawerOpen} appeared />
            </Grid>
            <PrintButton fileName="Operators" document={<PDFView data={state} />} />
          </Grid>
          <Grid item container justifyContent="flex-end" xs={6}>
            <Toolbar className={classes.toolbar}>
              <FilterIcon onClick={onFilterToggle} />
            </Toolbar>
          </Grid>
        </Grid>
        <Collapse in={openFilter}>
          <div className={classes.filteredItems}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextInput
                  label="Employee Name"
                  name="operatorName"
                  className={classes.filterBoxBackground}
                  value={filterState.operatorName}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextInput
                  label="Employee Code"
                  name="operatorCode"
                  className={classes.filterBoxBackground}
                  value={filterState.operatorCode}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <CustomAutoComplete
                  ref={departmentRef}
                  name="departmentId"
                  className={classes.filterBoxBackground}
                  data={departments}
                  label="Select Department"
                  value={department}
                  onChange={onDepartmentChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <CustomAutoComplete
                  ref={designationRef}
                  name="designationId"
                  className={classes.filterBoxBackground}
                  data={designations}
                  label="Select Designation"
                  value={designation}
                  onChange={onDesignationChange}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <SearchButton className={classes.actionButton} onClick={onSearch} />
              <ResetButton className={classes.actionButton} onClick={onReset} />
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
              <StyledTableCell>{row.operatorCode}</StyledTableCell>
              <StyledTableCell>{row.operatorName}</StyledTableCell>
              <StyledTableCell>{row.operatorGroupName}</StyledTableCell>
              <StyledTableCell>{row.departmentName}</StyledTableCell>
              <StyledTableCell>{row.designationName}</StyledTableCell>
              <StyledTableCell>{row.phoneNumber}</StyledTableCell>
              <StyledTableCell>{row.email}</StyledTableCell>
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
                      title: 'Delete Operator?',
                      content: 'Are you sure to delete this operator??',
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
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Operators">
        <OperatorForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Operator Details">
        <OperatorDetails itemKey={operatorKey} />
      </DetailsViewDialog>
      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ActiveOperatorList, 'OperatorName');

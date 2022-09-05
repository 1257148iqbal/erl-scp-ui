import CmtAvatar from '@coremat/CmtAvatar';
import {
  Box,
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
import Button from '@material-ui/core/Button';
import { FilterList } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  FabSetting,
  NewButton,
  PasswordBox,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import { USERS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import UserForm from '../form/UserCreateForm';
import UserEditForm from '../form/UserEditForm';
import UserDetails from '../View/UserDetails';

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
  resetButton: {
    margin: 5,
    border: 'none',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const ActiveUserList = props => {
  const classes = useStyles();
  const { REACT_APP_BASE_URL } = process.env;
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { authUser } = useSelector(({ auth }) => auth);

  //#region States
  const [openFilter, setOpenFilter] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customDrawerOpen, setCustomDrawerOpen] = useState(false);
  const [drawerOpenForEdit, setDrawerOpenForEdit] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [state, setState] = useState([]);
  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [details, setDetails] = useState(null);

  const [filterState, setFilterState] = useState({ fullName: '', alias: '' });

  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });

  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordState, setResetPasswordState] = useState({ userId: '', userName: '', password: '' });

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'fileName',
      label: 'Photo',
      isDisableSorting: true
    },
    {
      name: 'employeeID',
      label: 'Employee Code',
      minWidth: 130,
      isDisableSorting: true
    },
    {
      name: 'fullName',
      label: 'Full Name',
      minWidth: 130,
      isDisableSorting: true
    },
    {
      name: 'phoneNumber',
      label: 'Phone',
      isDisableSorting: true
    },
    {
      name: 'departmentName',
      label: 'Department',
      isDisableSorting: true
    },
    {
      name: 'jobTitle',
      label: 'Designation',
      isDisableSorting: true
    },
    {
      name: 'isActive',
      label: 'Status',
      format: value => (value ? 'Active' : 'In-Active'),
      isDisableSorting: true
    },

    {
      name: 'userName',
      label: 'User Name',
      minWidth: 120,
      isDisableSorting: true
    },

    {
      name: 'resetPassword',
      label: 'Reset Password',
      minWidth: 150,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getAllUser = async () => {
    try {
      await http.get(USERS.get_all).then(res => {
        const users = res.data;
        setState(users);
      });
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  //#endregion

  //#region Hooks
  useEffect(() => {
    getAllUser();
  }, []);
  //#endregion

  //#region Events

  const onDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const onFilterInputChange = e => {
    const { name, value } = e.target;
    setFilterState({
      ...filterState,
      [name]: value
    });
  };

  const onView = async row => {
    try {
      const res = await http.get(`${USERS.get_user_by_userId}/${row.id}`);
      setDetails(res.data);
      setOpenDetailsView(true);
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  const onEdit = row => {
    setRecordForEdit(row);
    setDrawerOpenForEdit(true);
  };

  const onDelete = id => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${USERS.delete}/${id}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllUser();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  const onSubmit = async formData => {
    setLoading(true);
    setOpenBackdrop(true);
    try {
      const res = await http.post(USERS.create, formData);
      if (res.status === 201) {
        toastAlerts('success', 'User Created Successfully!!!');
      } else {
        toastAlerts('error', 'There was a problem creating user!!!');
      }
      getAllUser();
    } catch (err) {
      if (err?.response?.data?.error) {
        const errors = err?.response?.data?.error;
        const separatederros = errors.join('\n');
        toastAlerts('error', separatederros, 'top-left', 7000);
      } else {
        toastAlerts('error', internalServerError, 'top-left', 7000);
      }
    } finally {
      setDrawerOpen(false);
      setLoading(false);
      setOpenBackdrop(false);
    }
  };

  const onUpdate = (formData, id) => {
    try {
      setLoading(true);
      setOpenBackdrop(true);
      http.put(`${USERS.update}/${id}`, formData).then(res => {
        setDrawerOpenForEdit(false);
        setLoading(false);
        setOpenBackdrop(false);
        if (res.status === 200) {
          toastAlerts('success', 'User Updated Successfully!!!');
        } else {
          toastAlerts('error', 'There was a problem updating user!!!');
        }
        getAllUser();
      });
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  const onResetDrawerOpen = row => {
    setResetPasswordState({ ...resetPasswordState, userId: row.id, userName: authUser.userName, password: '' });
    setCustomDrawerOpen(true);
  };

  const onResetPassword = () => {
    const data = {
      ...resetPasswordState
    };
    http.post(`${USERS.reset_password_by_admin}?${qs.stringify(data)}`).then(res => {
      setCustomDrawerOpen(false);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
      } else {
        toastAlerts('error', res.data.message);
      }
    });
  };
  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onDrawerOpen} appeared />
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
                  label="User Name"
                  name="userName"
                  className={classes.filterBoxBackground}
                  value={filterState.userName}
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
              <ResetButton className={classes.actionButton} onClick={() => {}} />
            </Grid>
          </div>
        </Collapse>
        <CustomTable onRowPerPageChange={() => {}} onChangePage={() => {}} columns={columns}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>
                <CmtAvatar src={`${REACT_APP_BASE_URL}/${row.media?.fileUrl}`} />
              </StyledTableCell>
              <StyledTableCell>{row.employeeID}</StyledTableCell>
              <StyledTableCell>{row.fullName}</StyledTableCell>
              <StyledTableCell>{row.phoneNumber}</StyledTableCell>
              <StyledTableCell>{row.departmentName}</StyledTableCell>
              <StyledTableCell>{row.jobTitle}</StyledTableCell>
              <StyledTableCell>{row.isEnabled ? 'Enabled' : 'Disabled'}</StyledTableCell>
              <StyledTableCell>{row.userName}</StyledTableCell>
              <StyledTableCell align="center">
                {
                  <FabSetting
                    onClick={() => {
                      onResetDrawerOpen(row);
                    }}
                  />
                }
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton
                  appearedEditButton
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete User?',
                      content: 'Are you sure to delete this user??',
                      onConfirm: () => onDelete(row.id)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Users">
        <UserForm onSubmit={onSubmit} />
      </CustomDrawer>

      <CustomDrawer drawerOpen={drawerOpenForEdit} setDrawerOpen={setDrawerOpenForEdit} title="Users">
        <UserEditForm onUpdate={onUpdate} recordForEdit={recordForEdit} />
      </CustomDrawer>

      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="User Details">
        <UserDetails details={details} />
      </DetailsViewDialog>

      <CustomDrawer drawerOpen={customDrawerOpen} setDrawerOpen={setCustomDrawerOpen}>
        <Fragment>
          <PasswordBox
            name="password"
            label="Password"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            value={resetPasswordState.password}
            onChange={e => setResetPasswordState({ ...resetPasswordState, password: e.target.value })}
          />
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="default"
              size="small"
              className={classes.resetButton}
              onClick={onResetPassword}>
              Reset Password
            </Button>
          </Grid>
        </Fragment>
      </CustomDrawer>
    </Box>
  );
};

export default ActiveUserList;

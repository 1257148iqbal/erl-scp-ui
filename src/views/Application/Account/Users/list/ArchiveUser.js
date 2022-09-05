import CmtAvatar from '@coremat/CmtAvatar';
import { Box, Grid, makeStyles, Paper, TableCell, TableRow, withStyles } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  NewButton
} from 'components/CustomControls';
import { USERS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import UserForm from '../form/UserCreateForm';
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
  }
}));

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
    minWidth: 150,
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
    name: 'userName',
    label: 'User Name',
    minWidth: 150,
    isDisableSorting: true
  }
];
//#endregion

const ArchiveUserList = props => {
  const { REACT_APP_BASE_URL } = process.env;

  //#region hooks
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  //#endregion

  //#region States
  const [state, setState] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [details, setDetails] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  //#endregion

  //#region UDF
  const getAllArchiveUser = async () => {
    try {
      await http.get(USERS.get_all_archived).then(res => {
        const users = res.data;
        setState(users);
      });
    } catch (error) {
      toastAlerts('error', error);
    }
  };
  //#endregion

  //#region Effetcs
  useEffect(() => {
    getAllArchiveUser();
  }, []);
  //#endregion

  //#region Events
  const onDrawerOpen = () => {
    setDrawerOpen(true);
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
      getAllArchiveUser();
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

  const onRestore = id => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${USERS.active}/${id}`)
      .then(res => {
        if (res.status === 204) {
          toastAlerts('success', 'User Activated Successfully');
          getAllArchiveUser();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onDrawerOpen} appeared />
          </Grid>
          {/* <Grid item container justifyContent="flex-end" xs={6} sm={6} md={6} lg={6}>
            <Toolbar className={classes.toolbar}>
              <Tooltip title="Filter list">
                <IconButton onClick={() => setOpenFilter(filter => !filter)}>
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Grid> */}
        </Grid>
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
              <StyledTableCell>{row.userName}</StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton
                  onView={() => onView(row)}
                  // onRestore={() => {
                  //   onRestore(row.id);
                  // }}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Active User?',
                      content: 'Are you sure to re-active user??',
                      onConfirm: () => onRestore(row.id)
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

      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="User Details">
        <UserDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveUserList;

/*
     Title: Roles
     Description: List Page for Roles
     Author: Nasir Ahmed
     Date: 06-October-2021
     Modified: 06-October-2021
*/

import { Box, Grid, makeStyles, Paper, styled, TableCell, TableRow, withStyles } from '@material-ui/core';
import LoadingContext from 'components/contextProvider/LoadingContextProvider/LoadingContext';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  NewButton,
  Spinner
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { ROLES } from 'constants/ApiEndPoints/v1';
import { ROLE } from 'constants/permissionsType';
import _ from 'lodash';
import React, { Fragment, useContext, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import PDFView from './Report/PDFView';
import RoleCreateForm from './RoleForm';
import RoleDetails from './View/RoleDetails';

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

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const useStyles = makeStyles(theme => ({
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  demo: {
    backgroundColor: theme.palette.background.default
  },
  title: {
    margin: theme.spacing(8, 0, 4)
  }
}));

const RoleList = () => {
  const classes = useStyles();
  const context = useContext(LoadingContext);
  const { setOpenBackdrop, setLoading } = context;
  //#region States
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [recordForEdit, setRecordForEdit] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [roleDetails, setRoleDetails] = React.useState(null);

  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(ROLE.EDIT);
  const hasDeletePermission = userPermission?.includes(ROLE.DELETE);
  const hasCreatePermission = userPermission?.includes(ROLE.CREATE);
  //#endregion
  //#region Colums for Table
  const columns = [
    {
      sortName: 'Name',
      name: 'name',
      label: 'Role Name',
      isDisableSorting: true
    },
    {
      sortName: 'Description',
      name: 'description',
      label: 'Description',
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getAllRoles = () => {
    trackPromise(
      http
        .get(ROLES.get_all)
        .then(res => {
          const roles = res.data.map(role => {
            const groupPermissions = role.permissions.map(per => per.split('.')[1]);
            const uniqueGroupPermissions = [...new Set(groupPermissions)];
            role.visualize = uniqueGroupPermissions.map(u => ({
              groupName: _.startCase(u),
              permissions: role.permissions.filter(item => item.split('.')[1] === u).map(x => x.split('.')[2])
            }));
            return role;
          });
          setState(roles);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };
  //#endregion

  //#region Effects
  useEffect(() => getAllRoles(), []);
  //#endregion

  //#region Events

  const onRowToggle = row => {
    setRoleDetails(row);
    setOpenDetailsView(true);
  };

  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const onEdit = row => {
    setRecordForEdit(row);
    setDrawerOpen(true);
  };

  const onDelete = row => {};

  const onSubmit = formValue => {
    setLoading(true);
    setOpenBackdrop(true);
    const id = formValue.id;
    if (id) {
      http
        .put(`${ROLES.upldate}/${id}`, formValue)
        .then(res => {
          toastAlerts('success', 'Updated Successfully!!!');
        })
        .catch(err => {
          toastAlerts('error', 'There was an error!!');
        });
    } else {
      http
        .post(ROLES.create, formValue)
        .then(res => {
          toastAlerts('success', 'Saved Successfully!!!');
        })
        .catch(err => {
          toastAlerts('error', 'There was an error!!');
        });
    }
    getAllRoles();
    setDrawerOpen(false);
    setLoading(false);
    setOpenBackdrop(false);
  };
  //#endregion
  return (
    <PageContainer heading="Roles">
      <Box>
        <Paper>
          <Grid container>
            <Grid item container justifyContent="flex-start" className={classes.newBtn}>
              <NewButton onClick={onDrawerOpen} appeared={hasCreatePermission} />
            </Grid>
          </Grid>
          <CustomTable columns={columns}>
            {state.map(row => (
              <Fragment key={row.id}>
                <StyledTableRow selected={row.open}>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>

                  <StyledTableCell align="center">
                    <ActionButtonGroup
                      appearedEditButton={hasEditPermission}
                      onEdit={() => onEdit(row)}
                      appearedViewButton
                      onView={() => onRowToggle(row)}
                      appearedDeleteButton={hasDeletePermission}
                      onDelete={() => onDelete(row)}
                    />
                    <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
                  </StyledTableCell>
                </StyledTableRow>
              </Fragment>
            ))}
          </CustomTable>
          <Spinner />
        </Paper>
        <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Roles">
          <RoleCreateForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
        </CustomDrawer>
        <DetailsViewDialog
          open={openDetailsView}
          setOpen={setOpenDetailsView}
          title="Role Details"
          fileName={'RolePermissions'}
          document={<PDFView data={roleDetails} />}>
          <RoleDetails data={roleDetails} />
        </DetailsViewDialog>
      </Box>
    </PageContainer>
  );
};

export default RoleList;

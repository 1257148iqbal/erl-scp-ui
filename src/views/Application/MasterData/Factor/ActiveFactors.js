/*
  > Title: List page for Factor
  > Description: This file invoked  when '/factor' or '/factor/list' hitted
  > Author: Nasir Ahmed
  > Date: 2021-07-15
*/

import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomDrawer, CustomTable, NewButton, Switch } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { FACTOR } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import ShiftForm from './FactorForm';

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

const ActiveFactorsList = props => {
  const classes = useStyles();
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
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'TagName',
      name: 'tagName',
      label: 'Tag Name',
      isDisableSorting: false
    },
    {
      sortName: 'FactorType',
      name: 'factorType',
      label: 'Factor Type',
      isDisableSorting: false
    },
    {
      sortName: 'Factor',
      name: 'factor',
      label: 'Factor',
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

  const getAllFactors = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(`${FACTOR.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          const factors = res.data;
          setState(factors);
          setDataLength(res.totalNoOfRow);
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllFactors(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events
  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = id => {};

  const onEdit = key => {
    http.get(`${FACTOR.get_single}/${key}`).then(res => {
      if (res.succeeded) {
        setRecordForEdit(res.data);
        setDrawerOpen(true);
      } else {
        toastAlerts('error', res.message);
      }
    });
  };
  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${FACTOR.update}/${row.key}`, data)
      .then(res => {
        if (res.succeeded) {
          toastAlerts('success', res.message);
          getAllFactors();
        } else {
          toastAlerts('error', res.message);
          getAllFactors();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getAllFactors();
      });
  };
  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${FACTOR.delete}/${key}`)
      .then(res => {
        if (res.succeeded) {
          toastAlerts('success', res.message);
          getAllFactors();
        }
      })
      .catch(err => toastAlerts('err', internalServerError));
  };

  const onSubmit = (e, formValue) => {
    setLoading(true);
    setOpenBackdrop(true);
    const id = formValue.id;
    const key = formValue.key;
    if (id > 0) {
      const data = {
        id,
        key,
        tagId: formValue.tagId,
        factorType: formValue.factorType,
        factor: formValue.factor,
        isActive: formValue.isActive
      };
      http
        .put(`${FACTOR.update}/${key}`, data)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.succeeded) {
            toastAlerts('success', res.message);
          } else {
            toastAlerts('error', res.message);
          }
          getAllFactors();
        })
        .catch(err => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('warning', err);
        });
    } else {
      http
        .post(FACTOR.create, formValue)
        .then(res => {
          setDrawerOpen(false);
          setLoading(false);
          setOpenBackdrop(false);
          if (res.succeeded) {
            toastAlerts('success', res.message);
          } else {
            toastAlerts('error', res.message);
          }
          getAllFactors();
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
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.tagName}</StyledTableCell>
              <StyledTableCell>{row.factorType}</StyledTableCell>
              <StyledTableCell>{row.factor}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Factor?',
                      content: 'Are you sure to active this factor??',
                      onConfirm: () => onStatusChange(row)
                    });
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton
                  appearedEditButton
                  onView={() => onView(row.id)}
                  onEdit={() => {
                    onEdit(row.key);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Factor?',
                      content: 'Are you sure to delete this Factor?',
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
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Factor">
        >
        <ShiftForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>
    </Box>
  );
};

export default withSortBy(ActiveFactorsList, 'TagName');

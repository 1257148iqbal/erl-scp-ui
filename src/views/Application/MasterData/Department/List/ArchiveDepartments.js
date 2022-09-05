import { Box, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { DEPARTMENT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { DEPARTMENTS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import DepartmentDetails from '../View/DepartmentDetails';

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

const ArchiveDepartmentList = props => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(DEPARTMENTS.RETRIEVE);
  //#endregion

  //#region States
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [departmentKey, setDepartmentKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'departmentName',
      label: 'Name'
    },
    {
      name: 'departmentCode',
      label: 'Code'
    },
    {
      name: 'alias',
      label: 'Alias'
    },
    {
      name: 'isActive',
      label: 'Status',
      format: value => (value ? 'Active' : 'In-Active')
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveDepartments = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${DEPARTMENT.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const departments = res.data.data;
          setState(departments);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage]);

  //#endregion

  //#region Hooks

  useEffect(() => getAllArchiveDepartments(), [getAllArchiveDepartments]);
  //#endregion

  //#region Events

  const onView = row => {
    setDepartmentKey(row.key);
    setOpenDetailsView(true);
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DEPARTMENT.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveDepartments();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
  };

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              {columns.map(column => {
                const value = row[column.name];
                return <StyledTableCell key={column.name}>{column.format ? column.format(value) : value}</StyledTableCell>;
              })}
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton={hasRetrivePermission}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Acitve Daily Data Sheet?',
                      content: 'Are you sure to re-active this daily data sheet??',
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
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Department">
        <DepartmentDetails itemKey={departmentKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveDepartmentList;

import { Box, Paper, TableCell, TableRow, withStyles } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { OPERATION_GROUP } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { OPERATION_GROUPS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import OperationGroupDetails from '../View/OperationGroupDetails';

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

const ArchiveOperationGroupsList = () => {
  //#region States

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(OPERATION_GROUPS.RETRIEVE);
  //#endregion

  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [operationGroupKey, setOperationGroupKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'groupName',
      label: 'Group Name'
    },
    {
      name: 'alias',
      label: 'Alias'
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveOperationGroups = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };
    trackPromise(
      http
        .get(`${OPERATION_GROUP.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const operationGroups = res.data.data;
          setState(operationGroups);
          setArchiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveOperationGroups(), [getAllArchiveOperationGroups]);
  //#endregion

  //#region Events
  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${OPERATION_GROUP.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveOperationGroups();
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

  const onView = row => {
    setOperationGroupKey(row.key);
    setOpenDetailsView(true);
  };
  //#endregion

  return (
    <Box>
      <Paper>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(archiveDataLength / rowPerPage)}
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
                      title: 'Re-Acitve Operation Group?',
                      content: 'Are you sure to re-active this Operation Group??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />{' '}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Operation Group Details">
        <OperationGroupDetails itemKey={operationGroupKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveOperationGroupsList;

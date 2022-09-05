import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { DESIGNATION } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { DESIGNATIONS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import DesignationDetails from '../View/DesignationDetails';

const ArchiveDesignationList = () => {
  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(DESIGNATIONS.RETRIEVE);
  //#endregion

  //#region States
  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [designationKey, setDesignationKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'designationName',
      label: 'Designation'
    },
    {
      name: 'departmentName',
      label: 'Department'
    },
    {
      name: 'alias',
      label: 'Alias'
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveDesignations = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${DESIGNATION.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const designations = res.data.data;
            setState(designations);
            setArchiveDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveDesignations(), [rowPerPage, page]);
  //#endregion

  //#region Events
  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DESIGNATION.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveDesignations();
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
    setDesignationKey(row.key);
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
                      title: 'Re-Acitve Department?',
                      content: 'Are you sure to re-active this department??',
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
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Designation">
        <DesignationDetails itemKey={designationKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveDesignationList;

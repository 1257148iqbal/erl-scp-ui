import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog, Switch } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_NUMBERS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { DECOKING_NUMBER } from 'constants/permissionsType';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import DecokingNumberDetails from '../View/DecokingNumberDetails';

const ArchiveDecokingNumber = props => {
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [parameterKey, setParemeterKey] = React.useState(null);
  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(DECOKING_NUMBER.RETRIEVE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'DecokingNumber',
      name: 'decokingNumber',
      label: 'Decoking Number',
      minWidth: 200
    },
    {
      sortName: 'Details',
      name: 'details',
      label: 'Details',
      minWidth: 200
    },
    {
      sortName: 'FromDate',
      name: 'fromDate',
      label: 'From Date',
      minWidth: 150
    },
    {
      sortName: 'ToDate',
      name: 'toDate',
      label: 'To Date',
      minWidth: 150
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

  const getArchiveDecokingNumber = () => {
    trackPromise(
      http
        .get(`${DECOKING_NUMBERS.get_archive}`)
        .then(res => {
          if (res.data.succeeded) {
            setState(res.data.data);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getArchiveDecokingNumber(), [rowPerPage, page]);
  //#endregion

  //#endregion

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onStatusChange = row => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const data = {
      ...row,
      isActive: !row.isActive
    };
    http
      .put(`${DECOKING_NUMBERS.update}/${row.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getArchiveDecokingNumber();
        } else {
          toastAlerts('error', res.data.message);
          getArchiveDecokingNumber();
        }
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
        getArchiveDecokingNumber();
      });
  };

  const onView = row => {
    setParemeterKey(row.key);
    setOpenDetailsView(true);
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DECOKING_NUMBERS.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getArchiveDecokingNumber();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  //#endregion

  return (
    <Box>
      <Paper>
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
              <StyledTableCell>{row.decokingNumber}</StyledTableCell>
              <StyledTableCell>{row.details}</StyledTableCell>
              <StyledTableCell>{formattedDate(row.fromDate)}</StyledTableCell>
              <StyledTableCell>{row.toDate ? formattedDate(row.toDate) : 'None'}</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={row.isActive}
                  onChange={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Active Decoking Numbers?',
                      content: 'Are you sure to active this decoking numbers??',
                      onConfirm: () => onStatusChange(row)
                    });
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton={hasEditPermission}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Retreive Decoking Numbers?',
                      content: 'Are you sure to retreive this decoking numbers??',
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
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Decoking Numbers Details">
        <DecokingNumberDetails itemKey={parameterKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ArchiveDecokingNumber, 'DecokingNumbers');

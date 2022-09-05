import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { SHIFT_REPORT_SETTINGS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const ArchiveShiftReportSettingList = () => {
  const [state, setState] = React.useState([]);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [dataLength, setDataLength] = React.useState(0);

  const columns = [
    {
      name: 'shiftSection',
      label: 'Shift Section',
      isDisableSorting: true
    },
    {
      name: 'valueFrom',
      label: 'Value From',
      isDisableSorting: true
    },
    {
      name: 'name',
      label: 'Name',
      isDisableSorting: true
    },
    {
      name: 'getAutoReading',
      label: 'Get Auto Reading',
      isDisableSorting: true
    }
  ];

  //#region UDF's
  const getArchiveShiftReportSettings = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${SHIFT_REPORT_SETTINGS.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const data = res.data.data;
            setState(data);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage]);

  //#endregion
  //#region Hooks
  useEffect(() => getArchiveShiftReportSettings(), [getArchiveShiftReportSettings]);
  //#endregion
  //#region Event's

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = id => {};

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${SHIFT_REPORT_SETTINGS.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getArchiveShiftReportSettings();
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
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.shiftSection}</StyledTableCell>
              <StyledTableCell>{row.valueFrom}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.getAutoReading.toString()}</StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton
                  onView={() => onView(row.id)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Active Shift Report Setting?',
                      content: 'Are you sure to re-active this shift report Setting??',
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
    </Box>
  );
};

export default ArchiveShiftReportSettingList;

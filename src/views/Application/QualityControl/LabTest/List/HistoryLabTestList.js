/**
 * Title: History lab test list
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 27-February-2022
 **/

import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog, FabUnLock } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { LAB_TEST } from 'constants/ApiEndPoints/v1';
import { DESC } from 'constants/SortedBy';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import { useLabTestListStyles } from '../styles';
import LabTestDetails from '../View/LabTestDetails';

const ActiveLabTestList = props => {
  const classes = useLabTestListStyles();
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = useState([]);

  const [activeDataLength, setActiveDataLength] = React.useState(0);

  const [confirmDialog, setConfirmDialog] = React.useState({
    title: '',
    content: '',
    isOpen: false
  });

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [labTestKey, setLabTestKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      isDisableSorting: false
    },
    {
      sortName: 'ShiftName',
      name: 'shiftName',
      label: 'Shift',
      isDisableSorting: false
    },
    {
      name: 'Locked',
      label: 'Locked',
      minWidth: 170,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getAllHistoryLabReports = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(LAB_TEST.get_history, { params: queryParam })
        .then(res => {
          const labReports = res.data.data;
          setState(labReports);
          setActiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks

  useEffect(() => getAllHistoryLabReports(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onLockStatusChange = (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${LAB_TEST.unlock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            callback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onView = row => {
    setLabTestKey(row.key);
    setOpenDetailsView(true);
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(activeDataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell>{row.shiftName}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>
                {!row.isLocked ? (
                  <Box className={classes.badgeRoot} component="span" bgcolor="#FF8C00">
                    Unlocked
                  </Box>
                ) : (
                  <FabUnLock
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Unlock lab test?',
                        content: 'Do you want to unlock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getAllHistoryLabReports)
                      })
                    }
                  />
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup appearedViewButton onView={() => onView(row)} />
                <ConfirmDialog
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
                  confirmButtonText="Delete"
                  cancelButtonText="Cancel"
                />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Lab Test Details">
        <LabTestDetails itemKey={labTestKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ActiveLabTestList, 'Date', DESC);

/** Change Log
 * 27-Feb-2022 (nasir) : Unlock icon add
 **/

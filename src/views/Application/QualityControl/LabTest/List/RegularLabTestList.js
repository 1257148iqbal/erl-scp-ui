/**
 * Title: Regular lab test list
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 11-June-2022
 **/

import { Box, Button, Grid, Paper } from '@material-ui/core';
import { Memory } from '@material-ui/icons';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomTable,
  DetailsViewDialog,
  FabLock,
  NewButton
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { LAB_SHIFT, LAB_TEST } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { LAB_RPORTS } from 'constants/permissionsType';
import { DESC } from 'constants/SortedBy';
import qs from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { sweetAlerts, toastAlerts } from 'utils/alerts';
import { formattedDate, serverDate, time24 } from 'utils/dateHelper';
import { useLabTestListStyles } from '../styles';
import LabTestDetails from '../View/LabTestDetails';

const RegularLabTestList = props => {
  const classes = useLabTestListStyles();
  const { sortedColumn, sortedBy, onSort } = props;
  const history = useHistory();
  const location = useLocation();

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

  const [currentShift, setCurrentShift] = useState(null);

  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [labTestKey, setLabTestKey] = React.useState(null);
  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(LAB_RPORTS.EDIT);
  const hasDeletePermission = userPermission?.includes(LAB_RPORTS.DELETE);
  const hasCreatePermission = userPermission?.includes(LAB_RPORTS.CREATE);
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

  const getAllLabReports = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(LAB_TEST.get_active, { params: queryParam })
        .then(res => {
          const labReports = res.data.data;
          setState(labReports);
          setActiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  /**
   * Get Current Shift for Lab Report
   */

  const getCurrentShift = () => {
    const queryParam = {
      CurrentTime: time24(new Date())
    };
    trackPromise(
      http.get(`${LAB_SHIFT.get_current_shift}?${qs.stringify(queryParam)}`).then(res => {
        const currentShift = res.data.data;
        setCurrentShift(currentShift);
      })
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => {
    getCurrentShift();
  }, []);

  useEffect(() => getAllLabReports(), [rowPerPage, page, sortedColumn, sortedBy, getAllLabReports]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onNavigateNewForm = () => {
    const queryParam = {
      ShiftId: currentShift.id,
      Date: serverDate(new Date())
    };
    trackPromise(
      http
        .get(LAB_TEST.check_duplicate_lab_report, { params: queryParam })
        .then(res => {
          if (res.data.data > 0) {
            sweetAlerts('error', 'Error', res.data.message);
          } else {
            history.push({ pathname: `${location.pathname}/create` });
          }
        })
        .catch(err => toastAlerts('error', internalServerError))
    );
  };

  const onNavigateCreateSpecificForm = () => {
    history.push({
      pathname: `${location.pathname}/create-specific`
    });
  };

  const onView = row => {
    setLabTestKey(row.key);
    setOpenDetailsView(true);
  };

  const onLockStatusChange = (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${LAB_TEST.lock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            callback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onEdit = row => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: row.key
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${LAB_TEST.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllLabReports();
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
            <NewButton onClick={onNavigateNewForm} appeared={hasCreatePermission} />
            <Button
              className={classes.btnSpecific}
              color="primary"
              variant="contained"
              endIcon={<Memory />}
              onClick={onNavigateCreateSpecificForm}>
              Create Specific
            </Button>
          </Grid>
        </Grid>
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
                {row.isLocked ? (
                  <Box className={classes.badgeRoot} component="span" bgcolor="#8DCD03">
                    Current
                  </Box>
                ) : (
                  <FabLock
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Lock lab test',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getAllLabReports)
                      });
                    }}
                  />
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton={hasDeletePermission}
                  appearedEditButton={hasEditPermission}
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Lab Report?',
                      content: 'Are you sure to delete this lab report??',
                      onConfirm: () => onDelete(row.key)
                    });
                  }}
                />
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
      {labTestKey && (
        <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Lab Test Details">
          <LabTestDetails itemKey={labTestKey} />
        </DetailsViewDialog>
      )}
    </Box>
  );
};

export default withSortBy(RegularLabTestList, 'Date', DESC);

/** Change Log
 * 27-Feb-2022 (nasir) : Lock icon add
 **/

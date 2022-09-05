/**
 * Title: Regular shift report
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 28-February-2022
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
import { SHIFT_REPORT } from 'constants/ApiEndPoints/v1';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import { useStyles } from '../Styles';
import ShiftReportDetails from '../View/ShiftReportDetails';

const RegularShiftReportList = props => {
  const classes = useStyles();
  const { sortedColumn, sortedBy, onSort } = props;

  const history = useHistory();
  const location = useLocation();

  //#region States
  const [state, setState] = useState([]);
  const [activeDataLength, setActiveDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [shiftReportDetails, setShiftReportDetails] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      isDisableSorting: true
    },
    {
      sortName: 'DepartmentCode',
      name: 'shiftName',
      label: 'Shift',
      isDisableSorting: true
    },
    {
      name: 'Locked',
      label: 'Locked',
      minWidth: 170,
      isDisableSorting: true
    }
  ];
  //#endregion

  const fetchRegularShiftReports = useCallback(async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    const res = await http.get(SHIFT_REPORT.get_active, { params: queryParam });
    setState(res.data.data);
    setActiveDataLength(res.data.totalNoOfRow);
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#region Hooks
  useEffect(() => {
    fetchRegularShiftReports();
  }, [fetchRegularShiftReports]);
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
        .put(`${SHIFT_REPORT.lock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            callback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onView = async row => {
    if (row.key) {
      try {
        const res = await http.get(`${SHIFT_REPORT.get_single}/${row.key}`);
        const details = res.data.data;
        setShiftReportDetails(details);
        setOpenDetailsView(true);
      } catch (error) {
        toastAlerts('error', error.response.data.Message);
      }
    }
  };
  const onEdit = key => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: { key }
    });
  };

  const onDelete = async key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const res = await http.delete(`${SHIFT_REPORT.delete}/${key}`);
      toastAlerts('success', res.data.message);
    } catch (err) {
      toastAlerts('error', err.message);
    } finally {
      fetchRegularShiftReports();
    }
  };

  const onNavigateNewForm = () => {
    history.push({ pathname: `${location.pathname}/create` });
  };

  const onNavigateCreateSpecificForm = () => {
    history.push({
      pathname: `${location.pathname}/create-specific`
    });
  };
  //#endregion
  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onNavigateNewForm} appeared />
            <Button
              color="primary"
              variant="contained"
              className={classes.btnSpecific}
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
                        title: 'Lock shift report',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, fetchRegularShiftReports)
                      });
                    }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton
                  appearedEditButton
                  onView={() => onView(row)}
                  onEdit={() => {
                    onEdit(row.key);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Record?',
                      content: 'Are you sure to delete this record?',
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
      <DetailsViewDialog
        open={openDetailsView}
        setOpen={setOpenDetailsView}
        title="Shift Report Details"
        fileName={'ShiftReport'}
        document={<PDFView data={shiftReportDetails} />}>
        <ShiftReportDetails state={shiftReportDetails} />
      </DetailsViewDialog>
    </Box>
  );
};

export default RegularShiftReportList;

/** Change Log
 * 28-Feb-2022 (nasir) : Lock icon add
 **/

/**
 * Title: Archive shift report
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 28-February-2022
 **/

import { Box, Grid, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog, NewButton } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { SHIFT_REPORT } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import { useStyles } from '../Styles';
import ShiftReportDetails from '../View/ShiftReportDetails';

const ArchiveShiftReportList = props => {
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
    }
  ];
  //#endregion

  const fetchArchiveShiftReports = async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    const res = await http.get(SHIFT_REPORT.get_archive, { params: queryParam });
    setState(res.data.data);
    setActiveDataLength(res.data.totalNoOfRow);
  };

  //#region Hooks
  useEffect(() => {
    fetchArchiveShiftReports();
  }, [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events
  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = async row => {
    if (row.key) {
      try {
        const res = await (await http.get(`${SHIFT_REPORT.get_single}/${row.key}`)).data.data;
        setShiftReportDetails(res);
        setOpenDetailsView(true);
      } catch (error) {
        toastAlerts('error', error.response.data.Message);
      }
    }
  };

  const onRetrieve = async (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const res = await http.put(`${SHIFT_REPORT.retrieve}/${key}`);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        callback();
      }
    } catch (err) {
      toastAlerts('warning', err);
    }
  };

  const onNavigateNewForm = () => {
    history.push({ pathname: `${location.pathname}/create` });
  };
  //#endregion
  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={6} sm={6} md={6} lg={6}>
            <NewButton onClick={onNavigateNewForm} appeared />
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
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton
                  onView={() => onView(row)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Active shift report?',
                      content: 'Are you sure to re-active this shift report??',
                      onConfirm: () => onRetrieve(row.key, fetchArchiveShiftReports)
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

export default ArchiveShiftReportList;

/** Change Log
 * 28-Feb-2022 (nasir) : Lock icon add
 **/

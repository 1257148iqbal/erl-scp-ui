import { Box, Grid, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomTable,
  DetailsViewDialog,
  FabUnLock,
  NewButton
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { SHIFT_REPORT } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import { useStyles } from '../Styles';
import ShiftReportDetails from '../View/ShiftReportDetails';

const ActiveShiftReportList = props => {
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

  const fetchHistoryShiftReports = async () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    const res = await http.get(SHIFT_REPORT.get_history, { params: queryParam });
    setState(res.data.data);
    setActiveDataLength(res.data.totalNoOfRow);
  };

  //#region Hooks
  useEffect(() => {
    fetchHistoryShiftReports();
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

  const onLockStatusChange = (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${SHIFT_REPORT.unlock}/${key}`)
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
        const res = await (await http.get(`${SHIFT_REPORT.get_single}/${row.key}`)).data.data;
        setShiftReportDetails(res);
        setOpenDetailsView(true);
      } catch (error) {
        toastAlerts('error', error.response.data.Message);
      }
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
                        onConfirm: () => onLockStatusChange(row.key, fetchHistoryShiftReports)
                      })
                    }
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup appearedViewButton onView={() => onView(row)} />
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

export default ActiveShiftReportList;

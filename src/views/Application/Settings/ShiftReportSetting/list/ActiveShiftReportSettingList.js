import { Box, Grid, lighten, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, NewButton } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { SHIFT_REPORT_SETTINGS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  }
}));

const columns = [
  {
    sortName: 'ShiftSection',
    name: 'shiftSection',
    label: 'Shift Section',
    isDisableSorting: false
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

const ActiveShiftReportSettingList = props => {
  const { sortedColumn, sortedBy, onSort } = props;

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [state, setState] = React.useState([]);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [dataLength, setDataLength] = React.useState(0);

  //#region UDF's
  const getAllShiftReportSettings = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(`${SHIFT_REPORT_SETTINGS.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const data = res.data.data;
            setState(data);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion
  //#region Hooks
  useEffect(() => getAllShiftReportSettings(), [getAllShiftReportSettings]);
  //#endregion
  //#region Event's

  const onDrawerOpen = () => {
    history.push({
      pathname: `${location.pathname}/create`
    });
  };

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = id => {};

  const onEdit = key => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: key
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${SHIFT_REPORT_SETTINGS.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllShiftReportSettings();
        }
      })
      .catch(err => toastAlerts('warning', internalServerError));
  };

  //#endregion
  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={12} sm={12} md={12} lg={12}>
            <NewButton onClick={onDrawerOpen} appeared />
          </Grid>
        </Grid>
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
              <StyledTableCell>{row.shiftSection}</StyledTableCell>
              <StyledTableCell>{row.valueFrom}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.getAutoReading.toString()}</StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton
                  appearedEditButton
                  onView={() => onView(row.id)}
                  onEdit={() => {
                    onEdit(row.key);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Shift Report Setting?',
                      content: 'Are you sure to delete this shift report setting??',
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
    </Box>
  );
};

export default withSortBy(ActiveShiftReportSettingList, 'ShiftSection');

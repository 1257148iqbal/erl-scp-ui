import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DAILY_DATA_SHEET } from 'constants/ApiEndPoints/v1/dailyDataSheet';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_DATA_SHEETS } from 'constants/permissionsType';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import DailyDataSheetDetails from '../View/DailyDataSheetDetails';

const ArchiveDailyDataSheetList = props => {
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = React.useState([]);
  const [confirmDialog, setConfirmDialog] = React.useState({
    title: '',
    content: '',
    isOpen: false
  });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [activeDataLength, setActiveDataLength] = React.useState(0);
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [dailyDataSheetKey, setDailyDataSheetKey] = React.useState(null);
  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRestorePermission = userPermission?.includes(DAILY_DATA_SHEETS.RETRIEVE);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      isDisableSorting: false
    }
  ];
  //#endregion

  //#region UDF
  const getDailyDataSheet = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(DAILY_DATA_SHEET.get_archive, { params: queryParam })
        .then(res => {
          if (res.data.succeeded) {
            const data = res.data.data;
            setState(data);
            setActiveDataLength(res.data.totalNoOfRow);
          } else {
            toastAlerts('error', res.data.message);
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };
  //#endregion

  ////#region  Hooks
  useEffect(() => getDailyDataSheet(), [rowPerPage, page, sortedColumn, sortedBy]);
  //#endregion

  //#region Events

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    setDailyDataSheetKey(row.key);
    setOpenDetailsView(true);
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    http
      .put(`${DAILY_DATA_SHEET.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getDailyDataSheet();
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
          count={Math.ceil(activeDataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton={hasRestorePermission}
                  onView={() => onView(row)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Lab Report?',
                      content: 'Are you sure to delete this lab report??',
                      onConfirm: () => onRestore(row.key)
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
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Daily Data Sheet Details">
        <DailyDataSheetDetails itemKey={dailyDataSheetKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ArchiveDailyDataSheetList, 'Date');

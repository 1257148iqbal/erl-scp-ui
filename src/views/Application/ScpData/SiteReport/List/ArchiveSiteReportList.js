import { Box, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { SITE_REPORT } from 'constants/ApiEndPoints/v1/siteReport';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_DATA_SHEETS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import SiteReportDetails from '../View/SiteReportDetails';

const ArchiveSiteReportList = props => {
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
  const [details, setDetails] = React.useState(null);
  const [boxes, setBoxes] = React.useState({
    box1: [],
    box2: [],
    box3: [],
    box4: [],
    box5: [],
    box6: [],
    box7: [],
    box8: [],
    box9: [],
    box10: [],
    box11: []
  });
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
      isDisableSorting: false,
      minWidth: 250
    },
    {
      sortName: 'Time',
      name: 'time',
      label: 'Time',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      sortName: 'Lab Shift Name',
      name: 'labShiftName',
      label: 'Shift Name',
      isDisableSorting: false,
      minWidth: 200
    }
  ];
  //#endregion

  //#region UDF
  const getSiteReports = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(`${SITE_REPORT.get_archive}?${qs.stringify(queryParam)}`)
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
  }, [page, rowPerPage, sortedBy, sortedColumn]);
  //#endregion

  ////#region  Hooks
  useEffect(() => getSiteReports(), [getSiteReports]);
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
        const res = await http.get(`${SITE_REPORT.get_single}/${row.key}`);
        const box1 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-1');
        const box2 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-2');
        const box3 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-3');
        const box4 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-4');
        const box5 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-5');
        const box6 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-6');
        const box7 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-7');
        const box8 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-8');
        const box9 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-9');
        const box10 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-10');
        const box11 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-11');

        setDetails(res.data.data);
        setBoxes({ ...boxes, box1, box2, box3, box4, box5, box6, box7, box8, box9, box10, box11 });
        setOpenDetailsView(true);
      } catch (error) {
        toastAlerts('error', error);
      }
    }
  };

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${SITE_REPORT.retrieve}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getSiteReports();
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
              <StyledTableCell>{row.time}</StyledTableCell>
              <StyledTableCell>{row.labShiftName}</StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedReactiveButton={hasRestorePermission}
                  onView={() => onView(row)}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Active Site Report?',
                      content: 'Are you sure to re-active this site report??',
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
      {details && (
        <DetailsViewDialog
          open={openDetailsView}
          setOpen={setOpenDetailsView}
          title="Site Report Details"
          fileName={`SiteReport`}
          document={<PDFView data={details} />}>
          <SiteReportDetails
            boxes={boxes}
            masterInfo={{ date: details.date, time: details.time, operatorGroup: details.operatorGroup }}
          />
        </DetailsViewDialog>
      )}
    </Box>
  );
};

export default withSortBy(ArchiveSiteReportList, 'Date');

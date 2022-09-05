/**
 * Title: History daily data sheet
 * Description:History daily data sheet
 * Author: Nasir Ahmed
 * Date: 26-February-2022
 * Modified: 26-February-2022
 **/

import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import FabUnlock from 'components/CustomControls/FabIcon/Unlock';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DAILY_DATA_SHEET } from 'constants/ApiEndPoints/v1/dailyDataSheet';
import {
  CASE_CN_AMMONIA,
  CASE_CN_AO,
  CASE_CN_BFW,
  CASE_CN_CI,
  CASE_CN_FQ_3037,
  CASE_CN_POWER,
  CASE_CN_STEAM,
  CASE_OF_DELTA_P,
  CASE_PS_FQ_3039,
  CASE_PS_FQ_3041,
  CASE_PS_FQ_3042,
  CASE_PS_FQ_3043,
  CASE_PS_FQ_3044,
  CASE_PS_FQ_3045
} from 'constants/PSFormulaNames';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import DailyDataSheetDetails from '../View/DailyDataSheetDetails';

const useStyles = makeStyles(theme => ({
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  filteredItems: {
    padding: 10,
    backgroundColor: '#ECF0F6',
    borderRadius: 5,
    margin: 10
  },
  actionButton: {
    marginLeft: 5
  }
}));

const HistoryDailyDataSheetList = props => {
  const classes = useStyles();
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
  const [sections, setSections] = React.useState({
    cumulitive: [],
    tui: [],
    fi: [],
    fic: [],
    ammonia: [],
    tray: [],
    productionSynopsys: [],
    consumptions: [],
    otherFeatures: []
  });
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
      name: 'Locked?',
      label: 'Locked',
      minWidth: 170,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getHistoryDailyDataSheet = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(DAILY_DATA_SHEET.get_history, {
          params: queryParam
        })
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
  useEffect(() => getHistoryDailyDataSheet(), [rowPerPage, page, sortedColumn, sortedBy, getHistoryDailyDataSheet]);
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
        .put(`${DAILY_DATA_SHEET.unlock}/${key}`)
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
        const res = await http.get(`${DAILY_DATA_SHEET.get_single}/${row.key}`);
        const ddsDetails = res.data.data.dailyDataSheetDetailsBySection.map(item => item.dailyDataSheetDetails).flat();
        const cumulitive = ddsDetails.filter(b => b.ddsSection === 'Cumulitive');
        const tui = ddsDetails.filter(b => b.ddsSection === 'TUI');
        const fi = ddsDetails.filter(b => b.ddsSection === 'FI');
        const fic = ddsDetails.filter(b => b.ddsSection === 'FIC');
        const ammonia = ddsDetails.filter(b => b.ddsSection === 'Ammonia');
        const tray = ddsDetails.filter(b => b.ddsSection === 'Tray');

        const productionSynopsys = ddsDetails
          .filter(b => b.ddsSection === 'ProductionSynopsys')
          .map(ps => {
            switch (ps.caseName) {
              case CASE_PS_FQ_3041:
              case CASE_PS_FQ_3042:
              case CASE_PS_FQ_3043:
              case CASE_PS_FQ_3039:
                ps.psCalculatedValue = ps.psCalculatedValue ? parseInt(ps.psCalculatedValue) : ps.psCalculatedValue;
                return ps;
              case CASE_PS_FQ_3045:
              case CASE_PS_FQ_3044:
                ps.psCalculatedValue = ps.psCalculatedValue
                  ? parseFloat(ps.psCalculatedValue).toFixed(2)
                  : ps.psCalculatedValue;
                return ps;

              default:
                return ps;
            }
          });
        const consumptions = ddsDetails
          .filter(b => b.ddsSection === 'Consumptions')
          .map(con => {
            switch (con.caseName) {
              case CASE_CN_FQ_3037:
              case CASE_CN_POWER:
              case CASE_CN_BFW:
              case CASE_CN_STEAM:
                con.psCalculatedValue = con.psCalculatedValue ? parseInt(con.psCalculatedValue) : con.psCalculatedValue;
                return con;

              case CASE_CN_AMMONIA:
              case CASE_CN_CI:
              case CASE_CN_AO:
                con.psCalculatedValue = con.psCalculatedValue
                  ? parseFloat(con.psCalculatedValue).toFixed(2)
                  : con.psCalculatedValue;
                return con;

              default:
                return con;
            }
          });
        const otherFeatures = ddsDetails
          .filter(b => b.ddsSection === 'OtherFeatures')
          .map(othf => {
            switch (othf.caseName) {
              case CASE_OF_DELTA_P:
                othf.currentReading = othf.currentReading
                  ? Number.isInteger(Number(othf.currentReading))
                    ? Number(othf.currentReading)
                    : Number(othf.currentReading).toFixed(2)
                  : othf.currentReading;

                return othf;

              default:
                return othf;
            }
          });

        setDetails(res.data.data);
        setSections({
          ...sections,
          cumulitive,
          tui,
          fi,
          fic,
          ammonia,
          tray,
          productionSynopsys,
          consumptions,
          otherFeatures
        });
        setOpenDetailsView(true);
      } catch (error) {
        toastAlerts('error', error);
      }
    }
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
              <StyledTableCell style={{ minWidth: 170 }}>
                {!row.isLocked ? (
                  <Box className={classes.badgeRoot} component="span" bgcolor="#FF8C00">
                    Unlocked
                  </Box>
                ) : (
                  <FabUnlock
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Unlock daily data sheet',
                        content: 'Do you want to unlocked this record?',
                        onConfirm: () => onLockStatusChange(row.key, getHistoryDailyDataSheet)
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
      <DetailsViewDialog
        open={openDetailsView}
        setOpen={setOpenDetailsView}
        title="Daily Data Sheet Details"
        fileName={`Daily_Data_Sheet_${new Date().toLocaleString()}`}
        document={<PDFView details={details} data={sections} />}>
        <DailyDataSheetDetails details={details} sections={sections} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(HistoryDailyDataSheetList, 'Date');

/**
 * Title: Regular data sheet list
 * Description:
 * Author: N/A
 * Date: N/A
 * Modified: 26-February-2022
 **/

import { Box, Button, Grid, Paper } from '@material-ui/core';
import { Memory } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
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
import { DAILY_DATA_SHEET } from 'constants/ApiEndPoints/v1/dailyDataSheet';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_DATA_SHEETS } from 'constants/permissionsType';
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
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
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
  },
  btnSpecific: {
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: 5
    }
  }
}));

const RegularDailyDataSheetList = props => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
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

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(DAILY_DATA_SHEETS.EDIT);
  const hasDeletePermission = userPermission?.includes(DAILY_DATA_SHEETS.DELETE);
  const hasCreatePermission = userPermission?.includes(DAILY_DATA_SHEETS.CREATE);
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
      name: 'Locked',
      label: 'Locked',
      minWidth: 170,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getRegularDailyDataSheet = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(DAILY_DATA_SHEET.get_active, {
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
  useEffect(() => getRegularDailyDataSheet(), [getRegularDailyDataSheet]);
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
    history.push({ pathname: `${location.pathname}/create` });
  };
  const onNavigateCreateSpecificForm = () => {
    history.push({
      pathname: `${location.pathname}/create-specific`
    });
  };

  const onLockStatusChange = (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${DAILY_DATA_SHEET.lock}/${key}`)
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

  const onEdit = row => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: row.key
    });
  };
  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    http
      .delete(`${DAILY_DATA_SHEET.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getRegularDailyDataSheet();
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
                        title: 'Lock daily data sheet',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getRegularDailyDataSheet)
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

export default withSortBy(RegularDailyDataSheetList, 'Date');

/*
  > Title: Log sheet List
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-09
*/

import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomPreloder,
  CustomTable,
  DetailsViewDialog,
  FabUnLock,
  NewButton
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_LOG } from 'constants/ApiEndPoints/v1';
import { DECOKING_LOG as DECOKING_LOG_PERMISSION } from 'constants/permissionsType';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, getTime } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import DecokingLogSheetDetails from '../View/DecokingLogSheetDetails';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  newButtons: {
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
  filterBoxBackground: {
    backgroundColor: '#FFFFFF'
  }
}));

const HistoryDecokingLogSheetList = props => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { sortedColumn, sortedBy, onSort } = props;

  //#region States

  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [details, setDetails] = React.useState(null);

  //#endregion

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasCreatePermission = userPermission?.includes(DECOKING_LOG_PERMISSION.CREATE);
  const hasUnlockPermission = userPermission?.includes(DECOKING_LOG_PERMISSION.UNLOCK);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Number',
      name: 'number',
      label: 'Decoking No',
      minWidth: 170
    },
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      minWidth: 170,
      format: value => formattedDate(value)
    },
    {
      sortName: 'Time',
      name: 'time',
      label: 'Time',
      minWidth: 170
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

  const getHistoryDecokingLogSheets = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(DECOKING_LOG.get_history, { params: queryParam })
        .then(res => {
          const decokingLogSheet = res.data.data;
          setState(decokingLogSheet);
          setDataLength(res.data.totalNoOfRow);
          setIsPageLoaded(true);
        })
        .catch(err => toastAlerts('error', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion

  //#region Hooks
  useEffect(() => {
    getHistoryDecokingLogSheets();
  }, [getHistoryDecokingLogSheets]);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events
  const onNavigateNewForm = () => {
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

  const onLockStatusChange = (key, callback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${DECOKING_LOG.unlock}/${key}`)
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
    if (row.key) {
      http
        .get(`${DECOKING_LOG.get_single}/${row.key}`)
        .then(res => {
          if (res.data.succeeded) {
            setDetails(res.data.data);
          }
        })
        .catch(err => toastAlerts('error', err));
    }
    setOpenDetailsView(true);
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid item container justifyContent="flex-start" className={classes.newButtons} xs={6} sm={6} md={6} lg={6}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <NewButton onClick={onNavigateNewForm} appeared={hasCreatePermission} />
            </Grid>
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
              <StyledTableCell style={{ minWidth: 170 }}>{row.number}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>{getTime(row.time, 'HH:mm')}</StyledTableCell>
              <StyledTableCell style={{ minWidth: 170 }}>
                {hasUnlockPermission && (
                  <FabUnLock
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Unlock Decoking Log?',
                        content: 'Do you want to unlock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getHistoryDecokingLogSheets)
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
        title="Decoking Log Sheet Details"
        fileName={`Decoking_Laboratory_Result`}
        document={<PDFView data={details} />}>
        <DecokingLogSheetDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(HistoryDecokingLogSheetList, 'Date');

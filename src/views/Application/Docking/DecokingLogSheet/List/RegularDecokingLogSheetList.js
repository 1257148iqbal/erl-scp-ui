/*
  > Title: Log sheet List
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-10-09
*/

import { Box, makeStyles, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomPreloder,
  CustomTable,
  DetailsViewDialog,
  FabLock
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_LOG } from 'constants/ApiEndPoints/v1';
import { DECOKING_LOG as DECOKING_LOG_PERMISSION } from 'constants/permissionsType';
import { uniqueId } from 'lodash';
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

const RegularDecokingLogSheetList = props => {
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
  const hasLockPermission = userPermission?.includes(DECOKING_LOG_PERMISSION.LOCK);
  const hasEditPermission = userPermission?.includes(DECOKING_LOG_PERMISSION.EDIT);
  const hasDeletePermission = userPermission?.includes(DECOKING_LOG_PERMISSION.DELETE);

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

  const getRegularDecokingLogSheets = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(DECOKING_LOG.get_active, { params: queryParam })
        .then(res => {
          const decokingLogSheet = res.data.data.map(item => ({
            ...item,
            id: uniqueId()
          }));
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
    getRegularDecokingLogSheets();
  }, [getRegularDecokingLogSheets]);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

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
        .put(`${DECOKING_LOG.lock}/${key}`)
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

  const onEdit = row => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: { key: row.key }
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .delete(`${DECOKING_LOG.delete}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            getRegularDecokingLogSheets();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
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
                {hasLockPermission && (
                  <FabLock
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Lock Decoking Lab',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getRegularDecokingLogSheets)
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
                      title: 'Delete Decoking Log Sheet?',
                      content: 'Are you sure to delete this decoking Log Sheet?',
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
        title="Decoking Log Sheet Details"
        fileName={`Decoking_Laboratory_Result`}
        document={<PDFView data={details} />}>
        <DecokingLogSheetDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(RegularDecokingLogSheetList, 'Date');

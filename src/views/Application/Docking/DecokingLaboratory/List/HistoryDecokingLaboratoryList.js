import { Box, Grid, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  FabUnLock,
  NewButton
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_LABORATORY_RESULT } from 'constants/ApiEndPoints/v1/decokingLaboratory';
import { DECOKING_LABRATORY } from 'constants/permissionsType';
import { DESC } from 'constants/SortedBy';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, getTime, getTimeFromDate, serverDate } from 'utils/dateHelper';
import DecokingLaboratoryForm from '../Forms/DecokingLaboratoryForm';
import PDFView from '../Report/PDFView';
import { useDecLabListStyles } from '../style';
import DecokingLaboratoryDetails from '../View/DecokingLaboratoryDetails';

const ActiveDecokingLaboratoryList = props => {
  const { sortedColumn, sortedBy, onSort } = props;
  //#region Hooks
  const classes = useDecLabListStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#endregion

  //#region States
  const [state, setState] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [dataLength, setDataLength] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [details, setDetails] = useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      sortName: 'Number',
      name: 'number',
      label: 'NO.',
      minWidth: 100,
      isDisableSorting: false
    },
    {
      sortName: 'Date',
      name: 'date',
      label: 'Date',
      minWidth: 150,
      isDisableSorting: false
    },
    {
      sortName: 'Time',
      name: 'time',
      label: 'Time',
      minWidth: 100,
      isDisableSorting: false
    },
    {
      name: 'timeDifference',
      label: 'Time Diff',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'cO2',
      label: 'CO\u2082',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'co',
      label: 'CO',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'o2',
      label: 'O\u2082',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'airReading',
      label: 'Air Reading',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'cokeFlow',
      label: 'Coke Flow',
      minWidth: 100,
      isDisableSorting: true
    },
    {
      name: 'Locked?',
      label: 'Locked',
      minWidth: 100,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region Action Button Permission Check

  const hasUnlockPermission = userPermission?.includes(DECOKING_LABRATORY.UNLOCK);
  const hasCreatePermission = userPermission?.includes(DECOKING_LABRATORY.CREATE);

  //#endregion

  //#region UDF
  const getHistoryDecokingLaboratoryResults = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(DECOKING_LABORATORY_RESULT.get_history, { params: queryParam })
        .then(res => {
          if (res.data.succeeded) {
            const decokingLaboratory = res.data.data;
            setState(decokingLaboratory);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion

  //#region Hooks
  useEffect(() => getHistoryDecokingLaboratoryResults(), [getHistoryDecokingLaboratoryResults]);
  //#endregion

  //#region Events
  const onDrawerOpen = () => {
    setRecordForEdit(null);
    setDrawerOpen(true);
  };

  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    if (row.key) {
      http
        .get(`${DECOKING_LABORATORY_RESULT.get_single}/${row.key}`)
        .then(res => {
          if (res.data.succeeded) {
            setDetails(res.data.data);
          }
        })
        .catch(err => toastAlerts('error', err));
    }
    setOpenDetailsView(true);
  };

  const onLockStatusChange = (key, calback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${DECOKING_LABORATORY_RESULT.unlock}/${key}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message);
            calback();
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  const onSubmit = async formValue => {
    setLoading(true);
    setOpenBackdrop(true);

    try {
      const data = {
        ...formValue,
        date: serverDate(formValue.date),
        time: getTimeFromDate(formValue.time, 'HH:mm'),
        cO2: formValue.cO2 ? +formValue.cO2 : 0,
        co: formValue.co ? +formValue.co : 0,
        o2: formValue.o2 ? +formValue.o2 : 0,
        airReading: formValue.airReading ? +formValue.airReading : 0,
        comment: formValue.comment
      };

      const res = await http.post(DECOKING_LABORATORY_RESULT.create, data);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (err) {
      toastAlerts('warning', 'err');
    } finally {
      setDrawerOpen(false);
      setLoading(false);
      setOpenBackdrop(false);
      getHistoryDecokingLaboratoryResults();
    }
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={12} sm={12} md={12} lg={12}>
            <NewButton onClick={onDrawerOpen} appeared={hasCreatePermission} />
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
              <StyledTableCell style={{ width: 100 }}>{row.number}</StyledTableCell>
              <StyledTableCell>{formattedDate(row.date)}</StyledTableCell>
              <StyledTableCell>{getTime(row.time, 'HH:mm')}</StyledTableCell>
              <StyledTableCell>{row.timeDifference}</StyledTableCell>
              <StyledTableCell>{row.cO2}</StyledTableCell>
              <StyledTableCell>{row.co}</StyledTableCell>
              <StyledTableCell>{row.o2}</StyledTableCell>
              <StyledTableCell>{row.airReading}</StyledTableCell>
              <StyledTableCell>{row.cokeFlow}</StyledTableCell>
              <StyledTableCell>
                {hasUnlockPermission && (
                  <FabUnLock
                    onClick={() =>
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Unlocke Dec. Lab?',
                        content: 'Do you want to unlock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getHistoryDecokingLaboratoryResults)
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

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} title="Decoking Lab.">
        <DecokingLaboratoryForm recordForEdit={recordForEdit} onSubmit={onSubmit} />
      </CustomDrawer>

      <DetailsViewDialog
        open={openDetailsView}
        setOpen={setOpenDetailsView}
        title="Decoking Laboratory Details"
        fileName="DecokingLaboratoryDetails"
        document={<PDFView data={details} />}>
        <DecokingLaboratoryDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ActiveDecokingLaboratoryList, 'Number', DESC);

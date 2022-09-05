import { Box, Paper } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomBackDrop,
  CustomDrawer,
  CustomTable,
  DetailsViewDialog,
  FabLock
} from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_LABORATORY_RESULT } from 'constants/ApiEndPoints/v1/decokingLaboratory';
import { internalServerError } from 'constants/ErrorMessages';
import { DECOKING_LABRATORY } from 'constants/permissionsType';
import { DESC } from 'constants/SortedBy';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getTime, getTimeFromDate, serverDate } from 'utils/dateHelper';
import { useDecokingListStyles } from 'views/Application/MasterData/DecokingNumber/style';
import DecokingLaboratoryForm from '../Forms/DecokingLaboratoryForm';
import PDFView from '../Report/PDFView';
import DecokingLaboratoryDetails from '../View/DecokingLaboratoryDetails';

const ActiveDecokingLaboratoryList = props => {
  const { sortedColumn, sortedBy, onSort } = props;
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const classes = useDecokingListStyles();

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

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEditPermission = userPermission?.includes(DECOKING_LABRATORY.EDIT);
  const hasDeletePermission = userPermission?.includes(DECOKING_LABRATORY.DELETE);
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
      isDisableSorting: true
    },
    {
      name: 'timeDifference',
      label: 'Time Diff',
      minWidth: 100,
      isDisableSorting: false
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
      name: 'Locked',
      label: 'Locked',
      minWidth: 100,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF

  const getRegularDecokingLaboratoryResults = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(DECOKING_LABORATORY_RESULT.get_active, { params: queryParam })
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
  useEffect(() => getRegularDecokingLaboratoryResults(), [getRegularDecokingLaboratoryResults]);
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
        const res = await http.get(`${DECOKING_LABORATORY_RESULT.get_single}/${row.key}`);
        if (res.data.succeeded) {
          setDetails(res.data.data);
          setOpenDetailsView(true);
        }
      } catch (err) {
        toastAlerts('error', err);
      }
    }
  };

  const onEdit = async row => {
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${DECOKING_LABORATORY_RESULT.get_single}/${row.key}`);
      if (res.data.succeeded) {
        setRecordForEdit(res.data.data);
        setOpenBackdrop(false);
        setDrawerOpen(true);
      }
    } catch (err) {
      toastAlerts('error', err);
    }
  };

  const onDelete = async key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    try {
      const res = await http.delete(`${DECOKING_LABORATORY_RESULT.delete}/${key}`);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        getRegularDecokingLaboratoryResults();
      }
    } catch (err) {
      toastAlerts('warning', internalServerError);
    }
  };

  const onLockStatusChange = (key, calback) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    trackPromise(
      http
        .put(`${DECOKING_LABORATORY_RESULT.lock}/${key}`)
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

      const res = await http.put(`${DECOKING_LABORATORY_RESULT.update}/${data.key}`, data);
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
      getRegularDecokingLaboratoryResults();
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
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell style={{ width: 100 }}>{row.number}</StyledTableCell>
              <StyledTableCell>{serverDate(row.date)}</StyledTableCell>
              <StyledTableCell>{getTime(row.time, 'HH:mm')}</StyledTableCell>
              <StyledTableCell>{row.timeDifference}</StyledTableCell>
              <StyledTableCell>{row.cO2}</StyledTableCell>
              <StyledTableCell>{row.co}</StyledTableCell>
              <StyledTableCell>{row.o2}</StyledTableCell>
              <StyledTableCell>{row.airReading}</StyledTableCell>
              <StyledTableCell>{row.cokeFlow}</StyledTableCell>
              <StyledTableCell>
                {row.isLocked ? (
                  <Box className={classes.badgeRoot} component="span" bgcolor="#8DCD03">
                    Current
                  </Box>
                ) : (
                  <FabLock
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Lock Decoking Lab',
                        content: 'Do you want to lock this record?',
                        onConfirm: () => onLockStatusChange(row.key, getRegularDecokingLaboratoryResults)
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
      <CustomBackDrop />
    </Box>
  );
};

export default withSortBy(ActiveDecokingLaboratoryList, 'Number', DESC);

import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import withSortBy from 'components/HOC/withSortedBy';
import { DECOKING_LABORATORY_RESULT } from 'constants/ApiEndPoints/v1/decokingLaboratory';
import { internalServerError } from 'constants/ErrorMessages';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getTime, serverDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import DecokingLaboratoryDetails from '../View/DecokingLaboratoryDetails';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
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
    backgroundColor: 'white'
  },
  formContainer: {
    padding: 15
  }
}));

const ArchiveDecokingLaboratoryList = props => {
  const classes = useStyles();

  const { sortedColumn, sortedBy, onSort } = props;

  //#region States
  const [state, setState] = useState([]);
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
    }
  ];
  //#endregion

  //#region UDF

  const getArchiveDecokingLaboratoryResults = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(DECOKING_LABORATORY_RESULT.get_archive, { params: queryParam })
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
  useEffect(() => getArchiveDecokingLaboratoryResults(), [getArchiveDecokingLaboratoryResults]);
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

  const onReset = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${DECOKING_LABORATORY_RESULT.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getArchiveDecokingLaboratoryResults();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
  };

  //#endregion

  return (
    <Box>
      <Paper>
        <Grid container>
          <Grid className={classes.newBtn} item container justifyContent="flex-start" xs={12} sm={12} md={12} lg={12}></Grid>
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
              <StyledTableCell>{serverDate(row.date)}</StyledTableCell>
              <StyledTableCell>{getTime(row.time, 'HH:mm')}</StyledTableCell>
              <StyledTableCell>{row.timeDifference}</StyledTableCell>
              <StyledTableCell>{row.cO2}</StyledTableCell>
              <StyledTableCell>{row.co}</StyledTableCell>
              <StyledTableCell>{row.o2}</StyledTableCell>
              <StyledTableCell>{row.airReading}</StyledTableCell>
              <StyledTableCell>{row.cokeFlow}</StyledTableCell>

              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Retrieve Decoking Laboratory?',
                      content: 'Are you sure to retrieve this decoking laboratory??',
                      onConfirm: () => onReset(row.key)
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
        title="Decoking Laboratory Details"
        fileName="DecokingLaboratoryDetails"
        document={<PDFView data={details} />}>
        <DecokingLaboratoryDetails details={details} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ArchiveDecokingLaboratoryList, 'Date');

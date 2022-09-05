import { Box, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { LAB_SHIFT } from 'constants/ApiEndPoints/v1/labshift';
import { internalServerError } from 'constants/ErrorMessages';
import { LAB_SHIFTS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import LabShiftDetails from '../View/LabShiftDetails';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
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
  filterBoxBackground: {
    backgroundColor: '#FFFFFF'
  }
}));

const ArchiveLabShiftList = () => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(LAB_SHIFTS.RETRIEVE);
  //#endregion

  //#region States
  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [labShiftKey, setLabShiftKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'shiftName',
      label: 'Shift Name',
      minWidth: 200
    },
    {
      name: 'fromTime',
      label: 'Start Time',
      minWidth: 200
    },
    {
      name: 'toTime',
      label: 'End Time',
      minWidth: 200
    },
    {
      name: 'alias',
      label: 'Alias'
    }
  ];
  //#endregion

  //#region UDF
  const getAllArchiveLabshit = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };
    trackPromise(
      http
        .get(`${LAB_SHIFT.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const shifts = res.data.data;
          setState(shifts);
          setArchiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveLabshit(), [rowPerPage, page]);
  //#endregion

  //#region Events
  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${LAB_SHIFT.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveLabshit();
      })
      .catch(err => {
        toastAlerts('error', internalServerError);
      });
  };
  const onRowPerPageChange = e => {
    setRowPerPage(e.target.value);
    setPage(1);
  };

  const onPageChange = (event, pageNumber) => {
    setPage(pageNumber);
  };

  const onView = row => {
    setLabShiftKey(row.key);
    setOpenDetailsView(true);
  };
  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(archiveDataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              {columns.map(column => {
                const value = row[column.name];
                return <StyledTableCell key={column.name}>{column.format ? column.format(value) : value}</StyledTableCell>;
              })}
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  onView={() => onView(row)}
                  appearedReactiveButton={hasRetrivePermission}
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Acitve Shift?',
                      content: 'Are you sure to re-active this shift??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />{' '}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Lab Shift Details">
        <LabShiftDetails itemKey={labShiftKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveLabShiftList;

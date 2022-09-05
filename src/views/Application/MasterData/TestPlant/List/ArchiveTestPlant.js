import { Box, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, DetailsViewDialog } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { LAB_UNIT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { LAB_UNITS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import TestPlantDetails from '../View/TestPlantDetails';

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

const ArchiveLabUnits = () => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRetrivePermission = userPermission?.includes(LAB_UNITS.RETRIEVE);
  //#endregion

  //#region States
  const [state, setState] = React.useState([]);
  const [dataLength, setDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [testPlantKey, setTestPlantKey] = React.useState(null);

  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'unitName',
      label: 'Name'
    },
    {
      name: 'alias',
      label: 'Alias'
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveLabUnits = () => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${LAB_UNIT.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const departments = res.data.data;
          setState(departments);
          setDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  };

  //#endregion

  //#region Hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getAllArchiveLabUnits(), [rowPerPage, page]);
  //#endregion

  //#region Events
  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${LAB_UNIT.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveLabUnits();
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
    setTestPlantKey(row.key);
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
          count={Math.ceil(dataLength / rowPerPage)}
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
                      title: 'Re-Acitve Unit?',
                      content: 'Are you sure to re-active this Unit??',
                      onConfirm: () => onRestore(row.key)
                    });
                  }}
                />
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </CustomTable>
      </Paper>
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Test Plant Details">
        <TestPlantDetails itemKey={testPlantKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default ArchiveLabUnits;

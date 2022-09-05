import { Box, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { FACTOR } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

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

const ArchiveFactorsList = () => {
  const classes = useStyles();

  //#region States
  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'tagName',
      label: 'Tag Name'
    },
    {
      name: 'factorType',
      label: 'Factor Type'
    },
    {
      name: 'factor',
      label: 'Factor'
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveFactors = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${FACTOR.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const factors = res.data;
          setState(factors);
          setArchiveDataLength(res.totalNoOfRow);
        })
        .catch(err => toastAlerts('error', err))
    );
  }, [page, rowPerPage]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveFactors(), [getAllArchiveFactors]);
  //#endregion

  //#region Events
  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${FACTOR.restore}/${key}`)
      .then(res => {
        if (res.succeeded) {
          toastAlerts('success', res.message);
        } else {
          toastAlerts('error', res.message);
        }
        getAllArchiveFactors();
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

  const onView = id => {};

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
                  onView={() => onView(row.id)}
                  appearedReactiveButton
                  onRestore={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Re-Acitve Department?',
                      content: 'Are you sure to re-active this department??',
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
    </Box>
  );
};

export default ArchiveFactorsList;

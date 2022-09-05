import { Box, Collapse, Grid, makeStyles, Paper, TableCell, TableRow, Toolbar, withStyles } from '@material-ui/core';
import {
  ActionButtonGroup,
  ConfirmDialog,
  CustomTable,
  DetailsViewDialog,
  FilterIcon,
  ResetButton,
  SearchButton,
  TextInput
} from 'components/CustomControls';
import withSortBy from 'components/HOC/withSortedBy';
import { OPERATOR } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { OPERATORS } from 'constants/permissionsType';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import OperatorDetails from '../View/OperatorDetails';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    '&:hover': {
      backgroundColor: '#DAE9F8',
      cursor: 'pointer'
    }
  }
}))(TableRow);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.dark,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

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

const ArchiveOperatorList = props => {
  const classes = useStyles();

  //#region Action Button Permission Check
  const { userPermission } = useSelector(({ auth }) => auth);
  const { sortedColumn, sortedBy, onSort } = props;
  const hasRetrivePermission = userPermission?.includes(OPERATORS.RETRIEVE);
  //#endregion

  //#region States
  const [openArchiveFilter, setOpenArchiveFilter] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [archiveDataLength, setArchiveDataLength] = React.useState(0);
  const [archiveFilterState, setArchiveFilterState] = React.useState({
    operatorName: '',
    operatorCode: ''
  });

  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [openDetailsView, setOpenDetailsView] = React.useState(false);
  const [operatorKey, setOperatorKey] = React.useState(null);
  //#endregion

  //#region Colums for Table
  const columns = [
    {
      name: 'operatorCode',
      label: 'Employee Code',
      minWidth: 200,
      isDisableSorting: true
    },
    {
      sortName: 'OperatorName',
      name: 'operatorName',
      label: 'Employee Name',
      minWidth: 200,
      isDisableSorting: false
    },
    {
      sortName: 'operatorGroupName',
      name: 'operatorGroupName',
      label: 'Current Group',
      isDisableSorting: true,
      minWidth: 200
    },
    {
      name: 'departmentName',
      label: 'Department',
      minWidth: 200,
      isDisableSorting: true
    },
    {
      name: 'designationName',
      label: 'Designation',
      minWidth: 200,
      isDisableSorting: true
    },
    {
      name: 'phoneNumber',
      label: 'Phone',
      minWidth: 200,
      isDisableSorting: true
    },
    {
      name: 'email',
      label: 'Email',
      minWidth: 200,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF

  const getAllArchiveOperators = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    trackPromise(
      http
        .get(`${OPERATOR.get_archive}?${qs.stringify(queryParam)}`)
        .then(res => {
          const operators = res.data.data;
          setState(operators);
          setArchiveDataLength(res.data.totalNoOfRow);
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage, sortedBy, sortedColumn]);

  //#endregion

  //#region Hooks
  useEffect(() => getAllArchiveOperators(), [getAllArchiveOperators]);
  //#endregion

  //#region Events
  const onSearch = e => {};

  const onReset = e => {};

  const onRestore = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .put(`${OPERATOR.restore}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
        } else {
          toastAlerts('error', res.data.message);
        }
        getAllArchiveOperators();
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

  const onFilterInputChange = e => {
    const { name, value } = e.target;
    setArchiveFilterState({
      ...archiveFilterState,
      [name]: value
    });
  };

  const onView = row => {
    setOperatorKey(row.key);
    setOpenDetailsView(true);
  };

  //#endregion

  return (
    <Box>
      <Paper className={classes.root}>
        <Grid container>
          <Grid item container justifyContent="flex-end" xs={12} sm={12} md={12} lg={12}>
            <Toolbar className={classes.toolbar}>
              <FilterIcon onClick={() => setOpenArchiveFilter(filter => !filter)} />
            </Toolbar>
          </Grid>
        </Grid>

        <Collapse in={openArchiveFilter}>
          <div className={classes.filteredItems}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Employee Name"
                  name="operatorName"
                  className={classes.filterBoxBackground}
                  value={archiveFilterState.operatorName}
                  onChange={onFilterInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  label="Employee Code"
                  name="operatorCode"
                  className={classes.filterBoxBackground}
                  value={archiveFilterState.operatorCode}
                  onChange={onFilterInputChange}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <SearchButton className={classes.actionButton} onClick={onSearch} />
              <ResetButton className={classes.actionButton} onClick={onReset} />
            </Grid>
          </div>
        </Collapse>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(archiveDataLength / rowPerPage)}
          onPageChange={onPageChange}
          sortedColumn={sortedColumn}
          sortedBy={sortedBy}
          onSort={onSort}>
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
                      title: 'Re-Acitve Operator?',
                      content: 'Are you sure to re-active this operator??',
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
      <DetailsViewDialog open={openDetailsView} setOpen={setOpenDetailsView} title="Operator Details">
        <OperatorDetails itemKey={operatorKey} />
      </DetailsViewDialog>
    </Box>
  );
};

export default withSortBy(ArchiveOperatorList, 'OperatorName');

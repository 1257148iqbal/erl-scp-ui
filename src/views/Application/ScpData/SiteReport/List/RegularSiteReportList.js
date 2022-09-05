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
import { SITE_REPORT } from 'constants/ApiEndPoints/v1/siteReport';
import { internalServerError } from 'constants/ErrorMessages';
import { DAILY_DATA_SHEETS } from 'constants/permissionsType';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import SiteReportDetails from '../View/SiteReportDetails';

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
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  },
  btnSpecific: {
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: 5
    }
  }
}));

const RegularSiteReportList = props => {
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
  // const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [details, setDetails] = React.useState(null);
  const [boxes, setBoxes] = React.useState({
    box1: [],
    box2: [],
    box3: [],
    box4: [],
    box5: [],
    box6: [],
    box7: [],
    box8: [],
    box9: [],
    box10: [],
    box11: []
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
      isDisableSorting: false,
      minWidth: 250
    },
    {
      sortName: 'Time',
      name: 'time',
      label: 'Time',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      sortName: 'Lab Shift Name',
      name: 'labShiftName',
      label: 'Shift Name',
      isDisableSorting: false,
      minWidth: 200
    },
    {
      name: 'Locked?',
      label: 'Locked',
      minWidth: 170,
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF
  const getRegularSiteReports = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    trackPromise(
      http
        .get(SITE_REPORT.get_active, { params: queryParam })
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
  useEffect(() => getRegularSiteReports(), [getRegularSiteReports]);
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
        .put(`${SITE_REPORT.lock}/${key}`)
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
    try {
      const res = await http.get(`${SITE_REPORT.get_single}/${row.key}`);
      const box1 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-1');
      const box2 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-2');
      const box3 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-3');
      const box4 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-4');
      const box5 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-5');
      const box6 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-6');
      const box7 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-7');
      const box8 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-8');
      const box9 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-9');
      const box10 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-10');
      const box11 = res.data.data.siteReportDetails.filter(b => b.siteSection === 'Box-11');
      setDetails(res.data.data);
      setBoxes({ ...boxes, box1, box2, box3, box4, box5, box6, box7, box8, box9, box10, box11 });
      setOpenDetailsView(true);
    } catch (error) {
      toastAlerts('error', error);
    }
  };

  //#region Pre Loader
  const onEdit = row => {
    const date = row.date;
    if (date) {
      history.push({
        pathname: `${location.pathname}/edit`,
        state: row.key
      });
    } else {
      toastAlerts('error', 'There Was an Problems');
    }
  };
  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${SITE_REPORT.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getRegularSiteReports();
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
              color="primary"
              variant="contained"
              className={classes.btnSpecific}
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
              <StyledTableCell>{row.time}</StyledTableCell>
              <StyledTableCell>{row.labShiftName}</StyledTableCell>
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
                        title: 'Locked Log Sheet',
                        content: 'Do you want to locked Log Sheet?',
                        onConfirm: () => onLockStatusChange(row.key, getRegularSiteReports)
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
                      title: 'Delete Site Report?',
                      content: 'Are you sure to delete this site report??',
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
      {details && (
        <DetailsViewDialog
          open={openDetailsView}
          setOpen={setOpenDetailsView}
          title="Site Report Details"
          fileName={`SiteReport`}
          document={<PDFView data={details} />}>
          <SiteReportDetails
            boxes={boxes}
            masterInfo={{ date: details.date, time: details.time, operatorGroup: details.operatorGroup }}
          />
        </DetailsViewDialog>
      )}
    </Box>
  );
};

export default withSortBy(RegularSiteReportList, 'Date');

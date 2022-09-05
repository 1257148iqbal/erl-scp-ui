import { Box, Grid, lighten, makeStyles, Paper } from '@material-ui/core';
import { ActionButtonGroup, ConfirmDialog, CustomTable, NewButton } from 'components/CustomControls';
import { StyledTableCell, StyledTableRow } from 'components/CustomControls/TableRowHeadCell';
import { SITE_REPORT_SETTINGS } from 'constants/ApiEndPoints/v1/siteReportSetting';
import { internalServerError } from 'constants/ErrorMessages';
import qs from 'querystring';
import React, { useCallback, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  }
}));

const ActiveSiteReportSetting = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [state, setState] = React.useState([]);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [page, setPage] = React.useState(1);
  const [rowPerPage, setRowPerPage] = React.useState(10);
  const [dataLength, setDataLength] = React.useState(0);

  //#region Colums for Table
  const columns = [
    {
      name: 'siteSection',
      label: 'Site Section',
      isDisableSorting: true
    },
    {
      name: 'equipTagDisplayName',
      label: 'Equip Display Name',
      isDisableSorting: true
    },
    {
      name: 'standByTagDisplayName',
      label: 'Stand By Display Name',
      isDisableSorting: true
    }
  ];
  //#endregion

  //#region UDF

  const getAllSiteReportSettings = useCallback(() => {
    const queryParam = {
      PageNumber: page,
      PageSize: rowPerPage
    };

    trackPromise(
      http
        .get(`${SITE_REPORT_SETTINGS.get_all}?${qs.stringify(queryParam)}`)
        .then(res => {
          if (res.data.succeeded) {
            const siteReportSettings = res.data.data;
            setState(siteReportSettings);
            setDataLength(res.data.totalNoOfRow);
          }
        })
        .catch(err => toastAlerts('warning', err))
    );
  }, [page, rowPerPage]);

  //#region Hooks
  useEffect(() => getAllSiteReportSettings(), [getAllSiteReportSettings]);
  //#endregion

  //#region Event's
  const onDrawerOpen = () => {
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

  const onView = id => {};

  const onEdit = key => {
    history.push({
      pathname: `${location.pathname}/edit`,
      state: key
    });
  };

  const onDelete = key => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    http
      .delete(`${SITE_REPORT_SETTINGS.delete}/${key}`)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          getAllSiteReportSettings();
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
            <NewButton onClick={onDrawerOpen} appeared />
          </Grid>
        </Grid>
        <CustomTable
          columns={columns}
          rowPerPage={rowPerPage}
          onRowPerPageChange={onRowPerPageChange}
          count={Math.ceil(dataLength / rowPerPage)}
          onPageChange={onPageChange}>
          {state.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.siteSection}</StyledTableCell>
              <StyledTableCell>{row.equipTagDisplayName}</StyledTableCell>
              <StyledTableCell>{row.standByTagDisplayName}</StyledTableCell>
              <StyledTableCell align="center">
                <ActionButtonGroup
                  appearedViewButton
                  appearedDeleteButton
                  appearedEditButton
                  onView={() => onView(row.id)}
                  onEdit={() => {
                    onEdit(row.key);
                  }}
                  onDelete={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Designation?',
                      content: 'Are you sure to delete this designation??',
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
    </Box>
  );
};

export default ActiveSiteReportSetting;

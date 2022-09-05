/*
  > Title: Switch Log Edit form
  > Description: 
  > Author: Iqbal Hossain
  > Date: 2021-09-30
*/

import {
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles
} from '@material-ui/core';
import { CancelButton, CustomPreloder, Switch } from 'components/CustomControls';
import { SWITCH_LOG } from 'constants/ApiEndPoints/v1';
import { SWITCH_LOG_CONDITION } from 'constants/SwitchLogTypes';
import React, { useEffect } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    padding: 10
  },
  masterInfoBoxTableCell: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: '1.1rem'
  },
  h1: {
    color: '#fff',
    backgroundColor: '#2f64ba',
    border: 'none',
    fontSize: '1.3rem',
    fontWeight: 'Bold',
    margin: 1,
    textAlign: 'center'
  }
}));

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
    backgroundColor: '#215280',
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const SwitchLogViewForm = props => {
  const classes = useStyles();
  const { history, location } = props;

  //#region States
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  const [state, setState] = React.useState([]);

  //#endregion

  //#region UDF
  const getSwitche = () => {
    http.get(`${SWITCH_LOG.get_single}/${location.state}`).then(res => {
      if (res.succeeded) {
        const swithInfo = {
          ...res.data,
          switchLogDetails: res.data.switchLogDetails.map(s => ({
            id: s.id,
            switchId: s.switchId,
            key: s.key,
            switchLogMasterId: s.switchLogMasterId,
            switchName: s.switchName,
            operation: s.operation,
            isActive: s.isActive,
            value: s.condition === SWITCH_LOG_CONDITION.Bypass ? true : false
          }))
        };
        setState(swithInfo);
        setIsPageLoaded(true);
      } else {
        toastAlerts('error', 'Error with loading switches!!!');
      }
    });
  };

  //#endregion

  //#region Hook
  useEffect(() => {
    getSwitche();
  }, []);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events
  const onSwitchChange = e => {};

  const onCancel = () => {
    history.goBack();
  };

  //#endregion

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <h1 className={classes.h1}>SwitchLog Information</h1>
        </Grid>
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{formattedDate(state.date)}</TableCell>
                <TableCell>{state.shiftName}</TableCell>
                <TableCell>{state.fromTime ? state.fromTime : '...'}</TableCell>
                <TableCell>{state.toTime ? state.toTime : '...'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 10 }}>
        <TableContainer component={Paper}>
          <Table stickyHeader className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Switch Name</StyledTableCell>
                <StyledTableCell>Operation</StyledTableCell>
                <StyledTableCell>Condition</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.switchLogDetails.map(row => (
                <StyledTableRow key={row.switchId}>
                  <StyledTableCell size="small">{row.switchName}</StyledTableCell>
                  <StyledTableCell size="small">{row.operation}</StyledTableCell>
                  <StyledTableCell size="small">
                    <Typography component="div">
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>Normal</Grid>
                        <Grid item>
                          <Switch
                            checked={row.value}
                            onChange={e => {
                              onSwitchChange(e, row.switchId);
                            }}
                          />
                        </Grid>
                        <Grid item>Bypass</Grid>
                      </Grid>
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: 15 }}>
          <Grid container spacing={3}></Grid>
          <Grid container justifyContent="flex-end">
            <CancelButton onClick={onCancel} />
          </Grid>
        </div>
        <pre id="jsonData"></pre>
      </Grid>
    </Grid>
  );
};

export default SwitchLogViewForm;

/*
  > Title: Switch Log Edit form
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-07-19
  > Modified: 2022-01-20
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
import { CancelButton, CustomPreloder, Form, FormWrapper, SaveButton, Switch } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SWITCH_LOG } from 'constants/ApiEndPoints/v1';
import { SWITCH_LOG_CONDITION } from 'constants/SwitchLogTypes';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useCallback, useEffect } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, serverDate, time24 } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    padding: 10
  },
  masterInfoBoxTableCell: {
    paddingRight: 0,
    maxWidth: 16,
    [theme.breakpoints.down('md')]: {
      maxWidth: 55
    }
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

const SwitchLogEditForm = props => {
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history, location } = props;

  //#region States
  const [state, setState] = React.useState([]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  //#endregion

  //#region UDF
  const getSwitche = useCallback(() => {
    http.get(`${SWITCH_LOG.get_single}/${location.state}`).then(res => {
      if (res.data.succeeded) {
        const swithInfo = {
          ...res.data.data,
          switchLogDetails: res.data.data.switchLogDetails.map(s => ({
            id: s.id,
            switchId: s.switchId,
            key: s.key,
            switchLogMasterId: s.switchLogMasterId,
            switchName: s.switchName,
            operation: s.operation,
            isActive: s.isActive,
            value: s.condition === SWITCH_LOG_CONDITION.Normal ? true : false
          }))
        };
        setState(swithInfo);
        setIsPageLoaded(true);
      } else {
        toastAlerts('error', 'Error with loading switches!!!');
      }
    });
  }, [location.state]);

  //#endregion

  //#region Hook
  useEffect(() => {
    getSwitche();
  }, [getSwitche]);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events
  const onSwitchChange = (e, switchId) => {
    const { checked } = e.target;
    const oldState = { ...state };
    const updatedState = oldState.switchLogDetails.map(s => {
      if (s.switchId === switchId) {
        s['value'] = checked;
      }
      return s;
    });
    setState({ ...state, switchLogDetails: updatedState });
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      id: state.id,
      key: state.key,
      date: serverDate(state.date),
      currentTime: time24(new Date()),
      shiftId: state.shiftId,
      shiftName: state.shiftName,
      operatorId: state.operatorId,
      empCode: state.empCode,
      userName: state.userName,

      switchLogs: state.switchLogDetails.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.id = item.id;
        copiedItem.switchLogMasterId = item.switchLogMasterId;
        copiedItem.switchId = item.switchId;
        copiedItem.switchName = item.switchName;
        copiedItem.operation = item.operation;
        copiedItem.condition = item.value === true ? SWITCH_LOG_CONDITION.Normal : SWITCH_LOG_CONDITION.Bypass;
        delete copiedItem.key;
        delete copiedItem.value;
        delete copiedItem.isActive;
        return copiedItem;
      })
    };
    http
      .put(`${SWITCH_LOG.update}/${data.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('error', res.data.message);
        }
      })
      .catch(err => {
        setLoading(false);
        setOpenBackdrop(false);
        toastAlerts('error', err);
      });
  };
  //#endregion

  return (
    <PageContainer heading="Switch Log (Update)">
      <FormWrapper>
        <Form>
          <Grid container>
            <Grid item xs={12}>
              <Paper size="small">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                      <TableCell>{formattedDate(state.date)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                      <TableCell>{state.shiftName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                      <TableCell>{state.fromTime ? state.fromTime : '...'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
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
                        <StyledTableCell>{row.switchName}</StyledTableCell>
                        <StyledTableCell>{row.operation}</StyledTableCell>
                        <StyledTableCell>
                          <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                              <Grid item>Bypass</Grid>
                              <Grid item>
                                <Switch
                                  checked={row.value}
                                  onChange={e => {
                                    onSwitchChange(e, row.switchId);
                                  }}
                                />
                              </Grid>
                              <Grid item>Normal</Grid>
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
                  <SaveButton onClick={onSubmit} />
                  <CancelButton onClick={onCancel} />
                </Grid>
              </div>
              <pre id="jsonData"></pre>
            </Grid>
          </Grid>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default SwitchLogEditForm;

/**
 * 20-Jan-2022: Normal and Bypass position swiped
 **/

/*
  > Title: Switch Log form
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
import { CancelButton, Form, FormWrapper, SaveButton, Spinner, Switch } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, SWITCH, SWITCH_LOG } from 'constants/ApiEndPoints/v1';
import { SWITCH_LOG_CONDITION } from 'constants/SwitchLogTypes';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { sweetAlerts, toastAlerts } from 'utils/alerts';
import { stringifyConsole } from 'utils/commonHelper';
import { formattedDate, getNewDateBefore, getTimeFromDate, serverDate, time24 } from 'utils/dateHelper';

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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
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

const SwitchLogCreateForm = props => {
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history } = props;

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region States
  const [state, setState] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [date, setDate] = useState(new Date());

  //#endregion

  //#region UDF
  const getSwitches = useCallback(
    shiftFormTime => {
      const queryParam = {
        Date: serverDate(date),
        FromTime: shiftFormTime
      };
      trackPromise(
        http.get(`${SWITCH.get_switches_with_last_value}?${qs.stringify(queryParam)}`).then(res => {
          const switches = res.data.data.map(s => ({
            switchId: s.id,
            key: s.key,
            switchName: s.switchName,
            condition: s.condition,
            operation: s.operation,
            isActive: s.isActive,
            value: s.condition ? (s.condition === SWITCH_LOG_CONDITION.Normal ? true : false) : true
          }));
          setState(switches);
        })
      );
    },
    [date]
  );

  const checkDuplicateShift = useCallback(
    (shiftId, shiftFormTime) => {
      const queryParam = {
        ShiftId: shiftId,
        Date: serverDate(date)
      };
      trackPromise(
        http.get(`${SWITCH_LOG.check_duplicate_switch_log}?${qs.stringify(queryParam)}`).then(res => {
          const isExist = res.data.data > 0;
          if (isExist) {
            sweetAlerts('error', 'Error', res.data.message);
          } else {
            getSwitches(shiftFormTime);
          }
        })
      );
    },
    [date, getSwitches]
  );
  // Get Swith and Current Shift
  const getCurrentShift = useCallback(() => {
    const queryParam = {
      CurrentTime: time24(date)
    };

    trackPromise(
      http
        .get(`${LAB_SHIFT.get_current_shift}?${qs.stringify(queryParam)}`)
        .then(res => {
          const currentshift = res.data.data;
          setCurrentShift(currentshift);
          const shiftId = currentshift.id;
          const shiftFormTime = currentshift.fromTime;
          checkDuplicateShift(shiftId, shiftFormTime);
        })
        .catch(({ response }) => {
          toastAlerts('error', response.data.Message);
        })
    );
  }, [checkDuplicateShift, date]);
  //#endregion

  //#region Hook

  useEffect(() => {
    const currentTime = getTimeFromDate(date);

    const fromTime = getTimeFromDate(new Date(`0000-01-01 00:00:01`));
    const toTime = getTimeFromDate(new Date(`0000-01-01 06:59:59`));

    if (currentTime >= fromTime && currentTime <= toTime) {
      const prevDate = getNewDateBefore(date, 1);
      setDate(prevDate);
    }
  }, [date]);

  useEffect(() => {
    getCurrentShift();
  }, [getCurrentShift]);

  //#endregion

  //#region Events
  const onSwitchChange = (e, switchId) => {
    const { checked } = e.target;
    const oldState = [...state];
    const updatedState = oldState.map(s => {
      if (s.switchId === switchId) {
        s['value'] = checked;
      }
      return s;
    });
    setState(updatedState);
  };

  const onCancel = () => {
    history.goBack();
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);

    if (currentShift) {
      // const currentdatetime = date;
      // const currshift = { ...currentShift };
      // let date = currentdatetime;

      // const currentTime = getTimeFromDate(currentdatetime);

      // const shiftEndTime = getTimeFromDate(new Date(`0000-01-01 ${currshift.toTime}`));

      // if (currshift.isEndNextDay) {
      //   if (currentTime <= shiftEndTime) {
      //     date = getNewDateBefore(currentdatetime);
      //   }
      // }
      const data = {
        date: serverDate(date),
        shiftId: currentShift.id,
        shiftName: currentShift.shiftName,
        operatorId: operatorId,
        empCode: employeeID,
        userName: userName,
        switchLogs: state.map(item => {
          const copiedItem = Object.assign({}, item);
          copiedItem.switchId = item.switchId;
          copiedItem.switchName = item.switchName;
          copiedItem.operation = item.operation;
          copiedItem.condition = item.value === true ? SWITCH_LOG_CONDITION.Normal : SWITCH_LOG_CONDITION.Bypass;
          delete copiedItem.key;
          delete copiedItem.isActive;
          delete copiedItem.value;
          return copiedItem;
        })
      };
      stringifyConsole(data, 'normal');
      //return;
      http
        .post(SWITCH_LOG.create, data)
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
    } else {
      toastAlerts('warning', 'There is a proble with loading shift info. Please contact with admin');
    }
  };
  //#endregion

  return (
    <PageContainer heading="Switch Log (Create)">
      <FormWrapper>
        <Form>
          <Grid container>
            <Grid item xs={12}>
              <Paper>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                      <TableCell>{formattedDate(date)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                      <TableCell>{currentShift ? currentShift.shiftName : '...'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                      <TableCell>{currentShift ? currentShift.fromTime : '...'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
                      <TableCell>{currentShift ? currentShift.toTime : '...'}</TableCell>
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
                      <StyledTableCell>Previous Condition</StyledTableCell>
                      <StyledTableCell>Condition</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.map(row => (
                      <StyledTableRow key={row.switchId}>
                        <StyledTableCell>{row.switchName}</StyledTableCell>
                        <StyledTableCell>{row.operation}</StyledTableCell>
                        <StyledTableCell>{row.condition ?? 'N/A'}</StyledTableCell>
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
          <Spinner type="Oval" />
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default SwitchLogCreateForm;

/**
 * 20-Jan-2022: Normal and Bypass position swiped
 **/

/*
  > Title: Switch Log form
  > Description: 
  > Author: Nasir Ahmed
  > Date: 2021-08-18
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
import Axios from 'axios';
import {
  CancelButton,
  CustomAutoComplete,
  CustomDatePicker,
  Form,
  FormWrapper,
  SaveButton,
  Switch
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, SWITCH, SWITCH_LOG } from 'constants/ApiEndPoints/v1';
import { SWITCH_LOG_CONDITION } from 'constants/SwitchLogTypes';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { serverDate } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    padding: 10
  },
  masterInfoBoxTableCell: {
    paddingRight: 0,
    maxWidth: 20,
    [theme.breakpoints.down('md')]: {
      maxWidth: 60
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

const SwitchLogSpecificForm = props => {
  const classes = useStyles();

  //#region Refs
  const refShiftName = useRef();
  //#endregion

  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history } = props;

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region States

  const [shift, setShift] = React.useState(null);
  const [shifts, setShifts] = React.useState([]);

  const [state, setState] = useState([]);
  const [date, setDate] = React.useState(null);

  //#endregion

  //#region UDF

  // Get Swith and Active Shift
  const getDependencies = () => {
    Axios.all([http.get(SWITCH.get_active), http.get(LAB_SHIFT.get_active)])
      .then(
        Axios.spread((...responses) => {
          const switchResponse = responses[0].data;
          const shiftResponse = responses[1].data;
          if (switchResponse.succeeded && shiftResponse.succeeded) {
            const switches = switchResponse.data.map(s => ({
              switchId: s.id,
              key: s.key,
              switchName: s.switchName,
              operation: s.operation,
              isActive: s.isActive,
              value: true
            }));
            setState(switches);
            const shifts = shiftResponse.data.map(item => ({
              ...item,
              label: item.shiftName,
              value: item.id
            }));
            setShifts(shifts);
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  };
  //#endregion

  //#region Hook
  useEffect(() => {
    getDependencies();
  }, []);
  //#endregion

  //#region Events

  const onDateChange = date => {
    setDate(date);
    if (!date) {
      setShift(null);
    }
  };

  const onShiftChange = (e, newValue) => {
    if (newValue) {
      setShift(newValue);
    } else {
      setShift(null);
    }
  };

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

  const onReset = () => {
    const oldState = [...state];
    const updatedState = oldState.map(s => ({
      ...s,
      value: true
    }));
    setDate(null);
    setShift(null);
    setState(updatedState);
  };

  const onSubmit = e => {
    e.preventDefault();
    if (date && shift) {
      setLoading(true);
      setOpenBackdrop(true);
      const data = {
        date: serverDate(date),
        shiftId: shift.value,
        shiftName: shift.label,
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

      http
        .post(SWITCH_LOG.create, data)
        .then(res => {
          if (res.data.succeeded) {
            setLoading(false);
            setOpenBackdrop(false);
            toastAlerts('success', res.data.message);
            onReset();
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
      toastAlerts('warning', 'Plese select all fields!!');
    }
  };
  //#endregion

  return (
    <PageContainer heading="Switch Log (Create Specific)">
      <FormWrapper>
        <Form>
          <Grid container>
            <Grid item xs={12}>
              <Paper>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                      <TableCell>
                        <CustomDatePicker label="Select Date" value={date} onChange={onDateChange} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                      <TableCell>
                        <CustomAutoComplete
                          ref={refShiftName}
                          disabled={!date}
                          name="shiftId"
                          data={shifts}
                          label="Shift"
                          value={shift}
                          onChange={onShiftChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> Start Time</TableCell>
                      <TableCell>{shift ? shift.fromTime : 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}> End Time</TableCell>
                      <TableCell>{shift ? shift.toTime : 'N/A'}</TableCell>
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
                    {state.map(row => (
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

export default SwitchLogSpecificForm;

/**
 * 20-Jan-2022: Normal and Bypass position swiped
 **/

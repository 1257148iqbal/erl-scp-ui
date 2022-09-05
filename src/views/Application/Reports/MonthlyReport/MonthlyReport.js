import {
  Button,
  Grid,
  lighten,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Add, Assignment, ExitToApp } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/styles';
import { CustomBackDrop, CustomDatePicker, TextInput } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DAILY_PRODUCTION, REPORTS } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import qs from 'querystring';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { floatingPointCheck, getPercentage, isZeroCheck, sleep } from 'utils/commonHelper';
import { datesFromMonth, formattedDate, getDateElements, serverDate } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import PDFView from './PDFView';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  throughPut: {
    backgroundColor: '#E7F4E3'
  },
  production: {
    backgroundColor: '#F0EBDD'
  },
  consumption: {
    backgroundColor: '#DFEFF0'
  },
  btnGenerate: {
    margin: 5,
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#62AD2D',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#62AD2D',
      color: '#FFFFFF',
      border: 'none'
    }
  },
  label: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  link: {
    color: '#FEA362',
    textDecoration: 'none',
    backgroundColor: '#FFFFFF',
    padding: '20px 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#FEA362',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const StyledTableHeadCell = withStyles(theme => ({
  head: {
    backgroundColor: '#222',
    color: '#FFF',
    border: '1px solid #FFF'
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

const MonthlyReport = props => {
  const classes = useStyles();
  const history = useHistory();
  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  const { setOpenBackdrop } = useBackDrop();
  //#region States
  const [state, setState] = useState(null);
  const [date, setDate] = useState(new Date('2022-05-01'));
  //#endregion

  //find Start Date
  const fromDate = datesFromMonth(date).startDate;

  //#region UDF's
  const calculateThroughput = (data = [], propsName) => {
    const sum = data.reduce((acc, curr) => {
      const sum = acc + curr[propsName];
      return Number(parseFloat(sum).toFixed(2));
    }, 0);
    return sum;
  };
  const calculateProductionOrConsumption = (data = [], propsName) => {
    const filterdData = data.filter(item => item.feed_ALC || item.feed_Murban);
    const sum = filterdData.reduce((acc, curr) => {
      const sum = acc + curr[propsName];
      return Number(parseFloat(sum).toFixed(2));
    }, 0);
    return sum;
  };

  //#endregion

  //#region Event
  const onDateChange = date => {
    setDate(date);
  };

  const onGetData = () => {
    const queryParam = {
      fromDate: datesFromMonth(date).startDate,
      toDate: datesFromMonth(date).endDate
    };

    http.get(`${REPORTS.get_monthly_production_by_date}?${qs.stringify(queryParam)}`).then(res => {
      const data = {
        records: res.data.data.map(item => {
          item.id = uuid();
          item.note = item.note ?? '';
          item.toggleNote = false;
          item.feed_ALC = Math.round(item.feed_ALC);
          item.feed_Murban = Math.round(item.feed_Murban);
          item.gas_Oil = Math.round(item.gas_Oil);
          item.residue = Math.round(item.residue);
          item.steam = Math.round(item.steam);
          item.ng = Math.round(item.ng);
          item.power = Math.round(item.power);
          item.naptha = Number(parseFloat(item.naptha).toFixed(2));
          item.gas = Number(parseFloat(item.gas).toFixed(2));
          item.nH3 = Number(parseFloat(item.nH3).toFixed(2));
          item.ci = Number(parseFloat(item.ci).toFixed(2));
          item.ao = Number(parseFloat(item.ao).toFixed(2));
          return item;
        })
      };
      data.month = getDateElements(date).date.month;
      data.year = getDateElements(date).date.year;
      data.feed_ALC_Total = calculateThroughput(data.records, 'feed_ALC');
      data.feed_Murban_Total = calculateThroughput(data.records, 'feed_Murban');
      data.gas_Oil_Total = calculateProductionOrConsumption(data.records, 'gas_Oil');
      data.residue_Total = calculateProductionOrConsumption(data.records, 'residue');
      data.steam_Total = calculateProductionOrConsumption(data.records, 'steam');
      data.ng_Total = calculateProductionOrConsumption(data.records, 'ng');
      data.power_Total = calculateProductionOrConsumption(data.records, 'power');
      data.naptha_Total = calculateProductionOrConsumption(data.records, 'naptha');
      data.gas_Total = calculateProductionOrConsumption(data.records, 'gas');
      data.nH3_Total = calculateProductionOrConsumption(data.records, 'nH3');
      data.ci_Total = calculateProductionOrConsumption(data.records, 'ci');
      data.ao_Total = calculateProductionOrConsumption(data.records, 'ao');

      data.throughput = floatingPointCheck(data.feed_ALC_Total + data.feed_Murban_Total);
      data.production = floatingPointCheck(
        data.gas_Oil_Total + data.residue_Total + data.naptha_Total + data.gas_Total + data.steam_Total
      );
      data.consumption = floatingPointCheck(
        data.ng_Total + data.power_Total + data.nH3_Total + data.ci_Total + data.ao_Total
      );

      data.feed_ALC_Percentage = getPercentage(data.feed_ALC_Total, data.throughput);
      data.feed_Murban_Percentage = getPercentage(data.feed_Murban_Total, data.throughput);

      data.gas_Oil_Percentage = getPercentage(data.gas_Oil_Total, data.throughput);
      data.naptha_Percentage = getPercentage(data.naptha_Total, data.throughput);
      data.residue_Percentage = 100 - (data.gas_Oil_Percentage + data.naptha_Percentage);
      data.gas_Percentage = '-';
      data.steam_Percentage = '-';

      data.ng_Percentage = '-';
      data.power_Percentage = '-';
      data.nH3_Percentage = '-';
      data.ci_Percentage = '-';
      data.ao_Percentage = '-';
      // stringifyConsole(data, 'normal');
      setState(data);
    });
  };

  // useEffect(() => {
  //   onGetData();
  // }, []);

  const onToggleNote = (toggle, rowIndex) => {
    const _state = _.cloneDeep(state);
    const _records = [..._state.records];
    const targetRow = _records[rowIndex];
    targetRow.toggleNote = toggle;
    _records[rowIndex] = targetRow;
    _state.records = _records;
    setState(_state);
  };

  const onNoteChange = (e, rowId, rowIndex) => {
    const _state = _.cloneDeep(state);
    const _records = [..._state.records];
    const targetRow = _records[rowIndex];
    targetRow.note = e.target.value;
    _records[rowIndex] = targetRow;
    _state.records = _records;
    setState(_state);
  };

  const onSaveNote = async data => {
    const payload = { ...data };
    payload.operatorId = operatorId;
    payload.empCode = employeeID;
    payload.userName = userName;
    setOpenBackdrop(true);
    await sleep(500);

    try {
      const res = await http.post(DAILY_PRODUCTION.create, payload);
      if (res.data.succeeded) {
        onGetData();
      } else {
        toastAlerts('error', 'There was an error to save this note!!!');
      }
    } catch (err) {
      toastAlerts('error', 'There was an error to save this note!!!');
    } finally {
      setOpenBackdrop(false);
    }
  };

  //#endregion

  return (
    <PageContainer heading="Monthly Report">
      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView data={state} />
        </PDFViewer>
      </Grid> */}
      <Grid
        container
        component={Paper}
        style={{ padding: 5, margin: '10px 0px' }}
        spacing={5}
        justifyContent="space-between">
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <CustomDatePicker
            disableFuture
            openTo="year"
            views={['year', 'month']}
            label="Select Date"
            format="MMM yyyy"
            value={date}
            onChange={onDateChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Button
            disabled={!date}
            variant="contained"
            color="default"
            className={classes.btnGenerate}
            endIcon={<Assignment />}
            onClick={onGetData}>
            Generate
          </Button>

          {state && <PrintButton fileName="MonthlyReport" document={<PDFView data={state} fromDate={fromDate} />} />}
        </Grid>
      </Grid>

      {state ? (
        <Fragment>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell rowSpan="2" align="center">
                    Date
                  </StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="2" align="center">
                    THROUGH PUT
                  </StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="5" align="center">
                    PRODUCTION
                  </StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="5" align="center">
                    CONSUMPTION
                  </StyledTableHeadCell>
                </TableRow>
                <TableRow>
                  <StyledTableHeadCell align="center">Feed (ALC)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Feed (Murban)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Gas Oil (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Residue (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">NAPTHA (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">GAS (N-m3)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">STEAM (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">NG (N-m3)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">POWER (kwh)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">NH3 (Kg)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">C.I (Ltr)</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">A.O (Ltr)</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.records?.map((row, index) => {
                  if (row.feed_ALC || row.feed_Murban) {
                    return (
                      <TableRow key={row.id}>
                        <TableCell style={{ minWidth: 130, borderRight: '2px solid black' }}>
                          {formattedDate(row.date)}
                        </TableCell>
                        <TableCell align="center" className={classes.throughPut}>
                          {isZeroCheck(row.feed_ALC)}
                        </TableCell>
                        <TableCell align="center" style={{ backgroundColor: '#E7F4E3', borderRight: '2px solid black' }}>
                          {isZeroCheck(row.feed_Murban)}
                        </TableCell>

                        <TableCell align="center" className={classes.production}>
                          {isZeroCheck(row.gas_Oil)}
                        </TableCell>
                        <TableCell align="center" className={classes.production}>
                          {isZeroCheck(row.residue)}
                        </TableCell>
                        <TableCell align="center" className={classes.production}>
                          {isZeroCheck(row.naptha)}
                        </TableCell>
                        <TableCell align="center" className={classes.production}>
                          {isZeroCheck(row.gas)}
                        </TableCell>
                        <TableCell align="center" style={{ backgroundColor: '#F0EBDD', borderRight: '2px solid black' }}>
                          {isZeroCheck(row.steam)}
                        </TableCell>

                        <TableCell align="center" className={classes.consumption}>
                          {isZeroCheck(row.ng)}
                        </TableCell>
                        <TableCell align="center" className={classes.consumption}>
                          {isZeroCheck(row.power)}
                        </TableCell>
                        <TableCell align="center" className={classes.consumption}>
                          {isZeroCheck(row.nH3)}
                        </TableCell>
                        <TableCell align="center" className={classes.consumption}>
                          {isZeroCheck(row.ci)}
                        </TableCell>
                        <TableCell align="center" className={classes.consumption}>
                          {isZeroCheck(row.ao)}
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow key={row.id}>
                        <TableCell style={{ minWidth: 130, borderRight: '2px solid black' }}>
                          {formattedDate(row.date)}
                        </TableCell>
                        <TableCell colSpan={12} align="center">
                          {''}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}

                <TableRow style={{ backgroundColor: '#D8D9F0' }}>
                  <TableCell size="small" style={{ borderRight: '2px solid black', fontSize: '20px', fontWeight: 'bold' }}>
                    Total:
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.feed_ALC_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label} style={{ borderRight: '2px solid black' }}>
                    {isZeroCheck(state.feed_Murban_Total)}
                  </TableCell>

                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.gas_Oil_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.residue_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.naptha_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.gas_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label} style={{ borderRight: '2px solid black' }}>
                    {isZeroCheck(state.steam_Total)}
                  </TableCell>

                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.ng_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.power_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.nH3_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.ci_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.ao_Total)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell size="small" className={classes.label} style={{ borderRight: '2px solid black' }}>
                    Throughput
                  </TableCell>
                  <TableCell
                    size="small"
                    colSpan={2}
                    className={classes.throughPut}
                    style={{ borderRight: '2px solid black' }}>
                    {state.throughput}
                  </TableCell>

                  <TableCell size="small" colSpan={2} className={classes.label} style={{ backgroundColor: '#F0EBDD' }}>
                    {/* Production */}
                  </TableCell>
                  <TableCell
                    size="small"
                    colSpan={3}
                    className={classes.production}
                    style={{ borderRight: '2px solid black' }}>
                    {/* {state.production} */}
                  </TableCell>

                  <TableCell size="small" colSpan={2} className={classes.label} style={{ backgroundColor: '#DFEFF0' }}>
                    {/* Consumption */}
                  </TableCell>
                  <TableCell size="small" colSpan={3} className={classes.consumption}>
                    {/* {state.consumption} */}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell size="small" className={classes.label} style={{ borderRight: '2px solid black' }}>
                    Percent
                  </TableCell>
                  <TableCell size="small" className={classes.throughPut}>{`${state.feed_ALC_Percentage}%`}</TableCell>
                  <TableCell
                    size="small"
                    className={classes.throughPut}
                    style={{ borderRight: '2px solid black' }}>{`${state.feed_Murban_Percentage}%`}</TableCell>

                  <TableCell size="small" className={classes.production}>{`${state.gas_Oil_Percentage}%`}</TableCell>
                  <TableCell size="small" className={classes.production}>{`${state.residue_Percentage}%`}</TableCell>
                  <TableCell size="small" className={classes.production}>{`${state.naptha_Percentage}%`}</TableCell>
                  <TableCell size="small" className={classes.production}>{``}</TableCell>
                  <TableCell
                    size="small"
                    className={classes.production}
                    style={{ borderRight: '2px solid black' }}>{``}</TableCell>

                  <TableCell size="small" className={classes.consumption}>{``}</TableCell>
                  <TableCell size="small" className={classes.consumption}>{``}</TableCell>
                  <TableCell size="small" className={classes.consumption}>{``}</TableCell>
                  <TableCell size="small" className={classes.consumption}>{``}</TableCell>
                  <TableCell size="small" className={classes.consumption}>{``}</TableCell>
                </TableRow>

                {state.records?.map((row, idx) => {
                  if (serverDate(row.date) === fromDate) {
                    if (row.getNote) {
                      return (
                        <TableRow key={row.id}>
                          <TableCell colSpan={12}>
                            {!row.toggleNote && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onToggleNote(true, idx)}
                                startIcon={<Add />}>
                                Add Note
                              </Button>
                            )}

                            {row.toggleNote && (
                              <Fragment>
                                <TextInput name="note" value={row.note} onChange={e => onNoteChange(e, row.id, idx)} />
                                <button
                                  type="button"
                                  style={{
                                    padding: '8px 5px',
                                    margin: '0 3px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: 5
                                  }}
                                  onClick={() => onSaveNote({ date: row.date, note: row.note })}>
                                  Save
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    padding: '8px 5px',
                                    margin: '0 3px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: 5
                                  }}
                                  onClick={() => onToggleNote(false, idx)}>
                                  Cancel
                                </button>
                              </Fragment>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    } else if (!row.getNote && !row.toggleNote) {
                      return (
                        <TableRow key={row.id}>
                          <TableCell colSpan={1} style={{ fontWeight: 'bold', fontSize: 18 }}>{`Remarks: `}</TableCell>
                          <TableCell colSpan={12}>
                            <TextInput disabled value={row.note} onChange={e => onNoteChange(e, row.id, idx)} />

                            {!row.toggleNote && (
                              <button
                                type="button"
                                style={{
                                  padding: '8px 5px',
                                  margin: '0 3px',
                                  backgroundColor: 'green',
                                  color: 'white',
                                  cursor: 'pointer',
                                  borderRadius: 5
                                }}
                                onClick={() => onToggleNote(true, idx)}>
                                Update
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      if (row.toggleNote) {
                        return (
                          <TableRow key={row.id}>
                            <TableCell colSpan={1} style={{ fontWeight: 'bold', fontSize: 18 }}>{`Remarks: `}</TableCell>
                            <TableCell colSpan={12}>
                              <TextInput name="note" value={row.note} onChange={e => onNoteChange(e, row.id, idx)} />

                              {row.toggleNote && (
                                <Fragment>
                                  <button
                                    type="button"
                                    style={{
                                      padding: '8px 5px',
                                      margin: '0 3px',
                                      backgroundColor: 'green',
                                      color: 'white',
                                      cursor: 'pointer',
                                      borderRadius: 5
                                    }}
                                    onClick={() => onSaveNote({ date: row.date, note: row.note })}>
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    style={{
                                      padding: '8px 5px',
                                      margin: '0 3px',
                                      backgroundColor: 'red',
                                      color: 'white',
                                      cursor: 'pointer',
                                      borderRadius: 5
                                    }}
                                    onClick={() => onToggleNote(false, idx)}>
                                    Cancel
                                  </button>
                                </Fragment>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    }
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container justifyContent="flex-end" spacing={1}>
            <Button
              variant="contained"
              color="default"
              className={classes.buttonPrint}
              endIcon={<ExitToApp />}
              onClick={() => history.goBack()}>
              Go Back
            </Button>
          </Grid>
        </Fragment>
      ) : (
        <h2 style={{ textAlign: 'center' }}>No Data</h2>
      )}
      <CustomBackDrop />
    </PageContainer>
  );
};

export default MonthlyReport;

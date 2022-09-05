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
  TableRow,
  Typography
} from '@material-ui/core';
import { Assignment, ExitToApp } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/styles';
import { CustomDatePicker } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { REPORTS } from 'constants/ApiEndPoints/v1';
import qs from 'querystring';
import React, { Fragment, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { floatingPointCheck, getPercentage, isZeroCheck } from 'utils/commonHelper';
import { datesFromMonth } from 'utils/dateHelper';
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
  }
}));

const StyledTableHeadCell = withStyles(theme => ({
  head: {
    backgroundColor: '#222',
    color: '#FFF',
    border: '1px solid #FFF',
    textAlign: 'center',
    minWidth: 130,
    fontSize: 15
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

const YearlyReport = props => {
  const classes = useStyles();
  const history = useHistory();
  //#region States
  const [state, setState] = React.useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  //#endregion

  //#region UDF's
  const sumCalculation = (data = [], propsName) =>
    data.reduce((acc, curr) => {
      const sum = acc + curr[propsName];
      return Number(parseFloat(sum).toFixed(2));
    }, 0);

  //#endregion

  //#region Event
  const onToDateChange = date => {
    setToDate(date);
  };

  const onFromDateChange = date => {
    setFromDate(date);
    setToDate(null);
  };

  const onGetData = () => {
    const queryParam = {
      fromDate: datesFromMonth(fromDate).startDate,
      toDate: datesFromMonth(toDate).endDate
    };
    trackPromise(
      http.get(`${REPORTS.get_yearly_production_by_date}?${qs.stringify(queryParam)}`).then(res => {
        const data = {
          records: res.data.data.map(item => {
            item.id = uuid();
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
        data.feed_ALC_Total = sumCalculation(data.records, 'feed_ALC');
        data.feed_Murban_Total = sumCalculation(data.records, 'feed_Murban');
        data.gas_Oil_Total = sumCalculation(data.records, 'gas_Oil');
        data.residue_Total = sumCalculation(data.records, 'residue');
        data.steam_Total = sumCalculation(data.records, 'steam');
        data.ng_Total = sumCalculation(data.records, 'ng');
        data.power_Total = sumCalculation(data.records, 'power');
        data.naptha_Total = sumCalculation(data.records, 'naptha');
        data.gas_Total = sumCalculation(data.records, 'gas');
        data.nH3_Total = sumCalculation(data.records, 'nH3');
        data.ci_Total = sumCalculation(data.records, 'ci');
        data.ao_Total = sumCalculation(data.records, 'ao');

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

        const sorted = { ...data, records: data.records.sort((a, b) => a.year - b.year) };
        setState(sorted);
      })
    );
  };
  //#endregion

  return (
    <PageContainer heading="Yearly Report">
      <Grid container component={Paper} style={{ padding: 5, margin: '10px 0px' }} spacing={5}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <CustomDatePicker
            label="From Date"
            views={['year', 'month']}
            format="MMM yyyy"
            value={fromDate}
            onChange={onFromDateChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <CustomDatePicker
            label="To Date"
            disableFuture
            value={toDate}
            minDate={datesFromMonth(fromDate).startDate}
            disabled={datesFromMonth(fromDate).startDate == null}
            onChange={onToDateChange}
            views={['year', 'month']}
            format="MMM yyyy"
          />
        </Grid>
        <Grid container item justifyContent="flex-start" xs={12} sm={12} md={4} lg={4}>
          <Button
            variant="contained"
            color="default"
            className={classes.btnGenerate}
            endIcon={<Assignment />}
            onClick={onGetData}>
            Generate
          </Button>
          {state && (
            <PrintButton
              fileName="YearlyReport"
              document={
                <PDFView
                  data={state}
                  fromDate={datesFromMonth(fromDate).startDate}
                  toDate={datesFromMonth(toDate).endDate}
                />
              }
            />
          )}
        </Grid>
      </Grid>
      {state ? (
        <Fragment>
          <TableContainer component={Paper} style={{ marginBottom: 15 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell rowSpan="2">Month</StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="2">THROUGH PUT</StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="5">PRODUCTION</StyledTableHeadCell>
                  <StyledTableHeadCell colSpan="5">CONSUMPTION</StyledTableHeadCell>
                </TableRow>
                <TableRow>
                  <StyledTableHeadCell>Feed (ALC)</StyledTableHeadCell>
                  <StyledTableHeadCell>Feed (Murban)</StyledTableHeadCell>

                  <StyledTableHeadCell>Residue (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell>Gas Oil (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell>NAPTHA (MT)</StyledTableHeadCell>
                  <StyledTableHeadCell>VB GAS (N-m3)</StyledTableHeadCell>
                  <StyledTableHeadCell>STEAM (MT)</StyledTableHeadCell>

                  <StyledTableHeadCell>NG (N-m3)</StyledTableHeadCell>
                  <StyledTableHeadCell>POWER (kwh)</StyledTableHeadCell>
                  <StyledTableHeadCell>NH3 (Kg)</StyledTableHeadCell>
                  <StyledTableHeadCell>C.I (Ltr)</StyledTableHeadCell>
                  <StyledTableHeadCell>A.O (Ltr)</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.records?.map(row => (
                  <TableRow key={row.id}>
                    <TableCell style={{ minWidth: 130, borderRight: '2px solid black' }}>
                      <Typography variant="h3">{row.month}</Typography>
                      <Typography variant="caption">{row.year}</Typography>
                    </TableCell>
                    <TableCell align="center" className={classes.throughPut}>
                      {isZeroCheck(row.feed_ALC)}
                    </TableCell>
                    <TableCell align="center" style={{ backgroundColor: '#E7F4E3', borderRight: '2px solid black' }}>
                      {isZeroCheck(row.feed_Murban)}
                    </TableCell>

                    <TableCell align="center" className={classes.production}>
                      {isZeroCheck(row.residue)}
                    </TableCell>
                    <TableCell align="center" className={classes.production}>
                      {isZeroCheck(row.gas_Oil)}
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
                ))}
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
                    {isZeroCheck(state.residue_Total)}
                  </TableCell>
                  <TableCell size="small" className={classes.label}>
                    {isZeroCheck(state.gas_Oil_Total)}
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

                  <TableCell size="small" className={classes.production}>{`${Number(state.residue_Percentage).toFixed(
                    2
                  )}%`}</TableCell>
                  <TableCell size="small" className={classes.production}>{`${Number(state.gas_Oil_Percentage).toFixed(
                    2
                  )}%`}</TableCell>
                  <TableCell size="small" className={classes.production}>{`${Number(state.naptha_Percentage).toFixed(
                    2
                  )}%`}</TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                    TOTAL THROUGHTPUT: {`${state.throughput} MT  = `}
                    {`${Math.round(state.throughput * 6.69075)} BBL`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell colSpan={4}>TOTAL PRODUCTION</StyledTableHeadCell>
                </TableRow>
                <TableRow>
                  <StyledTableHeadCell>Particulars</StyledTableHeadCell>
                  <StyledTableHeadCell>Amount</StyledTableHeadCell>
                  <StyledTableHeadCell>Unit</StyledTableHeadCell>
                  <StyledTableHeadCell>Percent (%)</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>VB Residue</TableCell>
                  <TableCell align="center"> {state.residue_Total}</TableCell>
                  <TableCell align="center">MT</TableCell>
                  <TableCell align="center">{`${Number(state.residue_Percentage).toFixed(2)}%`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gas Oil</TableCell>
                  <TableCell align="center"> {state.gas_Oil_Total}</TableCell>
                  <TableCell align="center">MT</TableCell>
                  <TableCell align="center">{`${state.gas_Oil_Percentage}%`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Naphtha</TableCell>
                  <TableCell align="center"> {state.naptha_Total}</TableCell>
                  <TableCell align="center">MT</TableCell>
                  <TableCell align="center">{`${state.naptha_Percentage}%`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VB Gas</TableCell>
                  <TableCell align="center"> {state.gas_Total}</TableCell>
                  <TableCell align="center">MT</TableCell>
                  <TableCell align="center">{``}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Steam</TableCell>
                  <TableCell align="center"> {state.steam_Total}</TableCell>
                  <TableCell align="center">MT</TableCell>
                  <TableCell align="center">{``}</TableCell>
                </TableRow>
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
        <h2 style={{ textAlign: 'center' }}>No data</h2>
      )}
    </PageContainer>
  );
};

export default YearlyReport;

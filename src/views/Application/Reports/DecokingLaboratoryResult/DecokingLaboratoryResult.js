import {
  Button,
  Grid,
  lighten,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Assignment, ExitToApp } from '@material-ui/icons';
import axios from 'axios';
import { CustomAutoComplete, CustomDatePicker, CustomPreloder } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_NUMBERS, REPORTS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, getTime } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import PDFView from './PDFView';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  btnGenerate: {
    margin: 5,
    height: 42,
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
  buttonPrint: {
    textDecoration: 'none',
    margin: 5,
    height: 42,
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#FEA362',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#FEA362',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const DecokingLaboratoryResult = () => {
  const classes = useStyles();
  const history = useHistory();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [decokingNumber, setDecokingNumber] = useState(null);
  const [decokingNumbers, setDecokingNumbers] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [decokingLaboratory, setDecokingLaboratory] = useState([]);

  const getDecokingLaboratoryReports = async () => {
    try {
      const response = await http.get(REPORTS.decoking_laboratory_result, {
        params: {
          decokingNumberId: decokingNumber?.id,
          fromDate: formattedDate(fromDate),
          toDate: formattedDate(toDate)
        }
      });
      setDecokingLaboratory(response.data.data);
      setIsPageLoaded(true);
    } catch (error) {
      toastAlerts('error', process.env.NODE_ENV === 'production' ? internalServerError : error.message);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const token = source.token;

    const getDecokingNumbers = async () => {
      try {
        const response = await await http.get(DECOKING_NUMBERS.get_active, {
          cancelToken: token
        });
        const decokingNumbers = response.data.data.map(item => ({
          ...item,
          label: item.decokingNumber,
          value: item.id
        }));

        setDecokingNumbers(decokingNumbers);
        setIsPageLoaded(true);
      } catch (error) {
        toastAlerts('error', process.env.NODE_ENV === 'production' ? internalServerError : error.message);
      }
    };
    getDecokingNumbers();

    return () => {
      source.cancel();
    };
  }, []);

  const onDecokingNumberChange = (e, newValue) => {
    if (newValue) {
      setDecokingNumber(newValue);
    } else {
      setDecokingNumber(null);
    }
  };

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  return (
    <PageContainer heading="Decoking Laboratory Report">
      <CustomAutoComplete
        data={decokingNumbers}
        label="Decoking Number"
        value={decokingNumber}
        onChange={onDecokingNumberChange}
      />
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={6}>
          <CustomDatePicker
            disabled={!decokingNumber}
            label="Select From Date"
            value={fromDate}
            onChange={date => setFromDate(date)}
            minDate={decokingNumber?.fromDate}
            maxDate={decokingNumber?.toDate ? decokingNumber?.toDate : new Date()}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomDatePicker
            disabled={!decokingNumber}
            label="Select To Date"
            value={toDate}
            onChange={date => setToDate(date)}
            minDate={fromDate}
            maxDate={decokingNumber?.toDate ? decokingNumber?.toDate : new Date()}
          />
        </Grid>
      </Grid>

      <Grid item container spacing={2} justifyContent="flex-start">
        <Grid item>
          <Button
            variant="contained"
            color="default"
            className={classes.btnGenerate}
            endIcon={<Assignment />}
            onClick={getDecokingLaboratoryReports}
            disabled={!decokingNumber || !fromDate || !toDate}>
            Generate
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="default"
            className={classes.buttonPrint}
            endIcon={<ExitToApp />}
            onClick={() => history.goBack()}>
            Go Back
          </Button>
        </Grid>
        <Grid item>
          {decokingLaboratory ? (
            <PrintButton
              fileName={`DecokingLaboratoryReport`}
              document={<PDFView data={decokingLaboratory} />}
              disabled={!decokingNumber || !fromDate || !toDate}
            />
          ) : null}
        </Grid>
      </Grid>

      <div>
        {decokingLaboratory.length > 0 &&
          decokingLaboratory?.map((decoking, index) => (
            <React.Fragment key={index + 1}>
              <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333', margin: '10px auto' }}>
                <span>Date: </span>
                <span>{formattedDate(decoking.date)}</span>
              </div>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell>TIME (hrs.)</StyledTableHeadCell>
                      <StyledTableHeadCell>TIME Difference</StyledTableHeadCell>
                      <StyledTableHeadCell>
                        CO<sub>2</sub> (%)
                      </StyledTableHeadCell>
                      <StyledTableHeadCell>CO (%)</StyledTableHeadCell>
                      <StyledTableHeadCell>
                        O<sub>2</sub> (%)
                      </StyledTableHeadCell>
                      <StyledTableHeadCell>Air Reading</StyledTableHeadCell>
                      <StyledTableHeadCell>Coke Flow</StyledTableHeadCell>
                      <StyledTableHeadCell>Comment</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {decoking.details?.map((reading, index) => {
                      if (reading.cO2 === 0 && reading.co === 0 && reading.o2 === 0) {
                        const firstReading = decoking.details[0];
                        return (
                          <Fragment key={uuid()}>
                            <TableRow key={uuid()}>
                              <TableCell style={{ minWidth: 100 }}>{getTime(firstReading.time, 'HH:mm')}</TableCell>
                              <TableCell style={{ minWidth: 100, textAlign: 'center' }} colSpan={4}>
                                {'AIR CHARGE'}
                              </TableCell>
                              <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                {firstReading.airReading ? firstReading.airReading : '-'}
                              </TableCell>
                              <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                {firstReading.cokeFlow ? firstReading.cokeFlow : '-'}
                              </TableCell>
                              <TableCell style={{ minWidth: 100 }}>{firstReading.comment}</TableCell>
                            </TableRow>
                            {firstReading === !reading && (
                              <TableRow key={uuid()}>
                                <TableCell style={{ minWidth: 100 }}>{reading.time ? reading.time : '-'}</TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.timeDifference ? reading.timeDifference : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.cO2 ? reading.cO2 : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.co ? reading.co : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.o2 ? reading.o2 : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.airReading ? reading.airReading : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                                  {reading.cokeFlow ? reading.cokeFlow : '-'}
                                </TableCell>
                                <TableCell style={{ minWidth: 100 }}>{reading.comment ? reading.comment : '-'}</TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        );
                      } else {
                        return (
                          <TableRow key={index + 1}>
                            <TableCell style={{ minWidth: 100 }}>{getTime(reading.time, 'HH:mm')}</TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.timeDifference ? reading.timeDifference : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.cO2 ? reading.cO2 : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.co ? reading.co : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.o2 ? reading.o2 : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.airReading ? reading.airReading : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100, textAlign: 'center' }}>
                              {reading.cokeFlow ? reading.cokeFlow : '-'}
                            </TableCell>
                            <TableCell style={{ minWidth: 100 }}>{reading.comment}</TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </React.Fragment>
          ))}
      </div>

      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView data={decokingLaboratory} />
        </PDFViewer>
      </Grid> */}
    </PageContainer>
  );
};

export default DecokingLaboratoryResult;

import { Button, Grid, lighten, makeStyles, TableContainer } from '@material-ui/core';
import { Assignment, ExitToApp } from '@material-ui/icons';
import axios from 'axios';
import { CustomAutoComplete, CustomDatePicker, CustomPreloder } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_NUMBERS, REPORTS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';
import { formattedDate, getTimeFromDate } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import PDFView from './PDFView';
import './style/index.css';

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

const DecokingLogSheetResult = () => {
  const classes = useStyles();
  const history = useHistory();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [decokingNumber, setDecokingNumber] = React.useState(null);
  const [decokingNumbers, setDecokingNumbers] = React.useState([]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [decokingLogSheet, setDecokingLogSheet] = useState([]);

  const getDecokingLogSheets = async () => {
    try {
      const response = await http.get(REPORTS.decoking_log_sheet, {
        params: {
          decokingNumberId: decokingNumber.id,
          fromDate: formattedDate(fromDate),
          toDate: formattedDate(toDate)
        }
      });
      const decock = response.data.data;
      setDecokingLogSheet(decock);
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
    <PageContainer heading="Decoking Log Sheet Report">
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
            onClick={getDecokingLogSheets}
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
          <PrintButton
            fileName={`DecokingLogSheet`}
            document={<PDFView data={decokingLogSheet} />}
            disabled={!decokingNumber || !fromDate || !toDate}
          />
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView data={decokingLogSheet} />
        </PDFViewer>
      </Grid> */}

      <div>
        <React.Fragment>
          <TableContainer>
            {decokingLogSheet.map(item => {
              return (
                <div key={uuid()}>
                  <table size="small" className="decokingLogTable">
                    <thead>
                      <tr className="tableRow">
                        <td>PARAMETERS</td>
                        <td>UNIT</td>
                        {item.headings.map(heading => {
                          const datePart = formattedDate(heading);
                          const timePart = getTimeFromDate(heading, 'HH:mm');
                          return (
                            <td key={uuid()}>
                              {heading ? (
                                <>
                                  <span>{datePart}</span> <br />
                                  <span>{timePart}</span>
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {item.details
                        .filter(og => og.operationGroupName === 'Control Room')
                        .map(details => (
                          <tr key={uuid()}>
                            <td className="parameter">{details.parameterName}</td>
                            <td className="readingUnit">{getSign(details.unitName)}</td>
                            {details.readings.map(time => (
                              <td key={uuid()} className="readingUnit">
                                {time.reading === '0' || '' || 0 ? '-' : time.reading}
                              </td>
                            ))}
                          </tr>
                        ))}

                      <tr>
                        <td colSpan={7} className="local">
                          LOCAL READING
                        </td>
                      </tr>
                      {item.details
                        .filter(og => og.operationGroupName === 'Local')
                        .map(details => (
                          <tr key={uuid()}>
                            <td className="parameter">{details.parameterName}</td>
                            <td className="readingUnit">{getSign(details.unitName)}</td>
                            {details.readings.map(time => (
                              <td key={uuid()} className="readingUnit">
                                {time.reading === '0' || '' || 0 ? '-' : time.reading}
                              </td>
                            ))}
                          </tr>
                        ))}
                      <tr>
                        <td>{item.remark}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </TableContainer>
        </React.Fragment>
      </div>
    </PageContainer>
  );
};

export default DecokingLogSheetResult;

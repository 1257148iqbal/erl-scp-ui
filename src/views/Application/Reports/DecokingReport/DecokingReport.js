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
import { CustomAutoComplete, CustomPreloder } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_NUMBERS, REPORTS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
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

const DecokingReport = () => {
  const classes = useStyles();
  const history = useHistory();

  const [decokingNumber, setDecokingNumber] = React.useState(null);
  const [decokingNumbers, setDecokingNumbers] = React.useState([]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [decokingReport, setDecokingReport] = useState({});

  const getDecokingReport = async () => {
    try {
      const response = await http.get(REPORTS.decoking_report, {
        params: {
          decokingNumberId: decokingNumber?.id
        }
      });
      setDecokingReport(response.data.data);
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
    <PageContainer heading="Decoking Report">
      <CustomAutoComplete
        data={decokingNumbers}
        label="Decoking Number"
        value={decokingNumber}
        onChange={onDecokingNumberChange}
      />

      <Grid item container spacing={2} justifyContent="flex-start">
        <Grid item>
          <Button
            variant="contained"
            color="default"
            className={classes.btnGenerate}
            endIcon={<Assignment />}
            onClick={getDecokingReport}
            disabled={!decokingNumber}>
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
          {decokingReport ? (
            <PrintButton
              fileName={`decokingReportReport`}
              document={<PDFView data={decokingReport} />}
              disabled={!decokingNumber}
            />
          ) : null}
        </Grid>
      </Grid>

      <div>
        <React.Fragment>
          {decokingReport.number && decokingNumber && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>Parameter Name</StyledTableHeadCell>
                    <StyledTableHeadCell>Unit</StyledTableHeadCell>
                    <StyledTableHeadCell>Results</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Decoking Number</TableCell>
                    <TableCell align="center">No.</TableCell>
                    <TableCell align="center">{decokingReport.number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Start Date</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">{formattedDate(decokingReport.fromDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">{formattedDate(decokingReport.toDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Time Duration</TableCell>
                    <TableCell align="center">Day</TableCell>
                    <TableCell align="center">{decokingReport.duration}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Steam Consumption</TableCell>
                    <TableCell align="center">MT</TableCell>
                    <TableCell align="center">{decokingReport.steamConsumption}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fuel consumption</TableCell>
                    <TableCell align="center">NM3</TableCell>
                    <TableCell align="center">{decokingReport.fuelConsumption}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Amount of Coke Burnt</TableCell>
                    <TableCell align="center">kg</TableCell>
                    <TableCell align="center">{decokingReport.cokeBurnt}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </React.Fragment>
      </div>

      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView data={decokingReport} />
        </PDFViewer>
      </Grid> */}
    </PageContainer>
  );
};

export default DecokingReport;

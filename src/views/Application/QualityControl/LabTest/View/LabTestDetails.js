import { Grid, lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { CustomPreloder } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import { LAB_TEST } from 'constants/ApiEndPoints/v1';
import React, { Fragment, useEffect, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { sleep, stringifyConsole } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import PDFView from '../Report/PDFView';
import LrvUnitDetails from './LrvUnit';
import WaterUnitDetails from './WaterUnit';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 500
  },
  container: {
    padding: 15
  },
  buttonPrint: {
    textDecoration: 'none',
    margin: 5,
    height: 42,
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#FEA362',
    width: 100,
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

const LabTestDetails = props => {
  const { itemKey } = props;
  const classes = useStyles();
  const [details, setDetails] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (itemKey) {
      const fetchLabTest = async () => {
        await sleep(1000);
        try {
          const res = await http.get(`${LAB_TEST.get_single}/${itemKey}`);
          if (res.data.succeeded) {
            stringifyConsole(res.data.data);
            setDetails(res.data.data);

            setIsPageLoaded(true);
          }
        } catch (err) {
          toastAlerts('error', err.response.data.Message);
        }
      };
      fetchLabTest();
    }
  }, [itemKey]);

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer className={classes.root}>
            <Table className={classes.table} aria-label="custom pagination table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                    Date
                  </TableCell>
                  <TableCell align="left">{`: ${formattedDate(details.date)} ${details.time}`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                    Shift
                  </TableCell>
                  <TableCell align="left">{`: ${details.shiftName}`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                    Employee Code
                  </TableCell>
                  <TableCell align="left">{`: ${details.empCode}`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                    User Name
                  </TableCell>
                  <TableCell align="left">{`: ${details.userName}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                    Group
                  </TableCell>
                  <TableCell align="left">{`: ${details.operatorGroup ?? ''}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container item justifyContent="center" xs={12}>
          {details && <PrintButton fileName={'Lab_Test'} document={<PDFView data={details} />} />}
          {/* <PDFViewer width="100%" height="1000">
            <PDFView data={details} />
          </PDFViewer> */}
        </Grid>
      </Grid>
      <LrvUnitDetails data={details.labReportDetails.filter(unit => unit.labUnitName === 'lrv')} />
      <WaterUnitDetails data={details.labReportDetails.filter(unit => unit.labUnitName === 'water')} />
    </Fragment>
  );
};

export default LabTestDetails;

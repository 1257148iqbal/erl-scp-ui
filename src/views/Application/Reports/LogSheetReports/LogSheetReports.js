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
  TableRow,
  Typography
} from '@material-ui/core';
import { Assignment, ExitToApp } from '@material-ui/icons';
import axios from 'axios';
import { CustomAutoComplete, CustomDatePicker, CustomPreloder } from 'components/CustomControls';
import PrintButton from 'components/CustomControls/CustomButtons/PrintButton';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATION_GROUP, REPORTS } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';
import { serverDate } from 'utils/dateHelper';
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

const LogSheetReports = () => {
  const classes = useStyles();
  const history = useHistory();

  const [date, setDate] = useState(null);
  const [operationGroup, setOperationGroup] = useState(null);
  const [operationGroups, setOperationGroups] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [sections, setSections] = useState([]);

  const getLogSheetReports = async () => {
    try {
      const response = await http.get(REPORTS.log_sheet, {
        params: {
          date: serverDate(date),
          operationGroupId: operationGroup.value
        }
      });
      setSections(response.data.data);
    } catch (error) {
      toastAlerts('error', process.env.NODE_ENV === 'production' ? internalServerError : error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();
    const token = source.token;

    const getOperationGroups = async () => {
      try {
        const response = await await http.get(OPERATION_GROUP.get_active, {
          cancelToken: token
        });
        const operationGroups = response.data.data.map(item => ({
          ...item,
          label: item.groupName,
          value: item.id
        }));
        if (isMounted) {
          setOperationGroups(operationGroups);
          setIsPageLoaded(true);
        }
      } catch (error) {
        toastAlerts('error', process.env.NODE_ENV === 'production' ? internalServerError : error.message);
      }
    };
    getOperationGroups();

    return () => {
      isMounted = false;
      source.cancel();
    };
  }, []);

  const onOperationGroupChange = (e, newValue) => {
    if (newValue) {
      setOperationGroup(newValue);
    } else {
      setOperationGroup(null);
    }
  };

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  return (
    <PageContainer heading="Log Sheet Report">
      <CustomDatePicker label="Select Date" value={date} onChange={setDate} />
      <CustomAutoComplete
        data={operationGroups}
        label="Operation Group"
        value={operationGroup}
        onChange={onOperationGroupChange}
      />
      <Grid item container spacing={2} justifyContent="flex-start">
        <Grid item>
          <Button
            variant="contained"
            color="default"
            className={classes.btnGenerate}
            endIcon={<Assignment />}
            onClick={getLogSheetReports}
            disabled={!operationGroup || !date}>
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
            fileName={`LogSheetReport`}
            document={<PDFView data={sections} />}
            disabled={!operationGroup || !date}
          />
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView data={sections} />
        </PDFViewer>
      </Grid> */}

      <div>
        <React.Fragment>
          {sections.length > 0 &&
            sections.map((section, index) => (
              <React.Fragment key={index + 1}>
                <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333', margin: '10px auto' }}>
                  <span>Section Name: </span>
                  <span>{section.sectionName}</span>
                </div>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell>TIME</StyledTableHeadCell>
                        <StyledTableHeadCell>UNIT</StyledTableHeadCell>
                        {section.timeSlotName.map(ts => {
                          return <StyledTableHeadCell key={ts}>{ts}</StyledTableHeadCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.tags.map(tag => {
                        return (
                          <TableRow key={tag.id}>
                            <TableCell align="left" style={{ minWidth: 200 }}>
                              <Typography variant="h4">{tag.tagName}</Typography>
                              <Typography variant="caption">{tag.details}</Typography>
                            </TableCell>
                            <TableCell>{getSign(tag.unitName)}</TableCell>
                            {tag.timeSlotWiseReadings.map(reading => (
                              <TableCell style={{ textAlign: 'center' }} key={uuid()}>
                                {reading.reading}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {section.switches && (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeadCell style={{ textAlign: 'center' }}>SWITCH</StyledTableHeadCell>
                          <StyledTableHeadCell style={{ textAlign: 'center' }}>OPERATION</StyledTableHeadCell>
                          {section.shiftName.map(shift => {
                            return (
                              <StyledTableHeadCell style={{ textAlign: 'center' }} key={shift}>
                                {shift}
                              </StyledTableHeadCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.switches?.map(tag => (
                          <TableRow key={tag.id}>
                            <TableCell align="left">
                              <Typography variant="h4">{tag.switchName}</Typography>
                            </TableCell>
                            <TableCell>{tag.operation}</TableCell>
                            {tag.shiftWiseReadings.map(reading => (
                              <TableCell style={{ textAlign: 'center' }} key={uuid()}>
                                {reading.reading ? reading.reading : 'N/A'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </React.Fragment>
            ))}
        </React.Fragment>
      </div>
    </PageContainer>
  );
};

export default LogSheetReports;

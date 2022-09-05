import {
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
import { CustomPreloder } from 'components/CustomControls';
import { uniqueId } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate, getTime } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 250
  },
  container: {
    padding: 15
  }
}));

const DecokingLogSheetDetails = props => {
  const { details } = props;

  const classes = useStyles();
  const [decokingLogSheetDetails, setDecokingLogSheetDetails] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  useEffect(() => {
    if (details) {
      const parameters = details.decokingLogDetails.map(item => ({
        ...item,
        id: uniqueId()
      }));
      const uniqueGroupName = [...new Set(parameters.map(item => item.operationGroupName))];
      const parametersByGroupName = uniqueGroupName.reduce((accumulator, current) => {
        const filteredArray = parameters.filter(item => item.operationGroupName === current);
        const assignArray = { operationGroupName: current, parameters: filteredArray };
        accumulator.push(assignArray);
        return accumulator;
      }, []);
      setDecokingLogSheetDetails({ ...details, decokingLogDetails: parametersByGroupName });
      setIsPageLoaded(true);
    }
  }, [details]);
  //#region

  if (!isPageLoaded) {
    return <CustomPreloder />;
  }

  return (
    <Fragment>
      <TableContainer className={classes.root}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Date
              </TableCell>
              <TableCell align="left">{`: ${formattedDate(decokingLogSheetDetails?.date)}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Time
              </TableCell>
              <TableCell align="left">{`: ${getTime(decokingLogSheetDetails?.time, 'HH:mm')}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Decoking No
              </TableCell>
              <TableCell align="left">{`: ${decokingLogSheetDetails?.number}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {decokingLogSheetDetails.decokingLogDetails.map((item, idx) => (
        <Fragment key={idx + 1}>
          <Typography align="center">{item.operationGroupName}</Typography>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ minWidth: 160 }}>
                    Parameters
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 130 }}>
                    Unit
                  </TableCell>
                  <TableCell align="left" style={{ minWidth: 130 }}>
                    Reading
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item.parameters.map((item, index) => (
                  <TableRow hover tabIndex={-1} key={index + 1}>
                    <TableCell align="left" style={{ minWidth: 160 }}>
                      {item.parameterName}
                    </TableCell>
                    <TableCell>{getSign(item.unitName)}</TableCell>
                    <TableCell>{item.reading ? item.reading : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default DecokingLogSheetDetails;

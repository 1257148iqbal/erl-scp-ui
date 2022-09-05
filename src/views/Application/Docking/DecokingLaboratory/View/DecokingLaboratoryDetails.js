import { lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import React, { Fragment } from 'react';
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

const DecokingLaboratoryDetails = props => {
  const classes = useStyles();

  const { details } = props;

  //#region

  return (
    <Fragment>
      <TableContainer className={classes.root}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableBody>
            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Date
              </TableCell>
              <TableCell align="left">{`: ${formattedDate(details?.date)}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Time
              </TableCell>
              <TableCell align="left">{`: ${getTime(details?.time, 'HH:mm')}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Time Diiference
              </TableCell>
              <TableCell align="left">{`: ${details?.timeDifference} (h)`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                {'CO\u2082'}
              </TableCell>
              <TableCell align="left">{`: ${details?.cO2}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                CO(%)
              </TableCell>
              <TableCell align="left">{`: ${details?.co}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                {'O\u2082'}(%)
              </TableCell>
              <TableCell align="left">{`: ${details?.o2}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Air Reading
              </TableCell>
              <TableCell align="left">{`: ${details?.airReading}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Coke Flow
              </TableCell>
              <TableCell align="left">{`: ${details?.cokeFlow}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 160 }}>
                Comment
              </TableCell>
              <TableCell align="left">{`: ${details?.comment}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default DecokingLaboratoryDetails;

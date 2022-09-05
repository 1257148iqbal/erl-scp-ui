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
import React, { Fragment } from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';

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
  link: {
    color: '#fff',
    textDecoration: 'none',
    width: 200,
    backgroundColor: 'black',
    padding: '20px 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const LogSheetDetails = props => {
  const { details } = props;

  const classes = useStyles();

  //#region

  return (
    <Fragment>
      <TableContainer className={classes.root}>
        <Table className={classes.table} aria-label="custom pagination table" size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Date
              </TableCell>
              <TableCell align="left">{`: ${formattedDate(details?.date)}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Operation Group
              </TableCell>
              <TableCell align="left">{`: ${details?.operationGroupName}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Shift
              </TableCell>
              <TableCell align="left">{`: ${details?.shiftName}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Section
              </TableCell>
              <TableCell align="left">{`: ${details?.sectionName}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Remarks
              </TableCell>
              <TableCell align="left">{`: ${details?.remark ? details?.remark : 'None'}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                Employee Code
              </TableCell>
              <TableCell align="left">{`: ${details?.empCode}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" align="left" style={{ maxWidth: 80 }}>
                User Name
              </TableCell>
              <TableCell align="left">{`: ${details?.userName}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: 160 }}>
                Log Info
              </TableCell>
              <TableCell align="center" style={{ minWidth: 130 }}>
                Last Reading
              </TableCell>
              <TableCell align="center" style={{ minWidth: 130 }}>
                Reading
              </TableCell>
              <TableCell align="left" style={{ minWidth: 130 }}>
                Unit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details?.logSheetDetails.map(item => (
              <TableRow hover tabIndex={-1} key={item.id}>
                <TableCell>
                  <Typography variant="h4">{item.tagName}</Typography>
                  <Typography variant="caption">{item.details}</Typography>
                </TableCell>

                <TableCell align="center">{item.lastReading ?? '-'}</TableCell>
                <TableCell align="center">{item.reading ? item.reading : '-'}</TableCell>
                <TableCell>{getSign(item.unitName)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default LogSheetDetails;

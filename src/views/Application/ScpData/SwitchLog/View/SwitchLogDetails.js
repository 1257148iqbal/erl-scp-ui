import { lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { Fragment } from 'react';
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
  }
}));

const DetailsView = props => {
  const { details } = props;

  const classes = useStyles();

  //#region

  return (
    <Fragment>
      <TableContainer className={classes.root}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Date
              </TableCell>
              <TableCell align="left">{`: ${formattedDate(details.date)}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                Shift
              </TableCell>
              <TableCell align="left">{`: ${details.shiftName}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                Employee Code
              </TableCell>
              <TableCell align="left">{`: ${details.empCode}`}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                User Name
              </TableCell>
              <TableCell align="left">{`: ${details.userName}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Switch Name</TableCell>
              <TableCell align="center">Operation</TableCell>
              <TableCell align="center">Condition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.switchLogDetails.map(item => (
              <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                <TableCell>{item.switchName}</TableCell>
                <TableCell>{item.operation}</TableCell>
                <TableCell>{item.condition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default DetailsView;

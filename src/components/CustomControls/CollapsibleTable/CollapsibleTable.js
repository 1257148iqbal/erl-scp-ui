import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { data } from './data';
import Row from './Row';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 800
  },
  tableCell: {
    backgroundColor: '#37474F',
    color: '#FFFFFF'
  }
}));

const CollapsibleTable = props => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table stickyHeader className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell} />
            <TableCell className={classes.tableCell}>Operation Group</TableCell>
            <TableCell className={classes.tableCell}>Section</TableCell>
            <TableCell className={classes.tableCell}>Serial</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CollapsibleTable;

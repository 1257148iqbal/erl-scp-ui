import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import React from 'react';

const StyledTableHeadCell = withStyles(theme => ({
  head: {
    backgroundColor: '#045170',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF'
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

const useStyles = makeStyles(theme => ({
  container: {
    padding: 15
  }
}));

const WaterUnitDetails = ({ data }) => {
  const classes = useStyles();
  return (
    <TableContainer className={classes.container}>
      <Table aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell align="center">Unit</StyledTableHeadCell>
            <StyledTableHeadCell align="center">Sample</StyledTableHeadCell>
            <StyledTableHeadCell align="center">pH</StyledTableHeadCell>
            <StyledTableHeadCell align="center">COND µS</StyledTableHeadCell>
            <StyledTableHeadCell align="center">TDS ppm</StyledTableHeadCell>
            <StyledTableHeadCell align="center">TA ppm</StyledTableHeadCell>
            <StyledTableHeadCell align="center">TAC ppm</StyledTableHeadCell>
            <StyledTableHeadCell align="center">NaCl ppm</StyledTableHeadCell>
            <StyledTableHeadCell align="center">H2S ppm</StyledTableHeadCell>
            <StyledTableHeadCell align="center">NH3 ppm</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((w, index) => (
            <TableRow hover tabIndex={-1} key={index + 1}>
              <TableCell align="center">{w.labUnitName}</TableCell>
              <TableCell align="left">{w.testSampleName}</TableCell>
              <TableCell align="center">{w.ph ? w.ph : '-'}</TableCell>
              <TableCell align="center">{w.cond ? w.cond : '-'}</TableCell>
              <TableCell align="center">{w.tds ? w.tds : '-'}</TableCell>
              <TableCell align="center">{w.ta ? w.ta : '-'}</TableCell>
              <TableCell align="center">{w.tac ? w.tac : '-'}</TableCell>
              <TableCell align="center">{w.naCI ? w.naCI : '-'}</TableCell>
              <TableCell align="center">{w.h2S ? w.h2S : '-'}</TableCell>
              <TableCell align="center">{w.nH3 ? w.nH3 : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WaterUnitDetails;

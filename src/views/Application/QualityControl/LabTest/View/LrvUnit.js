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

const LrvUnitDetails = ({ data }) => {
  const classes = useStyles();
  return (
    <TableContainer className={classes.container}>
      <Table aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableHeadCell rowSpan="3" align="center">
              Unit
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              Sample
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              Density
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              RVP psi
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              Color ASTM
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              FP
            </StyledTableHeadCell>
            <StyledTableHeadCell colSpan="2" rowSpan="2" align="center">
              Viscosity
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              {'pp \u00b0C'}
            </StyledTableHeadCell>
            <StyledTableHeadCell colSpan="7" rowSpan="2" align="center">
              ASTM Distillation
            </StyledTableHeadCell>
            <StyledTableHeadCell colSpan="3" align="center">
              Stability (UOP)
            </StyledTableHeadCell>
            <StyledTableHeadCell rowSpan="3" align="center">
              FR-5 %xylene
            </StyledTableHeadCell>
          </TableRow>

          <TableRow>
            <StyledTableHeadCell colSpan="3" align="center">
              BSW
            </StyledTableHeadCell>
          </TableRow>

          <TableRow>
            <StyledTableHeadCell align="center">{'50 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'100 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">IBP</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'5 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'10 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'50 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'90 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">{'95 \u00b0C'}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">FBP</StyledTableHeadCell>
            <StyledTableHeadCell align="center">Before Oxid.</StyledTableHeadCell>
            <StyledTableHeadCell align="center">After Oxid.</StyledTableHeadCell>
            <StyledTableHeadCell align="center">Report</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((lr, index) => (
            <TableRow hover tabIndex={-1} key={index + 1}>
              <TableCell align="center">{lr.labUnitName}</TableCell>
              <TableCell align="left">{lr.testSampleName}</TableCell>
              <TableCell align="center">{lr.density ? lr.density : '-'}</TableCell>
              <TableCell align="center">{lr.rvP_psi ? lr.rvP_psi : '-'}</TableCell>
              <TableCell align="center">{lr.colour_ASTM ? lr.colour_ASTM : '-'}</TableCell>
              <TableCell align="center">{lr.fp ? lr.fp : '-'}</TableCell>
              <TableCell align="center">{lr.viscosity50 ? lr.viscosity50 : '-'}</TableCell>
              <TableCell align="center">{lr.viscosity100 ? lr.viscosity100 : '-'}</TableCell>
              <TableCell align="center">{lr.ppInC ? lr.ppInC : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_IBP ? lr.astM_Distillation_IBP : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_5 ? lr.astM_Distillation_5 : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_10 ? lr.astM_Distillation_10 : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_50 ? lr.astM_Distillation_50 : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_90 ? lr.astM_Distillation_90 : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_95 ? lr.astM_Distillation_95 : '-'}</TableCell>
              <TableCell align="center">{lr.astM_Distillation_FBP ? lr.astM_Distillation_FBP : '-'}</TableCell>
              <TableCell align="center">{lr.uoP_BSW_FBP_Before ? lr.uoP_BSW_FBP_Before : '-'}</TableCell>
              <TableCell align="center">{lr.uoP_BSW_FBP_After ? lr.uoP_BSW_FBP_After : '-'}</TableCell>
              <TableCell align="center">{lr.uoP_BSW_FBP_Report ? lr.uoP_BSW_FBP_Report : '-'}</TableCell>
              <TableCell align="center">{lr.fR_5 ? lr.fR_5 : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LrvUnitDetails;

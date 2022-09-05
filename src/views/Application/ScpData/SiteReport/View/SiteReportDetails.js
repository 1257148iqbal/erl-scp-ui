import {
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
import { withStyles } from '@material-ui/styles';
import { Checkbox } from 'components/CustomControls';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 250
  },

  container: {
    padding: 15,
    marginBottom: 5,
    '& .MuiTableCell-root': {
      border: '1px solid black'
    }
  },
  checkedIcon: {
    width: 16,
    height: 16
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

const StyledTableHeadCell = withStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
    boxSizing: 'small',
    width: 100
  },
  head: {
    backgroundColor: '#d0d5db',
    color: '#000',
    border: '1px solid #000',
    width: 100
  },
  body: {
    fontSize: 12,
    width: 100
  }
}))(TableCell);

const SiteReportDetails = props => {
  const classes = useStyles();
  const { boxes, masterInfo } = props;

  //#region
  return (
    <Grid container>
      {/* Master Info */}
      <Grid item container xs={12} justifyContent="space-between" alignItems="center" style={{ padding: '0 15px' }}>
        <Grid item>{`Date : ${formattedDate(masterInfo.date)}`}</Grid>
        <Grid item>{`Time : ${masterInfo.time}`}</Grid>
        <Grid item>{`Group : ${masterInfo.operatorGroup ?? ''}`}</Grid>
      </Grid>
      {/* Master Info */}

      {/* Box 1 */}
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Equip. No.
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Disch. Press Bar
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Amp / %Stroke
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Stand By
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box1.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell width="30%">{item.equipTagDisplayName}</TableCell>
                    <TableCell width="20%" align="center">
                      {item.discH_PRESS ? item.discH_PRESS : '-'}
                    </TableCell>
                    <TableCell align="center">{item.amP_STROKE ? item.amP_STROKE : '-'}</TableCell>
                    <TableCell align="center">{item.standByTagDisplayName ? item.standByTagDisplayName : '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 1 */}

      {/* Box 2,3,4 */}
      <Grid item container xs={12} sm={12} md={12} lg={6}>
        <Grid item xs={12}>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    Equip. No.
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    AMP
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    LOUV. %
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    Stand By
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boxes.box2.map((item, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell style={{ width: '20%' }}>{item.equipTagDisplayName}</TableCell>
                      <TableCell style={{ width: '20%' }} align="center">
                        {item.amp ? item.amp : '-'}
                      </TableCell>
                      <TableCell style={{ width: '20%' }} align="center">
                        {item.louv ? item.louv : '-'}
                      </TableCell>
                      <TableCell style={{ width: '20%' }} align="center">
                        <Checkbox className={classes.checkedIcon} name="isStandBy" checked={item.isStandBy} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    Equip. No.
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    AMP
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    LOAD. %
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    N2 SEAL
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boxes.box3.map((item, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell>{item.equipTagDisplayName}</TableCell>
                      <TableCell align="center">{item.amp ? item.amp : '-'}</TableCell>
                      <TableCell align="center">{item.load ? item.load : '-'}</TableCell>
                      <TableCell align="center">{item.n2_SEAL ? item.n2_SEAL : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    VESSEL
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    TIME
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    Level cm%
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                    % Soln
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boxes.box4.map((item, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell>{item.equipTagDisplayName}</TableCell>
                      <TableCell align="center">{item.time ? item.time : '-'}</TableCell>
                      <TableCell align="center">{item.leveL_CM ? item.leveL_CM : '-'}</TableCell>
                      <TableCell align="center">{item.soln ? item.soln : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* Box 2,3,4 */}

      {/* Box 5 */}
      <Grid item xs={12}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  HIC-3003 % Read
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  HIC-3023 %Read
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Draft mm w.c
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  No. Of Burner
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  No. Of Pilot
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Flame Color
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  IMPINGEMENT
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box5.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell align="center">{item.hiC_3003 ? item.hiC_3003 : '-'}</TableCell>
                    <TableCell align="center">{item.hiC_3023 ? item.hiC_3023 : '-'}</TableCell>
                    <TableCell align="center">{item.drafT_MM_WC ? item.drafT_MM_WC : '-'}</TableCell>
                    <TableCell align="center">{item.noOfBurner ? item.noOfBurner : '-'}</TableCell>
                    <TableCell align="center">{item.noOfPilot ? item.noOfPilot : '-'}</TableCell>
                    <TableCell align="center">{item.flameColor ? item.flameColor : '-'}</TableCell>
                    <TableCell align="center">{item.impingement}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 5 */}

      {/* Box 6 */}
      <Grid item xs={12}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  Burner
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  01
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  02
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  03
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  04
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  05
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  06
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  07
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  08
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  09
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 90 }}>
                  10
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box6.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell align="center">{item.equipTagDisplayName}</TableCell>
                    <TableCell align="center">{item.burner_1 ? item.burner_1 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_2 ? item.burner_2 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_3 ? item.burner_3 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_4 ? item.burner_4 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_5 ? item.burner_5 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_6 ? item.burner_6 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_7 ? item.burner_7 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_8 ? item.burner_8 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_9 ? item.burner_9 : '-'}</TableCell>
                    <TableCell align="center">{item.burner_10 ? item.burner_10 : '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 6 */}

      {/* Box 7,8 */}
      <Grid item container xs={12}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Equip.
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Suc. Bar
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Disc. Bar
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Stand By
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boxes.box7.map((item, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell align="center">{item.equipTagDisplayName}</TableCell>
                      <TableCell align="center">{item.suC_BAR ? item.suC_BAR : '-'}</TableCell>
                      <TableCell align="center">{item.disC_BAR ? item.disC_BAR : '-'}</TableCell>
                      <TableCell align="center">{item.standByTagDisplayName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <TableContainer className={classes.container}>
            <Table aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Equip.
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    Oil Level
                  </StyledTableHeadCell>
                  <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                    CW Flow
                  </StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boxes.box8.map((item, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell align="center">{item.equipTagDisplayName}</TableCell>
                      <TableCell align="center">{item.oiL_LEVEL ? item.oiL_LEVEL : '-'}</TableCell>
                      <TableCell align="center">{item.cW_FLOW ? item.cW_FLOW : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* Box 7,8 */}

      {/* Box 9 */}
      <Grid item xs={12}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Equip.
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  1St D. Temp
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  1St D. Temp
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Oil Pres.
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Oil Level
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  CW Flow
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Stand By
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Auto
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box9.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{`${item.equipTagDisplayName}${item.equipCondition}`}</TableCell>
                    <TableCell>{item.temP_1ST_D}</TableCell>
                    <TableCell align="center">{item.temP_2ND_D ? item.temP_2ND_D : '-'}</TableCell>
                    <TableCell align="center">{item.oiL_PRES ? item.oiL_PRES : '-'}</TableCell>
                    <TableCell align="center">{item.oiL_LEVEL ? 'OK' : ''}</TableCell>
                    <TableCell align="center">{item.cW_FLOW ? 'OK' : ''}</TableCell>
                    <TableCell align="center">{`${item.standByTagDisplayName}${item.standByCondition}`}</TableCell>
                    <TableCell align="center">{item.auto ? item.auto : '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 9 */}

      {/* Box 10 */}
      <Grid item xs={12}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  PIT LEVEL %
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  PUMP IN AUTO
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  STAND-BY
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  OIL CHAM. LEVEL %
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  GA-6062 POSITION
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box10.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{item.piT_LEVEL ? item.piT_LEVEL : '-'}</TableCell>
                    <TableCell align="center">{`${item.equipTagDisplayName}${item.equipCondition}`}</TableCell>
                    <TableCell align="center">{`${item.standByTagDisplayName}${item.standByCondition}`}</TableCell>
                    <TableCell align="center">{item.oiL_CHAM_LEVEL ? item.oiL_CHAM_LEVEL : '-'}</TableCell>
                    <TableCell align="center">{item.gA_6062_POSITION}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 10 */}

      {/* Box 11 */}
      <Grid item xs={12}>
        <TableContainer className={classes.container}>
          <Table aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  B-6071 Level
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Pump In Auto
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Stand By
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Seal Water
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Steam
                </StyledTableHeadCell>
                <StyledTableHeadCell align="center" style={{ minWidth: 160 }}>
                  Pilot Gas Bar.
                </StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boxes.box11.map((item, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{item.b_6071_LEVEL ? item.b_6071_LEVEL : '-'}</TableCell>
                    <TableCell align="center">{`${item.equipTagDisplayName}${item.equipCondition}`}</TableCell>
                    <TableCell align="center">{`${item.standByTagDisplayName}${item.standByCondition}`}</TableCell>
                    <TableCell align="center">{item.seaL_WATER}</TableCell>
                    <TableCell align="center">{item.steam}</TableCell>
                    <TableCell align="center">{item.piloT_GAS_BAR ? item.piloT_GAS_BAR : '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Box 11 */}
    </Grid>
  );
};

export default SiteReportDetails;

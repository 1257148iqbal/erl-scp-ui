import {
  Divider,
  Grid,
  lighten,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ArrowDownward, ArrowUpward, ImportExport } from '@mui/icons-material';
import clsx from 'clsx';
import {
  Box_1,
  Box_10,
  Box_11,
  Box_2,
  Box_3,
  Box_4,
  Box_5,
  Box_6,
  Box_7,
  Box_8,
  Box_9,
  FEED,
  File_1,
  GAS_OIL,
  NAPHTHA,
  RESIDUE
} from 'constants/ShiftReportSectionName';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import { useStyles } from '../Styles';
import '../Styles/icon.css';

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

const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const ShiftReportDetails = props => {
  const { state } = props;
  const classes = useStyles();

  const file1 = state?.shiftReportDetails.filter(item => item.shiftSection === File_1);

  //Function for Max Vlaue
  const getMaxTag = data => {
    const filteredTag = data.filter(
      item => item.name === 'T-10' || item.name === 'T-11' || item.name === 'T-12' || item.name === 'T-13'
    );
    const readings = filteredTag.map(item => item.reading);
    const maxReading = Math.max(...readings);
    const maxReadingObj = filteredTag.find(item => item.reading === maxReading?.toString());
    return maxReadingObj ? maxReadingObj : { name: 'no-matched-tag' };
  };

  return (
    <Grid container spacing={3}>
      {/* <PDFViewer width="100%" height="1000">
        <PDFView data={state} />
      </PDFViewer> */}
      {/* master info */}
      <Grid item container style={{ padding: '0px 0px 0px 40px' }}>
        <Grid item xs={3} style={{ marginBottom: 10, padding: 10 }}>
          <span>
            <strong>Date: </strong> {formattedDate(state.date)}
          </span>
        </Grid>
        <Grid item xs={2} style={{ marginBottom: 10, padding: 10 }}>
          <span>
            <strong>Group: </strong> {state.operatorGroup ?? ''}
          </span>
        </Grid>
        <Grid item xs={3} style={{ marginBottom: 10, padding: 10 }}>
          <span>
            <strong>Time: </strong> {state.time}
          </span>
        </Grid>
        <Grid item xs={2} style={{ marginBottom: 10, padding: 10 }}>
          <span>
            <strong>Shift: </strong> {state.shiftName}
          </span>
        </Grid>
        <Grid item xs={2} style={{ marginBottom: 10, padding: 10 }}>
          <span>
            <strong>Status: </strong> {state.status}
          </span>
        </Grid>
      </Grid>

      {/* Feed, Naptha, Resid, Gas_Oil part */}
      <Grid item container spacing={2}>
        {/* Feed */}
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.gridItem}>
            <h3 className={classes.sectionHead}>FEED</h3>
            <Table size="small">
              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === FEED),
                  ['sortOrder']
                ).map(feed => {
                  const _item = feed;
                  let tablecell;

                  if (_item.getAutoReading) {
                    tablecell = (
                      <TableCell>
                        {feed.reading === '0' || feed.reading === 0 || feed.reading === ''
                          ? '-'
                          : ` :  ${feed.reading} ${feed.unitName ? getSign(feed.unitName) : ''}`}
                      </TableCell>
                    );
                  } else if (feed.name === 'TYPE') {
                    tablecell = <TableCell>{feed.reading ? feed.reading : '-'}</TableCell>;
                  } else if (feed.name === 'TANK') {
                    const reading = JSON.parse(feed.reading);
                    tablecell = (
                      <TableCell
                        id="tank"
                        style={{
                          display: 'flex',
                          gap: 5,
                          alignItems: 'center'
                        }}>
                        {reading.map((item, idx) => (
                          <div key={idx + 1}>
                            <span>{item.tank}</span>
                            <span>{icons[item.symbol]}</span>
                          </div>
                        ))}
                      </TableCell>
                    );
                  }

                  return (
                    <TableRow key={feed.id}>
                      <TableCell>{feed.name}</TableCell>
                      {tablecell}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Naptha */}
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.gridItem}>
            <h3 className={classes.sectionHead}>NAPHTHA</h3>
            <Table size="small">
              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === NAPHTHA),
                  ['sortOrder']
                ).map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{`${item.name}`}</TableCell>
                    <TableCell>
                      {item.reading === '0' || item.reading === 0 || item.reading === ''
                        ? '-'
                        : ` :  ${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Gas oil */}
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.gridItem}>
            <h3 className={classes.sectionHead}>Gas Oil</h3>
            <Table size="small">
              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === GAS_OIL),
                  ['sortOrder']
                ).map(item => {
                  let reading;
                  switch (item.name) {
                    case '90%':
                    case 'EP':
                      if (item.reading > 0) {
                        reading = ` > ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`;
                      } else {
                        reading = ` ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`;
                      }
                      break;
                    default:
                      reading = ` ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`;
                      break;
                  }
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{`${item.name}`}</TableCell>
                      <TableCell>{` : ${reading}`}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Residue */}
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.gridItem}>
            <h3 className={classes.sectionHead}>Residue</h3>
            <Table size="small">
              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === RESIDUE),
                  ['sortOrder']
                ).map(item => {
                  const _item = item;
                  let tablecell;

                  if (_item.getAutoReading) {
                    tablecell = (
                      <TableCell>
                        {item.reading === '0' || item.reading === 0 || item.reading === ''
                          ? '-'
                          : ` :  ${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  } else {
                    tablecell = (
                      <TableCell>
                        {item.reading === '0' || item.reading === 0 || item.reading === ''
                          ? '-'
                          : ` :  ${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  }

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      {tablecell}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* images */}
      <Grid item container className={classes.imageContainer}>
        <Grid item xs={12} className={clsx(classes.imagesReading)}>
          <div className={classes.images}>
            <img className={classes.image01} src="/images/ShiftImage01.jpg" alt="Shift-report File-01" />
            {file1.map((item, index, sourceFile1) => {
              return (
                <Fragment key={item.id}>
                  <span className={clsx(classes.fileOneti04Left)}>{item.name === 'TI-04' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOneti04Right)}>{item.name === 'TI-04' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnefic01)}>{item.name === 'FIC-01' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnefic02)}> {item.name === 'FIC-02' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnepi02)}>{item.name === 'PI-02' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnepi03)}>{item.name === 'PI-03' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnet05)}> {item.name === 'T-05' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnet06)}>{item.name === 'T-06' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnepi06)}>{item.name === 'PI-06' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnepi07)}> {item.name === 'PI-07' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnet07)}>{item.name === 'T-07' ? item.reading ?? '-' : ''}</span>
                  <span className={clsx(classes.fileOnet08)}>{item.name === 'T-08' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnet09)}> {item.name === 'T-09' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnepic19)}>{item.name === 'PIC-19' ? item.reading ?? 0 : ''}</span>
                  {/* <span className={clsx(classes.fileOneo2)}>{item.name === '%O2' ? item.reading ?? 0 : ''}</span> */}
                  {item.name === '%O2' && !(item.reading === 0 || item.reading === '0' || item.reading === '') && (
                    <span className={clsx(classes.fileOneo2)}>{item.reading}</span>
                  )}
                  <span
                    className={clsx(classes.fileOnet10, item.name === getMaxTag(sourceFile1).name && classes.textRedColor)}>
                    {item.name === 'T-10' ? item.reading ?? 0 : ''}
                  </span>
                  <span
                    className={clsx(classes.fileOnet11, item.name === getMaxTag(sourceFile1).name && classes.textRedColor)}>
                    {item.name === 'T-11' ? item.reading ?? 0 : ''}
                  </span>
                  <span
                    className={clsx(classes.fileOnet12, item.name === getMaxTag(sourceFile1).name && classes.textRedColor)}>
                    {item.name === 'T-12' ? item.reading ?? 0 : ''}
                  </span>
                  <span
                    className={clsx(classes.fileOnet13, item.name === getMaxTag(sourceFile1).name && classes.textRedColor)}>
                    {item.name === 'T-13' ? item.reading ?? 0 : ''}
                  </span>

                  <span className={clsx(classes.fileOnet14)}>{item.name === 'T-14' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnet15)}> {item.name === 'T-15' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnet64)}> {item.name === 'T-64' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnet65)}> {item.name === 'T-65' ? item.reading ?? 0 : ''}</span>

                  <span className={clsx(classes.fileOneft37)}> {item.name === 'FT-37' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnestrokePass1)}>
                    {item.name === '%STROKE_PASS-1' ? `${item.reading} x ${item.reading}` ?? 0 : ''}
                  </span>
                  <span className={clsx(classes.fileOnestrokePass2)}>
                    {item.name === '%STROKE_PASS-2' ? `${item.reading} x ${item.reading}` ?? 0 : ''}
                  </span>
                  <span className={clsx(classes.fileOnehic03)}> {item.name === 'HIC-03' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnehic23)}> {item.name === 'HIC-23' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnepi52)}>{item.name === 'PI-52' ? item.reading ?? 0 : ''}</span>
                  <span className={clsx(classes.fileOnefuelType)}>{item.name === 'FUEL TYPE' ? item.reading ?? 0 : ''}</span>
                </Fragment>
              );
            })}
          </div>
        </Grid>
      </Grid>
      {/* box 1,2,3,4,5,6 */}
      <Grid item container spacing={2} className={classes.boxWrapper}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.boxTitle}>
            COLUMN DA-3001/DA-3002/DA-3004
          </Typography>
          <Divider />
        </Grid>
        {/* box 1 */}
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_1),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                        {item.name}
                      </StyledTableHeadCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_1),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </StyledTableHeadCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 2 */}
        <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_2),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center">
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_2),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center">
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 3 */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_3),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center">
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_3),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center">
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 4 */}
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_4),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_4),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 5 */}
        <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_5),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center">
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_5),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center">
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 6 */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_6),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center">
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_6),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center">
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* box 7,8,9 */}
      <Grid item container spacing={2} className={classes.boxWrapper} style={{ marginTop: 25 }}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.boxTitle}>
            COLUMN DA-3003
          </Typography>
          <Divider />
        </Grid>
        {/* box 7 */}
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_7),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_7),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 8 */}
        <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_8),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center">
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_8),
                    ['sortOrder']
                  ).map(item => {
                    return (
                      <TableCell key={item.id} align="center">
                        {item.getAutoReading
                          ? `${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`
                          : `${item.unitName ? getSign(item.unitName) : ''}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 9 */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_9),
                    ['sortOrder']
                  ).map(item => (
                    <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 105 }}>
                      {item.name}
                    </StyledTableHeadCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {_.sortBy(
                    state.shiftReportDetails.filter(item => item.shiftSection === Box_9),
                    ['sortOrder']
                  ).map(item => {
                    let tableCell;
                    if (item.getAutoReading) {
                      tableCell = (
                        <TableCell key={item.id} align="center">
                          {`${item.reading ? item.reading : '-'} ${item.unitName ? getSign(item.unitName) : ''}`}
                        </TableCell>
                      );
                    } else if (item.name === 'K-6051 A') {
                      tableCell = (
                        <TableCell key={item.id} align="center">
                          {item.reading ? item.reading : '-'}
                        </TableCell>
                      );
                    } else {
                      tableCell = (
                        <TableCell key={item.id} align="center">
                          {item.reading ? item.reading : '-'}
                        </TableCell>
                      );
                    }
                    return tableCell;
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* box 10,11 */}
      <Grid item container spacing={2} className={classes.boxWrapper} style={{ marginTop: 25 }}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.boxTitle}>
            MATERIAL BALANCE (ONE HR. BASIS)
          </Typography>
          <Divider />
        </Grid>
        {/* box 10 */}
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center"></StyledTableHeadCell>
                  <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">%</StyledTableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === Box_10),
                  ['sortOrder']
                ).map(item => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.reading ? item.reading : '-'}</TableCell>
                      <TableCell align="center">{item.production ? item.production : '-'}</TableCell>
                      <TableCell align="center">{item.percent ? item.percent : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* box 11 */}
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">PRODUCTION</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">% YIELD</StyledTableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {_.sortBy(
                  state.shiftReportDetails.filter(item => item.shiftSection === Box_11),
                  ['sortOrder']
                ).map(item => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.reading ? item.reading : '-'}</TableCell>
                      <TableCell align="center">{item.production ? item.production : '-'}</TableCell>
                      <TableCell align="center">{item.percent ? item.percent : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* box 10,11 */}
      <Grid item container spacing={2} className={classes.boxWrapper} style={{ marginTop: 25 }}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.boxTitle}>
            HYDROGEN PLANT : Shut CAPACITY :
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">Reformer</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">IN. TR-12</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">OUT TR-16</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'C'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">PRESSURE</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-02</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-03</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-26</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-92</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-91</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'Bar.g'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">STEAM</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FIC-16</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FI-15</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'KG/H'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">FEED</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FIC-07</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FIC-05</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FFI-04</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'KG/H'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">FUEL</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">NG FI-29</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PG FI-30</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">FUEL</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-1859</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-1860</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'KG/H'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'Bar.g'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">DRAFT</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PIC-1814</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">VALVE OPEN</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>mmWC</TableCell>
                  <TableCell>%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">V-1 LEV %</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">V-2 LEV %</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">CW M3/H</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">TEMP.</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">R-1 IN</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">R-2 OUT</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">R-3 IN</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">R-3 OUT</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">PSA IN</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>{'C'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} className={classes.gridItemWrapper}>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">PSA</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">KF</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">KW</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Cap.Time</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>VALUE</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{'-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: '6px 10px' }}>
            <span>
              <strong>Remarks: </strong> {state.remark}
            </span>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShiftReportDetails;

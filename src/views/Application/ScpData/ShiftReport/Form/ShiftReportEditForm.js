import {
  Divider,
  Fab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ArrowDownward, ArrowUpward, ImportExport } from '@mui/icons-material';
import Axios from 'axios';
import clsx from 'clsx';
import {
  CancelButton,
  CustomAutoComplete,
  CustomPreloder,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SHIFT_REPORT, SHIFT_REPORT_SETTINGS, TANK } from 'constants/ApiEndPoints/v1';
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
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Select from 'react-select';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import {
  ADD_TANK_SYMBOL,
  CHANGE_FEED_TYPE,
  CHANGE_FUEL_TYPE,
  CHANGE_K6051A,
  CHANGE_K6051B,
  CHANGE_STABILITY,
  CHANGE_STATUS,
  CHANGE_SYMBOL,
  CHANGE_TANK,
  FETCH_SHIFT_REPORT_SUCCESS,
  REMOVE_TANK_SYMBOL
} from '../store/actionTypes';
import { initialState, shiftReportEditReducer } from '../store/reducers';
import { useStyles } from '../Styles';

const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const ShiftReportEditForm = props => {
  //#region Hooks
  const classes = useStyles();
  const history = useHistory();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const [state, dispatch] = useReducer(shiftReportEditReducer, initialState);
  //#region

  //#region States
  //@TODO: add remarks
  // eslint-disable-next-line no-unused-vars
  const [remarks, setRemarks] = useState('');

  //#endregion

  const {
    state: { key }
  } = useLocation();

  //#region Effects
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const res = await Axios.all([
          http.get(SHIFT_REPORT_SETTINGS.get_all_feed_type),
          http.get(TANK.get_active),
          http.get(SHIFT_REPORT_SETTINGS.get_all_stability),
          http.get(SHIFT_REPORT_SETTINGS.get_all_load),
          http.get(SHIFT_REPORT_SETTINGS.get_all_fuel_type),
          http.get(`${SHIFT_REPORT.get_single}/${key}`)
        ]);

        const feedTypes = res[0].data.data;
        const tanks = res[1].data.data;
        const stabilities = res[2].data.data;
        const loads = res[3].data.data;
        const fuelTypes = res[4].data.data;
        const shiftReportDetails = res[5].data.data;

        dispatch({
          type: FETCH_SHIFT_REPORT_SUCCESS,
          payload: {
            feedTypes,
            tanks,
            stabilities,
            loads,
            fuelTypes,
            shiftReportDetails
          }
        });
      } catch (err) {
        toastAlerts('error', err.message);
      }
    };
    fetchDependencies();
  }, [key]);
  //#endregion

  const onAddTankWithSymble = () => {
    const data = {
      tank: state.selectedTank.label,
      symbol: state.selectedSymbol.value,
      bgColor: state.selectedSymbol.bgColor
    };
    dispatch({ type: ADD_TANK_SYMBOL, payload: data });
  };

  const onRemovedTankSymbol = (idx, item) => {
    const updatedTanks = [...state.selectedTankSymbol];
    updatedTanks.splice(idx, 1);
    dispatch({ type: REMOVE_TANK_SYMBOL, payload: { updatedTanks, removedTank: { label: item.tank, value: item.tank } } });
  };

  //#region Pre Loader
  if (!state.isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  const file1 = state?.data.shiftReportDetails.filter(item => item.shiftSection === File_1);
  //Function for Max Vlaue
  const getMaxTag = data => {
    const filteredTag = data.filter(
      item => item.name === 'T-10' || item.name === 'T-11' || item.name === 'T-12' || item.name === 'T-13'
    );
    const readings = filteredTag.map(item => item.reading);
    const maxReading = Math.max(...readings);
    const maxReadingObj = filteredTag.find(item => item.reading === maxReading.toString());
    return maxReadingObj ? maxReadingObj : { name: 'no-matched-tag' };
  };
  //#region Events

  const onSubmit = async e => {
    e.preventDefault();
    // setLoading(true);
    // setOpenBackdrop(true);
    //return;
    try {
      const res = await http.put(`${SHIFT_REPORT.update}/${state.data.key}`, state.data);
      toastAlerts('success', res.data.message);
    } catch (err) {
      toastAlerts('error', err.message);
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
      history.goBack();
    }
  };
  //#region

  return (
    <PageContainer heading="Shift Report (Update)">
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            {/* master info */}
            <Grid item container>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Paper>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.masterInfoBoxTableCell}>Date</TableCell>
                        <TableCell>{formattedDate(state.data.date)} </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.masterInfoBoxTableCell}>Time</TableCell>
                        <TableCell>{state.data.time}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.masterInfoBoxTableCell}>Shift</TableCell>
                        <TableCell>{state.data.shiftName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.masterInfoBoxTableCell}>Status</TableCell>
                        <TableCell>
                          <CustomAutoComplete
                            label="Status"
                            data={state.statuses}
                            value={state.status}
                            onChange={(e, newValue) => {
                              if (newValue) dispatch({ type: CHANGE_STATUS, payload: newValue });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            {/* Feed, Naptha, Resid, Gas_Oil part */}
            <Grid item container spacing={2}>
              {/* Feed */}
              <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
                <TableContainer component={Paper} className={classes.gridItem}>
                  <h3 className={classes.gridItemTitle}>FEED</h3>
                  <Table size="small">
                    <TableBody>
                      {_.sortBy(
                        state.data.shiftReportDetails.filter(item => item.shiftSection === FEED),
                        ['sortOrder']
                      ).map(feed => {
                        const _item = feed;
                        let tablecell;

                        if (_item.getAutoReading) {
                          tablecell = (
                            <TableCell>{` :  ${feed.reading ?? 0} ${
                              feed.unitName ? getSign(feed.unitName) : ''
                            }`}</TableCell>
                          );
                        } else if (feed.name === 'TYPE') {
                          tablecell = (
                            <TableCell>
                              <CustomAutoComplete
                                data={state.feedTypes}
                                label="Type"
                                value={state.feedType}
                                onChange={(e, newValue) => dispatch({ type: CHANGE_FEED_TYPE, payload: newValue })}
                              />
                            </TableCell>
                          );
                        } else if (feed.name === 'TANK') {
                          tablecell = (
                            <Fragment>
                              <TableCell>
                                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8 }}>
                                  <CustomAutoComplete
                                    data={state.tanks}
                                    label="Tanks"
                                    value={state.selectedTank}
                                    onChange={(e, newValue) => dispatch({ type: CHANGE_TANK, payload: newValue })}
                                  />

                                  <Select
                                    className={classes.symbol}
                                    placeholder="Symbol"
                                    value={state.selectedSymbol}
                                    options={state.symbols}
                                    onChange={e => dispatch({ type: CHANGE_SYMBOL, payload: e })}
                                    getOptionLabel={e => (
                                      <div style={{ display: 'flex', alignItems: 'center', color: e.color }}>{e.icon}</div>
                                    )}
                                  />

                                  <Fab size="small" onClick={onAddTankWithSymble} className={classes.btnParent}>
                                    <Add className={classes.btnChild} />
                                  </Fab>
                                </div>
                                {state.selectedTankSymbol?.map((item, idx) => (
                                  <div
                                    style={{
                                      position: 'relative',
                                      display: 'inline-block',
                                      marginRight: 5,
                                      borderRadius: 5,
                                      padding: '3px 7px',
                                      border: '1px solid black'
                                    }}
                                    key={idx + 1}>
                                    <div>
                                      <span>{item.tank}</span>
                                      <span>{icons[item.symbol]}</span>
                                    </div>
                                    <span className={classes.tankIcon} onClick={() => onRemovedTankSymbol(idx, item)}>
                                      x
                                    </span>
                                  </div>
                                ))}
                              </TableCell>
                            </Fragment>
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
                  <h3 className={classes.gridItemTitle}>NAPHTHA</h3>
                  <Table size="small">
                    <TableBody>
                      {_.sortBy(
                        state.data.shiftReportDetails.filter(item => item.shiftSection === NAPHTHA),
                        ['sortOrder']
                      ).map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{`${item.name}`}</TableCell>
                          <TableCell>{` :  ${item.reading ?? 0} ${item.unitName ? getSign(item.unitName) : ''}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Gas oil */}
              <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className={classes.gridItemWrapper}>
                <TableContainer component={Paper} className={classes.gridItem}>
                  <h3 className={classes.gridItemTitle}>Gas Oil</h3>
                  <Table size="small">
                    <TableBody>
                      {_.sortBy(
                        state.data.shiftReportDetails.filter(item => item.shiftSection === GAS_OIL),
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
                  <h3 className={classes.gridItemTitle}>Residue</h3>
                  <Table size="small">
                    <TableBody>
                      {_.sortBy(
                        state.data.shiftReportDetails.filter(item => item.shiftSection === RESIDUE),
                        ['sortOrder']
                      ).map(item => {
                        const _item = item;
                        let tablecell;

                        if (_item.getAutoReading) {
                          tablecell = (
                            <TableCell>{` :  ${item.reading ?? 0} ${
                              item.unitName ? getSign(item.unitName) : ''
                            }`}</TableCell>
                          );
                        } else {
                          tablecell = (
                            <TableCell>
                              <CustomAutoComplete
                                data={state.stabilities}
                                label="Stability"
                                value={state.stability}
                                onChange={(e, newValue) => dispatch({ type: CHANGE_STABILITY, payload: newValue })}
                              />
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
                        <span className={clsx(classes.fileOneti04Left)}>
                          {item.name === 'TI-04' ? item.reading ?? '-' : ''}
                        </span>
                        <span className={clsx(classes.fileOneti04Right)}>
                          {item.name === 'TI-04' ? item.reading ?? '-' : ''}
                        </span>
                        <span className={clsx(classes.fileOnefic01)}>
                          {item.name === 'FIC-01' ? item.reading ?? '-' : ''}
                        </span>
                        <span className={clsx(classes.fileOnefic02)}>
                          {' '}
                          {item.name === 'FIC-02' ? item.reading ?? '-' : ''}
                        </span>
                        <span className={clsx(classes.fileOnepi02)}>{item.name === 'PI-02' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnepi03)}>{item.name === 'PI-03' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnet05)}> {item.name === 'T-05' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnet06)}>{item.name === 'T-06' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnepi06)}>{item.name === 'PI-06' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnepi07)}>
                          {' '}
                          {item.name === 'PI-07' ? item.reading ?? '-' : ''}
                        </span>
                        <span className={clsx(classes.fileOnet07)}>{item.name === 'T-07' ? item.reading ?? '-' : ''}</span>
                        <span className={clsx(classes.fileOnet08)}>{item.name === 'T-08' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnet09)}> {item.name === 'T-09' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnepic19)}>{item.name === 'PIC-19' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOneo2)}>{item.name === '%O2' ? item.reading ?? 0 : ''}</span>

                        <span
                          className={clsx(
                            classes.fileOnet10,
                            item.name === getMaxTag(sourceFile1).name && classes.textRedColor
                          )}>
                          {item.name === 'T-10' ? item.reading ?? 0 : ''}
                        </span>
                        <span
                          className={clsx(
                            classes.fileOnet11,
                            item.name === getMaxTag(sourceFile1).name && classes.textRedColor
                          )}>
                          {item.name === 'T-11' ? item.reading ?? 0 : ''}
                        </span>
                        <span
                          className={clsx(
                            classes.fileOnet12,
                            item.name === getMaxTag(sourceFile1).name && classes.textRedColor
                          )}>
                          {item.name === 'T-12' ? item.reading ?? 0 : ''}
                        </span>
                        <span
                          className={clsx(
                            classes.fileOnet13,
                            item.name === getMaxTag(sourceFile1).name && classes.textRedColor
                          )}>
                          {item.name === 'T-13' ? item.reading ?? 0 : ''}
                        </span>

                        <span className={clsx(classes.fileOnet14)}>{item.name === 'T-14' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnet15)}> {item.name === 'T-15' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnet64)}> {item.name === 'T-64' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnet65)}> {item.name === 'T-65' ? item.reading ?? 0 : ''}</span>

                        <span className={clsx(classes.fileOneft37)}> {item.name === 'FT-37' ? item.reading ?? 0 : ''}</span>
                        <span className={clsx(classes.fileOnestrokePass1)}>
                          {item.name === '%STROKE_PASS-1' ? item.reading ?? 0 : ''}
                        </span>
                        <span className={clsx(classes.fileOnestrokePass2)}>
                          {item.name === '%STROKE_PASS-2' ? item.reading ?? 0 : ''}
                        </span>
                        <span className={clsx(classes.fileOnehic03)}>
                          {' '}
                          {item.name === 'HIC-03' ? item.reading ?? 0 : ''}
                        </span>
                        <span className={clsx(classes.fileOnehic23)}>
                          {' '}
                          {item.name === 'HIC-23' ? item.reading ?? 0 : ''}
                        </span>
                        <span className={clsx(classes.fileOnepi52)}>{item.name === 'PI-52' ? item.reading ?? 0 : ''}</span>
                      </Fragment>
                    );
                  })}
                  <span className={clsx(classes.fileOnefuelType)}>
                    <CustomAutoComplete
                      data={state.fuelTypes}
                      value={state.fuelType}
                      onChange={(e, newValue) => dispatch({ type: CHANGE_FUEL_TYPE, payload: newValue })}
                    />
                  </span>
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_1),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_1),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* box 2 */}
              <Grid item xs={12} sm={12} md={12} lg={8} xl={6} className={classes.gridItemWrapper}>
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_2),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_2),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center">
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_3),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_3),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center">
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_4),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_4),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_5),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_5),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center">
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_6),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_6),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center">
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_7),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_7),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_8),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_8),
                          ['sortOrder']
                        ).map(item => {
                          return (
                            <TableCell key={item.id} align="center">
                              {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
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
                <TableContainer component={Paper} className={classes.gridItem}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {_.sortBy(
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_9),
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
                          state.data.shiftReportDetails.filter(item => item.shiftSection === Box_9),
                          ['sortOrder']
                        ).map(item => {
                          let tableCell;
                          if (item.getAutoReading) {
                            tableCell = (
                              <TableCell key={item.id} align="center">
                                {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                              </TableCell>
                            );
                          } else if (item.name === 'K-6051 A') {
                            tableCell = (
                              <TableCell key={item.id} align="center">
                                <CustomAutoComplete
                                  data={state.loads}
                                  value={state.selectedK6051A}
                                  onChange={(e, newValue) => {
                                    dispatch({ type: CHANGE_K6051A, payload: newValue });
                                  }}
                                />
                              </TableCell>
                            );
                          } else {
                            tableCell = (
                              <TableCell key={item.id} align="center">
                                <CustomAutoComplete
                                  data={state.loads}
                                  value={state.selectedK6051B}
                                  onChange={(e, newValue) => {
                                    dispatch({ type: CHANGE_K6051B, payload: newValue });
                                  }}
                                />
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
                <TableContainer component={Paper} className={classes.gridItem}>
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
                        state.data.shiftReportDetails.filter(item => item.shiftSection === Box_10),
                        ['sortOrder']
                      ).map(item => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell align="center">{item.name}</TableCell>
                            <TableCell align="center">{item.reading}</TableCell>
                            <TableCell align="center">{item.production}</TableCell>
                            <TableCell align="center">{item.percent}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* box 11 */}
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6} className={classes.gridItemWrapper}>
                <TableContainer component={Paper} className={classes.gridItem}>
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
                        state.data.shiftReportDetails.filter(item => item.shiftSection === Box_11),
                        ['sortOrder']
                      ).map(item => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell align="center">{item.name}</TableCell>
                            <TableCell align="center">{item.reading}</TableCell>
                            <TableCell align="center">{item.production}</TableCell>
                            <TableCell align="center">{item.percent}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 15 }}>
            <TextInput
              multiline
              className={classes.txtInput}
              label="Remarks"
              name="remark"
              value={state.data.remark}
              onChange={e => setRemarks(e.target.value)}
            />
          </Grid>
          <Grid container justifyContent="flex-end">
            <SaveButton onClick={onSubmit} />
            <CancelButton
              onClick={() => {
                history.goBack();
              }}
            />
          </Grid>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default ShiftReportEditForm;

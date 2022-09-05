/**
 * Title: Daily datasheet edit
 * Description:
 * Author: Nasir Ahmed
 * Date: 12-Jun-2022
 * Modified: 12-Jun-2022
 **/

import { Fab, Grid, Typography } from '@material-ui/core';
import { Add, ArrowDownward, ArrowUpward, ImportExport } from '@material-ui/icons';
import { ReactComponent as IconUpDown } from 'assets/svg/arrow-down-up.svg';
import { ReactComponent as IconDown } from 'assets/svg/arrow-down.svg';
import { ReactComponent as IconUp } from 'assets/svg/arrow-up.svg';
import axios from 'axios';
import { CustomAutoComplete, CustomBackDrop, CustomPreloder, CustomTimePicker, SaveButton } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DAILY_DATA_SHEET, TANK } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, getSign } from 'utils/commonHelper';
import { formattedDate, time24 } from 'utils/dateHelper';
import { useStyles } from 'views/Application/ScpData/DailyDataSheet/Styles/index';

const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const DailyDataSheetEditForm = () => {
  //#region Hooks
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);
  //#endregion

  //#region States
  const [state, setState] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [tanks, setTanks] = useState([]);
  const [tank, setTank] = useState(null);
  const [tankWithSymbol, setTankWithSymbol] = useState([]);

  const [symbols] = useState([
    {
      value: 'Up',
      label: 'Up',
      icon: <IconUp />,
      color: 'green'
    },
    {
      value: 'Down',
      label: 'Down',
      icon: <IconDown />,
      color: 'red'
    },
    {
      value: 'Running',
      label: 'Running',
      icon: <IconUpDown />,
      color: 'blue'
    }
  ]);
  const [symbol, setSymbol] = useState(null);
  //#endregion

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchDepencies = async () => {
      try {
        const tanksReq = http.get(TANK.get_active);
        const ddsReq = http.get(`${DAILY_DATA_SHEET.get_single}/${location.state}`);
        const [ddsRes, tanksRes] = await axios.all([ddsReq, tanksReq]);
        if (ddsRes.data.succeeded && tanksRes.data.succeeded) {
          const dds = ddsRes.data.data;

          const tanksDDL = fillDropDown(tanksRes.data.data, 'tankName', 'tankName');

          const tankObj = ddsRes.data.data.dailyDataSheetDetailsBySection
            .find(sec => sec.ddsSection === 'OtherFeatures')
            .dailyDataSheetDetails.find(
              tankSym => tankSym.caseName === 'of-feed-tank' || tankSym.displayName === 'Feed Tank'
            );

          const tankSymbols = tankObj.currentReading;

          const parsedTankSymbols = JSON.parse(tankSymbols).map(item => ({ ...item, label: item.tank, value: item.tank }));
          const filteredTanks = tanksDDL.filter(t => parsedTankSymbols.findIndex(item => item.tank === t.tankName) === -1);
          if (isMounted) {
            setState(dds);
            setTanks(filteredTanks);
            setTankWithSymbol(parsedTankSymbols);
            setIsPageLoaded(true);
          }
        }
      } catch (err) {
        toastAlerts('error', internalServerError);
      }
    };

    fetchDepencies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.state]);

  //#region Events
  const onTankChange = (e, newValue) => {
    setTank(newValue);
  };

  const onTankSymbolChange = e => {
    setSymbol(e);
  };

  const onAddTankWithSymble = () => {
    const data = { tank: tank.label, symbol: symbol.value, ...tank };
    const newtankWithSymbol = [...tankWithSymbol, data];

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.dailyDataSheetDetailsBySection.findIndex(
      othFSection => othFSection.ddsSection === 'OtherFeatures'
    );
    const otherFeaturesSection = coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex];

    const feedTankIndex = otherFeaturesSection.dailyDataSheetDetails.findIndex(item => item.displayName === 'Feed Tank');
    const feedTankObj = otherFeaturesSection.dailyDataSheetDetails[feedTankIndex];

    feedTankObj.currentReading = JSON.stringify(newtankWithSymbol.map(item => ({ tank: item.tank, symbol: item.symbol })));

    otherFeaturesSection.dailyDataSheetDetails[feedTankIndex] = feedTankObj;
    coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
    setTankWithSymbol(newtankWithSymbol);
    setTank(null);
    setTanks(prev => prev.filter(t => t.tankName !== data.tank));
  };

  const onRemovedTankSymbol = tankWithSymbolIndex => {
    const newtankWithSymbol = [...tankWithSymbol];
    const removedTank = newtankWithSymbol.splice(tankWithSymbolIndex, 1)[0];

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.dailyDataSheetDetailsBySection.findIndex(
      othFSection => othFSection.ddsSection === 'OtherFeatures'
    );
    const otherFeaturesSection = coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex];

    const feedTankIndex = otherFeaturesSection.dailyDataSheetDetails.findIndex(item => item.displayName === 'Feed Tank');
    const feedTankObj = otherFeaturesSection.dailyDataSheetDetails[feedTankIndex];

    feedTankObj.currentReading = JSON.stringify(newtankWithSymbol.map(item => ({ tank: item.tank, symbol: item.symbol })));

    otherFeaturesSection.dailyDataSheetDetails[feedTankIndex] = feedTankObj;
    coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex] = otherFeaturesSection;

    setState(coppiedState);
    setTankWithSymbol(newtankWithSymbol);
    setTanks(prev => [...prev, { ...removedTank }]);
  };

  const onTankLevelChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.dailyDataSheetDetailsBySection.findIndex(
      othFSection => othFSection.ddsSection === 'OtherFeatures'
    );
    const otherFeaturesSection = coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex];

    const tankLevelObjIndex = otherFeaturesSection.dailyDataSheetDetails.findIndex(
      item => item.displayName === 'Tank Level'
    );
    const tankLevelObj = otherFeaturesSection.dailyDataSheetDetails[tankLevelObjIndex];

    const reding = regx.test(value) ? value : tankLevelObj.currentReading;
    tankLevelObj.currentReading = reding;

    otherFeaturesSection.dailyDataSheetDetails[tankLevelObjIndex] = tankLevelObj;
    coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onTimeChange = time => {
    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.dailyDataSheetDetailsBySection.findIndex(
      othFSection => othFSection.ddsSection === 'OtherFeatures'
    );
    const otherFeaturesSection = coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex];

    const timeObjIndex = otherFeaturesSection.dailyDataSheetDetails.findIndex(item => item.displayName === 'Time');
    const timeObj = otherFeaturesSection.dailyDataSheetDetails[timeObjIndex];

    timeObj.currentReading = time24(time);

    otherFeaturesSection.dailyDataSheetDetails[timeObjIndex] = timeObj;
    coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onRunningDaysChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.dailyDataSheetDetailsBySection.findIndex(
      othFSection => othFSection.ddsSection === 'OtherFeatures'
    );
    const otherFeaturesSection = coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex];

    const runningDaysObjIndex = otherFeaturesSection.dailyDataSheetDetails.findIndex(
      item => item.displayName === 'Running Days'
    );
    const runningDayObj = otherFeaturesSection.dailyDataSheetDetails[runningDaysObjIndex];

    const reding = regx.test(value) ? value : runningDayObj.currentReading;
    runningDayObj.currentReading = reding;

    otherFeaturesSection.dailyDataSheetDetails[runningDaysObjIndex] = runningDayObj;
    coppiedState.dailyDataSheetDetailsBySection[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onSubmit = async () => {
    setOpenBackdrop(true);
    setLoading(true);

    const dailyDataSheetDetails = state.dailyDataSheetDetailsBySection.map(sec => sec.dailyDataSheetDetails).flat();
    const payload = {
      id: state.id,
      key: state.key,
      date: state.date,
      time: state.time,
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName,
      dailyDataSheetDetails
    };

    try {
      const res = await http.put(`${DAILY_DATA_SHEET.update}/${payload.key}`, payload);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      }
    } catch (err) {
      toastAlerts('error', err?.response?.data.Message);
    } finally {
      setOpenBackdrop(false);
      setLoading(false);
    }
  };
  //#region

  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  return (
    <PageContainer heading="Daily Data Sheet (Update)">
      <Grid container spacing={3}>
        <Grid
          item
          container
          xs={4}
          className="section"
          spacing={5}
          justifyContent="space-between"
          style={{ padding: '10px 5px', border: '1px solid #666' }}>
          <Typography component="div" variant="h3">
            Date :
          </Typography>
          <Typography component="div" variant="h3">
            {formattedDate(state.date)}
          </Typography>
        </Grid>
        {/* Cumulitive and TUI */}

        <Grid item container xs={12} className="section" spacing={5}>
          {/* Cumulitive */}
          <Grid item xs={7}>
            <table className="ddstables">
              <thead>
                <tr>
                  <td colSpan={2}>ITEM</td>
                  <td>FQ READING</td>
                  <td>FACTOR</td>
                </tr>
              </thead>
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(cuSec => cuSec.ddsSection === 'Cumulitive')
                    .dailyDataSheetDetails,
                  ['sortOrder']
                ).map((cu, index) => (
                  <tr key={index + 1}>
                    <td colSpan={cu.displayName === 'POWER INCOMER' ? 2 : 1}>{cu.displayName}</td>
                    {cu.displayName !== 'POWER INCOMER' && <td>{cu.tagName}</td>}
                    <td className="textBoxCenter">{cu.currentReading ? cu.currentReading : ''}</td>
                    <td className="textBoxCenter">{cu.factor ? cu.factor : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* Cumulitive */}

          {/* TUI */}
          <Grid item xs={5}>
            <table className="ddstables">
              <thead>
                <tr>
                  <td>TUI</td>
                  <td>TEMP {`\u00b0C`}</td>
                </tr>
              </thead>
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(tuiSec => tuiSec.ddsSection === 'TUI').dailyDataSheetDetails,
                  ['sortOrder']
                ).map((t, index) => (
                  <tr key={index + 1}>
                    <td>{t.displayName}</td>
                    <td className="textBoxCenter">{t.currentReading ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* TUI */}
        </Grid>
        {/* Cumulitive and TUI */}

        {/* FI and FIC */}
        <Grid item container xs={12} className="section" spacing={5}>
          {/* FI */}
          <Grid item xs={7}>
            <table className="ddstables fi">
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(fiSec => fiSec.ddsSection === 'FI').dailyDataSheetDetails,
                  ['sortOrder']
                ).map((fi, index) => (
                  <tr key={index + 1}>
                    <td>{fi.displayName}</td>
                    <td className="textBoxCenter">{fi.signe}</td>
                    <td className="textBoxCenter">{fi.currentReading ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* FI */}

          {/* FIC */}
          <Grid item xs={5}>
            <table className="ddstables fic">
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(ficSec => ficSec.ddsSection === 'FIC').dailyDataSheetDetails,
                  ['sortOrder']
                ).map((fic, index) => (
                  <tr key={index + 1}>
                    <td>{fic.displayName}</td>
                    <td className="textBoxCenter">{fic.signe}</td>
                    <td className="textBoxCenter">{fic.currentReading ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* FIC */}
        </Grid>
        {/* FI and FIC */}

        {/* Ammonia and Tray */}
        <Grid item container xs={12} className="section" spacing={5}>
          {/* Ammonia */}
          <Grid item xs={7}>
            <table className="ddstables ammonia">
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(ammoniaSec => ammoniaSec.ddsSection === 'Ammonia')
                    .dailyDataSheetDetails,
                  ['sortOrder']
                ).map((am, index) => (
                  <tr key={index + 1}>
                    <td>{am.displayName}</td>
                    <td className="textBoxCenter">{am.currentReading ?? ''}</td>
                    <td className="textBoxCenter">{am.signe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* Ammonia */}

          {/* Tray */}
          <Grid item xs={5}>
            <table className="ddstables">
              <tbody>
                {_.sortBy(
                  state.dailyDataSheetDetailsBySection.find(traySec => traySec.ddsSection === 'Tray').dailyDataSheetDetails,
                  ['sortOrder']
                ).map((t, trayIdex) => (
                  <tr key={trayIdex + 1}>
                    <td>{t.displayName}</td>
                    <td className="textBoxCenter">{t.signe}</td>
                    <td className="textBoxCenter">{t.currentReading ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          {/* Tray */}
        </Grid>
        {/*  Ammonia and Tray */}

        {/* Production Synopsis, Consumptions and Other Features */}
        <Grid item container xs={12} className="section" spacing={5}>
          {/* Production Synopsis, Consumptions */}
          <Grid item container xs={6}>
            {/* Production Synopsis */}
            <Grid item xs={12} style={{ marginBottom: 20 }}>
              <table className="ddstables production-synopsis">
                <thead>
                  <tr>
                    <td colSpan={3}>Production Synopsis</td>
                  </tr>
                </thead>
                <tbody>
                  {_.sortBy(
                    state.dailyDataSheetDetailsBySection.find(psSec => psSec.ddsSection === 'ProductionSynopsys')
                      .dailyDataSheetDetails,
                    ['sortOrder']
                  ).map((ps, psIdx) => {
                    return (
                      <tr key={psIdx + 1}>
                        <td>{ps.displayName}</td>
                        <td className="textBoxCenter">{`${ps.psCalculatedValue ?? ''} ${ps.signe &&
                          '( ' + getSign(ps.signe) + ' )'}`}</td>
                        <td className="textBoxCenter">{ps.currentReading}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Grid>
            {/* Production Synopsis */}

            {/* Consumptions */}
            <Grid item xs={12}>
              <table className="ddstables consumptions">
                <thead>
                  <tr>
                    <td colSpan={2}>Consumptions</td>
                  </tr>
                </thead>
                <tbody>
                  {_.sortBy(
                    state.dailyDataSheetDetailsBySection.find(consumtionsSec => consumtionsSec.ddsSection === 'Consumptions')
                      .dailyDataSheetDetails,
                    ['sortOrder']
                  ).map((con, conIdx) => (
                    <tr key={conIdx + 1}>
                      <td>{`${con.displayName} ${con.signe && getSign(con.signe)}`}</td>
                      <td className="textBoxCenter">{con.psCalculatedValue ? con.psCalculatedValue : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
            {/* Consumptions */}
          </Grid>
          {/* Production Synopsis, Consumptions */}

          {/* Other Features */}

          <Grid item xs={6}>
            <table className="ddstables  other-features">
              <thead>
                <tr>
                  <td colSpan={2}>Other Features</td>
                </tr>
              </thead>
              <tbody>
                {/* Feed Rate */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Rate').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Rate').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Rate').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Rate').signe
                      )}`}
                  </td>
                </tr>

                {/* Feed Temp */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Temp').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Temp').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Temp').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Temp').signe
                      )}`}
                  </td>
                </tr>
                {/* Furnace Outlet */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Furnace Outlet').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Furnace Outlet').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Furnace Outlet').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Furnace Outlet').signe
                      )}`}
                  </td>
                </tr>
                {/* Max. Skin Temp. */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').signe
                      )}`}
                  </td>
                </tr>
                {/* ΔT */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔT').displayName
                    }
                  </td>
                  <td>
                    {`${
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔT').currentReading
                    } ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔT').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔT').signe
                      )}`}
                  </td>
                </tr>

                {/* ΔP */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔP').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔP').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔP').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'ΔP').signe
                      )}`}
                  </td>
                </tr>

                {/* Feed Viscosity */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Viscosity').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Viscosity').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Viscosity').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Viscosity').signe
                      )}`}
                  </td>
                </tr>

                {/* Residue Visco. */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Residue Visco.').displayName
                    }
                  </td>
                  <td>
                    {`${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Residue Visco.').currentReading ??
                      0} ${state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Residue Visco.').signe &&
                      getSign(
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Residue Visco.').signe
                      )}`}
                  </td>
                </tr>

                {/* Feed Tank */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Feed Tank').displayName
                    }
                  </td>
                  <td>
                    <div className="feed-tank-items">
                      <CustomAutoComplete data={tanks} label="Tanks" value={tank} onChange={onTankChange} />
                      <Select
                        className="symbol"
                        placeholder="Symbol"
                        value={symbol}
                        options={symbols}
                        onChange={onTankSymbolChange}
                        getOptionLabel={e => (
                          <div style={{ display: 'flex', alignItems: 'center', color: e.color }}>{e.icon}</div>
                        )}
                      />
                      <Fab
                        size="small"
                        onClick={onAddTankWithSymble}
                        className={classes.btnParent}
                        disabled={!tank || !symbol}>
                        <Add className={classes.btnChild} />
                      </Fab>
                    </div>
                    {tankWithSymbol?.map((item, idx) => (
                      <div className="tank-icon-container" key={idx + 1}>
                        <div>
                          <span>{item.tank}</span>
                          <span>{icons[item.symbol]}</span>
                        </div>
                        <span className="tank-remove-icon" onClick={() => onRemovedTankSymbol(idx)}>
                          x
                        </span>
                      </div>
                    ))}
                  </td>
                </tr>

                {/* Tank Level */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Tank Level').displayName
                    }
                  </td>
                  <td>
                    <input
                      type="text"
                      name="tankLevel"
                      value={
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Tank Level').currentReading ?? ''
                      }
                      onChange={onTankLevelChange}
                    />
                    {state.dailyDataSheetDetailsBySection
                      .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                      .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Tank Level').signe && (
                      <span>
                        {getSign(
                          state.dailyDataSheetDetailsBySection
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Tank Level').signe
                        )}
                      </span>
                    )}
                  </td>
                </tr>
                {/* Time */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Time').displayName
                    }
                  </td>
                  <td>
                    <CustomTimePicker
                      placeholder="select time"
                      value={
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Time').currentReading
                          ? `0001/01/01 ${
                              state.dailyDataSheetDetailsBySection
                                .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                                .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Time').currentReading
                            }`
                          : null
                      }
                      onChange={onTimeChange}
                    />
                  </td>
                </tr>

                {/* Running Days */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Running Days').displayName
                    }
                  </td>
                  <td>
                    <input
                      type="text"
                      name="runningDays"
                      value={
                        state.dailyDataSheetDetailsBySection
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Running Days').currentReading ?? ''
                      }
                      onChange={onRunningDaysChange}
                    />
                  </td>
                </tr>

                {/* Shift Incharge */}
                <tr>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Shift Incharge').displayName
                    }
                  </td>
                  <td>
                    {
                      state.dailyDataSheetDetailsBySection
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dailyDataSheetDetails.find(ofItem => ofItem.displayName === 'Shift Incharge').currentReading
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </Grid>
          {/* Other Features */}
        </Grid>
        {/* Production Synopsis, Consumptions and Other Features */}
      </Grid>
      <Grid container justifyContent="flex-end">
        <SaveButton onClick={onSubmit} />
      </Grid>
      <CustomBackDrop />
    </PageContainer>
  );
};

export default DailyDataSheetEditForm;

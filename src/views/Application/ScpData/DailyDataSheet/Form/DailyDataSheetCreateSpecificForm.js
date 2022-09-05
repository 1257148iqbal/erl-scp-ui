/**
 * Title: Daily datasheet create specific form (reformed)
 * Description:
 * Author: Nasir Ahmed
 * Date: 19-April-2022
 * Modified: 12-May-2022
 **/

import { Fab, Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ArrowDownward, ArrowUpward, ImportExport } from '@mui/icons-material';
import { ReactComponent as IconUpDown } from 'assets/svg/arrow-down-up.svg';
import { ReactComponent as IconDown } from 'assets/svg/arrow-down.svg';
import { ReactComponent as IconUp } from 'assets/svg/arrow-up.svg';
import axios from 'axios';
import {
  CustomAutoComplete,
  CustomBackDrop,
  CustomDatePicker,
  CustomPreloder,
  CustomTimePicker,
  SaveButton
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DAILY_DATA_SHEET, DAILY_DATA_SHEET_SETTINGS, TANK } from 'constants/ApiEndPoints/v1';
import {
  CASE_CN_AMMONIA,
  CASE_CN_AO,
  CASE_CN_BFW,
  CASE_CN_CI,
  CASE_CN_STEAM,
  CASE_FIC_3005,
  CASE_FIC_3006,
  CASE_FIC_3012,
  CASE_PS_FQ_3039,
  CASE_PS_FQ_3041,
  CASE_PS_FQ_3042,
  CASE_PS_FQ_3043,
  CASE_PS_FQ_3044,
  CASE_PS_FQ_3045
} from 'constants/PSFormulaNames';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, getSign, sleep } from 'utils/commonHelper';
import { serverDate, time24 } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import { useStyles } from 'views/Application/ScpData/DailyDataSheet/Styles/index';
import { getDeltaTValue, getGetPSCalculatedValue, getPercentage, getResidureValue } from '../helperFunctions';
import '../Styles/dailydatasheet.css';

const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const DailyDataSheetCreateForm = () => {
  const classes = useStyles();
  const { setOpenBackdrop } = useBackDrop();
  const [state, setState] = useState([]);

  const [tanks, setTanks] = useState([]);
  const [tank, setTank] = useState(null);

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

  const [tankWithSymbol, setTankWithSymbol] = useState([]);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [date, setDate] = useState(new Date());

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  const history = useHistory();

  useEffect(() => {
    const fetchDataSheetSettingsWithReading = async () => {
      const tanksReq = http.get(TANK.get_active);
      const dailyDataSheetReadingReq = http.get(DAILY_DATA_SHEET_SETTINGS.get_data_sheet_with_reading, {
        params: { date: serverDate(date) }
      });
      try {
        const [tanksRes, dailyDatasheetReadingRes] = await axios.all([tanksReq, dailyDataSheetReadingReq]);
        if (tanksRes.data.succeeded && dailyDatasheetReadingRes.data.succeeded) {
          const settings = dailyDatasheetReadingRes.data.data.map((ddssec, index, sourceArr) => {
            switch (ddssec.ddsSection) {
              case 'OtherFeatures':
                ddssec.dataSheetSetting.map(dset => {
                  dset.rowId = uuid();
                  switch (dset.displayName) {
                    case 'ΔT': {
                      dset.currentReading = getDeltaTValue(ddssec);
                      return dset;
                    }
                    case 'ΔP': {
                      dset.currentReading = dset.currentReading
                        ? Number.isInteger(Number(dset.currentReading))
                          ? Number(dset.currentReading)
                          : Number(dset.currentReading).toFixed(2)
                        : dset.currentReading;
                      return dset;
                    }

                    case 'Shift Incharge': {
                      dset.currentReading = employeeID;
                      return dset;
                    }

                    default:
                      return dset;
                  }
                });
                return ddssec;

              case 'Consumptions':
                ddssec.dataSheetSetting.map((dset, index, arr) => {
                  dset.rowId = uuid();
                  switch (dset.caseName) {
                    case CASE_CN_AMMONIA: {
                      const { previousReading, currentReading } = dset;
                      if (previousReading === '' || previousReading === '0') {
                        dset.psCalculatedValue = 0;
                      } else {
                        const prev = previousReading ? parseFloat(previousReading) : 0;
                        const curr = currentReading ? parseFloat(currentReading) : 0;
                        const psCalculatedValueforAmonia = (curr - prev) * 3 * 0.185;
                        dset.psCalculatedValue = isNaN(psCalculatedValueforAmonia)
                          ? ''
                          : psCalculatedValueforAmonia.toFixed(2);
                      }

                      return dset;
                    }
                    case CASE_CN_CI: {
                      const { previousReading, currentReading } = dset;
                      if (previousReading === '' || previousReading === '0') {
                        dset.psCalculatedValue = 0;
                      } else {
                        const prev = previousReading ? parseFloat(previousReading) : 0;
                        const curr = currentReading ? parseFloat(currentReading) : 0;
                        const psCalculatedValueforCI = (curr - prev) * 1.97 * 0.1;
                        dset.psCalculatedValue = isNaN(psCalculatedValueforCI) ? '' : psCalculatedValueforCI.toFixed(2);
                      }

                      return dset;
                    }
                    case CASE_CN_AO: {
                      const { previousReading, currentReading } = dset;
                      if (previousReading === '' || previousReading === '0') {
                        dset.psCalculatedValue = 0;
                      } else {
                        const prev = previousReading ? parseFloat(previousReading) : 0;
                        const curr = currentReading ? parseFloat(currentReading) : 0;
                        const psCalculatedValueforAO = (curr - prev) * 1.97 * 0.05;
                        dset.psCalculatedValue = isNaN(psCalculatedValueforAO) ? '' : psCalculatedValueforAO.toFixed(2);
                      }

                      return dset;
                    }
                    case CASE_CN_STEAM: {
                      const ficSection = sourceArr.find(fic => fic.ddsSection === 'FIC');
                      const [fic3005, fic3006, fic3012] = ficSection.dataSheetSetting.filter(
                        item =>
                          item.caseName === CASE_FIC_3005 ||
                          item.caseName === CASE_FIC_3006 ||
                          item.caseName === CASE_FIC_3012
                      );
                      const fic3005Curr = fic3005.currentReading ? parseFloat(fic3005.currentReading) : 0;
                      const fic3005Factor = fic3005.factor;
                      const fic3006Curr = fic3006.currentReading ? parseFloat(fic3006.currentReading) : 0;
                      const fic3006Factor = fic3006.factor;
                      const fic3012Curr = fic3012.currentReading ? parseFloat(fic3012.currentReading) : 0;
                      const fic3012Factor = fic3012.factor;
                      const calcValue = parseInt(
                        ((fic3005Curr * fic3005Factor + fic3006Curr * fic3006Factor + fic3012Curr * fic3012Factor) * 24) /
                          1000
                      );

                      dset.psCalculatedValue = calcValue;
                      return dset;
                    }

                    default:
                      return dset;
                  }
                });
                return ddssec;

              default: {
                return {
                  ...ddssec,
                  dataSheetSetting: ddssec.dataSheetSetting.map(dset => {
                    dset.rowId = uuid();
                    return dset;
                  })
                };
              }
            }
          });
          const tanksddl = fillDropDown(tanksRes.data.data, 'tankName', 'id');

          setState(settings);
          setTanks(tanksddl);
          setIsPageLoaded(true);
        } else {
          toastAlerts('error', 'There is an error!!!');
        }
      } catch (err) {
        toastAlerts('error', err);
      }
    };

    trackPromise(fetchDataSheetSettingsWithReading());
  }, [employeeID, date]);

  const onDateChange = date => {
    setDate(date);
  };

  const onFQReadingChange = (e, fqIndex, refSettingId = null, refSettingName) => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    // Change fq reading
    let coppiedState = _.cloneDeep(state);
    const cumulitiveIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'Cumulitive');
    const cumulitiveSection = coppiedState[cumulitiveIndex];
    const targetFQItem = cumulitiveSection.dataSheetSetting[fqIndex];
    const fqRreading = regx.test(value) ? value : targetFQItem.currentReading;
    targetFQItem.currentReading = fqRreading;
    cumulitiveSection.dataSheetSetting[fqIndex] = targetFQItem;

    // Change PS
    if (refSettingId) {
      // Find PS section with its index
      const productionSynopsisOrConsumtionIndex = coppiedState.findIndex(
        cuSection => cuSection.ddsSection === refSettingName
      );
      const targetRespectiveSection = coppiedState[productionSynopsisOrConsumtionIndex];

      // Find Respective PS item with ites index
      const targetRespectiveSectionIndex = targetRespectiveSection.dataSheetSetting.findIndex(
        item => item.id === refSettingId
      );

      const targetPSOrConObj = targetRespectiveSection.dataSheetSetting[targetRespectiveSectionIndex];

      const { psFormula, previousReading, factor, vcf, density, tuiAverage, caseName } = targetPSOrConObj;

      const calcValue = getGetPSCalculatedValue(
        psFormula,
        fqRreading,
        previousReading,
        factor,
        vcf,
        density,
        tuiAverage,
        caseName
      );
      targetPSOrConObj.psCalculatedValue = calcValue;
      targetPSOrConObj.currentReading = getPercentage(targetRespectiveSection, calcValue, caseName);

      if (caseName === CASE_PS_FQ_3039) {
        const consumptionSectionIndex = coppiedState.findIndex(conSec => conSec.ddsSection === 'Consumptions');
        const consumptionSection = coppiedState[consumptionSectionIndex];

        const bfwIndex = consumptionSection.dataSheetSetting.findIndex(bfw => bfw.caseName === CASE_CN_BFW);
        const bfwObj = consumptionSection.dataSheetSetting[bfwIndex];
        bfwObj.psCalculatedValue = parseInt(calcValue * 1.1 + 17);

        consumptionSection.dataSheetSetting[bfwIndex] = bfwObj;
        coppiedState[consumptionSectionIndex] = consumptionSection;
      }

      if (refSettingName === 'ProductionSynopsys') {
        const fq3042 = targetRespectiveSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3042);
        fq3042.psCalculatedValue = getResidureValue(targetRespectiveSection);

        // For percentage calculation of PS or Consumption
        if (caseName === CASE_PS_FQ_3041) {
          fq3042.currentReading = isNaN((fq3042.psCalculatedValue / calcValue) * 100)
            ? ''
            : ((fq3042.psCalculatedValue / calcValue) * 100).toFixed(2);

          const fq3043 = targetRespectiveSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3043);
          fq3043.currentReading = isNaN((fq3043.psCalculatedValue / calcValue) * 100)
            ? ''
            : ((fq3043.psCalculatedValue / calcValue) * 100).toFixed(2);

          const fq3044 = targetRespectiveSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3044);
          fq3044.currentReading = isNaN((fq3044.psCalculatedValue / calcValue) * 100)
            ? ''
            : ((fq3044.psCalculatedValue / calcValue) * 100).toFixed(2);

          const fq3045 = targetRespectiveSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3045);
          fq3045.currentReading = isNaN((fq3045.psCalculatedValue / calcValue) * 100)
            ? ''
            : ((fq3045.psCalculatedValue / calcValue) * 100).toFixed(2);
        } else {
          const fq3041 = targetRespectiveSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041);
          fq3042.currentReading = isNaN((fq3042.psCalculatedValue / fq3041.psCalculatedValue) * 100)
            ? ''
            : ((fq3042.psCalculatedValue / fq3041.psCalculatedValue) * 100).toFixed(2);
        }
      }

      targetRespectiveSection.dataSheetSetting[targetRespectiveSectionIndex] = targetPSOrConObj;
      coppiedState[productionSynopsisOrConsumtionIndex] = targetRespectiveSection;
    }

    setState(coppiedState);
  };

  const onFactorChange = (e, fqIndex, refSettingId = null, refSettingName) => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    // Change factor
    let coppiedState = _.cloneDeep(state);
    const cumulitiveIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'Cumulitive');
    const cumulitiveSection = coppiedState[cumulitiveIndex];
    const targetFQItem = cumulitiveSection.dataSheetSetting[fqIndex];
    const factor = regx.test(value) ? value : targetFQItem.factor;
    targetFQItem.factor = factor;
    cumulitiveSection[fqIndex] = targetFQItem;

    // Change PS
    if (refSettingId) {
      // Find PS section with its index
      const productionSynopsisIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === refSettingName);
      const productionSynopsisSection = coppiedState[productionSynopsisIndex];

      // Find Respective PS item with ites index
      const targetPSIndex = productionSynopsisSection.dataSheetSetting.findIndex(item => item.id === refSettingId);

      const targetPSObj = productionSynopsisSection.dataSheetSetting[targetPSIndex];

      const { psFormula, previousReading, factor, vcf, density, tuiAverage, caseName } = targetPSObj;

      const calcValue = getGetPSCalculatedValue(
        psFormula,
        targetFQItem.currentReading,
        previousReading,
        factor,
        vcf,
        density,
        tuiAverage,
        caseName
      );

      // Change property value
      targetPSObj.psCalculatedValue = calcValue;
      targetPSObj.currentReading = getPercentage(productionSynopsisSection, calcValue, caseName);
      if (caseName === CASE_PS_FQ_3041) {
        const fq3042 = productionSynopsisSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3042);
        fq3042.currentReading = ((fq3042.psCalculatedValue / calcValue) * 100).toFixed(2);
        const fq3043 = productionSynopsisSection.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3043);
        fq3043.currentReading = ((fq3043.psCalculatedValue / calcValue) * 100).toFixed(2);
      }
      productionSynopsisSection.dataSheetSetting[targetPSIndex] = targetPSObj;
      coppiedState[productionSynopsisIndex] = productionSynopsisSection;
    }

    setState(coppiedState);
  };

  const onTrayReadingChange = (e, trayIndex) => {
    const { value } = e.target;

    // Change factor
    let coppiedState = _.cloneDeep(state);
    const traySectionIdex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'Tray');
    const traySection = coppiedState[traySectionIdex];
    const targetTrayItem = traySection.dataSheetSetting[trayIndex];

    targetTrayItem.currentReading = value;

    traySection.dataSheetSetting[trayIndex] = targetTrayItem;
    coppiedState[traySectionIdex] = traySection;

    setState(coppiedState);
  };

  // const onConsumptionsReadingChange = (e, conIndex) => {
  //   const { value } = e.target;
  //   const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

  //   // Change factor
  //   let coppiedState = _.cloneDeep(state);

  //   const consumptionIndex = coppiedState.findIndex(conSection => conSection.ddsSection === 'Consumptions');
  //   const consumptionSection = coppiedState[consumptionIndex];

  //   const targetConsumptionItem = consumptionSection.dataSheetSetting[conIndex];

  //   const fqRreading = regx.test(value) ? value : targetConsumptionItem.psCalculatedValue;

  //   targetConsumptionItem.psCalculatedValue = fqRreading;
  //   consumptionSection.dataSheetSetting[conIndex] = targetConsumptionItem;
  //   coppiedState[consumptionIndex] = consumptionSection;
  //   setState(coppiedState);
  // };

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

    const otherFeaturesIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'OtherFeatures');
    const otherFeaturesSection = coppiedState[otherFeaturesIndex];

    const feedTankIndex = otherFeaturesSection.dataSheetSetting.findIndex(item => item.displayName === 'Feed Tank');
    const feedTankObj = otherFeaturesSection.dataSheetSetting[feedTankIndex];

    feedTankObj.currentReading = JSON.stringify(newtankWithSymbol.map(item => ({ tank: item.tank, symbol: item.symbol })));

    otherFeaturesSection.dataSheetSetting[feedTankIndex] = feedTankObj;
    coppiedState[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
    setTankWithSymbol(newtankWithSymbol);
    setTank(null);
    setTanks(prev => prev.filter(t => t.tankName !== data.tank));
  };

  const onRemovedTankSymbol = idx => {
    const newtankWithSymbol = [...tankWithSymbol];
    const removedTank = newtankWithSymbol.splice(idx, 1)[0];

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'OtherFeatures');
    const otherFeaturesSection = coppiedState[otherFeaturesIndex];

    const feedTankIndex = otherFeaturesSection.dataSheetSetting.findIndex(item => item.displayName === 'Feed Tank');
    const feedTankObj = otherFeaturesSection.dataSheetSetting[feedTankIndex];

    feedTankObj.currentReading = JSON.stringify(newtankWithSymbol.map(item => ({ tank: item.tank, symbol: item.symbol })));

    otherFeaturesSection.dataSheetSetting[feedTankIndex] = feedTankObj;
    coppiedState[otherFeaturesIndex] = otherFeaturesSection;

    setState(coppiedState);
    setTankWithSymbol(newtankWithSymbol);
    setTanks(prev => [...prev, { ...removedTank }]);
  };

  const onTankLevelChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'OtherFeatures');
    const otherFeaturesSection = coppiedState[otherFeaturesIndex];

    const tankLevelIndex = otherFeaturesSection.dataSheetSetting.findIndex(item => item.displayName === 'Tank Level');
    const tankLevelObj = otherFeaturesSection.dataSheetSetting[tankLevelIndex];

    const reding = regx.test(value) ? value : tankLevelObj.currentReading;
    tankLevelObj.currentReading = reding;

    otherFeaturesSection.dataSheetSetting[tankLevelIndex] = tankLevelObj;
    coppiedState[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onRunningDaysChange = e => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;

    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'OtherFeatures');
    const otherFeaturesSection = coppiedState[otherFeaturesIndex];

    const runningDaysIndex = otherFeaturesSection.dataSheetSetting.findIndex(item => item.displayName === 'Running Days');
    const runningDaysObj = otherFeaturesSection.dataSheetSetting[runningDaysIndex];

    const reding = regx.test(value) ? value : runningDaysObj.currentReading;
    runningDaysObj.currentReading = reding;

    otherFeaturesSection.dataSheetSetting[runningDaysIndex] = runningDaysObj;
    coppiedState[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onTimeChange = time => {
    let coppiedState = _.cloneDeep(state);

    const otherFeaturesIndex = coppiedState.findIndex(cuSection => cuSection.ddsSection === 'OtherFeatures');
    const otherFeaturesSection = coppiedState[otherFeaturesIndex];

    const timeIndex = otherFeaturesSection.dataSheetSetting.findIndex(item => item.displayName === 'Time');
    const timeObj = otherFeaturesSection.dataSheetSetting[timeIndex];

    timeObj.currentReading = time24(time);

    otherFeaturesSection.dataSheetSetting[timeIndex] = timeObj;
    coppiedState[otherFeaturesIndex] = otherFeaturesSection;
    setState(coppiedState);
  };

  const onSubmit = async e => {
    setOpenBackdrop(true);
    await sleep(500);
    const postingDateTime = date;
    const data = _.cloneDeep(state);
    const payload = {
      date: serverDate(postingDateTime),
      time: '07:00:00',
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName,
      dailyDataSheetDetails: data
        .map(item => item.dataSheetSetting)
        .flat(1)
        .map(item => {
          const coppiedItem = Object.assign({}, item);
          coppiedItem.selfSettingId = item.id;
          delete coppiedItem.id;
          delete coppiedItem.key;
          delete coppiedItem.rowId;
          return coppiedItem;
        })
    };

    try {
      const res = await http.post(DAILY_DATA_SHEET.create, payload);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      }
    } catch (err) {
      const errText = err?.response?.data?.Message
        ? err?.response?.data?.Message
        : 'There was an error!!! Plese contact with admin';
      toastAlerts('error', errText);
    } finally {
      setOpenBackdrop(false);
    }
  };

  if (!isPageLoaded) {
    return <CustomPreloder />;
  }

  return (
    <PageContainer heading="Daily Data Sheet (Create Specific">
      <div>
        <Grid container spacing={3}>
          {/* Date */}
          <Grid item container xs={12} className="section" spacing={5}>
            <CustomDatePicker label="Select Date" value={date} onChange={onDateChange} clearable={false} />
          </Grid>
          {/* Date */}

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
                  {_.sortBy(state.find(cuSec => cuSec.ddsSection === 'Cumulitive').dataSheetSetting, ['sortOrder']).map(
                    (cu, index) => (
                      <tr key={cu.rowId}>
                        <td colSpan={cu.displayName === 'POWER INCOMER' ? 2 : 1}>{cu.displayName}</td>
                        {cu.displayName !== 'POWER INCOMER' && <td>{cu.tagName}</td>}
                        <td className="textBoxCenter">
                          <input
                            type="text"
                            value={cu.currentReading ? cu.currentReading : ''}
                            onChange={e => onFQReadingChange(e, index, cu.refSettingId, cu.refSettingSectionName)}
                          />
                        </td>
                        <td className="textBoxCenter">
                          <input
                            type="text"
                            value={cu.factor ? cu.factor : 0}
                            onChange={e => onFactorChange(e, index, cu.refSettingId, cu.refSettingSectionName)}
                          />
                        </td>
                      </tr>
                    )
                  )}
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
                  {_.sortBy(state.find(tuiSec => tuiSec.ddsSection === 'TUI').dataSheetSetting, ['sortOrder']).map(t => (
                    <tr key={t.rowId}>
                      <td>{t.displayName}</td>
                      <td className="textBoxCenter">
                        <input type="text" disabled={t.isAutoReading} value={t.currentReading ?? ''} onChange={() => {}} />
                      </td>
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
                  {_.sortBy(state.find(fiSec => fiSec.ddsSection === 'FI').dataSheetSetting, ['sortOrder']).map(fi => (
                    <tr key={fi.rowId}>
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
                  {_.sortBy(state.find(ficSec => ficSec.ddsSection === 'FIC').dataSheetSetting, ['sortOrder']).map(fic => (
                    <tr key={fic.rowId}>
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
                  {_.sortBy(state.find(ammoniaSec => ammoniaSec.ddsSection === 'Ammonia').dataSheetSetting, [
                    'sortOrder'
                  ]).map(am => (
                    <tr key={am.rowId}>
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
                  {_.sortBy(state.find(traySec => traySec.ddsSection === 'Tray').dataSheetSetting, ['sortOrder']).map(
                    (t, trayIdex) => (
                      <tr key={t.rowId}>
                        <td>{t.displayName}</td>
                        <td className="textBoxCenter">{t.signe}</td>
                        {t.isAutoReading ? (
                          <td className="textBoxCenter">{t.currentReading ?? ''}</td>
                        ) : (
                          <td className="textBoxCenter">
                            <input
                              type="text"
                              value={t.currentReading ?? ''}
                              onChange={e => onTrayReadingChange(e, trayIdex)}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  )}
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
                    {_.sortBy(state.find(psSec => psSec.ddsSection === 'ProductionSynopsys').dataSheetSetting, [
                      'sortOrder'
                    ]).map((ps, psIdx) => {
                      return (
                        <tr key={ps.rowId}>
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
                    {_.sortBy(state.find(consumtionsSec => consumtionsSec.ddsSection === 'Consumptions').dataSheetSetting, [
                      'sortOrder'
                    ]).map((con, conIdx) => (
                      <tr key={con.rowId}>
                        <td>{`${con.displayName} ${con.signe && getSign(con.signe)}`}</td>
                        <td className="textBoxCenter">{con.psCalculatedValue ? con.psCalculatedValue : ''}</td>
                        {/* {con.psFormula ? (
                        <td className="textBoxCenter">{con.psCalculatedValue ? con.psCalculatedValue : ''}</td>
                      ) : (
                        <td className="textBoxCenter">
                          <input
                            name="consumptions"
                            type="text"
                            value={con.psCalculatedValue ?? ''}
                            onChange={e => onConsumptionsReadingChange(e, conIdx)}
                          />
                        </td>
                      )} */}
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
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Rate').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Rate').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Rate').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Rate').signe
                        )}`}
                    </td>
                  </tr>

                  {/* Feed Temp */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Temp').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Temp').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Temp').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Temp').signe
                        )}`}
                    </td>
                  </tr>
                  {/* Furnace Outlet */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Furnace Outlet').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Furnace Outlet').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Furnace Outlet').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Furnace Outlet').signe
                        )}`}
                    </td>
                  </tr>
                  {/* Max. Skin Temp. */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Max. Skin Temp.').signe
                        )}`}
                    </td>
                  </tr>
                  {/* ΔT */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔT').displayName
                      }
                    </td>
                    <td>
                      {`${
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔT').currentReading
                      } ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔT').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔT').signe
                        )}`}
                    </td>
                  </tr>

                  {/* ΔP */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔP').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔP').currentReading ?? 0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔP').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'ΔP').signe
                        )}`}
                    </td>
                  </tr>

                  {/* Feed Viscosity */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Viscosity').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Viscosity').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Viscosity').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Viscosity').signe
                        )}`}
                    </td>
                  </tr>

                  {/* Residue Visco. */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Residue Visco.').displayName
                      }
                    </td>
                    <td>
                      {`${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Residue Visco.').currentReading ??
                        0} ${state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Residue Visco.').signe &&
                        getSign(
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Residue Visco.').signe
                        )}`}
                    </td>
                  </tr>

                  {/* Feed Tank */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Feed Tank').displayName
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
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Tank Level').displayName
                      }
                    </td>
                    <td>
                      <input
                        type="text"
                        name="tankLevel"
                        value={
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Tank Level').currentReading ?? ''
                        }
                        onChange={onTankLevelChange}
                      />
                      {state
                        .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                        .dataSheetSetting.find(ofItem => ofItem.displayName === 'Tank Level').signe && (
                        <span>
                          {getSign(
                            state
                              .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                              .dataSheetSetting.find(ofItem => ofItem.displayName === 'Tank Level').signe
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                  {/* Time */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Time').displayName
                      }
                    </td>
                    <td>
                      <CustomTimePicker
                        placeholder="select time"
                        value={
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Time').currentReading
                            ? `0001/01/01 ${
                                state
                                  .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                                  .dataSheetSetting.find(ofItem => ofItem.displayName === 'Time').currentReading
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
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Running Days').displayName
                      }
                    </td>
                    <td>
                      <input
                        type="text"
                        name="runningDays"
                        value={
                          state
                            .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                            .dataSheetSetting.find(ofItem => ofItem.displayName === 'Running Days').currentReading ?? ''
                        }
                        onChange={onRunningDaysChange}
                      />
                    </td>
                  </tr>

                  {/* Shift Incharge */}
                  <tr>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Shift Incharge').displayName
                      }
                    </td>
                    <td>
                      {
                        state
                          .find(otherFeaturesSec => otherFeaturesSec.ddsSection === 'OtherFeatures')
                          .dataSheetSetting.find(ofItem => ofItem.displayName === 'Shift Incharge').currentReading
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            {/* Other Features */}
          </Grid>
          {/* Production Synopsis, Consumptions and Other Features */}

          <Grid container justifyContent="flex-end">
            <SaveButton onClick={onSubmit} />
          </Grid>
        </Grid>
        <CustomBackDrop />
      </div>
    </PageContainer>
  );
};

export default DailyDataSheetCreateForm;

/** Change Log
 * 23-April:2022: posting time hard core: 07:00:00
 * 12-May-2022: calculation change for steam section
 **/

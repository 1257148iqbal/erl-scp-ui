/**
 * Title: Shift report create specific form add
 * Description:
 * Author: Nasir Ahmed
 * Date: 19-May-2022
 * Modified: 19-May-2022
 **/

import { Fab, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ArrowDownward, ArrowUpward, ImportExport } from '@mui/icons-material';
import { ReactComponent as IconUpDown } from 'assets/svg/arrow-down-up.svg';
import { ReactComponent as IconDown } from 'assets/svg/arrow-down.svg';
import { ReactComponent as IconUp } from 'assets/svg/arrow-up.svg';
import Axios from 'axios';
import clsx from 'clsx';
import LoadingContext from 'components/contextProvider/LoadingContextProvider/LoadingContext';
import {
  CancelButton,
  CustomAutoComplete,
  CustomDatePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, SHIFT_REPORT, SHIFT_REPORT_SETTINGS, TANK } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
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
import qs from 'querystring';
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import 'react-image-lightbox/style.css';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { http } from 'services/httpService';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, getSign, sleep } from 'utils/commonHelper';
import { getFloorTime, getTimeFromDate, serverDate } from 'utils/dateHelper';
import { useStyles } from '../Styles';

const data = [
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
];

const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const ShiftReportCreateForm = () => {
  //#region Hooks
  const classes = useStyles();
  const refFeedType = useRef();
  const refTank = useRef();
  const refStability = useRef();
  const refK6051A = useRef();
  const refK6051B = useRef();
  const refPlant = useRef();
  const history = useHistory();

  const context = useContext(LoadingContext);
  const { setOpenBackdrop, setLoading } = context;
  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);
  //#endregion

  //#region States
  const [statuses] = useState([
    { label: 'Run', value: 'run' },
    { label: 'Shut', value: 'shut' },
    { label: 'Decoking', value: 'decoking' }
  ]);
  const [status, setStatus] = useState({ label: 'Run', value: 'run' });
  const [date, setDate] = useState(new Date());
  const [labShifts, setLabShifts] = useState([]);
  const [labShift, setLabShift] = useState(null);

  const [remarks, setRemarks] = useState('');

  const [shift, setShift] = useState(null);

  //const [isPageLoaded, setIsPageLoaded] = React.useState(true);

  const [feedTypes, setFeedTypes] = useState([]);
  const [feedType, setFeedType] = useState(null);

  const [tanks, setTanks] = useState([]);
  const [tank, setTank] = useState(null);

  const [stabilities, setStabilities] = useState([]);
  const [stability, setStability] = useState(null);

  const [loads6051A, setLoads6051A] = useState([]);
  const [load6051A, setLoad6051A] = useState(null);

  const [load6051B, setLoad6051B] = useState(null);

  const [plants, setPlants] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [plant, setPlant] = useState(null);

  const [fuelTypes, setFuelTypes] = useState([]);
  const [fuelType, setFuyelType] = useState(null);

  const [symbol, setSymbol] = useState(null);

  const [tankSymbol, setTankSymbol] = useState([]);

  const [feed, setFeed] = useState([]);
  const [naptha, setNaptha] = useState([]);
  const [gasOil, setGasOil] = useState([]);
  const [residue, setResidue] = useState([]);
  const [box1, setBox1] = useState([]);
  const [box2, setBox2] = useState([]);
  const [box3, setBox3] = useState([]);
  const [box4, setBox4] = useState([]);
  const [box5, setBox5] = useState([]);
  const [box6, setBox6] = useState([]);
  const [box7, setBox7] = useState([]);
  const [box8, setBox8] = useState([]);
  const [box9, setBox9] = useState([]);
  const [box10, setBox10] = useState([]);
  const [box11, setBox11] = useState([]);
  const [file1, setFile1] = useState([]);
  //#endregion

  //#region UDF's

  //get Current Lab Shift
  const getShiftWithReading = async (shiftId, date) => {
    const queryParam = {
      date: serverDate(date),
      shiftId: shiftId
    };
    setOpenBackdrop(true);
    try {
      const res = await http.get(`${SHIFT_REPORT_SETTINGS.get_shift_report_with_reading}?${qs.stringify(queryParam)}`);
      const shifts = res.data.data.map(section => {
        section.shiftReportSettings.map(setting => {
          if (setting.useTagFactor) {
            if (setting.reading !== null && setting.reading !== '' && setting.reading !== '0' && setting.factor !== 0) {
              setting.reading = (setting.factor * setting.reading).toFixed(2);
            }
          }
          return setting;
        });
        return section;
      });
      setFeed(shifts.find(sec => sec.shiftSection === FEED).shiftReportSettings);
      setNaptha(shifts.find(sec => sec.shiftSection === NAPHTHA).shiftReportSettings);
      setGasOil(shifts.find(sec => sec.shiftSection === GAS_OIL).shiftReportSettings);
      setResidue(shifts.find(sec => sec.shiftSection === RESIDUE).shiftReportSettings);
      setBox1(shifts.find(sec => sec.shiftSection === Box_1).shiftReportSettings);
      setBox2(shifts.find(sec => sec.shiftSection === Box_2).shiftReportSettings);
      setBox3(shifts.find(sec => sec.shiftSection === Box_3).shiftReportSettings);
      setBox4(shifts.find(sec => sec.shiftSection === Box_4).shiftReportSettings);
      setBox5(shifts.find(sec => sec.shiftSection === Box_5).shiftReportSettings);
      setBox6(shifts.find(sec => sec.shiftSection === Box_6).shiftReportSettings);
      setBox7(shifts.find(sec => sec.shiftSection === Box_7).shiftReportSettings);
      setBox8(shifts.find(sec => sec.shiftSection === Box_8).shiftReportSettings);
      setBox9(shifts.find(sec => sec.shiftSection === Box_9).shiftReportSettings);
      setBox10(shifts.find(sec => sec.shiftSection === Box_10).shiftReportSettings);
      setBox11(shifts.find(sec => sec.shiftSection === Box_11).shiftReportSettings);
      setFile1(shifts.find(sec => sec.shiftSection === File_1).shiftReportSettings);
      setShift(res.data.data);
      //setIsPageLoaded(true);
    } catch (error) {
      toastAlerts('error', internalServerError);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const getAllDependencies = useCallback(() => {
    // const date = new Date('2022-05-14');
    Axios.all([
      http.get(SHIFT_REPORT_SETTINGS.get_all_feed_type),
      http.get(TANK.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_stability),
      http.get(SHIFT_REPORT_SETTINGS.get_all_load),
      http.get(SHIFT_REPORT_SETTINGS.get_all_h_plant),
      http.get(SHIFT_REPORT_SETTINGS.get_all_fuel_type),
      http.get(LAB_SHIFT.get_active)
    ]).then(
      Axios.spread((...responses) => {
        const feedTypeResponses = responses[0];
        const tankResponses = responses[1];
        const stabilityResponses = responses[2];
        const loadResponses = responses[3];
        const hPlantResponses = responses[4];
        const fuelTypesResponse = responses[5];
        const LabShiftResponse = responses[6];

        if (
          feedTypeResponses.data.succeeded &&
          tankResponses.data.succeeded &&
          stabilityResponses.data.succeeded &&
          loadResponses.data.succeeded &&
          hPlantResponses.data.succeeded &&
          fuelTypesResponse.data.succeeded &&
          LabShiftResponse.data.succeeded
        ) {
          const labshifts = fillDropDown(LabShiftResponse.data.data, 'shiftName', 'id');

          const feedTypeSection = feedTypeResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const tankSection = tankResponses.data.data.map(item => ({
            ...item,
            label: item.tankName,
            value: item.id
          }));

          const stabilitySection = stabilityResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const loadSection = loadResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const hPlantSection = hPlantResponses.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const fuelTypes = fuelTypesResponse.data.data.map(item => ({
            label: item,
            value: item
          }));

          setLabShifts(labshifts);
          setTanks(tankSection);
          setFeedTypes(feedTypeSection);
          setStabilities(stabilitySection);
          setLoads6051A(loadSection);
          setPlants(hPlantSection);
          setFuelTypes(fuelTypes);
        }
      })
    );
  }, []);

  const getBox10Data = shiftReportSettings => {
    // const shiftReportSettings2 = shift.find(item => item.shiftSection === Box_10);

    const feedPointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FEED' && item.calculationPoint === 'Point1'
    );

    const feedPointTwo = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FEED' && item.calculationPoint === 'Point2'
    );

    const feedPointThree = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FEED' && item.calculationPoint === 'Point3'
    );

    const flusOilPointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FLASH_OIL' && item.calculationPoint === 'Point1'
    );

    const flusOilPointTwo = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FLASH_OIL' && item.calculationPoint === 'Point2'
    );

    const flusOilPointThree = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'FLASH_OIL' && item.calculationPoint === 'Point3'
    );

    const feedM3 = +feedPointOne.reading;
    const feedMT = (feedM3 * Math.sqrt((+feedPointTwo.reading - (+feedPointThree.reading - 15) * 0.0007) * 0.915)).toFixed(
      4
    );

    const flusM3 = +flusOilPointOne.reading;
    const flusMT = (
      flusM3 *
      0.25 *
      Math.sqrt((+flusOilPointTwo.reading - (+flusOilPointThree.reading - 15) * 0.0007) * 0.85)
    ).toFixed(4);

    const totalMT = +feedMT + +flusMT;

    const feedPercent = isNaN((+feedMT * 100) / totalMT) ? 0 : ((+feedMT * 100) / totalMT).toFixed(2);
    const flusPercent = isNaN((+flusMT * 100) / totalMT) ? 0 : ((+flusMT * 100) / totalMT).toFixed(2);
    return {
      FEED: {
        name: 'FEED',
        m3: feedM3,
        mt: feedMT,
        percent: feedPercent
      },
      FLASH_OIL: {
        name: 'FLASH_OIL',
        m3: flusM3,
        mt: flusMT,
        percent: flusPercent
      }
    };
  };

  const getBox11Data = shiftReportSettings => {
    const gasPointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'GAS' && item.calculationPoint === 'Point1'
    );
    const napthaPointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'NAPHTHA' && item.calculationPoint === 'Point1'
    );
    const napthaPointTwo = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'NAPHTHA' && item.calculationPoint === 'Point2'
    );
    const napthaPointThree = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'NAPHTHA' && item.calculationPoint === 'Point3'
    );
    const gasOilPointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'GAS_OIL' && item.calculationPoint === 'Point1'
    );
    const gasOilPointTwo = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'GAS_OIL' && item.calculationPoint === 'Point2'
    );
    const gasOilPointThree = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'GAS_OIL' && item.calculationPoint === 'Point3'
    );
    const residuePointOne = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'RESIDUE' && item.calculationPoint === 'Point1'
    );
    const residuePointTwo = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'RESIDUE' && item.calculationPoint === 'Point2'
    );
    const residuePointThree = shiftReportSettings.shiftReportSettings.find(
      item => item.calculationType === 'RESIDUE' && item.calculationPoint === 'Point3'
    );

    const gasM3 = gasPointOne.reading ? +gasPointOne.reading : 0;

    //#region naptha
    const napthaM3 = napthaPointOne.reading ? +napthaPointOne.reading : 0;
    const napthaPointTwoReading = napthaPointTwo.reading ? +napthaPointTwo.reading : 0;
    const napthaPointThreeReading = napthaPointThree.reading ? +napthaPointThree.reading : 0;

    const napthaMT = isNaN(
      napthaM3 * 0.025 * Math.sqrt((napthaPointTwoReading - (napthaPointThreeReading - 15) * 0.0007) * 0.703)
    )
      ? 0
      : (napthaM3 * 0.025 * Math.sqrt((napthaPointTwoReading - (napthaPointThreeReading - 15) * 0.0007) * 0.703)).toFixed(4);
    //#endregion

    //#region gas oil
    const gasOilM3 = gasOilPointOne.reading ? +gasOilPointOne.reading : 0;
    const gasOilPointTwoReading = gasOilPointTwo.reading ? +gasOilPointTwo.reading : 0;
    const gasOilPointThreeReading = gasOilPointThree.reading ? +gasOilPointThree.reading : 0;

    const gasOilMT = isNaN(
      gasOilM3 * 0.25 * Math.sqrt((gasOilPointTwoReading - (gasOilPointThreeReading - 15) * 0.0007) * 0.85)
    )
      ? 0
      : (gasOilM3 * 0.25 * Math.sqrt((gasOilPointTwoReading - (gasOilPointThreeReading - 15) * 0.0007) * 0.85)).toFixed(4);
    //#endregion

    //#region residue
    const residueM3 = residuePointOne.reading ? Number(residuePointOne.reading) : 0;
    const residuePointTwoReading = residuePointTwo.reading ? +residuePointTwo.reading : 0;
    const residuePointThreeReading = residuePointThree.reading ? +residuePointThree.reading : 0;
    const residueMT = isNaN(
      residueM3 * 0.7 * Math.sqrt((residuePointTwoReading - (residuePointThreeReading - 15) * 0.0007) * 0.94)
    )
      ? 0
      : (residueM3 * 0.7 * Math.sqrt((residuePointTwoReading - (residuePointThreeReading - 15) * 0.0007) * 0.94)).toFixed(4);
    //#endregion

    //#region  percentage
    const totalMT = +napthaMT + +gasOilMT + +residueMT;
    const napthaPercent = isNaN((napthaMT * 100) / totalMT) ? 0 : ((napthaMT * 100) / totalMT).toFixed(2);
    const gasOilPercent = isNaN((gasOilMT * 100) / totalMT) ? 0 : ((gasOilMT * 100) / totalMT).toFixed(2);
    const residuePercent = isNaN((residueMT * 100) / totalMT) ? 0 : ((residueMT * 100) / totalMT).toFixed(2);
    //#endregion
    return {
      GAS: {
        name: 'GAS',
        m3: gasM3,
        mt: '',
        percent: ''
      },
      NAPHTHA: {
        name: 'NAPHTHA',
        m3: napthaM3,
        mt: napthaMT,
        percent: napthaPercent
      },
      GAS_OIL: {
        name: 'GAS_OIL',
        m3: gasOilM3,
        mt: gasOilMT,
        percent: gasOilPercent
      },
      RESIDUE: {
        name: 'RESIDUE',
        m3: residueM3,
        mt: residueMT,
        percent: residuePercent
      }
    };
  };

  const getMaxTag = useMemo(() => {
    const filteredTag = file1.filter(
      item => item.name === 'T-10' || item.name === 'T-11' || item.name === 'T-12' || item.name === 'T-13'
    );
    const readings = filteredTag.map(item => item.reading);
    const maxReading = Math.max(...readings);
    const maxReadingObj = filteredTag.find(item => item.reading === maxReading.toString());
    return maxReadingObj ? maxReadingObj : { name: 'no-matched-tag' };
  }, [file1]);

  //#endregion

  //#region Effects
  useEffect(() => {
    getAllDependencies();
  }, [getAllDependencies]);

  //#endregion

  //#region Events
  const onStatusChange = (e, newValue) => {
    if (newValue) {
      setStatus(newValue);
    }
  };
  const onDateChange = date => {
    setDate(date);
    setLabShift(null);
  };
  const onLabShiftChange = (e, newValue, callback) => {
    if (newValue) {
      setLabShift(newValue);
      callback(newValue.id, date);
    } else {
      setLabShift(null);
    }
  };
  const onFeedTypeChange = (e, newValue) => {
    const updatedShift = [...shift];
    const feedObj = updatedShift.find(feed => feed.shiftSection === FEED);
    const typeObj = feedObj.shiftReportSettings.find(item => item.name === 'TYPE');
    const feedObjIndex = updatedShift.findIndex(item => item.shiftSection === FEED);
    if (newValue) {
      setFeedType(newValue);
      typeObj.reading = newValue.value;
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    } else {
      setFeedType(null);
      typeObj.reading = '';
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    }
  };
  const onTankNameChange = (e, newValue) => {
    const updatedShift = [...shift];
    const feedObj = updatedShift.find(feed => feed.shiftSection === FEED);
    const tankObj = feedObj.shiftReportSettings.find(item => item.name === 'TANK');
    const feedObjIndex = updatedShift.findIndex(item => item.shiftSection === FEED);
    if (newValue) {
      setTank(newValue);
      tankObj.reading = newValue.value;
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    } else {
      setTank(null);
      tankObj.reading = '';
      updatedShift[feedObjIndex] = feedObj;
      setShift(updatedShift);
    }
  };
  const onTankSymbolChange = e => {
    setSymbol(e);
  };
  const onStabilityChange = (e, newValue) => {
    const updatedShift = [...shift];
    const residueObj = updatedShift.find(feed => feed.shiftSection === RESIDUE);
    const stabilityObj = residueObj.shiftReportSettings.find(item => item.name === 'STABILITY');
    const residueObjIndex = updatedShift.findIndex(item => item.shiftSection === RESIDUE);
    if (newValue) {
      setStability(newValue);
      stabilityObj.reading = newValue.value;
      updatedShift[residueObjIndex] = residueObj;
      setShift(updatedShift);
    } else {
      setStability(null);
      stabilityObj.reading = '';
      updatedShift[residueObjIndex] = residueObj;
      setShift(updatedShift);
    }
  };
  const onK6051AChange = (e, newValue) => {
    const updatedShift = [...shift];
    const boxNineObj = updatedShift.find(feed => feed.shiftSection === Box_9);
    const k6051AObj = boxNineObj.shiftReportSettings.find(item => item.name === 'K-6051 A');
    const boxNineObjIndex = updatedShift.findIndex(item => item.shiftSection === Box_9);
    if (newValue) {
      setLoad6051A(newValue);
      k6051AObj.reading = newValue.label;
      updatedShift[boxNineObjIndex] = boxNineObj;
      setShift(updatedShift);
    } else {
      setLoad6051A(null);
      k6051AObj.reading = '';
      updatedShift[boxNineObjIndex] = boxNineObj;
      setShift(updatedShift);
    }
  };
  const onK6051BChange = (e, newValue) => {
    const updatedShift = [...shift];
    const boxNineObj = updatedShift.find(feed => feed.shiftSection === Box_9);
    const k6051BObj = boxNineObj.shiftReportSettings.find(item => item.name === 'K-6051 B');
    const boxNineObjIndex = updatedShift.findIndex(item => item.shiftSection === Box_9);
    if (newValue) {
      setLoad6051B(newValue);
      k6051BObj.reading = newValue.label;
      updatedShift[boxNineObjIndex] = boxNineObj;
      setShift(updatedShift);
    } else {
      setLoad6051B(null);
      k6051BObj.reading = '';
      updatedShift[boxNineObjIndex] = boxNineObj;
      setShift(updatedShift);
    }
  };
  const onPlantChange = (e, newValue) => {
    if (newValue) {
      setPlant(newValue);
    } else {
      setPlant(null);
    }
  };
  const onFuelTypeChange = (e, newValue) => {
    const updatedShift = [...shift];
    const fileOneObj = updatedShift.find(feed => feed.shiftSection === File_1);
    const fuelTypeObj = fileOneObj.shiftReportSettings.find(item => item.name === 'FUEL TYPE');
    const fileOneObjIndex = updatedShift.findIndex(item => item.shiftSection === File_1);

    if (newValue) {
      setFuyelType(newValue);
      fuelTypeObj.reading = newValue.label;
      updatedShift[fileOneObjIndex] = fileOneObj;
      setShift(updatedShift);
    } else {
      setFuyelType(null);
      fuelTypeObj.reading = '';
      updatedShift[fileOneObjIndex] = fileOneObj;
      setShift(updatedShift);
    }
  };
  const onAddTankWithSymble = () => {
    const data = { tank: tank.label, symbol: symbol.value };
    const oldTankSymbol = [...tankSymbol, data];
    const tankArray = oldTankSymbol.map(item => item.tank);

    let map = {};
    let isTank = false;
    for (let i = 0; i < tankArray.length; i++) {
      if (map[tankArray[i]]) {
        isTank = true;
      }
      map[tankArray[i]] = true;
    }
    if (!isTank) {
      setTankSymbol(oldTankSymbol);
      setTank(null);
      setSymbol(null);
    } else {
      toastAlerts('warning', `Already ${data.tank} no Tank added!!`);
    }
  };
  const onRemovedTankSymbol = idx => {
    const updatedTank = [...tankSymbol];
    updatedTank.splice(idx, 1);
    setTankSymbol(updatedTank);
  };
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    await sleep(500);

    const postingDateTime = date;
    const shiftEndTime = getTimeFromDate(new Date(`0000-01-01 ${labShift.toTime}`));
    // const entryTime = getTimeBefore(shiftEndTime, 60);
    const floorTime = getFloorTime(shiftEndTime);
    const feedSection = shift
      .find(feed => feed.shiftSection === FEED)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.reading = item.name === 'TANK' ? JSON.stringify(tankSymbol) : item.reading;
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const napthaSection = shift
      .find(naptha => naptha.shiftSection === NAPHTHA)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const gasOilSection = shift
      .find(gasoil => gasoil.shiftSection === GAS_OIL)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const residueSection = shift
      .find(residue => residue.shiftSection === RESIDUE)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxOneSection = shift
      .find(boxone => boxone.shiftSection === Box_1)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxTwoSection = shift
      .find(boxtwo => boxtwo.shiftSection === Box_2)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxThreeSection = shift
      .find(boxthree => boxthree.shiftSection === Box_3)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxFourSection = shift
      .find(boxfour => boxfour.shiftSection === Box_4)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxFiveSection = shift
      .find(boxfive => boxfive.shiftSection === Box_5)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxSixSection = shift
      .find(boxsix => boxsix.shiftSection === Box_6)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxSevenSection = shift
      .find(boxseven => boxseven.shiftSection === Box_7)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxEigthSection = shift
      .find(boxeight => boxeight.shiftSection === Box_8)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const boxNineSection = shift
      .find(boxnine => boxnine.shiftSection === Box_9)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const { FEED: box10feed, FLASH_OIL: box10flashOil } = getBox10Data(shift.find(item => item.shiftSection === Box_10));
    const boxTenSection = shift
      .find(boxten => boxten.shiftSection === Box_10)
      .shiftReportSettings.filter(p => p.calculationPoint === 'Point1')
      .map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.reading = item.calculationType === 'FEED' ? box10feed.m3 : box10flashOil.m3;
        copiedItem.production = item.calculationType === 'FEED' ? box10feed.mt : box10flashOil.mt;
        copiedItem.percent = item.calculationType === 'FEED' ? box10feed.percent : box10flashOil.percent;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const { NAPHTHA: box11naptha, GAS_OIL: box11gasOil, RESIDUE: box11residue } = getBox11Data(
      shift.find(item => item.shiftSection === Box_11)
    );
    const boxElevenSection = shift
      .find(boxeleven => boxeleven.shiftSection === Box_11)
      .shiftReportSettings.filter(p => p.calculationPoint === 'Point1')
      .map(item => {
        let mt, percent;
        switch (item.calculationType) {
          case 'GAS': {
            mt = 0;
            percent = 0;
            break;
          }

          case 'NAPHTHA': {
            mt = box11naptha.mt;
            percent = box11naptha.percent;
            break;
          }
          case 'GAS_OIL': {
            mt = box11gasOil.mt;
            percent = box11gasOil.percent;
            break;
          }
          case 'RESIDUE': {
            mt = box11residue.mt;
            percent = box11residue.percent;
            break;
          }

          default:
            break;
        }
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = mt;
        copiedItem.percent = percent;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const fielOneSection = shift
      .find(file => file.shiftSection === File_1)
      .shiftReportSettings.map(item => {
        const copiedItem = Object.assign({}, item);
        copiedItem.shiftReportSettingId = item.id;
        copiedItem.symbol = '';
        copiedItem.production = 0;
        copiedItem.percent = 0;
        delete copiedItem.id;
        delete copiedItem.key;
        return copiedItem;
      });

    const data = {
      status: status.value,
      date: serverDate(postingDateTime),
      time: floorTime,
      shiftId: labShift.id,
      remark: remarks,
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName,
      shiftReportDetails: [
        ...feedSection,
        ...napthaSection,
        ...gasOilSection,
        ...residueSection,
        ...boxOneSection,
        ...boxTwoSection,
        ...boxThreeSection,
        ...boxFourSection,
        ...boxFiveSection,
        ...boxSixSection,
        ...boxSevenSection,
        ...boxEigthSection,
        ...boxNineSection,
        ...boxTenSection,
        ...boxElevenSection,
        ...fielOneSection
      ]
    };

    try {
      const res = await http.post(SHIFT_REPORT.create, data);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      } else {
        toastAlerts('error', internalServerError);
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        toastAlerts('error', err?.response?.data?.Message);
      } else {
        toastAlerts('error', err.message);
      }
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
    }
  };
  //#endregion

  return (
    <PageContainer heading="Shift Report (Create Specific)">
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <CustomDatePicker label="Select Date" value={date} onChange={onDateChange} clearable={false} />
            </Grid>
            <Grid item xs={4}>
              <CustomAutoComplete
                disabled={!date}
                name="labShiftId"
                data={labShifts}
                label="Select Shift"
                value={labShift}
                onChange={(e, newValue) => onLabShiftChange(e, newValue, getShiftWithReading)}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomAutoComplete label="Status" data={statuses} value={status} onChange={onStatusChange} />
            </Grid>
          </Grid>
          {labShift && shift ? (
            <Fragment>
              <Grid container spacing={5} style={{ boxSizing: 'border-box' }}>
                <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <h3 align="center">FEED</h3>
                    <Table stickyHeader size="small">
                      <TableBody>
                        {feed.map(item => {
                          const _item = item;
                          let tablecell;

                          if (_item.getAutoReading) {
                            tablecell = (
                              <TableCell>{` :  ${item.reading ?? 0} ${
                                item.unitName ? getSign(item.unitName) : ''
                              }`}</TableCell>
                            );
                          } else if (item.name === 'TYPE') {
                            tablecell = (
                              <TableCell>
                                <CustomAutoComplete
                                  ref={refFeedType}
                                  data={feedTypes}
                                  label="Type"
                                  value={feedType}
                                  onChange={onFeedTypeChange}
                                />
                              </TableCell>
                            );
                          } else if (item.name === 'TANK') {
                            tablecell = (
                              <Fragment>
                                <TableCell>
                                  <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8 }}>
                                    <CustomAutoComplete
                                      ref={refTank}
                                      data={tanks}
                                      label="Tanks"
                                      value={tank}
                                      onChange={onTankNameChange}
                                    />

                                    <Select
                                      className={classes.symbol}
                                      placeholder="Symbol"
                                      value={symbol}
                                      options={data}
                                      onChange={onTankSymbolChange}
                                      getOptionLabel={e => (
                                        <div style={{ display: 'flex', alignItems: 'center', color: e.color }}>{e.icon}</div>
                                      )}
                                    />
                                    <Fab
                                      size="small"
                                      onClick={onAddTankWithSymble}
                                      className={classes.btnParent}
                                      disabled={!symbol || !tank}>
                                      <Add className={classes.btnChild} />
                                    </Fab>
                                  </div>

                                  {tankSymbol?.map((item, idx) => (
                                    <div
                                      style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        marginRight: 10,
                                        borderRadius: 5,
                                        padding: '3px 7px',
                                        border: '1px solid black'
                                      }}
                                      key={idx + 1}>
                                      <div>
                                        <span>{item.tank}</span>
                                        <span>{icons[item.symbol]}</span>
                                      </div>
                                      <span className={classes.tankIcon} onClick={() => onRemovedTankSymbol(idx)}>
                                        x
                                      </span>
                                    </div>
                                  ))}
                                </TableCell>
                              </Fragment>
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

                <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <h3 style={{ textAlign: 'center' }}>NAPHTHA</h3>
                    <Table stickyHeader size="small">
                      <TableBody>
                        {naptha.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{`${item.name}`}</TableCell>
                            <TableCell>{` :  ${item.reading ?? 0} ${
                              item.unitName ? getSign(item.unitName) : ''
                            }`}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <h3 style={{ textAlign: 'center' }}>GAS OIL</h3>
                    <Table stickyHeader size="small">
                      <TableBody>
                        {gasOil.map(item => {
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

                <Grid item xs={6} sm={6} md={3} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <h3 style={{ textAlign: 'center' }}>RESIDUE</h3>
                    <Table stickyHeader size="small">
                      <TableBody>
                        {residue.map(item => {
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
                                  ref={refStability}
                                  data={stabilities}
                                  label="Stability"
                                  value={stability}
                                  onChange={onStabilityChange}
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
              <Grid container className={classes.imageContainer}>
                <Grid item xs={12}>
                  <div className={classes.images}>
                    <img className={classes.image01} src="/images/ShiftImage01.jpg" alt="Shift-report File-01" />
                    {file1.map((item, index) => {
                      return (
                        <div key={item.id}>
                          <span className={clsx(classes.imagesReading, classes.fileOneti04Left)}>
                            {item.name === 'TI-04' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOneti04Right)}>
                            {item.name === 'TI-04' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnefic01)}>
                            {item.name === 'FIC-01' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnefic02)}>
                            {item.name === 'FIC-02' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepi02)}>
                            {item.name === 'PI-02' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepi03)}>
                            {item.name === 'PI-03' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet05)}>
                            {item.name === 'T-05' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet06)}>
                            {item.name === 'T-06' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepi06)}>
                            {item.name === 'PI-06' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepi07)}>
                            {item.name === 'PI-07' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet07)}>
                            {item.name === 'T-07' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet08)}>
                            {item.name === 'T-08' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet09)}>
                            {item.name === 'T-09' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepic19)}>
                            {item.name === 'PIC-19' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOneo2)}>
                            {item.name === '%O2' ? item.reading ?? 0 : ''}
                          </span>
                          <span
                            className={clsx(
                              classes.imagesReading,
                              classes.fileOnet10,
                              item.reading && item.name === getMaxTag.name && classes.textRedColor
                            )}>
                            {item.name === 'T-10' ? item.reading ?? 0 : ''}
                          </span>
                          <span
                            className={clsx(
                              classes.imagesReading,
                              classes.fileOnet11,
                              item.reading && item.name === getMaxTag.name && classes.textRedColor
                            )}>
                            {item.name === 'T-11' ? item.reading ?? 0 : ''}
                          </span>
                          <span
                            className={clsx(
                              classes.imagesReading,
                              classes.fileOnet12,
                              item.reading && item.name === getMaxTag.name && classes.textRedColor
                            )}>
                            {item.name === 'T-12' ? item.reading ?? 0 : ''}
                          </span>
                          <span
                            className={clsx(
                              classes.imagesReading,
                              classes.fileOnet13,
                              item.reading && item.name === getMaxTag.name && classes.textRedColor
                            )}>
                            {item.name === 'T-13' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet14)}>
                            {item.name === 'T-14' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet15)}>
                            {item.name === 'T-15' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet64)}>
                            {item.name === 'T-64' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnet65)}>
                            {item.name === 'T-65' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOneft37)}>
                            {item.name === 'FT-37' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnestrokePass1)}>
                            {item.name === '%STROKE_PASS-1' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnestrokePass2)}>
                            {item.name === '%STROKE_PASS-2' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnehic03)}>
                            {item.name === 'HIC-03' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnehic23)}>
                            {item.name === 'HIC-23' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnepi52)}>
                            {item.name === 'PI-52' ? item.reading ?? 0 : ''}
                          </span>
                          <span className={clsx(classes.imagesReading, classes.fileOnefuelType)}>
                            <CustomAutoComplete data={fuelTypes} value={fuelType} onChange={onFuelTypeChange} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <h2>COLUMN DA-3001/DA-3002/DA-3004</h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box1.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box1.map((item, index) => {
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

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box2.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 95 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box2.map(item => {
                            return (
                              <TableCell key={item.id} align="center" style={{ minWidth: 95 }}>
                                {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box3.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box3.map(item => {
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

                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box4.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box4.map(item => {
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

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box5.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 120 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box5.map(item => {
                            return (
                              <TableCell key={item.id} align="center" style={{ minWidth: 120 }}>
                                {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box6.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 90 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box6.map(item => {
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

                <Grid item xs={12}>
                  <h2>COLUMN DA-3003</h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box7.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 100 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box7.map(item => {
                            return (
                              <TableCell key={item.id} align="center" style={{ minWidth: 100 }}>
                                {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box8.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 100 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box8.map(item => {
                            return (
                              <TableCell key={item.id} align="center" style={{ minWidth: 100 }}>
                                {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {box9.map(item => (
                            <StyledTableHeadCell key={item.id} align="center" style={{ minWidth: 105, maxWidth: 130 }}>
                              {item.name}
                            </StyledTableHeadCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          {box9.map(item => {
                            let tableCell;
                            if (item.getAutoReading) {
                              tableCell = (
                                <TableCell key={item.id} align="center" style={{ minWidth: 100, maxWidth: 130 }}>
                                  {`${item.reading ?? ''} ${item.unitName ? getSign(item.unitName) : ''}`}
                                </TableCell>
                              );
                            } else if (item.name === 'K-6051 A') {
                              tableCell = (
                                <TableCell key={item.id} align="center" style={{ minWidth: 100, maxWidth: 130 }}>
                                  <CustomAutoComplete
                                    ref={refK6051A}
                                    data={loads6051A}
                                    value={load6051A}
                                    onChange={onK6051AChange}
                                  />
                                </TableCell>
                              );
                            } else {
                              tableCell = (
                                <TableCell key={item.id} align="center" style={{ minWidth: 100, maxWidth: 130 }}>
                                  <CustomAutoComplete
                                    ref={refK6051B}
                                    data={loads6051A}
                                    value={load6051B}
                                    onChange={onK6051BChange}
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
                <Grid item xs={12}>
                  <h2>MATERIAL BALANCE (ONE HR. BASIS):</h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeadCell align="center" style={{ minWidth: 110 }}></StyledTableHeadCell>
                          <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">%</StyledTableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {box10
                          .filter(b => b.calculationPoint === 'Point1')
                          .map((x, i) => {
                            return (
                              <TableRow key={x.id}>
                                <TableCell align="center" style={{ minWidth: 120 }}>
                                  {x.name}
                                </TableCell>

                                <TableCell align="center">
                                  {getBox10Data(shift.find(item => item.shiftSection === Box_10))[x.calculationType]['m3']}
                                </TableCell>
                                <TableCell align="center">
                                  {getBox10Data(shift.find(item => item.shiftSection === Box_10))[x.calculationType]['mt']}
                                </TableCell>
                                <TableCell align="center">
                                  {
                                    getBox10Data(shift.find(item => item.shiftSection === Box_10))[x.calculationType][
                                      'percent'
                                    ]
                                  }
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeadCell align="center" style={{ minWidth: 110 }}>
                            PRODUCTION
                          </StyledTableHeadCell>
                          <StyledTableHeadCell align="center">{'M\u00b3'}</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">MT</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">% YIELD</StyledTableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {box11
                          .filter(b => b.calculationPoint === 'Point1')
                          .map((x, i) => {
                            return (
                              <TableRow key={x.id}>
                                <TableCell align="center" style={{ minWidth: 120 }}>
                                  {x.name}
                                </TableCell>
                                <TableCell align="center">
                                  {getBox11Data(shift.find(item => item.shiftSection === Box_11))[x.calculationType]['m3']}
                                </TableCell>
                                <TableCell align="center">
                                  {getBox11Data(shift.find(item => item.shiftSection === Box_11))[x.calculationType]['mt']}
                                </TableCell>
                                <TableCell align="center">
                                  {
                                    getBox11Data(shift.find(item => item.shiftSection === Box_11))[x.calculationType][
                                      'percent'
                                    ]
                                  }
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid container item xs={12} justifyContent="flex-start" alignItems="center">
                  <Grid item xs={4} sm={4} md={2} lg={2}>
                    <h2>HYDROGEN PLANT : </h2>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                    <CustomAutoComplete
                      ref={refPlant}
                      data={plants}
                      defaultValue={plants[1]}
                      // value={plant}
                      disabled
                      onChange={onPlantChange}
                    />
                  </Grid>
                  <Grid item xs={3} sm={3} md={2} lg={2}>
                    <h2 style={{ marginLeft: 10 }}>CAPACITY : %</h2>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeadCell align="center">Reformer</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">IN. TR-12</StyledTableHeadCell>
                          <StyledTableHeadCell align="center">OUT TR-16</StyledTableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow></TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                        <TableRow></TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                          <TableCell>kg/H</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                          <TableCell>KG/H</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                          <TableCell>KG/H</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={3} style={{ display: 'table', width: '100%' }}>
                  <TableContainer component={Paper} style={{ display: 'table-cell' }}>
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
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 15 }}>
                <TextInput
                  multiline
                  className={classes.txtInput}
                  label="Remarks"
                  name="remarks"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </Grid>
              <Grid container justifyContent="flex-end">
                <SaveButton onClick={onSubmit} />
                <ResetButton onClick={() => {}} />
                <CancelButton
                  onClick={() => {
                    history.goBack();
                  }}
                />
              </Grid>
            </Fragment>
          ) : (
            <h3>Please select your dependency</h3>
          )}
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default ShiftReportCreateForm;

/**
 * 23-Dec-2021 (Nasir) : Box 10 modify, hard core jsx to dynamic jsx based on 'Point1'
 * 17-April-2022 (Nasir) : floor time add on post, value calculation with factor
 **/

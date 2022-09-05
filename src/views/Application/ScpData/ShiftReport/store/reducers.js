import { ReactComponent as IconUpDown } from 'assets/svg/arrow-down-up.svg';
import { ReactComponent as IconDown } from 'assets/svg/arrow-down.svg';
import { ReactComponent as IconUp } from 'assets/svg/arrow-up.svg';
import { Box_9, FEED, File_1, RESIDUE } from 'constants/ShiftReportSectionName';
import _ from 'lodash';
import React from 'react';
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
} from './actionTypes';

export const initialState = {
  data: null,
  isPageLoaded: false,

  statuses: [
    { label: 'Run', value: 'Run' },
    { label: 'Shut', value: 'Shut' },
    { label: 'Decoking', value: 'Decoking' }
  ],
  status: null,

  feedTypes: [],
  feedType: null,

  tanks: [],
  selectedTank: null,

  symbols: [
    {
      value: 'Up',
      label: 'Up',
      icon: <IconUp />,
      color: 'green',
      bgColor: 'rgba(127, 191, 127,0.7)'
    },
    {
      value: 'Down',
      label: 'Down',
      icon: <IconDown />,
      color: 'red',
      bgColor: 'rgba(255, 0, 0, 0.4)'
    },
    {
      value: 'Running',
      label: 'Running',
      icon: <IconUpDown />,
      color: 'blue',
      bgColor: 'rgba(95, 95, 255, 0.5)'
    }
  ],
  selectedSymbol: null,

  selectedTankSymbol: [],

  stabilities: [],
  stability: null,

  fuelTypes: [],
  fuelType: null,

  loads: [],
  selectedK6051A: null,
  selectedK6051B: null,
  error: '',
  remark: ''
};

export const shiftReportEditReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_SHIFT_REPORT_SUCCESS: {
      const { feedTypes, tanks, stabilities, loads, fuelTypes, shiftReportDetails } = payload;

      const selectedStatus = shiftReportDetails.status
        ? state.statuses.find(st => st.value === shiftReportDetails.status)
        : null;

      const feedTypeDDL = feedTypes.map(item => ({
        label: _.startCase(item),
        value: item
      }));

      const selectedFeedType = feedTypeDDL.find(
        item =>
          item.value ===
          shiftReportDetails.shiftReportDetails.find(item => item.shiftSection === 'FEED' && item.name === 'TYPE').reading
      );

      const selectedTankSymbol = JSON.parse(
        shiftReportDetails.shiftReportDetails.find(s => s.shiftSection === 'FEED' && s.name === 'TANK').reading
      );

      const tanksDDL = tanks
        .filter(t => !selectedTankSymbol.some(sts => sts.tank === t.tankNumber))
        .map(item => ({
          label: item.tankName,
          value: item.id
        }));

      const stabilitiesDDL = stabilities.map(item => ({
        label: _.startCase(item),
        value: item
      }));

      const selectedStability = stabilitiesDDL.find(
        item =>
          item.value ===
          shiftReportDetails.shiftReportDetails.find(item => item.shiftSection === RESIDUE && item.name === 'STABILITY')
            .reading
      );

      const fuelTypesDDL = fuelTypes.map(item => ({
        label: item,
        value: item
      }));

      const selectedSFuelType = fuelTypesDDL.find(
        item =>
          item.value ===
          shiftReportDetails.shiftReportDetails.find(item => item.shiftSection === File_1 && item.name === 'FUEL TYPE')
            .reading
      );

      const loadsDDL = loads.map(item => ({
        label: _.startCase(item),
        value: item
      }));

      const selectedK6051A = loadsDDL.find(
        item =>
          item.value ===
          shiftReportDetails.shiftReportDetails.find(item => item.shiftSection === Box_9 && item.name === 'K-6051 A').reading
      );
      const selectedK6051B = loadsDDL.find(
        item =>
          item.value ===
          shiftReportDetails.shiftReportDetails.find(item => item.shiftSection === Box_9 && item.name === 'K-6051 B').reading
      );

      return {
        ...state,
        isPageLoaded: true,
        statuses: state.statuses,
        status: selectedStatus,
        data: shiftReportDetails,
        feedTypes: feedTypeDDL,
        feedType: selectedFeedType,
        tanks: tanksDDL,
        selectedTankSymbol,
        stabilities: stabilitiesDDL,
        stability: selectedStability,
        fuelTypes: fuelTypesDDL,
        fuelType: selectedSFuelType,
        loads: loadsDDL,
        selectedK6051A,
        selectedK6051B
      };
    }

    case CHANGE_STATUS: {
      return {
        ...state,
        status: payload,
        data: {
          ...state.data,
          status: payload.value
        }
      };
    }

    case CHANGE_FEED_TYPE: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const feedTypeObj = _shiftReportDetails.find(item => item.shiftSection === FEED && item.name === 'TYPE');
      const feedTypeObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === FEED && item.name === 'TYPE');
      feedTypeObj.reading = payload ? payload.value : '';
      _shiftReportDetails[feedTypeObjIndex] = feedTypeObj;

      return {
        ...state,
        feedType: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case CHANGE_TANK: {
      return {
        ...state,
        selectedTank: payload
      };
    }

    case CHANGE_SYMBOL: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const feedTankObj = _shiftReportDetails.find(item => item.shiftSection === FEED && item.name === 'TANK');
      const feedTankObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === FEED && item.name === 'TANK');
      feedTankObj.symbol = payload ? payload.value : '';
      _shiftReportDetails[feedTankObjIndex] = feedTankObj;

      return {
        ...state,
        selectedSymbol: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case ADD_TANK_SYMBOL: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const feedTankObj = _shiftReportDetails.find(item => item.shiftSection === FEED && item.name === 'TANK');
      const feedTankObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === FEED && item.name === 'TANK');
      feedTankObj.reading = JSON.stringify([...state.selectedTankSymbol, { ...payload }]);
      _shiftReportDetails[feedTankObjIndex] = feedTankObj;
      const filteredTank = state.tanks.filter(item => item.label !== payload.tank);

      return {
        ...state,
        tanks: filteredTank,
        selectedTank: null,
        selectedSymbol: null,
        selectedTankSymbol: [...state.selectedTankSymbol, { ...payload }]
      };
    }

    case REMOVE_TANK_SYMBOL: {
      const { updatedTanks, removedTank } = payload;
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const feedTankObj = _shiftReportDetails.find(item => item.shiftSection === FEED && item.name === 'TANK');
      const feedTankObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === FEED && item.name === 'TANK');
      feedTankObj.reading = JSON.stringify(updatedTanks);
      _shiftReportDetails[feedTankObjIndex] = feedTankObj;

      return {
        ...state,
        tanks: [...state.tanks, { ...removedTank }],
        selectedTankSymbol: updatedTanks,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case CHANGE_STABILITY: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const stabilityObj = _shiftReportDetails.find(item => item.shiftSection === RESIDUE && item.name === 'STABILITY');
      const stabilityObjIndex = _shiftReportDetails.findIndex(
        item => item.shiftSection === RESIDUE && item.name === 'STABILITY'
      );
      stabilityObj.reading = payload ? payload.value : '';
      _shiftReportDetails[stabilityObjIndex] = stabilityObj;

      return {
        ...state,
        stability: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case CHANGE_FUEL_TYPE: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const fuelTypeObj = _shiftReportDetails.find(item => item.shiftSection === File_1 && item.name === 'FUEL TYPE');
      const fuelTypeObjIndex = _shiftReportDetails.findIndex(
        item => item.shiftSection === File_1 && item.name === 'FUEL TYPE'
      );
      fuelTypeObj.reading = payload ? payload.value : '';
      _shiftReportDetails[fuelTypeObjIndex] = fuelTypeObj;

      return {
        ...state,
        fuelType: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case CHANGE_K6051A: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const k6051AObj = _shiftReportDetails.find(item => item.shiftSection === Box_9 && item.name === 'K-6051 A');
      const k6051AObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === Box_9 && item.name === 'K-6051 A');
      k6051AObj.reading = payload ? payload.value : '';
      _shiftReportDetails[k6051AObjIndex] = k6051AObj;

      return {
        ...state,
        selectedK6051A: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    case CHANGE_K6051B: {
      const _shiftReportDetails = [...state.data.shiftReportDetails];
      const k6051BObj = _shiftReportDetails.find(item => item.shiftSection === Box_9 && item.name === 'K-6051 B');
      const k6051BObjIndex = _shiftReportDetails.findIndex(item => item.shiftSection === Box_9 && item.name === 'K-6051 B');
      k6051BObj.reading = payload ? payload.value : '';
      _shiftReportDetails[k6051BObjIndex] = k6051BObj;

      return {
        ...state,
        selectedK6051B: payload,
        data: {
          ...state.data,
          shiftReportDetails: _shiftReportDetails
        }
      };
    }

    default:
      return state;
  }
};

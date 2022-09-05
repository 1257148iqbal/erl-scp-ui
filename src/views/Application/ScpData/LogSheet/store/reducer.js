import {
  ADD_REMARK,
  CHANGE_DATE,
  CHANGE_OPERATION_GROUP,
  CHANGE_OPERATION_GROUP_FAIL,
  CHANGE_REMARK,
  CHANGE_SECTION,
  CHANGE_SECTION_FAIL,
  CHANGE_SHIFT,
  CHANGE_SHIFT_FAIL,
  CHANGE_TAG,
  CHANGE_TIME_SLOT,
  CHANGE_TIME_SLOT_FAIL,
  FETCH_OPERATION_GROUP,
  FETCH_SECTIONS,
  FETCH_SHIFT,
  FETCH_TAGS,
  FETCH_TIME_SLOT,
  REMOVE_REMARK,
  RESET
} from './actionTypes';

export const initialState = {
  operationGroup: null,
  operationGroups: [],
  section: null,
  sections: [],
  shift: null,
  shifts: [],
  timeSlot: null,
  timeSlots: [],
  tags: [],
  remark: '',
  remarks: [],
  date: null,
  error: ''
};

export const logSheetSpecificReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_DATE:
      return { ...state, date: payload };

    case FETCH_OPERATION_GROUP:
      return { ...state, operationGroups: payload };
    case CHANGE_OPERATION_GROUP: {
      return { ...state, operationGroup: payload, section: null, tags: [] };
    }
    case CHANGE_OPERATION_GROUP_FAIL:
      return { ...state, operationGroup: null };

    case FETCH_SHIFT:
      return { ...state, shifts: payload };
    case CHANGE_SHIFT:
      return { ...state, shift: payload, timeSlot: null };
    case CHANGE_SHIFT_FAIL:
      return { ...state, shift: null };

    case FETCH_TIME_SLOT:
      return { ...state, timeSlots: payload };
    case CHANGE_TIME_SLOT:
      return { ...state, timeSlot: payload };
    case CHANGE_TIME_SLOT_FAIL:
      return { ...state, timeSlot: null };

    case FETCH_SECTIONS:
      return { ...state, sections: payload };
    case CHANGE_SECTION:
      return { ...state, section: payload, tags: [] };
    case CHANGE_SECTION_FAIL:
      return { ...state, section: null };

    case FETCH_TAGS:
      return { ...state, tags: payload };
    case CHANGE_TAG:
      return { ...state, tags: payload };
    case CHANGE_REMARK:
      return { ...state, remark: payload };
    case ADD_REMARK:
      return { ...state, remarks: payload, remark: '' };
    case REMOVE_REMARK: {
      const _remarks = [...state.remarks];
      _remarks.splice(payload, 1);
      return { ...state, remarks: _remarks };
    }

    case RESET: {
      return { ...state, tags: payload, remark: '' };
    }
    default:
      return state;
  }
};

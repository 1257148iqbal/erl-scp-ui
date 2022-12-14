import {
  SEND_FORGET_PASSWORD_EMAIL,
  SET_USER_PERMISSION,
  UPDATE_AUTH_USER,
  UPDATE_LOAD_USER
} from '../../constants/ActionTypes';

export const setAuthUser = user => {
  return dispatch => {
    dispatch({
      type: UPDATE_AUTH_USER,
      payload: user
    });
  };
};

export const updateLoadUser = loading => {
  return dispatch => {
    dispatch({
      type: UPDATE_LOAD_USER,
      payload: loading
    });
  };
};

export const setForgetPassMailSent = status => {
  return dispatch => {
    dispatch({
      type: SEND_FORGET_PASSWORD_EMAIL,
      payload: status
    });
  };
};

export const saveUserPermission = permission => {
  return dispatch => {
    dispatch({
      type: SET_USER_PERMISSION,
      payload: permission
    });
  };
};

import { USERS } from 'constants/ApiEndPoints/v1';
import jwtDecode from 'jwt-decode';
import qs from 'querystring';
import React from 'react';
import { fetchError, fetchStart, fetchSuccess } from '../../../redux/actions';
import { saveUserPermission, setAuthUser, setForgetPassMailSent, updateLoadUser } from '../../../redux/actions/Auth';
import { http } from '../../httpService';

const JWTAuth = {
  onRegister: ({ name, email, password }) => {
    return dispatch => {
      dispatch(fetchStart());
      http
        .post('auth/register', {
          email: email,
          password: password,
          name: name
        })
        .then(({ data }) => {
          if (data.result) {
            localStorage.setItem('token', data.token.access_token);
            http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
            dispatch(fetchSuccess());
            dispatch(JWTAuth.getAuthUser(true, data.token.access_token));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  onLogin: ({ username, password }) => {
    const { REACT_APP_GRAND_TYPE, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET, REACT_APP_SCOPE } = process.env;
    const queryParam = {
      userName: username,
      password: password,
      grant_type: REACT_APP_GRAND_TYPE,
      client_id: REACT_APP_CLIENT_ID,
      client_secret: REACT_APP_CLIENT_SECRET,
      scope: REACT_APP_SCOPE
    };

    return dispatch => {
      try {
        dispatch(fetchStart());
        http
          .post('/connect/token', qs.stringify(queryParam))
          .then(({ data }) => {
            if (data) {
              localStorage.setItem('token', data.access_token);
              var getToken = jwtDecode(data.access_token);
              http.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
              dispatch(saveUserPermission(getToken.permission));
              dispatch(fetchSuccess());
              dispatch(JWTAuth.getAuthUser(true, data.access_token));
            } else {
              dispatch(fetchError(data.error));
            }
          })
          .catch(function(error) {
            dispatch(fetchError(error.message));
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },

  // onLogout: () => {
  //   return dispatch => {
  //     localStorage.removeItem('token');
  //     dispatch(setAuthUser(null));
  //   };
  // },

  onLogout: logOut => {
    return dispatch => {
      dispatch(fetchStart());
      if (!logOut) {
        dispatch(fetchSuccess());
        localStorage.removeItem('token');
        dispatch(setAuthUser(null));
      } else {
        dispatch(fetchError('Error'));
      }
    };
  },

  getAuthUser: (loaded = false, access_token) => {
    return dispatch => {
      const token = localStorage.getItem('token');
      if (!access_token) {
        http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        if (token) {
          var getToken = jwtDecode(token);
          dispatch(saveUserPermission(getToken.permission));
        }
      }

      if (token) {
        dispatch(fetchStart());
        dispatch(updateLoadUser(loaded));
        http
          .get(USERS.get_me)
          .then(({ data }) => {
            if (data.isEnabled) {
              dispatch(fetchSuccess());
              dispatch(setAuthUser(data));
            } else {
              dispatch(updateLoadUser(true));
            }
          })
          .catch(({ response }) => {
            if (response === undefined || response || response.status === 401) {
              localStorage.removeItem('token');
              dispatch(updateLoadUser(true));
            }
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },

  onForgotPassword: () => {
    return dispatch => {
      dispatch(fetchStart());

      setTimeout(() => {
        dispatch(setForgetPassMailSent(true));
        dispatch(fetchSuccess());
      }, 300);
    };
  },
  getSocialMediaIcons: () => {
    return <React.Fragment> </React.Fragment>;
  }
};

export default JWTAuth;

import { Button, Card, CardActions, CardMedia, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import defaultImage from 'assets/images/defaultImage.png';
import Axios from 'axios';
import {
  Checkbox,
  CustomAutoComplete,
  Form,
  FormWrapper,
  PasswordBox,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { OPERATOR, ROLES } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useReducer, useRef } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import {
  CHANGE_IMAGE,
  CHANGE_INPUT_FIELDS,
  CHANGE_OPERATOR,
  CHANGE_PASSWORD_VISIBILITY,
  CHANGE_ROLES,
  SET_DEPENDENCIES
} from '../store/actionTypes';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 330
  },
  text: {
    textAlign: 'center'
  },
  addPhoto: {
    width: '240px'
  },
  imageBox: {
    maxWidth: 'calc(100% - 120px)',
    margin: '0 auto'
  }
}));

const initialState = {
  id: '',
  operators: [],
  selectedOperator: null,
  roles: [],
  selectedRoles: [],
  departmentName: '',
  jobTitle: '',
  userName: '',
  operatorId: '',
  employeeID: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  isEnabled: true,
  showPassword: false,
  file: null,
  fileURL: null,
  fileName: ''
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_DEPENDENCIES:
      return {
        ...state,
        operators: payload.operators,
        roles: payload.roles
      };

    case CHANGE_OPERATOR: {
      return {
        ...state,
        selectedOperator: payload,
        employeeID: payload ? payload.operatorCode : '',
        departmentName: payload ? payload.departmentName : '',
        jobTitle: payload ? payload.designationName : '',
        phoneNumber: payload ? payload.phoneNumber : '',
        email: payload ? payload.email : ''
      };
    }

    case CHANGE_INPUT_FIELDS: {
      return {
        ...state,
        [payload.name]: payload.value
      };
    }

    case CHANGE_ROLES:
      return {
        ...state,
        selectedRoles: payload
      };

    case CHANGE_PASSWORD_VISIBILITY:
      return {
        ...state,
        showPassword: payload
      };

    case CHANGE_IMAGE:
      const { file, fileURL, fileName } = payload;
      return {
        ...state,
        file,
        fileURL,
        fileName
      };
    default:
      return state;
  }
};

const UserForm = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { onSubmit } = props;

  //#region Refs

  const operatorNameRef = useRef();

  //#endregion

  //#region States
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDFs
  const getDependencies = async () => {
    try {
      await Axios.all([http.get(OPERATOR.get_not_user_operator), http.get(ROLES.get_all)]).then(
        Axios.spread((...responses) => {
          const operatorResponse = responses[0].data;
          const rolesResponse = responses[1].data;
          if (operatorResponse.succeeded && rolesResponse.length > 0) {
            const operators = operatorResponse.data.map(operator => ({
              ...operator,
              label: `${operator.operatorName} (${operator.operatorCode})`,
              value: operator.id
            }));
            const roles = rolesResponse.map(role => ({
              label: role.name,
              value: role.name
            }));
            dispatch({
              type: SET_DEPENDENCIES,
              payload: {
                operators,
                roles
              }
            });
          }
        })
      );
    } catch (error) {
      toastAlerts('error', error);
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    getDependencies();
  }, []);

  //#endregion

  const onReset = () => {
    setErrors({});
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('employeeID' in fieldValues) {
      if (!fieldValues.employeeID) {
        temp.emploempCodeyeeId = requiredMessage;
      } else if (fieldValues.employeeID.length > 15) {
        temp.employeeID = 'Employee ID can not exceed eight character';
      } else {
        temp.employeeID = '';
      }
    }
    if ('departmentId' in fieldValues) {
      if (!fieldValues.departmentId) {
        temp.departmentId = requiredSelection;
      } else {
        temp.departmentId = '';
      }
    }
    if ('designationId' in fieldValues) {
      if (!fieldValues.designationId) {
        temp.designationId = requiredSelection;
      } else {
        temp.designationId = '';
      }
    }
    if ('phoneNumber' in fieldValues) {
      if (!fieldValues.phoneNumber) {
        temp.phoneNumber = requiredMessage;
      } else if (fieldValues.phoneNumber.length > 15) {
        temp.phoneNumber = 'Phone Number can not exceed fifteen character';
      } else {
        temp.phoneNumber = '';
      }
    }
    if ('selectedRoles' in fieldValues) {
      if (!fieldValues.selectedRoles.length) {
        temp.selectedRoles = requiredMessage;
      } else {
        temp.selectedRoles = '';
      }
    }
    if ('fullName' in fieldValues) {
      if (!fieldValues.fullName) {
        temp.fullName = requiredMessage;
      } else if (fieldValues.fullName.length > 15) {
        temp.fullName = 'Full Name can not exceed fifteen character';
      } else {
        temp.fullName = '';
      }
    }
    if ('userName' in fieldValues) {
      if (!fieldValues.userName) {
        temp.userName = requiredMessage;
      } else if (fieldValues.userName.length > 15) {
        temp.userName = 'User Name can not exceed fifteen character';
      } else {
        temp.userName = '';
      }
    }
    if ('password' in fieldValues) {
      if (!fieldValues.password) {
        temp.password = requiredMessage;
      } else if (fieldValues.password.length > 15) {
        temp.password = 'Password can not exceed fifteen character';
      } else {
        temp.password = '';
      }
    }
    if ('confirmPassword' in fieldValues) {
      if (!fieldValues.confirmPassword) {
        temp.confirmPassword = requiredMessage;
      } else if (fieldValues.confirmPassword.length > 15) {
        temp.confirmPassword = 'Confirm Password can not exceed fifteen character';
      } else {
        temp.confirmPassword = '';
      }
    }
    if ('imageName' in fieldValues) {
      if (!fieldValues.imageName) {
        temp.imageName = requiredMessage;
      } else if (fieldValues.imageName.length > 15) {
        temp.imageName = 'Image Name can not exceed fifteen character';
      } else {
        temp.imageName = '';
      }
    }
    if ('email' in fieldValues) {
      if (!fieldValues.email) {
        temp.email = requiredMessage;
      } else if (fieldValues.email.length > 50) {
        temp.email = 'Email can not exceed fifty character';
      } else {
        temp.email = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };

  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };
    dispatch({
      type: CHANGE_INPUT_FIELDS,
      payload: {
        name,
        value: type === 'checkbox' ? checked : value
      }
    });
    validate(filedValue);
  };

  const onOperatorChange = (e, newValue) => {
    dispatch({ type: CHANGE_OPERATOR, payload: newValue });
  };

  const onRolesChange = (e, newValue) => {
    dispatch({ type: CHANGE_ROLES, payload: newValue });
  };

  const onPasswordVisibilityChange = () => {
    dispatch({ type: CHANGE_PASSWORD_VISIBILITY, payload: !state.showPassword });
  };

  const onImageSelect = e => {
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    const fileName = file.name;

    dispatch({ type: CHANGE_IMAGE, payload: { file, fileURL, fileName } });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      id: state.id,
      operatorId: state.selectedOperator ? state.selectedOperator.id : null,
      currentPassword: state.newPassword,
      newPassword: state.confirmPassword,
      roles: state.selectedRoles.map(role => role.label),
      userName: state.userName,
      fullName: state.selectedOperator ? state.selectedOperator.operatorName : '',
      email: state.email,
      jobTitle: state.jobTitle,
      departmentName: state.departmentName,
      phoneNumber: state.phoneNumber,
      employeeID: state.selectedOperator ? state.selectedOperator.operatorCode : '',
      isEnabled: state.isEnabled
    };
    if (data.operatorId) {
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      if (state.file) {
        formData.append('File', state.file, state.fileName);
      }

      onSubmit(formData);
    } else {
      toastAlerts('warning', 'Please select all', 'center');
    }
  };

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={operatorNameRef}
              name="operatorId"
              data={state.operators}
              label="Select Employee"
              value={state.selectedOperator}
              error={errors.departmentId}
              onChange={onOperatorChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="departmentName" label="Department" value={state.departmentName} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="jobTitle" label="Designation" value={state.jobTitle} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="userName"
              label="User Name"
              value={state.userName}
              error={errors.userName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="email" label="Email" value={state.email} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="phoneNumber" label="Phone No" value={state.phoneNumber} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Autocomplete
              multiple
              size="small"
              limitTags={2}
              options={state.roles}
              getOptionLabel={option => option.label}
              onChange={onRolesChange}
              value={state.selectedRoles}
              renderInput={params => <TextField {...params} margin="dense" variant="outlined" label="Select Roles" />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <PasswordBox
              name="newPassword"
              label="Password"
              showPassword={state.showPassword}
              setShowPassword={onPasswordVisibilityChange}
              value={state.newPassword}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <PasswordBox
              name="confirmPassword"
              label="Confirm Password"
              showPassword={state.showPassword}
              setShowPassword={onPasswordVisibilityChange}
              value={state.confirmPassword}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card className={classes.imageBox}>
              <CardMedia component="img" alt="User Image" image={state.fileURL ?? defaultImage} title="User Image" />
              <CardActions style={{ backgroundColor: '#333' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="contained-button-file"
                  type="file"
                  onChange={onImageSelect}
                />
                <label htmlFor="contained-button-file" style={{ margin: '0 auto' }}>
                  <Button variant="contained" color="primary" component="span">
                    Pick a Photo
                  </Button>
                </label>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Checkbox name="isEnabled" label="Is Enabled" checked={state.isEnabled} onChange={onChange} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <SaveButton onClick={handleSubmit} />
          <ResetButton onClick={onReset} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default UserForm;

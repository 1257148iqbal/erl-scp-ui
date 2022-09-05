import { Button, Card, CardActions, CardMedia, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import defaultImage from 'assets/images/defaultImage.png';
import { CustomPreloder, Form, FormWrapper, ResetButton, SaveButton, TextInput } from 'components/CustomControls';
import { ROLES } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useReducer } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { CHANGE_IMAGE, CHANGE_INPUT_FIELDS, CHANGE_ROLES, SET_DEPENDENCIES, SET_EDITED } from '../store/actionTypes';

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
  userName: '',
  departmentName: '',
  fullName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  roles: [],
  selectedRoles: [],
  phoneNumber: '',
  jobTitle: '',
  employeeID: '',

  file: null,
  fileURL: null,
  fileName: '',
  isPageLoaded: true
};

const { REACT_APP_BASE_URL } = process.env;

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FETCH_START':
      return { ...state, isPageLoaded: false };

    case 'FETCH_SUCCESS':
      return { ...state, isPageLoaded: true };

    case SET_DEPENDENCIES:
      return {
        ...state,
        ...payload.recordForEdit,
        roles: payload.roles,
        selectedRoles: payload.selectedRoles,
        fileURL: payload.recordForEdit.media ? `${REACT_APP_BASE_URL}/${payload.recordForEdit.media?.fileUrl}` : null
      };

    case CHANGE_INPUT_FIELDS:
      return {
        ...state,
        [payload.name]: payload.value
      };

    case CHANGE_ROLES:
      return {
        ...state,
        selectedRoles: payload
      };

    case CHANGE_IMAGE:
      const { file, fileURL, fileName } = payload;
      return {
        ...state,
        file,
        fileURL,
        fileName
      };

    case SET_EDITED:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

const UserEditForm = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { onUpdate, recordForEdit } = props;

  //#endregion

  //#region States
  const classes = useStyles();
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDFs
  const getDependencies = async recordForEdit => {
    dispatch({ type: 'FETCH_START' });
    try {
      await http.get(ROLES.get_all).then(res => {
        const roles = res.data.map(role => ({
          label: role.name,
          value: role.name
        }));
        const selectedRoles = recordForEdit.roles.map(role => ({
          label: role,
          value: role
        }));
        dispatch({
          type: SET_DEPENDENCIES,
          payload: {
            roles,
            selectedRoles,
            recordForEdit
          }
        });
        dispatch({ type: 'FETCH_SUCCESS' });
      });
    } catch (error) {
      toastAlerts('error', error);
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    if (recordForEdit) {
      getDependencies(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Pre Loader
  if (!state.isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

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
    if ('roleName' in fieldValues) {
      if (!fieldValues.roleName) {
        temp.roleName = requiredMessage;
      } else if (fieldValues.roleName.length > 15) {
        temp.roleName = 'Role Name can not exceed fifteen character';
      } else {
        temp.roleName = '';
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
      } else if (fieldValues.email.length > 15) {
        temp.email = 'Email can not exceed fifteen character';
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

  const onRolesChange = (e, newValue) => {
    dispatch({ type: CHANGE_ROLES, payload: newValue });
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
      userName: state.userName,
      departmentName: state.departmentName,
      fullName: state.fullName,
      email: state.email,
      currentPassword: '',
      newPassword: '',
      roles: state.selectedRoles.map(role => role.label),
      phoneNumber: state.phoneNumber,
      jobTitle: state.jobTitle,
      employeeID: state.employeeID
    };

    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (state.file) {
      formData.append('File', state.file, state.fileName);
    }
    onUpdate(formData, data.id);
  };

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="operatorId" label="Employee Name" value={state.fullName} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="departmentName" label="Department" value={state.departmentName} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="jobTitle" label="Designation" value={state.jobTitle} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="userName" label="User Name" value={state.userName} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="email" label="Email" value={state.email} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="phoneNumber" label="Phone No" value={state.phoneNumber} onChange={onChange} />
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
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
            <PasswordBox
              disabled
              name="newPassword"
              label="Password"
              showPassword={state.showPassword}
              setShowPassword={onPasswordVisibilityChange}
              value={state.newPassword}
              onChange={onChange}
            />
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
            <PasswordBox
              disabled
              name="confirmPassword"
              label="Confirm Password"
              showPassword={state.showPassword}
              setShowPassword={onPasswordVisibilityChange}
              value={state.confirmPassword}
              onChange={onChange}
            />
          </Grid> */}
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
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
            <Checkbox name="isEnabled" label="Is Enabled" checked={state.isEnabled} onChange={onChange} />
          </Grid> */}
        </Grid>
        <Grid container justifyContent="flex-start">
          <SaveButton onClick={handleSubmit} />
          <ResetButton onClick={onReset} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default UserEditForm;

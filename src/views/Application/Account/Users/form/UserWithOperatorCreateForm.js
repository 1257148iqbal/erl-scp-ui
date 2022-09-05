import { Button, Card, CardActions, CardMedia, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
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
import { DEPARTMENT, DESIGNATION, ROLES } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useReducer, useRef } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';
import {
  CHANGE_DEPARTMENT,
  CHANGE_DESIGNATION,
  CHANGE_IMAGE,
  CHANGE_INPUT_FIELDS,
  CHANGE_PASSWORD_VISIBILITY,
  CHANGE_ROLES,
  FILL_DESIGNATIONS,
  SET_DEPENDENCIES
} from '../store/actionTypes';
import { initialUserCreateState, userCreateReducer } from '../store/reducer';
import { useUserStyles } from '../styles';

const UserForm = props => {
  const [state, dispatch] = useReducer(userCreateReducer, initialUserCreateState);
  const { onSubmit } = props;

  //#region Refs

  const departmentRef = useRef();
  const designationRef = useRef();
  const rolesRef = useRef();

  //#endregion

  //#region States
  const classes = useUserStyles();
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDFs
  const getDependencies = async () => {
    try {
      const res = await Axios.all([http.get(DEPARTMENT.get_all_active), http.get(ROLES.get_all)]);
      const departmentsRes = res[0].data;
      const rolesRes = res[1].data;
      if (departmentsRes.succeeded && rolesRes.length > 0) {
        const departments = fillDropDown(departmentsRes.data, 'departmentName', 'id');
        const roles = fillDropDown(rolesRes, 'name', 'name');

        dispatch({ type: SET_DEPENDENCIES, payload: { departments, roles } });
      }
    } catch (err) {
      toastAlerts('error', err);
    }
  };

  const getDesignationByDepartment = async departmentId => {
    try {
      const res = await http.get(`${DESIGNATION.get_all_active}/${departmentId}`);

      if (res.data.succeeded) {
        const designations = fillDropDown(res.data.data, 'designationName', 'id');
        dispatch({ type: FILL_DESIGNATIONS, payload: designations });
      }
    } catch (err) {
      toastAlerts('error', err);
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
        temp.employeeID = requiredMessage;
      } else if (fieldValues.employeeID.length > 10) {
        temp.employeeID = 'Employee ID can not exceed ten characters';
      } else {
        temp.employeeID = '';
      }
    }

    if ('fullName' in fieldValues) {
      if (!fieldValues.fullName) {
        temp.fullName = requiredMessage;
      } else if (fieldValues.fullName.length > 50) {
        temp.fullName = 'Full Name can not exceed fifty characters';
      } else {
        temp.fullName = '';
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

    if ('userName' in fieldValues) {
      if (!fieldValues.userName) {
        temp.userName = requiredMessage;
      } else if (fieldValues.userName.length > 20) {
        temp.userName = 'User Name can not exceed twenty characters';
      } else {
        temp.userName = '';
      }
    }
    if ('newPassword' in fieldValues) {
      if (!fieldValues.newPassword) {
        temp.newPassword = requiredMessage;
      } else if (fieldValues.newPassword.length > 20) {
        temp.newPassword = 'Password can not exceed twenty characters';
      } else {
        temp.newPassword = '';
      }
    }
    if ('confirmPassword' in fieldValues) {
      if (!fieldValues.confirmPassword) {
        temp.confirmPassword = requiredMessage;
      } else if (fieldValues.confirmPassword !== state.newPassword) {
        temp.confirmPassword = 'Password did not match';
      } else {
        temp.confirmPassword = '';
      }
    }

    if ('selectedRoles' in fieldValues) {
      if (!fieldValues.selectedRoles.length) {
        temp.selectedRoles = requiredSelection;
      } else {
        temp.selectedRoles = '';
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

  const onDepartmentChange = (e, newValue, callback) => {
    const controlName = departmentRef.current.getAttribute('name');
    const filedValue = { [controlName]: newValue.value };
    dispatch({ type: CHANGE_DEPARTMENT, payload: newValue });
    callback(newValue.value);
    validate(filedValue);
  };
  const onDesignationChange = (e, newValue) => {
    const controlName = designationRef.current.getAttribute('name');
    const filedValue = { [controlName]: newValue.value };
    dispatch({ type: CHANGE_DESIGNATION, payload: newValue });
    validate(filedValue);
  };

  const onRolesChange = (e, newValue) => {
    const controlName = rolesRef.current.getAttribute('name');
    const filedValue = { [controlName]: newValue };
    dispatch({ type: CHANGE_ROLES, payload: newValue });
    validate(filedValue);
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (validate()) {
      const data = {
        currentPassword: state.newPassword,
        newPassword: state.confirmPassword,
        roles: state.selectedRoles.map(role => role.label),
        id: state.id,
        employeeID: state.employeeID,
        fullName: state.fullName,
        phoneNumber: state.phoneNumber,
        email: state.email,
        userName: state.userName,
        departmentId: state.selectedDepartment.value,
        departmentName: state.selectedDepartment.label,
        designationId: state.selectedDesignation.value,
        jobTitle: state.selectedDesignation.label,
        isEnabled: state.isEnabled
      };

      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      if (state.file) {
        formData.append('File', state.file, state.fileName);
      }

      onSubmit(formData);
    }
  };

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="employeeID"
              label="Employee ID"
              value={state.employeeID}
              error={errors.employeeID}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="fullName"
              label="Full Name"
              value={state.fullName}
              error={errors.fullName}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="phoneNumber"
              label="Phone No"
              value={state.phoneNumber}
              error={errors.phoneNumber}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="email" label="Email" value={state.email} onChange={onChange} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={departmentRef}
              name="departmentId"
              data={state.departments}
              label="Select Department"
              value={state.selectedDepartment}
              error={errors.departmentId}
              onChange={(e, newValue) => onDepartmentChange(e, newValue, getDesignationByDepartment)}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={designationRef}
              name="designationId"
              data={state.designations}
              label="Select Designation"
              value={state.selectedDesignation}
              error={errors.designationId}
              onChange={onDesignationChange}
            />
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
            <PasswordBox
              name="newPassword"
              label="Password"
              showPassword={state.showPassword}
              setShowPassword={onPasswordVisibilityChange}
              value={state.newPassword}
              error={errors.newPassword}
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
              error={errors.confirmPassword}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Autocomplete
              multiple
              ref={rolesRef}
              size="small"
              limitTags={2}
              options={state.roles}
              getOptionLabel={option => option.label}
              onChange={onRolesChange}
              value={state.selectedRoles}
              name="selectedRoles"
              renderInput={params => (
                <TextField
                  {...params}
                  margin="dense"
                  variant="outlined"
                  label="Select Roles"
                  {...(errors && errors.selectedRoles && { error: true, helperText: errors.selectedRoles })}
                />
              )}
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

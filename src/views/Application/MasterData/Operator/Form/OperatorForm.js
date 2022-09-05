import { Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';
import {
  Checkbox,
  CustomAutoComplete,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { DEPARTMENT, DESIGNATION, OPERATOR_GROUP } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  operatorGroupId: '',
  operatorGroupName: '',
  departmentId: '',
  departmentName: '',
  designationId: '',
  designationName: '',
  operatorCode: '',
  operatorName: '',
  phoneNumber: '',
  email: '',
  isActive: true
};

const OperatorForm = props => {
  const classes = useStyles();
  const refOperatorGroupName = useRef();
  const refDepartmentName = useRef();
  const refDesignationName = useRef();

  const { recordForEdit, onSubmit } = props;

  //#region states
  const [state, setState] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [designation, setDesignation] = useState(null);
  const [designations, setDesignations] = useState([]);

  const [operatorGroup, setOperatorGroup] = useState(null);
  const [operatorGroups, setOperatorGroups] = useState([]);

  //#endregion

  //#region UDF

  const getDesignationByDepartment = departmentId => {
    http
      .get(`${DESIGNATION.get_all_active}/${departmentId}`)
      .then(res => {
        if (res.data.succeeded) {
          const designations = res.data.data.map(item => ({ label: item.designationName, value: item.id }));
          setDesignations(designations);
        }
      })
      .catch(err => toastAlerts('error', err));
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('departmentId' in fieldValues) {
      if (!fieldValues.departmentId) {
        temp.departmentId = requiredSelection;
      } else {
        temp.departmentId = '';
      }
    }
    if ('operatorCode' in fieldValues) {
      if (!fieldValues.operatorCode) {
        temp.operatorCode = requiredMessage;
      } else if (fieldValues.operatorCode.length > 20) {
        temp.operatorCode = 'Operator Code can not exceed twenty character';
      } else {
        temp.operatorCode = '';
      }
    }
    if ('operatorName' in fieldValues) {
      if (!fieldValues.operatorName) {
        temp.operatorName = requiredMessage;
      } else if (fieldValues.operatorName.length > 100) {
        temp.operatorName = 'Operator Name can not exceed hundred character';
      } else {
        temp.operatorName = '';
      }
    }
    if ('operatorGroupId' in fieldValues) {
      if (!fieldValues.operatorGroupId) {
        temp.operatorGroupId = requiredSelection;
      } else {
        temp.operatorGroupId = '';
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

    if ('email' in fieldValues) {
      if (!fieldValues.email) {
        temp.email = requiredMessage;
      } else if (fieldValues.email.length > 100) {
        temp.email = 'Email can not exceed hundred character';
      } else {
        temp.email = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchDependencies = async () => {
      try {
        const departmentReq = http.get(DEPARTMENT.get_all_active, { signal: controller.signal });
        const operatorGroupReq = http.get(OPERATOR_GROUP.get_all, { signal: controller.signal });
        const [departmentRes, operatorGroupRes] = await axios.all([departmentReq, operatorGroupReq]);
        if (departmentRes.data.succeeded && operatorGroupRes.data.succeeded) {
          const departemntDdl = fillDropDown(departmentRes.data.data, 'departmentName', 'id');
          const operatorGroupDdl = fillDropDown(operatorGroupRes.data.data, 'groupName', 'id');

          if (isMounted) {
            setDepartments(departemntDdl);
            setOperatorGroups(operatorGroupDdl);
          }
        }
      } catch (error) {}
    };

    fetchDependencies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const departemnt = { label: recordForEdit.departmentName, value: recordForEdit.departmentId };
      const designation = { label: recordForEdit.designationName, value: recordForEdit.designationId };
      const operatorGroup = { label: recordForEdit.operatorGroupName, value: recordForEdit.operatorGroupId };
      setDepartment(departemnt);
      getDesignationByDepartment(recordForEdit.departmentId);
      setDesignation(designation);
      setOperatorGroup(operatorGroup);
      setState(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };
    switch (name) {
      case 'phoneNumber':
        setState({
          ...state,
          [name]: value
        });
        break;

      default:
        setState({
          ...state,
          [name]: type === 'checkbox' ? checked : value
        });
        break;
    }

    validate(filedValue);
  };

  const onOperatorGroupChange = (e, newValue) => {
    if (newValue) {
      const controlName = refOperatorGroupName.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setOperatorGroup(newValue);
      setState({
        ...state,
        operatorGroupId: newValue.value,
        operatorGroupName: newValue.label
      });
      validate(filedValue);
    } else {
      setOperatorGroup(null);
      setState({ ...state, operatorGroupId: '', operatorGroupName: '' });
    }
  };
  const onDepartmentChange = (e, newValue) => {
    if (newValue) {
      const controlName = refDepartmentName.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setDepartment(newValue);
      setState({
        ...state,
        departmentId: newValue.value,
        departmentName: newValue.label,
        designationId: '',
        designationName: ''
      });
      validate(filedValue);
      setDesignation(null);
      getDesignationByDepartment(newValue.value);
    } else {
      setDepartment(null);
      setDesignation(null);
      setState({ ...state, departmentId: '', departmentName: '', designationId: '', designationName: '' });
    }
  };

  const onDesignationChange = (e, newValue) => {
    if (newValue) {
      const controlName = refDesignationName.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setDesignation(newValue);
      setState({ ...state, designationId: newValue.value, designationName: newValue.label });
      validate(filedValue);
    } else {
      setDesignation(null);
      setState({ ...state, designationId: '', designationName: '' });
    }
  };

  const onReset = () => {
    setState(initialFieldValues);
    setDepartment(null);
    setDesignation(null);
    setErrors({});
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e, state);
    }
  };
  //#endregion

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refOperatorGroupName}
              name="operatorGroupId"
              data={operatorGroups}
              label="Select Group"
              value={operatorGroup}
              error={errors.operatorGroupId}
              onChange={onOperatorGroupChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refDepartmentName}
              name="departmentId"
              data={departments}
              label="Select Department"
              value={department}
              error={errors.departmentId}
              onChange={onDepartmentChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="operatorCode"
              label="Employee Code"
              value={state.operatorCode}
              error={errors.operatorCode}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="operatorName"
              label="Employee Name"
              value={state.operatorName}
              error={errors.operatorName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refDesignationName}
              name="designationId"
              data={designations}
              label="Select Designation"
              value={designation}
              error={errors.designationId}
              onChange={onDesignationChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="phoneNumber"
              label="Phone Number"
              value={state.phoneNumber}
              error={errors.phoneNumber}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="email" label="Email" value={state.email} error={errors.email} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Checkbox name="isActive" label="Is Active" checked={state.isActive} onChange={onChange} />
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

export default OperatorForm;

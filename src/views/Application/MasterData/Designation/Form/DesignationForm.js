import { Grid, makeStyles } from '@material-ui/core';
import {
  Checkbox,
  CustomAutoComplete,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { DEPARTMENT } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef } from 'react';
import { http } from 'services/httpService';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  departmentId: '',
  departmentName: '',
  designationName: '',
  alias: '',
  isActive: true
};

const OperationGroupForm = props => {
  const classes = useStyles();
  const refDesignation = useRef();

  const { recordForEdit, onSubmit } = props;
  //#region states

  const [department, setDepartment] = React.useState(null);
  const [departments, setDepartments] = React.useState([]);

  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});

  //#endregion

  //#region UDF

  const getDepartments = () => {
    http.get(DEPARTMENT.get_all_active).then(res => {
      if (res.data.succeeded) {
        const departments = res.data.data.map(item => ({ label: item.departmentName, value: item.id }));
        setDepartments(departments);
      }
    });
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
    if ('designationName' in fieldValues) {
      if (!fieldValues.designationName) {
        temp.designationName = requiredMessage;
      } else if (fieldValues.designationName.length > 20) {
        temp.designationName = 'Designation Name can not exceed twenty character';
      } else {
        temp.designationName = '';
      }
    }
    if ('alias' in fieldValues) {
      if (!fieldValues.alias) {
        temp.alias = requiredMessage;
      } else if (fieldValues.alias.length > 10) {
        temp.alias = 'Group Name can not exceed ten character';
      } else {
        temp.alias = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    getDepartments();
  }, []);
  useEffect(() => {
    if (recordForEdit) {
      const department = { label: recordForEdit.department.departmentName, value: recordForEdit.department.id };
      setDepartment(department);
      setState(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value
    });
    validate(filedValue);
  };

  const onDepartmentChange = (e, newValue) => {
    if (newValue) {
      const controlName = refDesignation.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setDepartment(newValue);
      setState({ ...state, departmentId: newValue.value, departmentName: newValue.label });
      validate(filedValue);
    } else {
      setDepartment(null);
      setState({ ...state, departmentId: '', departmentName: '' });
    }
  };

  const onReset = () => {
    setState(initialFieldValues);
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
              ref={refDesignation}
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
              name="designationName"
              label="Designation"
              value={state.designationName}
              error={errors.designationName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="alias" label="Alias" value={state.alias} error={errors.alias} onChange={onChange} />
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

export default OperationGroupForm;

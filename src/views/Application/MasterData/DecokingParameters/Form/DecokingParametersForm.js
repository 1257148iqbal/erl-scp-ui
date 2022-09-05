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
import { OPERATION_GROUP, UNIT } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef } from 'react';
import { http } from 'services/httpService';
import { getSign } from 'utils/commonHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  sortOrder: '',
  operationGroupId: '',
  parameterName: '',
  details: '',
  unitId: '',
  unitName: '',
  isActive: true
};

const DecokingLogSheetForm = props => {
  const classes = useStyles();
  const refOperationGroup = useRef();
  const refUnits = useRef();

  const { recordForEdit, onSubmit } = props;
  //#region states

  const [operationGroup, setOperationGroup] = React.useState(null);
  const [operationGroups, setOperationGroups] = React.useState([]);

  const [unit, setUnit] = React.useState(null);
  const [units, setUnits] = React.useState([]);

  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});

  //#endregion

  //#region UDF

  const getOperationGroups = () => {
    http.get(OPERATION_GROUP.get_active).then(res => {
      if (res.data.succeeded) {
        const operationGroups = res.data.data.map(item => ({ label: item.groupName, value: item.id }));
        setOperationGroups(operationGroups);
      }
    });
  };
  const getUnits = () => {
    http.get(UNIT.get_active).then(res => {
      if (res.data.succeeded) {
        const units = res.data.data.map(item => ({
          ...item,
          label: `${getSign(item.sign)} - ${item.unitName}`,
          value: item.id
        }));
        setUnits(units);
      }
    });
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('sortOrder' in fieldValues) {
      if (!fieldValues.sortOrder) {
        temp.sortOrder = requiredMessage;
      } else {
        temp.sortOrder = '';
      }
    }
    if ('operationGroupId' in fieldValues) {
      if (!fieldValues.operationGroupId) {
        temp.operationGroupId = requiredSelection;
      } else {
        temp.operationGroupId = '';
      }
    }
    if ('dockingParameters' in fieldValues) {
      if (!fieldValues.dockingParameters) {
        temp.dockingParameters = requiredMessage;
      } else if (fieldValues.dockingParameters.length > 50) {
        temp.dockingParameters = 'Docking Parameters can not exceed fifty character';
      } else {
        temp.dockingParameters = '';
      }
    }
    if ('unitId' in fieldValues) {
      if (!fieldValues.unitId) {
        temp.unitId = requiredSelection;
      } else {
        temp.unitId = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook

  useEffect(() => {
    getOperationGroups();
    getUnits();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const operationGroup = { label: recordForEdit.operationGroup.groupName, value: recordForEdit.operationGroup.id };
      const units = { label: recordForEdit.unitName, value: recordForEdit.id };
      setOperationGroup(operationGroup);
      setUnit(units);
      setState(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };
    if (name === 'sortOrder') {
      const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
      setState({
        ...state,
        [name]: regx.test(value) ? value : state['sortOrder']
      });
    } else {
      setState({
        ...state,
        [name]: type === 'checkbox' ? checked : value
      });
    }

    validate(filedValue);
  };

  const onOperationGroupChange = (e, newValue) => {
    if (newValue) {
      const controlName = refOperationGroup.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setOperationGroup(newValue);
      setState({ ...state, operationGroupId: newValue.value, groupName: newValue.label });
      validate(filedValue);
    } else {
      setOperationGroup(null);
      setState({ ...state, operationGroupId: '', groupName: '' });
    }
  };

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      const controlName = refOperationGroup.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setUnit(newValue);
      setState({ ...state, unitId: newValue.value, unitName: newValue.sign });
      validate(filedValue);
    } else {
      setUnit(null);
      setState({ ...state, unitId: '', unitName: '' });
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
            <TextInput
              name="sortOrder"
              label="Sort Order"
              value={state.sortOrder}
              error={errors.sortOrder}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refOperationGroup}
              name="operationGroupId"
              data={operationGroups}
              label="Select Operation Group"
              value={operationGroup}
              error={errors.operationGroupId}
              onChange={onOperationGroupChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refUnits}
              name="unitId"
              data={units}
              label="Select Unit"
              value={unit}
              error={errors.unitId}
              onChange={onUnitChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="parameterName"
              label="Parameter Name"
              value={state.parameterName}
              error={errors.parameterName}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="details" label="Details" value={state.details} error={errors.details} onChange={onChange} />
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

export default DecokingLogSheetForm;

import { Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';
import {
  Checkbox,
  CustomAutoComplete,
  CustomTimePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { LAB_SHIFT, OPERATION_GROUP } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { time24 } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

export const initialDecLabFieldValues = {
  id: 0,
  slotName: '',
  operationGroupId: '',
  operationGroupName: '',
  shiftId: '',
  shiftName: '',
  fromTime: '',
  toTime: '',
  isEndNextDay: false,
  isActive: true
};

const TimeSlotForm = props => {
  const classes = useStyles();
  const refOperationGroup = useRef();
  const refShift = useRef();

  const { recordForEdit, onSubmit } = props;

  //#region states
  const [state, setState] = React.useState(initialDecLabFieldValues);
  const [errors, setErrors] = React.useState({});

  const [operationGroup, setperationGroup] = React.useState(null);
  const [operationGroups, setOperationGroups] = React.useState([]);

  const [shift, setShift] = React.useState(null);
  const [shifts, setShifts] = React.useState([]);

  const [fromTime, setFromTime] = React.useState(null);
  const [toTime, setToTime] = React.useState(null);
  //#endregion

  //#region UDF

  // Get Operation Group and Shift for dropdown load
  const getDropdowns = () => {
    axios
      .all([http.get(OPERATION_GROUP.get_all), http.get(LAB_SHIFT.get_active)])
      .then(
        axios.spread((...responses) => {
          const operationGroupsResponse = responses[0];
          const shiftsResponse = responses[1];
          if (operationGroupsResponse.data.succeeded && shiftsResponse.data.succeeded) {
            const operationGroups = operationGroupsResponse.data.data.map(item => ({
              label: item.groupName,
              value: item.id
            }));
            const shifts = shiftsResponse.data.data.map(item => ({ label: item.shiftName, value: item.id }));
            setOperationGroups(operationGroups);
            setShifts(shifts);
          }
        })
      )

      .catch(err => toastAlerts('error', err));
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('slotName' in fieldValues) {
      if (!fieldValues.slotName) {
        temp.slotName = requiredMessage;
      } else if (fieldValues.slotName.length > 20) {
        temp.slotName = 'Time Slot Name can not exceed twenty character';
      } else {
        temp.slotName = '';
      }
    }
    if ('operationGroupId' in fieldValues) {
      if (!fieldValues.operationGroupId) {
        temp.operationGroupId = requiredSelection;
      } else {
        temp.operationGroupId = '';
      }
    }
    if ('shiftId' in fieldValues) {
      if (!fieldValues.shiftId) {
        temp.shiftId = requiredSelection;
      } else {
        temp.shiftId = '';
      }
    }
    if ('fromTime' in fieldValues) {
      if (!fieldValues.fromTime) {
        temp.fromTime = requiredSelection;
      } else {
        temp.fromTime = '';
      }
    }
    if ('toTime' in fieldValues) {
      if (!fieldValues.toTime) {
        temp.toTime = requiredSelection;
      } else {
        temp.toTime = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook

  useEffect(() => {
    getDropdowns();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const operationGroup = { label: recordForEdit.operationGroup.groupName, value: recordForEdit.operationGroup.id };
      const shift = { label: recordForEdit.shift.shiftName, value: recordForEdit.shift.id };
      const fromTime = `01/01/0001 ${recordForEdit.fromTime}`;
      const toTime = `01/01/0001 ${recordForEdit.toTime}`;
      setperationGroup(operationGroup);
      setShift(shift);
      setFromTime(fromTime);
      setToTime(toTime);
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

  const onOperationGroupChange = (e, newValue) => {
    if (newValue) {
      const controlName = refOperationGroup.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setperationGroup(newValue);
      setState({ ...state, operationGroupId: newValue.value, operationGroupName: newValue.label });
      validate(filedValue);
    } else {
      setperationGroup(null);
      setState({ ...state, operationGroupId: '', operationGroupName: '' });
    }
  };

  const onShiftChange = (e, newValue) => {
    if (newValue) {
      const controlName = refShift.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setShift(newValue);
      setState({ ...state, shiftId: newValue.value, shiftName: newValue.label });
      validate(filedValue);
    } else {
      setShift(null);
      setState({ ...state, shiftId: '', shiftName: '' });
    }
  };

  const onStartTimeChange = date => {
    const filedValue = { fromTime: time24(date) };
    setState({ ...state, fromTime: time24(date) });
    setFromTime(date);
    validate(filedValue);
  };
  const onEndTimeChange = date => {
    const filedValue = { toTime: time24(date) };
    setState({ ...state, toTime: time24(date) });
    setToTime(date);
    validate(filedValue);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e, state);
    }
  };

  const onReset = () => {
    setState(initialDecLabFieldValues);
    setErrors({});
  };
  //#endregion

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="slotName"
              label="Slot Name"
              value={state.slotName}
              error={errors.slotName}
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
              ref={refShift}
              name="shiftId"
              data={shifts}
              label="Select Shift"
              value={shift}
              error={errors.shiftId}
              onChange={onShiftChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTimePicker label="Start Time" error={errors.fromTime} value={fromTime} onChange={onStartTimeChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTimePicker label="End Time" value={toTime} error={errors.toTime} onChange={onEndTimeChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Checkbox name="isEndNextDay" label="Is End Next Day" checked={state.isEndNextDay} onChange={onChange} />
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
      <pre id="jsonData"></pre>
    </FormWrapper>
  );
};

export default TimeSlotForm;

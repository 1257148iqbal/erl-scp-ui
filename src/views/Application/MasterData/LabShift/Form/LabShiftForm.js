import { Grid, makeStyles } from '@material-ui/core';
import {
  Checkbox,
  CustomTimePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect } from 'react';
import { time24 } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  shiftName: '',
  fromTime: '',
  toTime: '',
  alias: '',
  isActive: true,
  isEndNextDay: false
};

const LabShiftForm = props => {
  const classes = useStyles();
  const { recordForEdit, onSubmit } = props;
  //#region states
  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});
  const [fromTime, setFromTime] = React.useState(null);
  const [toTime, setToTime] = React.useState(null);

  //#endregion

  //#region UDF
  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('shiftName' in fieldValues) {
      if (!fieldValues.shiftName) {
        temp.shiftName = requiredMessage;
      } else if (fieldValues.shiftName.length > 20) {
        temp.shiftName = 'Shift Name can not exceed twenty character';
      } else {
        temp.shiftName = '';
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
    if ('alias' in fieldValues) {
      if (!fieldValues.alias) {
        temp.alias = requiredMessage;
      } else if (fieldValues.alias.length > 10) {
        temp.alias = 'Alias Name can not exceed ten character';
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
    if (recordForEdit) {
      const fromTime = `01/01/0001 ${recordForEdit.fromTime}`;
      const toTime = `01/01/0001 ${recordForEdit.toTime}`;
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
              name="shiftName"
              label="Shift Name"
              value={state.shiftName}
              error={errors.shiftName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTimePicker label="Start Time" error={errors.fromTime} value={fromTime} onChange={onStartTimeChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTimePicker label="End Time" value={toTime} error={errors.toTime} onChange={onEndTimeChange} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="alias" label="Alias" value={state.alias} error={errors.alias} onChange={onChange} />
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
    </FormWrapper>
  );
};

export default LabShiftForm;

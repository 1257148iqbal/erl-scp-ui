import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  CustomAutoComplete,
  CustomDatePicker,
  CustomTimePicker,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { DECOKING_LABORATORY_RESULT, DECOKING_NUMBERS } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';
import { formattedDateTime, getTime, getTimeDifference, getTimeFromDate, serverDate } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  },
  timeDifference: {
    color: 'red'
  }
}));

const initialFieldValues = {
  id: 0,
  date: null,
  time: null,
  timeDifference: '',
  decokingNumberId: '',
  number: '',
  cO2: 0,
  co: 0,
  o2: 0,
  airReading: 0,
  cokeFlow: '',
  comment: ''
};

const DecokingLaboratoryForm = props => {
  const classes = useStyles();
  const decokingNumberRef = useRef();

  const { onSubmit, recordForEdit } = props;

  //#region states
  const [state, setState] = React.useState(initialFieldValues);
  const [decokingNumbers, setDecokingNumbers] = useState([]);
  const [decokingNumber, setDecokingNumber] = useState(null);
  const [errors, setErrors] = React.useState({});
  //#endregion

  const validate = (fieldValues = state) => {
    let temp = { ...errors };

    if ('decokingNumberId' in fieldValues) {
      if (!fieldValues.decokingNumberId) {
        temp.decokingNumberId = requiredSelection;
      } else {
        temp.decokingNumberId = '';
      }
    }
    if ('date' in fieldValues) {
      if (!fieldValues.date) {
        temp.date = requiredSelection;
      } else {
        temp.date = '';
      }
    }
    if ('time' in fieldValues) {
      if (!fieldValues.time) {
        temp.time = requiredSelection;
      } else {
        temp.time = '';
      }
    }

    if ('airReading' in fieldValues) {
      if (fieldValues.airReading <= 0) {
        temp.airReading = requiredMessage;
      } else {
        temp.airReading = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };

  const getLastDecokingLab = async (decokingNumberId, date, time) => {
    try {
      const res = await http.get(DECOKING_LABORATORY_RESULT.get_last, { params: { decokingNumberId, date } });
      if (res.data.succeeded) {
        const _date = serverDate(res.data.data.date);
        const _time = res.data.data.time;
        const _dateTime = new Date(`${_date} ${_time}`);
        const _formattedDateTime = formattedDateTime(_dateTime);
        return _formattedDateTime;
      } else {
        toastAlerts('error', res.data.message, 'top-left');
        const _date = serverDate(state.date);
        const _time = getTime(time, 'HH:mm:ss');
        const _dateTime = `${_date} ${_time}`;
        const _selectedDateTime = formattedDateTime(_dateTime, 'yyyy-MM-DD HH:mm:ss');
        return _selectedDateTime;
      }
    } catch (err) {
      toastAlerts('error', err);
    }
  };

  const calculateCokeFlow = (co2 = 0, co = 0, airReading = 0, timeDifference = 0) => {
    const _co2 = co2 ? parseFloat(co2) : 0;
    const _co = co ? parseFloat(co) : 0;
    const _airReading = airReading ? parseFloat(airReading) : 0;
    const _timeDiff = timeDifference ? parseFloat(timeDifference) : 0;
    const cokeFlow = 0.1942 * (_co2 + _co) * _airReading * _timeDiff;
    return Number(cokeFlow).toFixed(2);
  };

  //#region Effects
  useEffect(() => {
    const fetchDecokingNumbers = async () => {
      try {
        const res = await http.get(DECOKING_NUMBERS.get_active);
        if (res.data.succeeded) {
          const activeDecokingNumber = res.data.data.filter(dn => dn.isActive);
          const _decokingNumbers = fillDropDown(activeDecokingNumber, 'decokingNumber', 'id');
          setDecokingNumbers(_decokingNumbers);
        }
      } catch (err) {
        toastAlerts('error', err);
      }
    };
    fetchDecokingNumbers();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const time = `01/01/0001 ${recordForEdit.time}`;
      const decokingNumber = {
        label: recordForEdit.number,
        value: recordForEdit.decokingNumberId,
        fromDate: recordForEdit.fromDate,
        toDate: recordForEdit.toDate
      };
      setDecokingNumber(decokingNumber);
      setState({ ...recordForEdit, time });
    }
  }, [recordForEdit]);

  //#endregion

  //#region Events
  const onDecokingNumberChange = (e, newValue) => {
    if (newValue) {
      const controlName = decokingNumberRef.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setDecokingNumber(newValue);
      setState({ ...state, decokingNumberId: newValue.value, number: newValue.label, date: null, time: null });
      validate(filedValue);
    } else {
      setDecokingNumber(null);
      setState({ ...state, decokingNumberId: '', number: '' });
    }
  };

  const onDateChange = date => {
    if (date) {
      const filedValue = { date: date };
      setState({ ...state, date: date });
      validate(filedValue);
    } else {
      setState({ ...state, date: null });
    }
  };
  const onTimeChange = async time => {
    if (time) {
      const _time = getTimeFromDate(time, 'HH:mm');
      const _date = serverDate(state.date);
      const _dateTime = `${_date} ${_time}`;
      const _selectedDateTime = formattedDateTime(_dateTime, 'yyyy-MM-DD HH:mm:ss');
      const prevDateTime = await getLastDecokingLab(decokingNumber.id, _date, _time);

      const timeDifference = getTimeDifference(_selectedDateTime, prevDateTime, 'asHours');

      if (timeDifference >= 0) {
        const co2 = state.cO2 ? parseFloat(state.cO2) : 0;
        const o2 = state.o2 ? parseFloat(state.o2) : 0;
        const airReading = state.airReading ? parseFloat(state.airReading) : 0;
        const cokeFlow = calculateCokeFlow(co2, o2, airReading, timeDifference);
        const filedValue = { time: time };
        setState({ ...state, time: time, timeDifference: timeDifference, cokeFlow: cokeFlow });
        validate(filedValue);
      } else {
        toastAlerts('warning', 'Invalid time', 'top-left');
        setState({ ...state, time: null });
      }
    } else {
      setState({ ...state, time: null });
    }
  };

  const onCO2Change = e => {
    const { name, value } = e.target;
    const cokeFlow = calculateCokeFlow(value, state.co, state.airReading, state.timeDifference);
    setState({
      ...state,
      [name]: value,
      cokeFlow: cokeFlow
    });
    const filedValue = { [name]: value };
    validate(filedValue);
  };

  const onCOChange = e => {
    const { name, value } = e.target;
    const cokeFlow = calculateCokeFlow(state.cO2, value, state.airReading, state.timeDifference);
    setState({
      ...state,
      [name]: value,
      cokeFlow: cokeFlow
    });
    const filedValue = { [name]: value };
    validate(filedValue);
  };

  const onAirReadingChange = e => {
    const { name, value } = e.target;

    const cokeFlow = calculateCokeFlow(state.cO2, state.o2, value, state.timeDifference);
    setState({
      ...state,
      [name]: value,
      cokeFlow: cokeFlow
    });
    const filedValue = { [name]: value };
    validate(filedValue);
  };

  const onChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'o2':
        // const readingRegex = /^[+-]?\d*(?:[.,]\d*)?$/;
        // const validInput = readingRegex.test(value) ? value : state[name];
        setState({
          ...state,
          [name]: value
        });
        break;

      default:
        setState({
          ...state,
          [name]: value
        });
        break;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validate()) {
      onSubmit(state);
    }
  };
  //#endregion
  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              disabled={state.id > 0}
              ref={decokingNumberRef}
              name="decokingNumberId"
              data={decokingNumbers}
              label="Decoking Number"
              value={decokingNumber}
              error={errors.decokingNumberId}
              onChange={onDecokingNumberChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomDatePicker
              disabled={!decokingNumber || state.id > 0}
              label="Select Date"
              minDate={decokingNumber?.fromDate}
              {...(decokingNumber?.toDate && { maxDate: decokingNumber?.toDate })}
              value={state.date}
              error={errors.date}
              onChange={onDateChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTimePicker
              disabled={state.id > 0}
              label="Select Time"
              views={['hours', 'minutes']}
              format={'HH:mm'}
              value={state.time}
              error={errors.time}
              onChange={onTimeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              disabled
              className={classes.timeDifference}
              name="timeDifference"
              label="Time Difference"
              value={state.timeDifference}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              type="number"
              name="cO2"
              label={'CO\u2082'}
              value={state.cO2}
              error={errors.cO2}
              onChange={onCO2Change}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput type="number" name="co" label="CO" value={state.co} error={errors.co} onChange={onCOChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput type="number" name="o2" label={'O\u2082'} value={state.o2} error={errors.o2} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              type="number"
              name="airReading"
              label="Air Reading"
              value={state.airReading}
              error={errors.airReading}
              onChange={onAirReadingChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput disabled name="cokeFlow" label="Coke Flow" value={state.cokeFlow} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="comment" label="Comment" value={state.comment} error={errors.comment} onChange={onChange} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <SaveButton onClick={handleSubmit} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default DecokingLaboratoryForm;

import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  CheckboxesGroup,
  CustomAutoComplete,
  CustomDatePicker,
  CustomDateTimePicker,
  CustomTimePicker,
  RadioGroup,
  TextInput
} from 'components/CustomControls';
import moment from 'moment';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));

const initialState = {
  userName: '',
  age: '',
  gender: '',
  tnc: true,
  tiffin: [
    { label: 'Breakfast', name: 'breakfast', checked: false, disabled: false },
    { label: 'Lunch', name: 'lunch', checked: false, disabled: false },
    { label: 'Dinner', name: 'dinner', checked: false, disabled: false },
    { label: 'Late Night', name: 'latenight', checked: false, disabled: true }
  ],
  dateOfBirth: '',
  time12: '',
  time24: '',
  dateTime: '',
  autoComplete: ''
};

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

const autoCompleteData = [
  { label: 'lable 1', value: 1 },
  { label: 'lable 2', value: 2 },
  { label: 'lable 3', value: 3 },
  { label: 'lable 4', value: 4 },
  { label: 'lable 5', value: 5 },
  { label: 'lable 6', value: 6 },
  { label: 'lable 7', value: 7 },
  { label: 'lable 8', value: 8 },
  { label: 'lable 9', value: 9 }
];

export default function Test() {
  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [dob, setDob] = useState(null);
  const [time, setTime] = useState(null);
  const [value, setValue] = useState(null);

  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validateAge = regx.test(value) ? value : state.age;

    if (name === 'age') {
      setState({
        ...state,
        [name]: validateAge
      });
    } else {
      setState({
        ...state,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const onTiffinChange = (e, tiffinName) => {
    const { checked } = e.target;
    const oldTiffins = [...state.tiffin];
    const updatedTiffins = oldTiffins.map(item => {
      if (item.name === tiffinName) {
        item.checked = checked;
      }
      return item;
    });
    setState({ ...state, tiffin: updatedTiffins });
  };

  const onAutoCompleteChange = (e, newValue) => {
    if (newValue) {
      setValue(newValue);
    } else {
      setValue(null);
    }
  };

  const onSubmit = () => {
    const selectedTiffin = state.tiffin
      .filter(x => x.checked)
      .map(y => {
        delete y.disabled;
        return y;
      });
    let tiffinNames = [];
    selectedTiffin.map(item => tiffinNames.push(item.name));

    const obj = {
      ...state,
      age: +state.age,
      dateOfBirth: dob == null ? '' : moment(dob).format('yyyy-MM-DD'),
      tiffin: selectedTiffin,
      tiffinNames,
      time12: time == null ? '' : moment(time).format('hh:mm a'),
      time24: time == null ? '' : moment(time).format('HH:mm'),
      dateTime: time == null ? '' : moment(time).format('yyyy-MM-DD HH:mm'),
      autoCompleteData: value ? value.value : ''
    };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(obj, null, 2));
  };

  return (
    <>
      <CustomAutoComplete data={autoCompleteData} label="Auto Complete" value={value} onChange={onAutoCompleteChange} />

      <TextInput label="User Name" name="userName" value={state.userName} onChange={onChange} />
      <TextInput label="Age" name="age" value={state.age} onChange={onChange} />
      <RadioGroup groupName="Gender" row={false} name="gender" value={state.gender} onChange={onChange} items={genders} />
      <Checkbox name="tnc" label="Agree with TnC" checked={state.tnc} onChange={onChange} />
      <div className={classes.root}>
        <CheckboxesGroup
          groupName="Tiffin"
          items={state.tiffin}
          onChange={(e, tiffinName) => onTiffinChange(e, tiffinName)}
        />
        <CheckboxesGroup
          groupName="Tiffin"
          items={state.tiffin}
          onChange={(e, tiffinName) => onTiffinChange(e, tiffinName)}
        />
      </div>
      <CustomDatePicker label="Dob" value={dob} onChange={setDob} />
      <CustomTimePicker label="Time Picker" value={time} onChange={setTime} />
      <CustomDateTimePicker label="Date Time Picker" value={time} onChange={setTime} />

      <button onClick={onSubmit}>Click</button>
    </>
  );
}

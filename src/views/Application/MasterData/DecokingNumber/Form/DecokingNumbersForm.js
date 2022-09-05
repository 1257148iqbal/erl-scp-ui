import { Grid, makeStyles } from '@material-ui/core';
import {
  Checkbox,
  CustomDatePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useState } from 'react';
import { serverDate } from 'utils/dateHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  decokingNumber: '',
  details: '',
  fromDate: '',
  toDate: '',
  isActive: true
};

const DecokingNumberPage = props => {
  const classes = useStyles();

  const { recordForEdit, onSubmit } = props;
  //#region states

  const [state, setState] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  //#endregion

  //#region UDF

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('decokingNumber' in fieldValues) {
      if (!fieldValues.decokingNumber) {
        temp.decokingNumber = requiredMessage;
      } else if (fieldValues.decokingNumber.length > 100) {
        temp.decokingNumber = 'Docking Number can not exceed hundred character';
      } else {
        temp.decokingNumber = '';
      }
    }

    if ('fromDate' in fieldValues) {
      if (!fieldValues.fromDate) {
        temp.fromDate = requiredSelection;
      } else {
        temp.fromDate = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook

  useEffect(() => {
    if (recordForEdit) {
      const fromDate = recordForEdit.fromDate;
      const toDate = recordForEdit.toDate;
      setFromDate(fromDate);
      setToDate(toDate);
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

  const onFromDateChange = fromDate => {
    const filedValue = { fromDate: fromDate };
    setState({ ...state, fromDate: serverDate(fromDate) });
    setFromDate(fromDate);
    validate(filedValue);
  };
  const onToDateChange = toDate => {
    if (toDate) {
      setState({ ...state, toDate: serverDate(toDate) });
      setToDate(toDate);
    } else {
      setState({ ...state, toDate: null });
      setToDate(null);
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
              name="decokingNumber"
              label="Decoking Number"
              value={state.decokingNumber}
              error={errors.decokingNumber}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="details" label="Details" value={state.details} error={errors.details} onChange={onChange} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomDatePicker
              label="Select From Date"
              value={fromDate}
              onChange={onFromDateChange}
              error={errors.fromDate}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomDatePicker
              disabled={!fromDate}
              label="Select To Date"
              value={toDate}
              minDate={fromDate}
              onChange={onToDateChange}
            />
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

export default DecokingNumberPage;

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
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import { symbolsArray } from 'constants/symbols';
import React, { useEffect, useRef } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 350
  }
}));

const initialFieldValues = {
  id: 0,
  unitName: '',
  alias: '',
  sign: '',
  isActive: true
};

const UnitForm = props => {
  const classes = useStyles();
  const refSign = useRef();
  const { recordForEdit, onSubmit } = props;
  //#region states
  const [state, setState] = React.useState(initialFieldValues);

  const [symbol, setSymbol] = React.useState(null);
  const [symbols] = React.useState(symbolsArray);
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDF
  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('unitName' in fieldValues) {
      if (!fieldValues.unitName) {
        temp.unitName = requiredMessage;
      } else if (fieldValues.unitName.length > 50) {
        temp.unitName = 'Unit Name can not exceed fifty character';
      } else {
        temp.unitName = '';
      }
    }
    if ('sign' in fieldValues) {
      if (!fieldValues.sign) {
        temp.sign = requiredSelection;
      } else {
        temp.sign = '';
      }
    }
    if ('alias' in fieldValues) {
      if (!fieldValues.alias) {
        temp.alias = requiredMessage;
      } else if (fieldValues.alias.length > 20) {
        temp.alias = 'Unit Name can not exceed twenty character';
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
      const _symbol = symbolsArray.find(item => item.value === recordForEdit.sign);
      setSymbol(_symbol);
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

  const onSignChange = (e, newValue) => {
    if (newValue) {
      const controlName = refSign.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setSymbol(newValue);
      setState({ ...state, sign: newValue.value });
      validate(filedValue);
    } else {
      setSymbol(null);
      setState({ ...state, sign: '' });
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
              name="unitName"
              label="Unit Name"
              value={state.unitName}
              error={errors.unitName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="alias" label="Alias" value={state.alias} error={errors.alias} onChange={onChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refSign}
              name="sign"
              data={symbols}
              label="Select Sign"
              value={symbol}
              error={errors.sign}
              onChange={onSignChange}
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

export default UnitForm;

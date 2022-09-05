import { Grid, makeStyles } from '@material-ui/core';
import { Checkbox, Form, FormWrapper, ResetButton, SaveButton, TextInput } from 'components/CustomControls';
import { requiredMessage } from 'constants/ErrorMessages';
import React, { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  tankName: '',
  tankNumber: '',
  isActive: true
};

const TankCreateForm = props => {
  const classes = useStyles();
  const { recordForEdit, onSubmit } = props;
  //#region states
  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDF
  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('tankName' in fieldValues) {
      if (!fieldValues.tankName) {
        temp.tankName = requiredMessage;
      } else if (fieldValues.tankName.length > 50) {
        temp.tankName = 'Tank Name can not exceed fifty character';
      } else {
        temp.tankName = '';
      }
    }
    if ('tankNumber' in fieldValues) {
      if (!fieldValues.tankNumber) {
        temp.tankNumber = requiredMessage;
      } else if (fieldValues.tankNumber.length > 15) {
        temp.tankNumber = 'Tank Number can not exceed fifteen character';
      } else {
        temp.tankNumber = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    if (recordForEdit) {
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
              name="tankName"
              label="Tank Name"
              value={state.tankName}
              error={errors.tankName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="tankNumber"
              label="Tank Number"
              value={state.tankNumber}
              error={errors.tankNumber}
              onChange={onChange}
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

export default TankCreateForm;

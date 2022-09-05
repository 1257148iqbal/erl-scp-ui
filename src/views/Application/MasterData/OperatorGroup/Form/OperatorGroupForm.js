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
  groupName: '',
  alias: '',
  isActive: true
};

const OperatorGroupForm = props => {
  const classes = useStyles();
  const { recordForEdit, onSubmit } = props;
  //#region states
  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDF
  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('groupName' in fieldValues) {
      if (!fieldValues.groupName) {
        temp.groupName = requiredMessage;
      } else if (fieldValues.groupName.length > 20) {
        temp.groupName = 'Group Name can not exceed twenty character';
      } else {
        temp.groupName = '';
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
              name="groupName"
              label="Group Name"
              value={state.groupName}
              error={errors.groupName}
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

export default OperatorGroupForm;

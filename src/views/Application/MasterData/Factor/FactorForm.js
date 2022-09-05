/*
  > Title: Form page for Factor
  > Description: This file invoked  when drawer open
  > Author: Nasir Ahmed
  > Date: 2021-07-15
*/

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
import { TAG } from 'constants/ApiEndPoints/v1';
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
  factorType: '',
  factor: '',
  tagId: '',
  tagName: '',
  isActive: true
};

const ShiftForm = props => {
  const refTag = useRef();
  const classes = useStyles();
  const { recordForEdit, onSubmit } = props;
  //#region states

  const [tag, setTag] = React.useState(null);
  const [tags, setTags] = React.useState([]);

  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDF

  const getTags = () => {
    http.get(TAG.get_all).then(res => {
      if (res.succeeded) {
        const tags = res.data.map(item => ({ label: item.tagName, value: item.id }));
        setTags(tags);
      }
    });
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('tagId' in fieldValues) {
      if (!fieldValues.tagId) {
        temp.tagId = requiredSelection;
      } else {
        temp.tagId = '';
      }
    }
    if ('factorType' in fieldValues) {
      if (!fieldValues.factorType) {
        temp.factorType = requiredMessage;
      } else if (fieldValues.factorType.length > 20) {
        temp.factorType = 'Factor type can not exceed twenty character';
      } else {
        temp.factorType = '';
      }
    }
    if ('factor' in fieldValues) {
      if (!fieldValues.factor) {
        temp.factor = requiredMessage;
      } else if (fieldValues.factor.length > 10) {
        temp.factor = 'Group Name can not exceed ten character';
      } else {
        temp.factor = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const tag = { label: recordForEdit.tag.tagName, value: recordForEdit.tag.id };
      setState(recordForEdit);
      setTag(tag);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;

    const regxFactor = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validateFactor = regxFactor.test(value) ? value : state.factor;

    const filedValue = { [name]: value };

    if (name === 'factor') {
      setState({
        ...state,
        [name]: validateFactor
      });
    } else {
      setState({
        ...state,
        [name]: type === 'checkbox' ? checked : value
      });
    }

    validate(filedValue);
  };

  const onTagChange = (e, newValue) => {
    if (newValue) {
      const controlName = refTag.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setTag(newValue);
      setState({ ...state, tagId: newValue.value, tagName: newValue.label });
      validate(filedValue);
    } else {
      setTag(null);
      setState({ ...state, tagId: '', tagName: '' });
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
              ref={refTag}
              name="tagId"
              data={tags}
              label="Select Tag"
              value={tag}
              error={errors.tagId}
              showGroupBy
              onChange={onTagChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="factorType"
              label="Factor Type"
              value={state.factorType}
              error={errors.factorType}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="factor" label="Factor" value={state.factor} error={errors.factor} onChange={onChange} />
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

export default ShiftForm;

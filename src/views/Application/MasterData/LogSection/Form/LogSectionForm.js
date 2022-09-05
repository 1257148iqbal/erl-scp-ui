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
import { OPERATION_GROUP } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import React, { useEffect, useRef } from 'react';
import { http } from 'services/httpService';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  operationGroupId: '',
  sectionName: '',
  details: '',
  serialNo: '',
  isActive: true
};

const SectionForm = props => {
  const classes = useStyles();
  const refname = useRef();

  const { recordForEdit, onSubmit } = props;

  //#region states
  const [operationGroup, setOperationGroup] = React.useState(null);
  const [operationGroups, setOperationGroups] = React.useState([]);

  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});
  //#endregion

  //#region UDF

  const getOperationGroups = () => {
    http.get(OPERATION_GROUP.get_all).then(res => {
      if (res.data.succeeded) {
        const operationGroups = res.data.data.map(item => ({ label: item.groupName, value: item.id }));
        setOperationGroups(operationGroups);
      }
    });
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('operationGroupId' in fieldValues) {
      if (!fieldValues.operationGroupId) {
        temp.operationGroupId = requiredSelection;
      } else {
        temp.operationGroupId = '';
      }
    }
    if ('sectionName' in fieldValues) {
      if (!fieldValues.sectionName) {
        temp.sectionName = requiredMessage;
      } else if (fieldValues.sectionName.length > 50) {
        temp.sectionName = 'Section Name can not exceed fifty character';
      } else {
        temp.sectionName = '';
      }
    }
    if ('details' in fieldValues) {
      if (!fieldValues.details) {
        temp.details = requiredMessage;
      } else if (fieldValues.details.length > 100) {
        temp.details = 'Details can not exceed hundred character';
      } else {
        temp.details = '';
      }
    }
    if ('serialNo' in fieldValues) {
      if (!fieldValues.serialNo) {
        temp.serialNo = requiredMessage;
      } else {
        temp.serialNo = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    if (recordForEdit) {
      const operationGroup = { label: recordForEdit.operationGroup.groupName, value: recordForEdit.operationGroup.id };
      setOperationGroup(operationGroup);
      setState(recordForEdit);
    }
  }, [recordForEdit]);

  useEffect(() => {
    getOperationGroups();
  }, []);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;
    const regexSerial = /^\d*(?:[0-9]\d*)?$/;
    const validatedSerial = regexSerial.test(value) ? value : state.serialNo;

    const filedValue = { [name]: value };

    if (name === 'serialNo') {
      setState({
        ...state,
        [name]: validatedSerial
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
      const controlName = refname.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setOperationGroup(newValue);
      setState({ ...state, operationGroupId: newValue.value, operationGroupName: newValue.label });
      validate(filedValue);
    } else {
      setOperationGroup(null);
      setState({ ...state, operationGroupId: '', operationGroupName: '' });
    }
  };

  const onReset = () => {
    setState(initialFieldValues);
    setOperationGroup(null);
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
              ref={refname}
              name="operationGroupId"
              data={operationGroups}
              label="Select Operation Group"
              value={operationGroup}
              error={errors.operationGroupId}
              onChange={onOperationGroupChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="sectionName"
              label="Section Name"
              value={state.sectionName}
              error={errors.sectionName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              multiline
              name="details"
              label="Details"
              value={state.details}
              error={errors.details}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="serialNo"
              label="Serial No"
              value={state.serialNo}
              error={errors.serialNo}
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

export default SectionForm;

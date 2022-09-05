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
import { LAB_UNIT } from 'constants/ApiEndPoints/v1';
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
  labUnitId: '',
  sampleName: '',
  density: '',
  alias: '',
  isActive: true
};

const TestSampleForm = props => {
  const classes = useStyles();
  const refUnit = useRef();

  const { recordForEdit, onSubmit } = props;
  //#region states

  const [unit, setUnit] = React.useState(null);
  const [units, setUnits] = React.useState([]);

  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});

  //#endregion

  //#region UDF

  const getLabUnits = () => {
    http.get(LAB_UNIT.get_all_active).then(res => {
      if (res.data.succeeded) {
        const labunits = res.data.data.map(item => ({ label: item.unitName, value: item.id }));
        setUnits(labunits);
      }
    });
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('labUnitId' in fieldValues) {
      if (!fieldValues.labUnitId) {
        temp.labUnitId = requiredSelection;
      } else {
        temp.labUnitId = '';
      }
    }
    if ('sampleName' in fieldValues) {
      if (!fieldValues.sampleName) {
        temp.sampleName = requiredMessage;
      } else if (fieldValues.sampleName.length > 20) {
        temp.sampleName = 'Sample Name can not exceed twenty character';
      } else {
        temp.sampleName = '';
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
    getLabUnits();
  }, []);
  useEffect(() => {
    if (recordForEdit) {
      const labunit = { label: recordForEdit.labUnit.unitName, value: recordForEdit.labUnit.id };
      setUnit(labunit);
      setState(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;

    const regxDensity = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validDensity = regxDensity.test(value) ? value : state.density;

    const filedValue = { [name]: value };

    if (name === 'density') {
      setState({
        ...state,
        [name]: validDensity
      });
    } else {
      setState({
        ...state,
        [name]: type === 'checkbox' ? checked : value
      });
    }

    validate(filedValue);
  };

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      const controlName = refUnit.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setUnit(newValue);
      setState({ ...state, labUnitId: newValue.value });
      validate(filedValue);
    } else {
      setUnit(null);
      setState({ ...state, labUnitId: '' });
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
              ref={refUnit}
              name="labUnitId"
              data={units}
              label="Select Unit"
              value={unit}
              error={errors.labUnitId}
              onChange={onUnitChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="sampleName"
              label="Sample Name"
              value={state.sampleName}
              error={errors.sampleName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="density" label="Density" value={state.density} onChange={onChange} />
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

export default TestSampleForm;

import { Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';
import {
  Checkbox,
  CustomAutoComplete,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { OPERATION_GROUP, SECTION, UNIT } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  }
}));

const initialFieldValues = {
  id: 0,
  sortOrder: '',
  sectionId: '',
  sectionName: '',
  name: '', // tagName is own property of JS, that's why tagName changed to name
  details: '',
  factor: 0,
  vcf: 0,
  unitId: '',
  unitName: '',
  ipAddress: '192.168.0.21',
  deviceModel: 'Device Model',
  brand: 'Brand',
  isActive: true
};

const TagForm = props => {
  const classes = useStyles();
  const refSectionName = useRef();
  const operationGroupRef = useRef();
  const refUnitName = useRef();

  const { recordForEdit, onSubmit } = props;

  const [operationGroup, setOperationGroup] = React.useState(null);
  const [operationGroups, setOperationGroups] = React.useState([]);

  const [section, setSection] = React.useState(null);
  const [sections, setSections] = React.useState([]);

  const [unit, setUnit] = React.useState(null);
  const [units, setUnits] = React.useState([]);

  //#region states
  const [state, setState] = React.useState(initialFieldValues);
  const [errors, setErrors] = React.useState({});

  //#endregion

  //#region UDF

  // Get Operation Groups and Units for drowdown
  const getDropdowns = () => {
    axios
      .all([http.get(`${OPERATION_GROUP.get_all}`), http.get(UNIT.get_active)])
      .then(
        axios.spread((...responses) => {
          const operationGroupsResponse = responses[0];
          const unitsResponse = responses[1];
          if (operationGroupsResponse.data.succeeded && unitsResponse.data.succeeded) {
            const operationGroupsData = operationGroupsResponse.data.data.map(item => ({
              label: item.groupName,
              value: item.id
            }));
            const units = unitsResponse.data.data.map(item => ({
              ...item,
              label: `${getSign(item.sign)} - ${item.unitName}`,
              value: item.id
            }));
            setOperationGroups(operationGroupsData);
            setUnits(units);
          }
        })
      )
      .catch(err => toastAlerts(err));
  };

  const getSectionsByOperationGroup = operationGroupId => {
    http
      .get(`${SECTION.get_by_operationGroup}/${operationGroupId}`)
      .then(res => {
        if (res.data.succeeded) {
          const sections = res.data.data.map(item => ({ label: item.sectionName, value: item.id }));
          const sortedData = _.sortBy(sections, ['label']);
          setSections(sortedData);
        }
      })
      .catch(err => toastAlerts(err));
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('sectionId' in fieldValues) {
      if (!fieldValues.sectionId) {
        temp.sectionId = requiredSelection;
      } else {
        temp.sectionId = '';
      }
    }
    if ('name' in fieldValues) {
      if (!fieldValues.name) {
        temp.name = requiredMessage;
      } else if (fieldValues.name.length > 20) {
        temp.name = 'Tag Name can not exceed twenty character';
      } else {
        temp.name = '';
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
    if ('unitId' in fieldValues) {
      if (!fieldValues.unitId) {
        temp.unitId = requiredSelection;
      } else {
        temp.unitId = '';
      }
    }
    if ('ipAddress' in fieldValues) {
      if (!fieldValues.ipAddress) {
        temp.ipAddress = requiredMessage;
      } else if (fieldValues.ipAddress.length > 15) {
        temp.ipAddress = 'IP can not exceed fifteen character';
      } else {
        temp.ipAddress = '';
      }
    }
    if ('deviceModel' in fieldValues) {
      if (!fieldValues.deviceModel) {
        temp.deviceModel = requiredMessage;
      } else if (fieldValues.deviceModel.length > 50) {
        temp.deviceModel = 'Device Model can not exceed fifty character';
      } else {
        temp.deviceModel = '';
      }
    }
    if ('brand' in fieldValues) {
      if (!fieldValues.brand) {
        temp.brand = requiredMessage;
      } else if (fieldValues.brand.length > 50) {
        temp.brand = 'Device Model can not exceed fifty character';
      } else {
        temp.brand = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#region

  //#region hook
  useEffect(() => {
    const stateCleanUp = getDropdowns();
    return () => stateCleanUp;
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const section = { label: recordForEdit.section.sectionName, value: recordForEdit.section.id };
      const unit = {
        label: `${getSign(recordForEdit.unit.sign)} - ${recordForEdit.unit.unitName}`,
        value: recordForEdit.unit.id
      };
      setSection(section);
      setUnit(unit);
      setState(recordForEdit);
    }
  }, [recordForEdit]);
  //#endregion

  //#region Events
  const onChange = e => {
    const { type, name, value, checked } = e.target;

    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const filedValue = { [name]: value };

    switch (name) {
      case 'factor':
      case 'sortOrder':
        const validFactor = regx.test(value) ? value : state.factor;
        setState({
          ...state,
          [name]: validFactor
        });
        break;

      default:
        setState({
          ...state,
          [name]: type === 'checkbox' ? checked : value
        });
        break;
    }
    validate(filedValue);
  };

  const onOperationGroupChange = (e, newValue) => {
    if (newValue) {
      setOperationGroup(newValue);
      setSection(null);
      getSectionsByOperationGroup(newValue.value);
    } else {
      setSection(null);
    }
  };

  const onSectionChange = (e, newValue) => {
    if (newValue) {
      const controlName = refSectionName.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setSection(newValue);
      setState({ ...state, sectionId: newValue.value, sectionName: newValue.label });
      validate(filedValue);
    } else {
      setSection(null);
      setState({ ...state, sectionId: '', sectionName: '' });
    }
  };

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      const controlName = refUnitName.current.getAttribute('name');
      const filedValue = { [controlName]: newValue.value };
      setUnit(newValue);
      setState({ ...state, unitId: newValue.value, unitName: newValue.sign });
      validate(filedValue);
    } else {
      setUnit(null);
      setState({ ...state, unitId: '', unitName: '' });
    }
  };

  const onReset = () => {
    setState(initialFieldValues);
    setSection(null);
    setSections([]);
    setUnit(null);
    setUnits([]);
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
              name="sortOrder"
              label="Sort Order"
              value={state.sortOrder}
              error={errors.sortOrder}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={operationGroupRef}
              name="operationGroupId"
              data={operationGroups}
              label="Select Operation Group"
              value={operationGroup}
              onChange={onOperationGroupChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refSectionName}
              name="sectionId"
              data={sections}
              label="Select Section"
              value={section}
              error={errors.sectionId}
              onChange={onSectionChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="name" label="Tag Name" value={state.name} error={errors.name} onChange={onChange} />
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
            <TextInput name="factor" label="Factor" value={state.factor} error={errors.factor} onChange={onChange} />
          </Grid>
          {/*<Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="vcf" label="VCF" value={state.vcf} error={errors.vcf} onChange={onChange} />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomAutoComplete
              ref={refUnitName}
              name="unitId"
              data={units}
              label="Select Unit"
              value={unit}
              error={errors.unitId}
              onChange={onUnitChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="ipAddress"
              label="IP Address"
              value={state.ipAddress}
              error={errors.ipAddress}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput
              name="deviceModel"
              label="Device Model"
              value={state.deviceModel}
              error={errors.deviceModel}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput name="brand" label="Brand" value={state.brand} error={errors.brand} onChange={onChange} />
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

export default TagForm;

/** Change log
 * 23-Dec-2021 (Nasir): Re-use Factor
 **/

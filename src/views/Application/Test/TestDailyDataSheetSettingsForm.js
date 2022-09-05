import { Collapse, FormControlLabel, Grid, lighten, makeStyles, Switch, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import { Checkbox, CustomAutoComplete, Form, FormWrapper, SaveButton, TextInput } from 'components/CustomControls';
import { DAILY_DATA_SHEET_SETTINGS, TAG, TEST_SAMPLE, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import _ from 'lodash';
import qs from 'querystring';
import React, { useEffect, useRef, useState } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { stringifyConsole } from 'utils/commonHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300
  },
  container: {
    display: 'flex'
  },
  polygon: {
    fill: lighten(theme.palette.background.paper, 0.1),
    stroke: theme.palette.divider,
    strokeWidth: 1
  }
}));

const initialState = {
  ddsSection: '',
  tagId: 0,
  tagName: '',
  displayName: '',
  factor: 0,
  vcf: 0,
  signe: '',
  testSampleId: 0,
  density: 0,
  isAutoReading: false,
  timeSlotId: '',
  timeSlotName: '',
  operationGroupId: 0,
  tuiIds: '',
  isActive: true
};
const DailyDataSheetSettingsForm = props => {
  const classes = useStyles();
  //#region Refs
  const reportSectionRef = useRef();
  const sectionRef = useRef();
  const tesSampleRef = useRef();
  const timeSlotRef = useRef();
  //#endregion

  const { recordForEdit } = props;

  //#region States

  const [state, setState] = useState(initialState);

  const [reportSections, setReportSections] = useState([]);
  const [reportSection, setReportSection] = useState(null);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);

  const [testSamples, setTestSamples] = useState([]);
  const [testSample, setTestSample] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState(null);

  const [errors, setErrors] = useState({});

  //#endregion

  //#region UDFs

  const getDependencies = async () => {
    const queryParamForTestSample = {
      PageNumber: 1,
      PageSize: 200
    };
    Axios.all([
      http.get(DAILY_DATA_SHEET_SETTINGS.get_data_sheet_sections),
      http.get(TAG.get_active),
      http.get(`${TEST_SAMPLE.get_all}?${qs.stringify(queryParamForTestSample)}`)
    ])
      .then(
        await Axios.spread((...responses) => {
          const reportSectionRepsonse = responses[0];
          const tagResponse = responses[1];
          const testSampleResponse = responses[2];
          if (reportSectionRepsonse.succeeded && tagResponse.succeeded && testSampleResponse.succeeded) {
            const reportSections = reportSectionRepsonse.data.map(item => ({ label: _.startCase(item), value: item }));

            const tags = tagResponse.data.map(item => ({
              label: item.tagName,
              value: item.id,
              operationGroupId: item.operationGroupId
            }));

            const testSamples = testSampleResponse.data.map(item => ({ label: item.sampleName, value: item.id }));

            setReportSections(reportSections);
            setTags(tags);
            setTestSamples(testSamples);
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  };

  const getTimeSlots = operationGroupId => {
    const queryParam = {
      OperationGroupId: operationGroupId
    };
    http
      .get(`${TIME_SLOT.get_by_operation_group_and_shift}?${qs.stringify(queryParam)}`)
      .then(res => {
        const timeSlots = res.data.map(item => ({ label: item.slotName, value: item.id }));
        setTimeSlots(timeSlots);
      })
      .catch(err => stringifyConsole(err));
  };

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('ddsSection' in fieldValues) {
      if (!fieldValues.ddsSection) {
        temp.ddsSection = requiredSelection;
      } else {
        temp.ddsSection = '';
      }
    }
    if ('tagId' in fieldValues) {
      if (!fieldValues.tagId) {
        temp.tagId = requiredSelection;
      } else {
        temp.tagId = '';
      }
    }
    if ('displayName' in fieldValues) {
      if (!fieldValues.displayName) {
        temp.displayName = requiredMessage;
      } else if (fieldValues.displayName.length > 15) {
        temp.displayName = 'Display Name can not exceed fifteen character';
      } else {
        temp.displayName = '';
      }
    }
    if ('factor' in fieldValues) {
      if (!fieldValues.factor) {
        temp.factor = requiredMessage;
      } else if (fieldValues.factor.length > 15) {
        temp.factor = 'Factor can not exceed fifteen number';
      } else {
        temp.factor = '';
      }
    }
    if ('vcf' in fieldValues) {
      if (!fieldValues.vcf) {
        temp.vcf = requiredMessage;
      } else if (fieldValues.vcf.length > 10) {
        temp.vcf = 'VCF can not exceed ten number';
      } else {
        temp.vcf = '';
      }
    }
    if ('signe' in fieldValues) {
      if (!fieldValues.signe) {
        temp.signe = requiredMessage;
      } else if (fieldValues.signe.length > 10) {
        temp.signe = 'VCF can not exceed ten character';
      } else {
        temp.signe = '';
      }
    }
    if ('testSampleId' in fieldValues) {
      if (!fieldValues.testSampleId) {
        temp.testSampleId = requiredSelection;
      } else {
        temp.testSampleId = '';
      }
    }
    if ('density' in fieldValues) {
      if (!fieldValues.density) {
        temp.density = requiredMessage;
      } else if (fieldValues.density.length > 10) {
        temp.density = 'Density can not exceed ten character';
      } else {
        temp.density = '';
      }
    }
    if ('timeSlotId' in fieldValues) {
      if (!fieldValues.timeSlotId) {
        temp.timeSlotId = requiredSelection;
      } else {
        temp.timeSlotId = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    getDependencies();
  }, []);

  useEffect(() => {
    if (recordForEdit) {
      const reportSection = { label: _.startCase(recordForEdit.ddsSection), value: recordForEdit.ddsSection };
      const tag = { label: recordForEdit.tagName, value: recordForEdit.tagId };
      setTag(tag);
      setReportSection(reportSection);
      getTimeSlots(recordForEdit.operationGroupId);
      if (recordForEdit.isAutoReading) {
        const timeSlot = { label: recordForEdit.timeSlotName, value: recordForEdit.timeSlotId };
        setTimeSlot(timeSlot);
      }

      setState(recordForEdit);
    }
  }, [recordForEdit]);

  //#endregion

  //#region Events
  const onSectionChange = (e, newValue) => {
    if (newValue) {
      setReportSection(newValue);
      setState({ ...state, ddsSection: newValue.value });
    } else {
      setReportSection(null);
      setState({ ...state, ddsSection: '' });
    }
  };

  const onTagChange = (e, newValue) => {
    if (newValue) {
      setTag(newValue);
      getTimeSlots(newValue.operationGroupId);
      setState({ ...state, tagId: newValue.value, tagName: newValue.label, operationGroupId: newValue.operationGroupId });
    } else {
      setTag(null);
      setState({ ...state, tagId: 0, tagName: '' });
    }
  };

  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setTestSample(newValue);
      setState({ ...state, testSampleId: newValue.value });
    } else {
      setTestSample(null);
      setState({ ...state, testSampleId: 0 });
    }
  };

  const onTimeSlotChange = (e, newValue) => {
    if (newValue) {
      setTimeSlot(newValue);
      setState({ ...state, timeSlotId: newValue.value, timeSlotName: newValue.label });
    } else {
      setTimeSlot(null);
      setState({ ...state, timeSlotId: null, timeSlotName: '' });
    }
  };

  const onInputChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };

    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    switch (name) {
      case 'factor':
        const validFactor = regx.test(value) ? value : state.factor;
        setState({
          ...state,
          [name]: validFactor
        });
        break;
      case 'vcf':
        const validVcf = regx.test(value) ? value : state.vcf;
        setState({
          ...state,
          [name]: validVcf
        });
        break;
      case 'density':
        const validDensity = regx.test(value) ? value : state.density;
        setState({
          ...state,
          [name]: validDensity
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

  const onTUISChange = (e, newValue) => {
    if (newValue.length > 0) {
      setState({ ...state, tuiIds: newValue.map(tui => tui.value).join(',') });
    } else {
      setState({ ...state, tuiIds: '' });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  //#endregion

  return (
    <FormWrapper>
      <Form className={classes.root} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <CustomAutoComplete
              ref={reportSectionRef}
              data={reportSections}
              label="Select Section"
              value={reportSection}
              onChange={onSectionChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutoComplete ref={sectionRef} data={tags} label="Select Tag" value={tag} onChange={onTagChange} />
          </Grid>
          <Grid item xs={12}>
            <TextInput name="displayName" label="Display Name" value={state.displayName} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextInput name="factor" label="Factor" value={state.factor} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextInput name="vcf" label="VCF" value={state.vcf} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextInput name="signe" label="Sign" value={state.signe} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12}>
            <CustomAutoComplete
              ref={tesSampleRef}
              data={testSamples}
              label="Select Test Sample"
              value={testSample}
              onChange={onTestSampleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              size="small"
              limitTags={2}
              options={tags}
              getOptionLabel={option => (option.label ? option.label : option)}
              onChange={onTUISChange}
              renderInput={params => (
                <TextField {...params} margin="dense" variant="outlined" label="Select TUIs" placeholder="TUI:" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput name="density" label="Density" value={state.density} onChange={onInputChange} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={state.isAutoReading} sx={{ m: 1 }} name="isAutoReading" />}
              label="Is Auto Reading"
              onChange={onInputChange}
            />

            <Collapse in={state.isAutoReading}>
              <Grid item xs={12}>
                <CustomAutoComplete
                  ref={timeSlotRef}
                  data={timeSlots}
                  label="Time Slot Name"
                  value={timeSlot}
                  onChange={onTimeSlotChange}
                />
              </Grid>
            </Collapse>
          </Grid>

          <Grid item xs={12}>
            <Checkbox name="isActive" label="Is Active" checked={state.isActive} onChange={onInputChange} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-start">
          <SaveButton />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default DailyDataSheetSettingsForm;

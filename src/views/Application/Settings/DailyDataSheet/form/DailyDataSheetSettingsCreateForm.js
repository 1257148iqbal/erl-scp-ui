import { Collapse, FormControlLabel, Grid, lighten, makeStyles, Switch, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Axios from 'axios';
import {
  CancelButton,
  Checkbox,
  CustomAutoComplete,
  CustomPreloder,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import {
  DAILY_DATA_SHEET_SETTINGS,
  LAB_SHIFT,
  SHIFT_REPORT_SETTINGS,
  TAG,
  TEST_SAMPLE,
  TIME_SLOT
} from 'constants/ApiEndPoints/v1';
import {
  PS_3039,
  PS_3042,
  PS_3044,
  PS_AMMONIA,
  PS_AO,
  PS_CI,
  PS_POWER,
  PS_WITH_FACTOR,
  PS_WITH_TUIS,
  PS_WITH_TUIS_DEDUCT_15
} from 'constants/PSFormulaNames';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 800
  },
  container: {
    display: 'flex'
  },
  polygon: {
    fill: lighten(theme.palette.background.paper, 0.1),
    stroke: theme.palette.divider,
    strokeWidth: 1
  },
  h3: {
    color: 'blue'
  },
  rules: {
    margin: 0,
    padding: '5px 15px',
    listStylePosition: 'inside'
  }
}));

const initialState = {
  sortOrder: '',
  ddsSection: '',
  tagId: 0,
  tagName: '',
  displayName: '',
  factor: 0,
  vcf: 0,
  signe: '',
  testSampleId: 0,
  testSampleName: '',
  density: 0,
  isAutoReading: false,
  timeSlotId: '',
  timeSlotName: '',
  labShiftId: '',
  labShiftName: '',
  operationGroupId: 0,
  isActive: true,
  tuiIds: '',
  psFormula: '',
  refSettingId: ''
};

const psFunctionData = [
  { label: PS_WITH_TUIS_DEDUCT_15, value: PS_WITH_TUIS_DEDUCT_15 },
  { label: PS_3042, value: PS_3042 },
  { label: PS_WITH_TUIS, value: PS_WITH_TUIS },
  { label: PS_3044, value: PS_3044 },
  { label: PS_3039, value: PS_3039 },
  { label: PS_WITH_FACTOR, value: PS_WITH_FACTOR },
  { label: PS_AMMONIA, value: PS_AMMONIA },
  { label: PS_CI, value: PS_CI },
  { label: PS_AO, value: PS_AO },
  { label: PS_POWER, value: PS_POWER }
];

const DailyDataSheetSettingsForm = props => {
  const history = useHistory();
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  //#region Refs
  const reportSectionRef = useRef();
  const sectionRef = useRef();
  const tesSampleRef = useRef();
  const psFunctionRef = useRef();
  const timeSlotRef = useRef();
  const ddssRef = useRef();
  //#endregion

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

  const [labShifts, setLabShifts] = useState([]);
  const [labShift, setLabShift] = useState(null);

  const [labColumns, setLabColumns] = useState([]);
  const [labColumn, setLabColumn] = useState(null);

  const [psFunctions] = useState(psFunctionData);
  const [psFunction, setPsFunction] = useState(null);

  const [dailydatasheetsettings, setDailydatasheetsettings] = useState([initialState]);
  const [dailydatasheetsetting, setDailydatasheetsetting] = useState(null);

  const [tuis, setTuis] = useState([]);

  const [selected, setSelected] = React.useState(false);

  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  //#endregion

  //#region UDFs

  const getDependencies = async () => {
    Axios.all([
      http.get(DAILY_DATA_SHEET_SETTINGS.get_data_sheet_sections),
      http.get(DAILY_DATA_SHEET_SETTINGS.get_all),
      http.get(TAG.get_active),
      http.get(TEST_SAMPLE.get_active),
      http.get(TIME_SLOT.get_by_operation_group_and_shift),
      http.get(LAB_SHIFT.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_lab_column)
    ])
      .then(
        await Axios.spread((...responses) => {
          const reportSectionRepsonse = responses[0];
          const ddssRepsonse = responses[1];
          const tagResponse = responses[2];
          const testSampleResponse = responses[3];
          const timeSlotResponse = responses[4];
          const labShiftResponse = responses[5];
          const laColumnsResponse = responses[6];
          if (
            reportSectionRepsonse.data.succeeded &&
            ddssRepsonse.data.succeeded &&
            tagResponse.data.succeeded &&
            testSampleResponse.data.succeeded &&
            timeSlotResponse.data.succeeded &&
            labShiftResponse.data.succeeded &&
            laColumnsResponse.data.succeeded
          ) {
            const reportSections = reportSectionRepsonse.data.data.map(item => ({ label: _.startCase(item), value: item }));

            const ddss = ddssRepsonse.data.data.reduce((acc, curr) => {
              curr.dataSheetSetting.map(setting => {
                const copiedSetting = Object.assign({}, setting);
                copiedSetting.label = `${setting.displayName}-${setting.ddsSection}`;
                copiedSetting.value = setting.id;
                acc.push({ ...copiedSetting });
                return setting;
              });
              return acc;
            }, []);

            const tags = tagResponse.data.data.map(item => ({
              label: item.tagName,
              value: item.id,
              operationGroupId: item.operationGroupId
            }));

            const testSamples = fillDropDown(testSampleResponse.data.data, 'sampleName', 'id');
            const labShifts = fillDropDown(labShiftResponse.data.data, 'shiftName', 'id');

            const labColumns = laColumnsResponse.data.data.map(lc => ({ label: lc, value: lc }));

            const timeSlots = timeSlotResponse.data.data.map(item => ({
              ...item,
              label: `${item.slotName}-${item.operationGroupName}`,
              value: item.id
            }));

            setReportSections(reportSections);
            setTags(tags);
            setTestSamples(testSamples);
            setDailydatasheetsettings(ddss);
            setTimeSlots(timeSlots);
            setLabShifts(labShifts);
            setLabColumns(labColumns);
            setIsPageLoaded(true);
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  };

  //#endregion

  //#region Effects
  useEffect(() => {
    getDependencies();
  }, []);

  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

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
      setState({ ...state, tagId: newValue.value, tagName: newValue.label, operationGroupId: newValue.operationGroupId });
    } else {
      setTag(null);
      setState({ ...state, tagId: 0, tagName: '' });
    }
  };

  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setTestSample(newValue);
      setState({ ...state, testSampleId: newValue.value, testSampleName: newValue.label });
    } else {
      setTestSample(null);
      setState({ ...state, testSampleId: 0, testSampleName: '' });
    }
  };

  const onTimeSlotChange = (e, newValue) => {
    if (newValue) {
      setTimeSlot(newValue);
      setState({ ...state, timeSlotId: newValue.value, timeSlotName: newValue.slotName });
    } else {
      setTimeSlot(null);
      setState({ ...state, timeSlotId: null, timeSlotName: '' });
    }
  };
  const onLabShiftChange = (e, newValue) => {
    if (newValue) {
      setLabShift(newValue);
      setState({ ...state, labShiftId: newValue.value, labShiftName: newValue.label });
    } else {
      setLabShift(null);
      setState({ ...state, labShiftId: null, labShiftName: '' });
    }
  };

  const onLabColumnChange = (e, newValue) => {
    if (newValue) {
      setLabColumn(newValue);
      setState({ ...state, labColumnName: newValue.value });
    } else {
      setLabColumn(null);
      setState({ ...state, labColumnName: '' });
    }
  };

  const onTUISChange = (e, newValue) => {
    if (newValue.length > 0) {
      setState({ ...state, tuiIds: newValue.map(tui => tui.value).join(',') });
      setTuis(newValue);
    } else {
      setState({ ...state, tuiIds: '' });
    }
  };

  const onPsFunctionChange = (e, newValue) => {
    if (newValue) {
      setPsFunction(newValue);
      setState({ ...state, psFormula: newValue.value });
    } else {
      setPsFunction(null);
      setState({ ...state, psFormula: '' });
    }
  };

  const onDailyDataSheetSettingChange = (e, newValue) => {
    if (newValue) {
      setDailydatasheetsetting(newValue);
      setState({ ...state, refSettingId: newValue.value });
    } else {
      setDailydatasheetsetting(null);
      setState({ ...state, refSettingId: null });
    }
  };

  const onInputChange = e => {
    const { type, name, value, checked } = e.target;
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
      case 'sortOrder':
        const validSortOder = regx.test(value) ? value : state.sortOrder;
        setState({
          ...state,
          [name]: validSortOder
        });
        break;

      default:
        setState({
          ...state,
          [name]: type === 'checkbox' ? checked : value
        });
        break;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      ddsSection: state.ddsSection,
      sortOrder: +state.sortOrder,
      operationGroupId: state.operationGroupId ?? 0,
      tagId: state.tagId ? state.tagId : null,
      tagName: state.tagName ? state.tagName : '',
      displayName: state.displayName,
      factor: +state.factor,
      vcf: +state.vcf,
      signe: state.signe,
      testSampleId: state.testSampleId ? state.testSampleId : null,
      testSampleName: state.testSampleName ? state.testSampleName : '',
      density: state.density,
      isActive: state.isActive,
      isAutoReading: state.isAutoReading,
      timeSlotId: state.timeSlotId ? state.timeSlotId : null,
      timeSlotName: state.timeSlotName ? state.timeSlotName : '',
      tuiIds: state.tuiIds,
      psFormula: state.psFormula ? state.psFormula : '',
      refSettingId: state.refSettingId,
      labShiftId: labShift ? labShift.value : null,
      labShiftName: labShift ? labShift.label : '',
      labColumnName: labColumn ? labColumn.value : ''
    };

    http
      .post(DAILY_DATA_SHEET_SETTINGS.create, data)
      .then(res => {
        setLoading(false);
        setOpenBackdrop(false);
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          toastAlerts('error', res.data.message);
        }
      })
      .catch(err => {
        setLoading(false);
        setOpenBackdrop(false);
        toastAlerts('warning', err);
      });
  };

  const handleChange = () => {
    setSelected(prev => !prev);
  };

  //#endregion

  return (
    <FormWrapper>
      <Form>
        <Grid container>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={selected} onChange={handleChange} />}
              label={selected ? 'Hide' : 'See Rules'}
            />
          </Grid>

          <Collapse in={selected}>
            <Grid item xs={12}>
              <h3 className={classes.h3}>Cumulative Section</h3>
              <ul className={classes.rules}>
                <li>Display Name</li>
                <li>Tag Selection (N.M.)</li>
                <li>Factor</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <h3 className={classes.h3}>TUI Section</h3>
              <ul className={classes.rules}>
                <li>Display Name</li>
                <li>Tag Selection (Multiple)</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3 className={classes.h3}>FI/FIC/Ammonia Section</h3>
              <ul className={classes.rules}>
                <li>Display Name</li>
                <li>Tag Selection</li>
                <li>Sign</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3 className={classes.h3}>Tray Section</h3>
              <ul className={classes.rules}>
                <li>Display Name</li>
                <li>Sign</li>
                <li>Is Auto Reading (False)</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3 className={classes.h3}>Production Synopsis</h3>
              <ul className={classes.rules}>
                <li>Display Name</li>
                <li>Tag Selection</li>
                <li>TUI Selection (Multiple)</li>
                <li>VCF</li>
                <li>Test Sample</li>
                <li>Factor</li>
                <li>PS Formula</li>
              </ul>
            </Grid>
          </Collapse>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              ref={reportSectionRef}
              data={reportSections}
              label="Select Section"
              value={reportSection}
              onChange={onSectionChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              ref={sectionRef}
              data={tags}
              label="Select Tag"
              value={tag}
              onChange={(e, newValue) => onTagChange(e, newValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="displayName" label="Display Name" value={state.displayName} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="factor" label="Factor" value={state.factor} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="vcf" label="VCF" value={state.vcf} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="signe" label="Sign" value={state.signe} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              ref={tesSampleRef}
              data={testSamples}
              label="Select Test Sample"
              value={testSample}
              onChange={onTestSampleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              ref={psFunctionRef}
              data={psFunctions}
              label="PS Function"
              value={psFunction}
              onChange={onPsFunctionChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete
              multiple
              size="small"
              limitTags={2}
              options={tags}
              getOptionLabel={option => option.label}
              onChange={onTUISChange}
              value={tuis}
              renderInput={params => (
                <TextField {...params} margin="dense" variant="outlined" label="Select TUIs" placeholder="TUI:" />
              )}
            />
          </Grid>
          <Grid item container xs={12} sm={6} md={4} lg={3}>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Switch checked={state.isAutoReading} sx={{ m: 1 }} name="isAutoReading" />}
                label="Is Auto Reading"
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutoComplete
                ref={timeSlotRef}
                data={timeSlots}
                label="Time Slot Name"
                value={timeSlot}
                onChange={onTimeSlotChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              ref={ddssRef}
              data={dailydatasheetsettings}
              label="Select Setting"
              value={dailydatasheetsetting}
              onChange={onDailyDataSheetSettingChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete data={labShifts} label="Select Lab Shift" value={labShift} onChange={onLabShiftChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete data={labColumns} label="Select Lab Column" value={labColumn} onChange={onLabColumnChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="sortOrder" label="Sort Order" value={state.sortOrder} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Checkbox name="isActive" label="Is Active" checked={state.isActive} onChange={onInputChange} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-start">
          <SaveButton onClick={handleSubmit} />
          <CancelButton
            onClick={() => {
              history.goBack();
            }}
          />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default DailyDataSheetSettingsForm;

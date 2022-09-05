import { Collapse, FormControlLabel, Grid, Switch, TextField } from '@material-ui/core';
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
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';

const psFunctionData = [
  { label: PS_WITH_TUIS_DEDUCT_15, value: PS_WITH_TUIS_DEDUCT_15 },
  { label: PS_WITH_TUIS, value: PS_WITH_TUIS },
  { label: PS_3044, value: PS_3044 },
  { label: PS_3039, value: PS_3039 },
  { label: PS_WITH_FACTOR, value: PS_WITH_FACTOR },
  { label: PS_AMMONIA, value: PS_AMMONIA },
  { label: PS_CI, value: PS_CI },
  { label: PS_AO, value: PS_AO },
  { label: PS_POWER, value: PS_POWER }
];

const DailyDataSheetSettingsEditForm = () => {
  const { setOpenBackdrop, setLoading } = useBackDrop();

  const location = useLocation();
  const history = useHistory();

  const [state, setState] = useState(null);
  const [psFunctions] = useState(psFunctionData);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [showRule, setShowRule] = useState(false);

  useEffect(() => {
    Axios.all([
      http.get(DAILY_DATA_SHEET_SETTINGS.get_data_sheet_sections),
      http.get(DAILY_DATA_SHEET_SETTINGS.get_all),
      http.get(TAG.get_active),
      http.get(TEST_SAMPLE.get_active),
      http.get(TIME_SLOT.get_by_operation_group_and_shift),
      http.get(LAB_SHIFT.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_lab_column),
      http.get(`${DAILY_DATA_SHEET_SETTINGS.get_single}/${location.state}`)
    ])
      .then(
        Axios.spread((...responses) => {
          const reportSectionRepsonse = responses[0];
          const ddssRepsonse = responses[1];
          const tagResponse = responses[2];
          const testSampleResponse = responses[3];
          const timeSlotsReponse = responses[4];
          const labShiftResponse = responses[5];
          const laColumnsResponse = responses[6];
          const recordForEditResponse = responses[7];
          if (
            reportSectionRepsonse.data.succeeded &&
            ddssRepsonse.data.succeeded &&
            tagResponse.data.succeeded &&
            testSampleResponse.data.succeeded &&
            timeSlotsReponse.data.succeeded &&
            labShiftResponse.data.succeeded &&
            laColumnsResponse.data.succeeded &&
            recordForEditResponse.data.succeeded
          ) {
            const reportSections = reportSectionRepsonse.data.data.map(item => ({ label: _.startCase(item), value: item }));

            const ddsSettings = ddssRepsonse.data.data.reduce((acc, curr) => {
              curr.dataSheetSetting.map(setting => {
                const copiedSetting = Object.assign({}, setting);
                copiedSetting.label = `${setting.displayName} ( ${setting.ddsSection} )`;
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

            const testSamples = testSampleResponse.data.data.map(item => ({ label: item.sampleName, value: item.id }));

            const labShifts = fillDropDown(labShiftResponse.data.data, 'shiftName', 'id');

            const labColumns = laColumnsResponse.data.data.map(lc => ({ label: lc, value: lc }));

            const recordForEdit = recordForEditResponse.data.data;
            const {
              id,
              key,
              sortOrder,
              ddsSection,
              tagId,
              tagName,
              displayName,
              factor,
              vcf,
              signe,
              testSampleId,
              isAutoReading,
              timeSlotId,
              timeSlotName,
              operationGroupId,
              isActive,
              tuiIds,
              psFormula,
              refSettingId,
              labShiftId,

              labColumnName
            } = recordForEdit;

            const timeSlots = timeSlotsReponse.data.data.map(item => ({
              ...item,
              label: `${item.slotName}-${item.operationGroupName}`,
              value: item.id
            }));

            const selectedTuiIds = tuiIds.split(',').map(id => parseInt(id));

            const selectedTestSample = testSampleId ? testSamples.find(item => item.value === testSampleId) : null;

            const selectedPSFormula = psFormula ? psFunctions.find(item => item.value === psFormula) : null;

            const selectedTimeSlot = timeSlotId ? timeSlots.find(item => item.value === timeSlotId) : null;

            const selectedSection = ddsSection ? { label: _.startCase(ddsSection), value: ddsSection } : null;

            const selectedTag = tagId ? { label: tagName, value: tagId } : null;

            const selectedLabShift = labShiftId ? labShifts.find(item => item.value === labShiftId) : null;

            const selectedLabColumn = labColumnName ? labColumns.find(item => item.value === labColumnName) : null;

            const selectedSetting = refSettingId ? ddsSettings.find(ddsSetting => ddsSetting.value === refSettingId) : null;

            const initialState = {
              ddlReportSections: reportSections,
              ddlTags: tags,
              ddlTestSamples: testSamples,
              ddlTimeSlots: timeSlots,
              ddlDdsSettings: ddsSettings,
              ddlLabShifts: labShifts,
              ddlLabColumns: labColumns,

              selectedSection,
              selectedTag,
              selectedTestSample,
              selectedPSFormula,
              selectedTimeSlot,
              selectedSetting,
              selectedLabShift,
              selectedLabColumn,

              id,
              key,
              sortOrder,
              ddsSection,
              tagId,
              tagName,
              displayName,
              factor,
              vcf,
              signe,
              testSampleId,
              isAutoReading,
              timeSlotId,
              timeSlotName,
              operationGroupId,
              isActive,
              tuiIds,
              tuis: tags.filter(item => selectedTuiIds.indexOf(item.value) > -1),
              psFormula
            };
            setState(initialState);
            setIsPageLoaded(true);
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  }, [location.state, psFunctions]);

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events

  const onTagChange = (e, newValue) => {
    if (newValue) {
      setState({
        ...state,
        selectedTag: { label: newValue.label, value: newValue.value },
        operationGroupId: newValue.operationGroupId
      });
    } else {
      setState({ ...state, selectedTag: null });
    }
  };

  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedTestSample: { label: newValue.label, value: newValue.value } });
    } else {
      setState({ ...state, selectedTestSample: null });
    }
  };

  const onPsFormulaChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedPSFormula: { label: newValue.label, value: newValue.value } });
    } else {
      setState({ ...state, selectedPSFormula: null });
    }
  };

  const onTimeSlotChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedTimeSlot: { label: newValue.label, value: newValue.value, ...newValue } });
    } else {
      setState({ ...state, selectedTimeSlot: null });
    }
  };
  const onLabShiftChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedLabShift: { label: newValue.label, value: newValue.value } });
    } else {
      setState({ ...state, selectedLabShift: null });
    }
  };
  const onLabColumnChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedLabColumn: { label: newValue.value, value: newValue.value } });
    } else {
      setState({ ...state, selectedLabColumn: null });
    }
  };

  const onTUISChange = (e, newValue) => {
    if (newValue.length > 0) {
      setState({ ...state, tuis: newValue });
    } else {
      setState({ ...state, tuis: [] });
    }
  };

  const onDDSSettingChange = (e, newValue) => {
    if (newValue) {
      setState({
        ...state,
        selectedSetting: { label: newValue.label, value: newValue.value }
      });
    } else {
      setState({ ...state, selectedSetting: null });
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
      case 'density':
        const validDensity = regx.test(value) ? value : state.density;
        setState({
          ...state,
          [name]: validDensity
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
    setOpenBackdrop(true);
    setLoading(true);
    const data = {
      id: state.id,
      key: state.key,
      sortOrder: +state.sortOrder,
      ddsSection: state.ddsSection,
      operationGroupId: state.operationGroupId ?? 0,
      tagId: state.selectedTag ? state.selectedTag.value : null,
      tagName: state.selectedTag ? state.selectedTag.label : '',
      displayName: state.displayName,
      factor: +state.factor,
      vcf: +state.vcf,
      signe: state.signe,
      testSampleId: state.selectedTestSample ? state.selectedTestSample.value : null,
      testSampleName: state.selectedTestSample ? state.selectedTestSample.label : '',
      density: state.density,
      isActive: state.isActive,
      isAutoReading: state.isAutoReading,
      timeSlotId: state.selectedTimeSlot ? state.selectedTimeSlot.value : null,
      timeSlotName: state.selectedTimeSlot ? state.selectedTimeSlot.slotName : '',
      tuiIds: state.tuis.map(tui => tui.value).join(','),
      psFormula: state.selectedPSFormula ? state.selectedPSFormula.value : '',
      refSettingId: state.selectedSetting ? state.selectedSetting.value : null,

      labShiftId: state.selectedLabShift ? state.selectedLabShift.value : null,
      labShiftName: state.selectedLabShift ? state.selectedLabShift.label : '',
      labColumnName: state.selectedLabColumn ? state.selectedLabColumn.label : ''
    };

    http
      .put(`${DAILY_DATA_SHEET_SETTINGS.update}/${data.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          setOpenBackdrop(false);
          setLoading(false);
          history.goBack();
        } else {
          toastAlerts('error', res.data.message);
          setOpenBackdrop(false);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        setOpenBackdrop(false);
        toastAlerts('error', err);
      });
  };

  const onCancel = () => {
    history.goBack();
  };
  //#endregion
  return (
    <FormWrapper>
      <Form>
        <Grid container>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={showRule} onChange={() => setShowRule(prevState => !prevState)} />}
              label={showRule ? 'Hide' : 'See Rules'}
            />
          </Grid>

          <Collapse in={showRule}>
            <Grid item xs={12}>
              <h3>Cumulative Section</h3>
              <ul>
                <li>Display Name</li>
                <li>Tag Selection (N.M.)</li>
                <li>Factor</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <h3>TUI Section</h3>
              <ul>
                <li>Display Name</li>
                <li>Tag Selection (Multiple)</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3>FI/FIC/Ammonia Section</h3>
              <ul>
                <li>Display Name</li>
                <li>Tag Selection</li>
                <li>Sign</li>
                <li>Is Auto Reading</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3>Tray Section</h3>
              <ul>
                <li>Display Name</li>
                <li>Sign</li>
                <li>Is Auto Reading (False)</li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              <h3>Production Synopsis</h3>
              <ul>
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
            <TextInput
              name="displayName"
              label="Report Section"
              value={_.startCase(state.ddsSection)}
              disabled
              onChange={() => {}}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete data={state.ddlTags} label="Select Tag" value={state.selectedTag} onChange={onTagChange} />
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
              data={state.ddlTestSamples}
              label="Select Test Sample"
              value={state.selectedTestSample}
              onChange={onTestSampleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              data={psFunctions}
              label="PS Formula"
              value={state.selectedPSFormula}
              onChange={onPsFormulaChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Autocomplete
              multiple
              size="small"
              limitTags={2}
              options={state.ddlTags}
              getOptionLabel={option => option.label}
              onChange={onTUISChange}
              value={state.tuis}
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
                onChange={() => setState(({ isAutoReading }) => setState({ ...state, isAutoReading: !isAutoReading }))}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutoComplete
                data={state.ddlTimeSlots}
                label="Time Slot Name"
                value={state.selectedTimeSlot}
                onChange={onTimeSlotChange}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              data={state.ddlDdsSettings}
              label="Select Setting"
              value={state.selectedSetting}
              onChange={onDDSSettingChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              data={state.ddlLabShifts}
              label="Select Lab Shift"
              value={state.selectedLabShift}
              onChange={onLabShiftChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CustomAutoComplete
              data={state.ddlLabColumns}
              label="Select Lab Col."
              value={state.selectedLabColumn}
              onChange={onLabColumnChange}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextInput name="sortOrder" label="Sort Order" value={state.sortOrder} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Checkbox name="isActive" label="Is Active" checked={state.isActive} onChange={onInputChange} />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <SaveButton onClick={handleSubmit} />
          <CancelButton onClick={onCancel} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default DailyDataSheetSettingsEditForm;

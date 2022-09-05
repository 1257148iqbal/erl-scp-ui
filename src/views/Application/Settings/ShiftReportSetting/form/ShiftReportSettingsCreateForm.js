import { Fab, FormControlLabel, Grid, makeStyles, Switch } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import Axios from 'axios';
import {
  CancelButton,
  Checkbox,
  ConfirmDialog,
  CustomAutoComplete,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { LAB_SHIFT, SHIFT, SHIFT_REPORT_SETTINGS, TAG, TEST_SAMPLE, TIME_SLOT, UNIT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import qs from 'querystring';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { getSign } from 'utils/commonHelper';
import { v4 as uuid } from 'uuid';

const useStyles = makeStyles(theme => ({
  addButton: {
    justifyContent: 'center'
  },
  btnChild: {
    color: '#3F51B5'
  },
  btnParent: {
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#3F51B5',
      '& $btnChild': {
        color: '#FFFFFF'
      }
    }
  }
}));

const initialState = {
  shiftSection: '',
  sortOrder: 0,
  valueFrom: '',
  name: '',
  unitId: 0,
  unitName: '',
  tagId: 0,
  testSampleId: 0,
  labColumnName: '',
  getAutoReading: false,
  useTagFactor: false,
  shiftMappings: []
};

const ShiftReportCreateForm = props => {
  const classes = useStyles();
  const history = useHistory();
  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region Refs
  const refShiftReportSection = useRef();
  const refValueFrom = useRef();
  const refUnit = useRef();
  const refTag = useRef();
  const refTestSample = useRef();
  const refCalculationType = useRef();
  const refLabColumnName = useRef();
  const retCalculatinPoint = useRef();
  const refLabShiftTimeSlot = useRef();
  const refShiftName = useRef();
  const refSlotName = useRef();
  //#endregion
  //#region States
  const [shiftReportSections, setShiftReportSections] = useState([]);
  const [shiftReportSection, setShiftReportSection] = useState(null);

  const [valueFroms, setValueFroms] = useState([]);
  const [valueFrom, setValueFrom] = useState(null);

  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState(null);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);

  const [testSamples, setTestSamples] = useState([]);
  const [testSample, setTestSample] = useState(null);

  const [labColumnNames, setLabColumnNames] = useState([]);
  const [labColumnName, setLabColumnName] = useState(null);

  const [calculationTypes, setCalculationTypes] = useState([]);
  const [calculationType, setCalculationType] = useState(null);

  const [calculationPoints, setCalculationPoints] = useState([]);
  const [calculationPoint, setCalculationPoint] = useState(null);

  const [labShifts, setLabShifts] = useState([]);

  const [shifts, setShifts] = useState([]);

  const [state, setState] = useState(initialState);
  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  //#endregion

  //#region UDFs
  const getAllDependencies = () => {
    Axios.all([
      http.get(SHIFT_REPORT_SETTINGS.get_all_shift_sections),
      http.get(SHIFT_REPORT_SETTINGS.get_all_value_from),
      http.get(UNIT.get_active),
      http.get(TAG.get_active),
      http.get(TEST_SAMPLE.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_lab_column),
      http.get(LAB_SHIFT.get_active),
      http.get(SHIFT.get_active),
      http.get(SHIFT_REPORT_SETTINGS.get_all_calculation_type),
      http.get(SHIFT_REPORT_SETTINGS.get_all_calculation_point)
    ]).then(
      Axios.spread((...responses) => {
        const shiftReportResponse = responses[0];
        const valueFromResponse = responses[1];
        const unitResponse = responses[2];
        const tagResponse = responses[3];
        const testSampleResponse = responses[4];
        const labColumnNameResponse = responses[5];
        const labShiftResponse = responses[6];
        const shiftResponse = responses[7];
        const shiftCalculationTypeResponse = responses[8];
        const shiftCalculationPointResponse = responses[9];

        if (
          shiftReportResponse.data.succeeded &&
          valueFromResponse.data.succeeded &&
          unitResponse.data.succeeded &&
          tagResponse.data.succeeded &&
          testSampleResponse.data.succeeded &&
          labColumnNameResponse.data.succeeded &&
          labShiftResponse.data.succeeded &&
          shiftResponse.data.succeeded &&
          shiftCalculationTypeResponse.data.succeeded &&
          shiftCalculationPointResponse.data.succeeded
        ) {
          const shiftReportSections = shiftReportResponse.data.data.map(item => ({
            label: _.startCase(item),
            value: item
          }));

          const valueFromShiftReport = valueFromResponse.data.data.map(value => ({
            label: _.startCase(value),
            value: value
          }));

          const units = unitResponse.data.data.map(unit => ({
            ...unit,

            label: `${getSign(unit.sign)} - ${unit.unitName}`,
            value: unit.id
          }));

          const tags = tagResponse.data.data.map(tag => ({
            ...tag,
            label: `${tag.tagName} (${tag.details})`,
            value: tag.id
          }));

          const testSample = testSampleResponse.data.data.map(sample => ({
            label: sample.sampleName,
            value: sample.id
          }));

          const labColumnName = labColumnNameResponse.data.data.map(lab => ({
            label: _.startCase(lab),
            value: lab
          }));

          const labShift = labShiftResponse.data.data.map(labShift => ({
            label: labShift.shiftName,
            value: labShift.id
          }));

          const shift = shiftResponse.data.data.map(shift => ({
            label: shift.shiftName,
            value: shift.id
          }));

          const calculationType = shiftCalculationTypeResponse.data.data.map(type => ({
            label: _.startCase(type),
            value: type
          }));

          const calculationPoint = shiftCalculationPointResponse.data.data.map(Point => ({
            label: _.startCase(Point),
            value: Point
          }));

          setShiftReportSections(shiftReportSections);
          setValueFroms(valueFromShiftReport);
          setUnits(units);
          setTags(tags);
          setTestSamples(testSample);
          setLabColumnNames(labColumnName);
          setLabShifts(labShift);
          setShifts(shift);
          setCalculationTypes(calculationType);
          setCalculationPoints(calculationPoint);
        }
      })
    );
  };

  const getTimeSlotsByOperationGroupAndShift = async (operationGroupId, shiftId, rowId) => {
    const queryParam = {
      OperationGroupId: operationGroupId,
      ShiftId: shiftId
    };

    try {
      const timeSlotResponse = await http.get(`${TIME_SLOT.get_by_operation_group_and_shift}?${qs.stringify(queryParam)}`);

      const timeSlots = timeSlotResponse.data.data.map(item => ({
        label: `${item.slotName} (${item.operationGroupName})`,
        value: item.id
      }));

      const oldShiftMappings = [...state.shiftMappings];

      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['timeSlots'] = timeSlots;
        }
        return item;
      });
      setState({ ...state, shiftMappings: newShiftMappings });
    } catch ({ response }) {
      toastAlerts('error', response.data.Message);
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    getAllDependencies();
  }, []);
  //#endregion

  //#region Events
  const onShiftReportSectionChange = (e, newValue) => {
    setCalculationType(null);
    setCalculationPoint(null);
    if (newValue) {
      setShiftReportSection(newValue);
    } else {
      setShiftReportSection(null);
    }
  };
  const onValueFromChange = (e, newValue) => {
    if (newValue) {
      setValueFrom(newValue);
      setTestSample(null);
      setTag(null);
    } else {
      setValueFrom(null);
      setTestSample(null);
      setTag(null);
    }
  };

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      setUnit(newValue);
    } else {
      setUnit(null);
    }
  };

  const onTagChange = (e, newValue) => {
    if (newValue) {
      setTag(newValue);
      setLabColumnName(null);
    } else {
      setTag(null);
      setLabColumnName(null);
    }
  };

  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setTestSample(newValue);
    } else {
      setTestSample(null);
    }
  };

  const onCalculationTypeChange = (e, newValue) => {
    if (newValue) {
      setCalculationType(newValue);
    } else {
      setCalculationType(null);
    }
  };

  const onCalculationPointChange = (e, newValue) => {
    if (newValue) {
      setCalculationPoint(newValue);
    } else {
      setCalculationPoint(null);
    }
  };

  const onLabColumnNameChange = (e, newValue) => {
    if (newValue) {
      setLabColumnName(newValue);
    } else {
      setLabColumnName(null);
    }
  };

  const onLabShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappings];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = newValue;
          item['selectedTimeSlot'] = null;
        }
        return item;
      });
      setState({ ...state, shiftMappings: newShiftMappings });
    } else {
      toastAlerts('error', 'Something Was Wrong');
    }
  };

  const onShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappings];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = newValue;
        }
        return item;
      });
      setState({ ...state, shiftMappings: newShiftMappings });
      getTimeSlotsByOperationGroupAndShift(tag ? tag.operationGroupId : 0, newValue.value, rowId);
    } else {
      toastAlerts('error', 'Something Was Wrong');
    }
  };

  const onTimeSlotChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappings];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = newValue;
          item['selectedLabShift'] = null;
        }
        return item;
      });
      setState({ ...state, shiftMappings: newShiftMappings });
    } else {
      toastAlerts('error', 'Something Was Wrong');
    }
  };

  const onInputChange = e => {
    const { name, value } = e.target;
    if (name === 'sortOrder') {
      const regxFactor = /^[+-]?\d*(?:[.,]\d*)?$/;
      const validReading = regxFactor.test(value) ? value : [...state];
      setState({
        ...state,
        [name]: validReading
      });
    } else {
      setState({
        ...state,
        [name]: value
      });
    }
  };

  const onUsePreviousDayChange = (e, rowId) => {
    const { name, checked } = e.target;
    const oldShiftMappings = [...state.shiftMappings];
    const newShiftMappings = oldShiftMappings.map(item => {
      if (item.rowId === rowId) {
        item[name] = checked;
      }
      return item;
    });
    setState({ ...state, shiftMappings: newShiftMappings });
  };

  const onRemoveFields = item => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const oldState = [...state.shiftMappings];
    oldState.splice(
      oldState.findIndex(siteReport => siteReport.rowId === item.rowId),
      1
    );
    setState({ ...state, shiftMappings: oldState });
    if (item.id === 0) {
      toastAlerts('success', 'Shift Report Deleted Successfully', 'bottom-end');
    } else {
      http
        .delete(`${SHIFT_REPORT_SETTINGS.delete}/${item.rowId}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message, 'bottom-end');
          }
        })
        .catch(err => toastAlerts('err', internalServerError));
    }
  };

  const onAutoReadingStatusChange = e => {
    const { name, checked } = e.target;
    setState({
      ...state,
      [name]: checked,
      shiftMappings: checked
        ? [
            ...state.shiftMappings,
            {
              rowId: uuid(),
              selectedLabShift: null,
              selectedShift: null,
              timeSlots: [],
              selectedTimeSlot: null,
              usePreviousDay: false
            }
          ]
        : []
    });
  };

  const onUseTagFactorStatusChange = e => {
    const { name, checked } = e.target;
    setState({
      ...state,
      [name]: checked
    });
  };

  const onAddFields = () => {
    setState({
      ...state,
      shiftMappings: [
        ...state.shiftMappings,
        {
          rowId: uuid(),
          selectedLabShift: null,
          selectedShift: null,
          timeSlots: [],
          selectedTimeSlot: null,
          usePreviousDay: false
        }
      ]
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      shiftSection: shiftReportSection ? shiftReportSection.value : '',
      sortOrder: state.sortOrder ? +state.sortOrder : 0,
      valueFrom: valueFrom ? valueFrom.value : '',
      name: state.name,
      unitId: unit ? unit.value : null,
      unitName: unit ? unit.sign : '',
      getAutoReading: state.getAutoReading,
      useTagFactor: state.useTagFactor,
      tagId: tag ? tag.value : null,
      testSampleId: testSample ? testSample.value : null,
      labColumnName: labColumnName ? labColumnName.value : '',
      calculationType: calculationType ? calculationType.value : '',
      calculationPoint: calculationPoint ? calculationPoint.value : ''
    };
    if (state.getAutoReading) {
      data.shiftMappings = state.shiftMappings.map(item => {
        const labShiftId = item.selectedLabShift ? item.selectedLabShift.value : null;
        const shiftId = item.selectedShift ? item.selectedShift.value : null;
        const timeSlotId = item.selectedTimeSlot ? item.selectedTimeSlot.value : null;
        const usePreviousDay = item.usePreviousDay;
        return {
          labShiftId,
          shiftId,
          timeSlotId,
          usePreviousDay
        };
      });
    }

    http
      .post(`${SHIFT_REPORT_SETTINGS.create}`, data)
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

  //#endregion

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid container spacing={3} item xs={12} sm={6} md={3} lg={3}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <CustomAutoComplete
                ref={refShiftReportSection}
                data={shiftReportSections}
                label="Select Section"
                value={shiftReportSection}
                onChange={onShiftReportSectionChange}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextInput label="Sort Order" name="sortOrder" value={state.sortOrder} onChange={onInputChange} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <CustomAutoComplete
              ref={refValueFrom}
              data={valueFroms}
              label="Select Value From"
              value={valueFrom}
              onChange={onValueFromChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <TextInput label="Display Name" name="name" value={state.name} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <CustomAutoComplete ref={refUnit} data={units} label="Select Unit" value={unit} onChange={onUnitChange} />
          </Grid>
          {valueFrom && valueFrom.value === 'Log' && (
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <CustomAutoComplete ref={refTag} data={tags} label="Select Tags" value={tag} onChange={onTagChange} />
            </Grid>
          )}

          {valueFrom && valueFrom.value === 'Lab' && (
            <Fragment>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refTestSample}
                  data={testSamples}
                  label="Select Test Sample"
                  value={testSample}
                  onChange={onTestSampleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refLabColumnName}
                  data={labColumnNames}
                  label="Select Lab Column"
                  value={labColumnName}
                  onChange={onLabColumnNameChange}
                />
              </Grid>
            </Fragment>
          )}
          <Grid container spacing={3} item xs={12} sm={6} md={3} lg={3}>
            {shiftReportSection && (shiftReportSection.value === 'Box-10' || shiftReportSection.value === 'Box-11') && (
              <Fragment>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomAutoComplete
                    ref={refCalculationType}
                    data={calculationTypes}
                    label="Select Calc. Type"
                    value={calculationType}
                    onChange={onCalculationTypeChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomAutoComplete
                    ref={retCalculatinPoint}
                    data={calculationPoints}
                    label="Select Calc. Point"
                    value={calculationPoint}
                    onChange={onCalculationPointChange}
                  />
                </Grid>
              </Fragment>
            )}
          </Grid>

          <Grid container spacing={3} item xs={12} sm={6} md={3} lg={3}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <FormControlLabel
                control={<Switch checked={state.getAutoReading} sx={{ m: 1 }} name="getAutoReading" />}
                label="Auto Reading"
                onChange={onAutoReadingStatusChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <FormControlLabel
                control={<Switch checked={state.useTagFactor} sx={{ m: 1 }} name="useTagFactor" />}
                label="Use Tag Factor"
                onChange={onUseTagFactorStatusChange}
              />
            </Grid>
          </Grid>
        </Grid>

        {state.shiftMappings.map((item, index) => (
          <div key={item.rowId}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refShiftName}
                  name="shiftId"
                  data={shifts}
                  label="Shift"
                  value={item.selectedShift}
                  onChange={(e, newValue) => onShiftChange(e, newValue, item.rowId)}
                />
              </Grid>
              {valueFrom && valueFrom.value === 'Lab' && (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <CustomAutoComplete
                    ref={refLabShiftTimeSlot}
                    data={labShifts}
                    label="Lab Shift"
                    value={item.selectedLabShift}
                    onChange={(e, newValue) => onLabShiftChange(e, newValue, item.rowId)}
                  />
                </Grid>
              )}
              {valueFrom && valueFrom.value === 'Log' && (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <CustomAutoComplete
                    ref={refSlotName}
                    name="timeSlotId"
                    data={item.timeSlots}
                    label="Select Slot"
                    value={item.selectedTimeSlot}
                    onChange={(e, newValue) => onTimeSlotChange(e, newValue, item.rowId)}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={3} md={2} lg={2}>
                <Checkbox
                  name="usePreviousDay"
                  label="Use Previous Day"
                  checked={item.usePreviousDay}
                  onChange={e => onUsePreviousDayChange(e, item.rowId)}
                />
              </Grid>

              <Grid item xs={12} sm={3} md={1} lg={1}>
                {index === state.shiftMappings.length - 1 ? (
                  <Fab size="small" onClick={() => onAddFields()} className={classes.btnParent}>
                    <Add className={classes.btnChild} />
                  </Fab>
                ) : null}
                <Fab
                  className={classes.btnParent}
                  size="small"
                  disabled={state.shiftMappings.length === 1}
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Shift Report Setting?',
                      content: 'Are you sure to delete this shift report setting??',
                      onConfirm: () => onRemoveFields(item)
                    });
                  }}>
                  <Remove className={classes.btnChild} />
                </Fab>
                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
              </Grid>
            </Grid>
          </div>
        ))}

        <Grid container justifyContent="flex-start">
          <SaveButton />
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

export default ShiftReportCreateForm;

import { Fab, FormControlLabel, Grid, makeStyles, Switch } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import Axios from 'axios';
import {
  CancelButton,
  Checkbox,
  ConfirmDialog,
  CustomAutoComplete,
  CustomPreloder,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { LAB_SHIFT, SHIFT, SHIFT_REPORT_SETTINGS, TAG, TEST_SAMPLE, TIME_SLOT, UNIT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
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

const ShiftReportSettingsEditForm = props => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region Refs
  const refValueFrom = useRef();
  const refUnit = useRef();
  const refTag = useRef();
  const refTestSample = useRef();
  const refLabShiftTimeSlot = useRef();
  const refShiftName = useRef();
  const refSlotName = useRef();
  const refLabColumnName = useRef();
  const retCalculatinPoint = useRef();
  const refCalculationType = useRef();

  //#endregion
  //#region States

  const [state, setState] = useState(null);

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  //#endregion

  //#region UDFs
  const getAllDependencies = () => {
    Axios.all([
      http.get(`${SHIFT_REPORT_SETTINGS.get_single}/${location.state}`),
      http.get(UNIT.get_active),
      http.get(TAG.get_active),
      http.get(TEST_SAMPLE.get_active),
      http.get(LAB_SHIFT.get_active),
      http.get(SHIFT.get_active),
      http.get(TIME_SLOT.get_all, {
        params: {
          PageNumber: 1,
          PageSize: 200
        }
      }),
      http.get(SHIFT_REPORT_SETTINGS.get_all_value_from),
      http.get(SHIFT_REPORT_SETTINGS.get_all_lab_column),
      http.get(SHIFT_REPORT_SETTINGS.get_all_calculation_type),
      http.get(SHIFT_REPORT_SETTINGS.get_all_calculation_point)
    ]).then(
      Axios.spread((...responses) => {
        const recordForEditResponse = responses[0];
        const unitResponse = responses[1];
        const tagResponse = responses[2];
        const testSampleResponse = responses[3];
        const labShiftResponse = responses[4];
        const shiftResponse = responses[5];
        const timeSlotResponse = responses[6];
        const valueFromResponse = responses[7];
        const labColumnResponse = responses[8];
        const shiftCalculationTypeResponse = responses[9];
        const shiftCalculationPointResponse = responses[10];

        if (
          recordForEditResponse.data.succeeded &&
          unitResponse.data.succeeded &&
          tagResponse.data.succeeded &&
          testSampleResponse.data.succeeded &&
          labShiftResponse.data.succeeded &&
          shiftResponse.data.succeeded &&
          timeSlotResponse.data.succeeded &&
          valueFromResponse.data.succeeded &&
          labColumnResponse.data.succeeded &&
          shiftCalculationTypeResponse.data.succeeded &&
          shiftCalculationPointResponse.data.succeeded
        ) {
          const {
            id,
            key,
            shiftSection,
            sortOrder,
            valueFrom,
            name,
            unitId,
            tagId,
            testSampleId,
            labColumnName,
            calculationType,
            calculationPoint,
            getAutoReading,
            useTagFactor,
            shiftMappings
          } = recordForEditResponse.data.data;

          /* Unit Section */
          const unitDdl = unitResponse.data.data.map(unit => ({
            ...unit,
            label: `${getSign(unit.sign)} - ${unit.unitName}`,
            value: unit.id
          }));

          const selectedUnit = unitId ? unitDdl.find(item => item.value === unitId) : null;
          /* Unit Section */

          /* Value From Section */
          const valueFromDdl = valueFromResponse.data.data.map(value => ({
            label: value,
            value: value
          }));
          const selectedValueFrom = valueFrom ? valueFromDdl.find(item => item.value === valueFrom) : null;
          /* Value From Section */

          /* Tag Section */
          const tagsDdl = tagResponse.data.data.map(tag => ({
            ...tag,
            label: `${tag.tagName} (${tag.details})`,
            value: tag.id
          }));

          const selectedTag = tagId ? tagsDdl.find(item => item.value === tagId) : null;
          /* Tag Section */

          /* Test Sample Section */
          const testSampleDdl = testSampleResponse.data.data.map(sample => ({
            ...sample,
            label: sample.sampleName,
            value: sample.id
          }));

          const selectedTestSample = testSampleId ? testSampleDdl.find(item => item.value === testSampleId) : null;
          /* Test Sample Section */

          /* Lab Column Section */
          const labColumnsDDL = labColumnResponse.data.data.map(lc => ({ label: lc, value: lc }));

          const selectedLabColumn = labColumnsDDL.find(item => item.value === labColumnName)
            ? labColumnsDDL.find(item => item.value === labColumnName)
            : null;

          /* Lab Column Section */

          /* Lab Shift Section */
          const labShifts = labShiftResponse.data.data.map(labShift => ({
            ...labShift,
            label: labShift.shiftName,
            value: labShift.id
          }));
          /* Lab Shift Section */

          /* Shift Section */
          const shifts = shiftResponse.data.data.map(shift => ({
            ...shift,
            label: shift.shiftName,
            value: shift.id
          }));
          /* Shift Section */

          /* Time Slot Section */
          const timeSlots = timeSlotResponse.data.data.map(slot => ({
            ...slot,
            label: slot.slotName,
            value: slot.id
          }));
          /* Time Slot Section */

          /* Calculatin Type */
          const calculationTypeDDL = shiftCalculationTypeResponse.data.data.map(ct => ({ label: ct, value: ct }));

          const selectedCalculationType = calculationTypeDDL.find(item => item.value === calculationType)
            ? calculationTypeDDL.find(item => item.value === calculationType)
            : null;

          /*  Calculatin Type */

          /* Calculation Point */
          const calculationPointDDL = shiftCalculationPointResponse.data.data.map(cp => ({ label: cp, value: cp }));

          const selectedCalculationPoint = calculationPointDDL.find(item => item.value === calculationPoint)
            ? calculationPointDDL.find(item => item.value === calculationPoint)
            : null;

          /* Calculation Point */

          const shiftMappingsArray = shiftMappings.map(item => {
            const coppiedItem = Object.assign({}, item);

            const selectedLabShift = labShifts.find(s => s.id === item.labShiftId);

            const selectedShift = shifts.find(s => s.id === item.shiftId);

            const selectedtimeSlot = timeSlots.find(s => s.id === item.timeSlotId);

            coppiedItem.rowId = uuid();
            coppiedItem.labShifts = labShifts;
            coppiedItem.selectedLabShift = selectedLabShift;
            coppiedItem.shifts = shifts;
            coppiedItem.selectedShift = selectedShift;
            coppiedItem.timeSlots = timeSlots;
            coppiedItem.selectedTimeSlot = selectedtimeSlot;
            return coppiedItem;
          });

          const initialState = {
            id,
            key,
            shiftSection,
            sortOrder,
            tagsDdl,
            unitDdl,

            labShifts,
            shifts,
            timeSlots,
            valueFromDdl,
            labColumnsDDL,
            calculationPointDDL,
            calculationTypeDDL,

            selectedUnit,
            selectedTag,
            selectedTestSample,
            selectedValueFrom,
            selectedLabColumn,
            selectedCalculationType,
            selectedCalculationPoint,

            name,
            valueFrom,
            labColumnName,
            calculationType,
            calculationPoint,
            testSampleDdl,
            getAutoReading,
            useTagFactor,
            shiftMappings: shiftMappingsArray,
            shiftMappingsArray
          };

          setState(initialState);
          setIsPageLoaded(true);
        }
      })
    );
  };

  const getTimeSlotsByOperationGroupAndShift = (operationGroupId, shiftId, rowId) => {
    const queryParam = {
      OperationGroupId: operationGroupId,
      ShiftId: shiftId
    };
    http
      .get(`${TIME_SLOT.get_by_operation_group_and_shift}?${qs.stringify(queryParam)}`)
      .then(res => {
        if (res.data.succeeded) {
          const timeSlots = res.data.data.map(item => ({
            label: item.slotName,
            value: item.id
          }));
          const oldShiftMappings = [...state.shiftMappingsArray];
          const newShiftMappings = oldShiftMappings.map(item => {
            if (item.rowId === rowId) {
              item['timeSlots'] = timeSlots;
            }
            return item;
          });
          setState({ ...state, shiftMappingsArray: newShiftMappings });
        }
      })
      .catch(err => {
        toastAlerts('error', err);
      });
  };

  //#endregion

  //#region Effects
  useEffect(() => {
    getAllDependencies();
  }, []);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events

  const onUnitChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedUnit: newValue });
    } else {
      setState({ ...state, selectedUnit: newValue });
    }
  };

  const onValueFromChange = (e, newValue) => {
    if (newValue) {
      setState({
        ...state,
        selectedValueFrom: newValue,
        valueFrom: newValue.value,
        selectedTag: null,
        selectedTestSample: null,
        selectedLabColumn: null,
        labColumnName: ''
      });
    } else {
      setState({
        ...state,
        selectedValueFrom: newValue,
        valueFrom: '',
        selectedTag: null,
        selectedTestSample: null,
        selectedLabColumn: null,
        labColumnName: ''
      });
    }
  };

  const onTagChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedTag: newValue });
    } else {
      setState({ ...state, selectedTag: null });
    }
  };

  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedTestSample: newValue });
    } else {
      setState({ ...state, selectedTestSample: null });
    }
  };

  const onLabColumnChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedLabColumn: newValue, labColumnName: newValue.value });
    } else {
      setState({ ...state, selectedLabColumn: null, labColumnName: '' });
    }
  };

  const onCalculationTypeChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedCalculationType: newValue, calculationType: newValue.value });
    } else {
      setState({ ...state, selectedCalculationType: null, calculationType: '' });
    }
  };

  const onCalculationPointChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedCalculationPoint: newValue, calculationPoint: newValue.value });
    } else {
      setState({ ...state, selectedCalculationPoint: null, calculationPoint: '' });
    }
  };

  const onLabShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappingsArray];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = newValue;
        }
        return item;
      });
      setState({ ...state, shiftMappingsArray: newShiftMappings });
    } else {
      toastAlerts('error', 'Something Was Wrong');
    }
  };

  const onShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappingsArray];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = newValue;
          item['selectedTimeSlot'] = null;
        }
        return item;
      });
      setState({ ...state, shiftMappingsArray: newShiftMappings });
      getTimeSlotsByOperationGroupAndShift(
        state.selectedTag ? state.selectedTag.operationGroupId : 0,
        newValue.value,
        rowId
      );
    } else {
      toastAlerts('error', 'Something Was Wrong');
    }
  };

  const onTimeSlotChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldShiftMappings = [...state.shiftMappingsArray];
      const newShiftMappings = oldShiftMappings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = newValue;
        }
        return item;
      });
      setState({ ...state, shiftMappingsArray: newShiftMappings });
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
    const oldShiftMappings = [...state.shiftMappingsArray];
    const newShiftMappings = oldShiftMappings.map(item => {
      if (item.rowId === rowId) {
        item[name] = checked;
      }
      return item;
    });
    setState({ ...state, shiftMappingsArray: newShiftMappings });
  };

  const onRemoveFields = item => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const oldState = [...state.shiftMappingsArray];
    oldState.splice(
      oldState.findIndex(siteReport => siteReport.rowId === item.rowId),
      1
    );
    setState({ ...state, shiftMappingsArray: oldState });
    if (item.id === 0) {
      toastAlerts('success', 'Shift Report Deleted Successfully', 'bottom-end');
    } else {
      http
        .delete(`${SHIFT_REPORT_SETTINGS.delete_shift_mapping}/${item.id}`)
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
      shiftMappingsArray: checked
        ? [
            ...state.shiftMappings,
            {
              rowId: uuid(),
              shifts: state.shifts,
              selectedShift: null,
              labShifts: state.labShifts,
              selectedLabShift: null,
              timeSlots: state.timeSlots,
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

  const onAddFields = item => {
    setState({
      ...state,
      shiftMappingsArray: [
        ...state.shiftMappingsArray,
        {
          rowId: uuid(),
          id: 0,
          shiftReportSettingId: 0,
          labShifts: item.labShifts,
          selectedLabShift: null,
          shifts: item.shifts,
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
    const key = state.key;
    const id = state.id;
    const data = {
      id,
      key,
      shiftSection: state.shiftSection,
      sortOrder: state.sortOrder ? +state.sortOrder : 0,
      valueFrom: state.valueFrom,
      name: state.name,
      unitId: state.selectedUnit ? state.selectedUnit.value : null,
      unitName: state.selectedUnit ? state.selectedUnit.sign : '',
      getAutoReading: state.getAutoReading,
      useTagFactor: state.useTagFactor,
      tagId: state.selectedTag ? state.selectedTag.value : null,
      testSampleId: state.selectedTestSample ? state.selectedTestSample.value : null,
      labColumnName: state.labColumnName,
      calculationType: state.calculationType,
      calculationPoint: state.calculationPoint
    };
    if (state.getAutoReading) {
      data.shiftMappings = state.shiftMappingsArray.map(item => {
        const id = item.id ? item.id : 0;
        const shiftReportSettingId = data.id;
        const labShiftId = item.selectedLabShift ? item.selectedLabShift.value : null;
        const shiftId = item.selectedShift ? item.selectedShift.value : null;
        const timeSlotId = item.selectedTimeSlot ? item.selectedTimeSlot.value : null;
        const usePreviousDay = item.usePreviousDay;
        return {
          id,
          shiftReportSettingId,
          labShiftId,
          shiftId,
          timeSlotId,
          usePreviousDay
        };
      });
    }

    http
      .put(`${SHIFT_REPORT_SETTINGS.update}/${key}`, data)
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
              <TextInput label="Shift Section" name="shiftSection" value={state.shiftSection} disabled />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextInput label="Sort Order" name="sortOrder" value={state.sortOrder} onChange={onInputChange} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <CustomAutoComplete
              ref={refValueFrom}
              data={state.valueFromDdl}
              label="Select Value Form"
              value={state.selectedValueFrom}
              onChange={onValueFromChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <TextInput label="Name" name="name" value={state.name} onChange={onInputChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <CustomAutoComplete
              ref={refUnit}
              data={state.unitDdl}
              label="Select Unit"
              value={state.selectedUnit}
              onChange={onUnitChange}
            />
          </Grid>
          {state && state.valueFrom === 'Log' && (
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <CustomAutoComplete
                ref={refTag}
                data={state.tagsDdl}
                label="Select Tags"
                value={state.selectedTag}
                onChange={onTagChange}
              />
            </Grid>
          )}

          {state && state.valueFrom === 'Lab' && (
            <Fragment>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refTestSample}
                  data={state.testSampleDdl}
                  label="Select Test Sample"
                  value={state.selectedTestSample}
                  onChange={onTestSampleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refLabColumnName}
                  data={state.labColumnsDDL}
                  label="Select Lab Column"
                  value={state.selectedLabColumn}
                  onChange={onLabColumnChange}
                />
              </Grid>
            </Fragment>
          )}

          <Grid container spacing={3} item xs={12} sm={6} md={3} lg={3}>
            {state && (state.shiftSection === 'Box-10' || state.shiftSection === 'Box-11') && (
              <Fragment>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomAutoComplete
                    ref={refCalculationType}
                    data={state.calculationTypeDDL}
                    label="Select Calc. Type"
                    value={state.selectedCalculationType}
                    onChange={onCalculationTypeChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomAutoComplete
                    ref={retCalculatinPoint}
                    data={state.calculationPointDDL}
                    label="Select Calc. Point"
                    value={state.selectedCalculationPoint}
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

        {state.shiftMappingsArray.map((item, index) => (
          <div key={item.rowId}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <CustomAutoComplete
                  ref={refShiftName}
                  name="shiftId"
                  data={item.shifts}
                  label="Shift"
                  value={item.selectedShift}
                  onChange={(e, newValue) => onShiftChange(e, newValue, item.rowId)}
                />
              </Grid>
              {state && state.valueFrom === 'Lab' && (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <CustomAutoComplete
                    ref={refLabShiftTimeSlot}
                    data={item.labShifts}
                    label="Lab Shift"
                    value={item.selectedLabShift}
                    onChange={(e, newValue) => onLabShiftChange(e, newValue, item.rowId)}
                  />
                </Grid>
              )}
              {state && state.valueFrom === 'Log' && (
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
                {index === state.shiftMappingsArray.length - 1 ? (
                  <Fab size="small" onClick={() => onAddFields(item)} className={classes.btnParent}>
                    <Add className={classes.btnChild} />
                  </Fab>
                ) : null}
                <Fab
                  className={classes.btnParent}
                  size="small"
                  disabled={state.shiftMappingsArray.length === 1}
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

export default ShiftReportSettingsEditForm;

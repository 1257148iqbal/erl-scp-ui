import { Grid } from '@material-ui/core';
import Axios from 'axios';
import {
  CancelButton,
  Checkbox,
  CustomAutoComplete,
  CustomPreloder,
  Form,
  FormWrapper,
  SaveButton
} from 'components/CustomControls';
import { LAB_SHIFT, TEST_SAMPLE } from 'constants/ApiEndPoints/v1';
import { MONTHLY_PRODUCTION_SETTING } from 'constants/ApiEndPoints/v1/monthlyProductionSetting';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const initialState = {
  id: 0,
  key: '',
  testSampleId: 0,
  labShiftId: 0,
  usePreviousDate: true,
  testSamples: [],
  selectedTestSample: null,
  labShifts: [],
  selectedLabShift: null,
  isPageLoaded: false
};

const MonthlyProductionSettingEditForm = () => {
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const history = useHistory();
  const location = useLocation();

  const tesSampleRef = useRef();
  const labShiftRef = useRef();

  const [state, setState] = useState(initialState);

  //#region UDF

  const getDependencies = useCallback(async () => {
    Axios.all([http.get(TEST_SAMPLE.get_active), http.get(LAB_SHIFT.get_active)])
      .then(
        await Axios.spread((...responses) => {
          const testSampleResponse = responses[0];
          const labShiftResponse = responses[1];
          if (testSampleResponse.data.succeeded && labShiftResponse.data.succeeded) {
            const testSamples = testSampleResponse.data.data.map(item => ({ label: item.sampleName, value: item.id }));
            const selectedTestSample = testSamples.find(ts => ts.value === location.state.testSampleId);

            const labShifts = labShiftResponse.data.data.map(item => ({ label: item.shiftName, value: item.id }));
            const selectedLabShift = labShifts.find(ls => ls.value === location.state.labShiftId);

            setState({
              ...state,
              id: location.state.id,
              key: location.state.key,
              testSampleId: location.state.testSampleId,
              labShiftId: location.state.labShiftId,
              testSamples,
              selectedTestSample,
              labShifts,
              selectedLabShift,
              isPageLoaded: true
            });
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  }, [location.state.id, location.state.key, location.state.labShiftId, location.state.testSampleId, state]);
  //#endregion

  //#region Hooks
  useEffect(() => {
    getDependencies();
  }, [getDependencies]);
  //#endregion

  // #region Pre Loader
  if (!state.isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events
  const onTestSampleChange = (e, newValue) => {
    if (newValue) {
      setState({
        ...state,
        testSampleId: newValue.value,
        selectedTestSample: { label: newValue.label, value: newValue.value }
      });
    } else {
      setState({ ...state, testSampleId: 0, selectedTestSample: null });
    }
  };

  const onLabShiftChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, labShiftId: newValue.value, selectedLabShift: { label: newValue.label, value: newValue.value } });
    } else {
      setState({ ...state, labShiftId: 0, selectedLabShift: null });
    }
  };

  const onInputChange = e => {
    const { type, name, value, checked } = e.target;
    setState({
      ...state,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setOpenBackdrop(true);
    setLoading(true);
    const data = {
      id: state.id,
      key: state.key,
      testSampleId: state.testSampleId ? state.testSampleId : null,
      labShiftId: state.labShiftId ? state.labShiftId : null,
      usePreviousDate: state.usePreviousDate
    };
    http
      .put(`${MONTHLY_PRODUCTION_SETTING.update}/${data.key}`, data)
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
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <CustomAutoComplete
              ref={tesSampleRef}
              data={state.testSamples}
              label="Select Test Sample"
              value={state.selectedTestSample}
              onChange={onTestSampleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4}>
            <CustomAutoComplete
              ref={labShiftRef}
              data={state.labShifts}
              label="Select LabShift"
              value={state.selectedLabShift}
              onChange={onLabShiftChange}
            />
          </Grid>

          <Grid item container xs={12} sm={4} md={4} lg={4}>
            <Checkbox
              name="usePreviousDate"
              label="Use Previous Date"
              checked={state.usePreviousDate}
              onChange={onInputChange}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <SaveButton />
          <CancelButton onClick={onCancel} />
        </Grid>
      </Form>
    </FormWrapper>
  );
};

export default MonthlyProductionSettingEditForm;

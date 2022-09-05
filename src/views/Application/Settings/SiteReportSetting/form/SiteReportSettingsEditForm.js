import { Fab, FormControlLabel, Grid, makeStyles, Switch } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import Axios from 'axios';
import {
  CancelButton,
  ConfirmDialog,
  CustomAutoComplete,
  CustomPreloder,
  Form,
  FormWrapper,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { LAB_SHIFT, SHIFT, SITE_REPORT_SETTINGS, TAG, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';
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

const SiteReportEditForm = props => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const refShiftName = useRef();
  const refSlotName = useRef();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  //#region Refs

  const sectionRef = useRef();
  const refStandByTag = useRef();
  const refLabShiftTimeSlot = useRef();
  //#endregion

  //#region States

  const [state, setState] = useState(null);

  // const [factor, setFactor] = React.useState([]);

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  //#endregion

  //#region UDFs

  const getDependencies = useCallback(() => {
    Axios.all([
      http.get(`${SITE_REPORT_SETTINGS.get_single}/${location.state}`),
      http.get(TAG.get_active),
      http.get(LAB_SHIFT.get_active),
      http.get(SHIFT.get_active),
      http.get(TIME_SLOT.get_by_operation_group_and_shift)
    ]).then(
      Axios.spread((...responses) => {
        const recordForEditResponse = responses[0].data;
        const tagResponse = responses[1].data;
        const labShiftResponse = responses[2].data;
        const shiftResponse = responses[3].data;
        const timeSlotResponse = responses[4].data;

        if (
          recordForEditResponse.succeeded &&
          tagResponse.succeeded &&
          labShiftResponse.succeeded &&
          shiftResponse.succeeded &&
          timeSlotResponse.succeeded
        ) {
          // editable data
          const {
            autoReadingSettings,
            equipTagDisplayName,
            equipTagId,
            getAutoReading,
            id,
            key,
            siteSection,
            standByTagDisplayName,
            standByTagId
          } = recordForEditResponse.data;

          // Tags dropdown
          const tagsDdl = tagResponse.data.map(t => ({
            ...t,
            label: `${t.tagName} (${t.details})`,
            value: t.id
          }));

          // selected equip tag
          const selectedEquipTag = equipTagId ? tagsDdl.find(equip => equip.value === equipTagId) : null;

          // selected standby tag
          const selectedStandByTag = standByTagId ? tagsDdl.find(equip => equip.value === standByTagId) : null;

          const labShifts = fillDropDown(labShiftResponse.data, 'shiftName', 'id');

          const shifts = fillDropDown(shiftResponse.data, 'shiftName', 'id');

          const timeSlots = fillDropDown(timeSlotResponse.data, 'slotName', 'id');

          const autoReadingSettingsMap = autoReadingSettings.map(item => {
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
            siteSection,
            tagsDdl,
            labShifts,
            shifts,
            timeSlots,
            selectedEquipTag,
            equipTagDisplayName,
            selectedStandByTag,
            standByTagDisplayName,
            getAutoReading,
            autoReadingSettings: autoReadingSettingsMap,
            autoReadingSettingsMap
          };
          setState(initialState);
          setIsPageLoaded(true);
        }
      })
    );
  }, [location.state]);

  const getTimeSlotsByOperationGroupAndShift = (shiftId, rowId) => {
    const queryParam = {
      OperationGroupId: 2,
      ShiftId: shiftId
    };
    http
      .get(`${TIME_SLOT.get_by_operation_group_and_shift}?${qs.stringify(queryParam)}`)
      .then(res => {
        if (res.data.succeeded) {
          const timeSlots = fillDropDown(res.data.data, 'slotName', 'id');
          const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
          const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
            if (item.rowId === rowId) {
              item['timeSlots'] = timeSlots;
            }
            return item;
          });
          setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
        }
      })
      .catch(err => {
        toastAlerts('error', err);
      });
  };

  //#endregion

  //#region Effects
  useEffect(() => {
    getDependencies();
  }, [getDependencies]);

  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region Events
  const onAddFields = item => {
    setState({
      ...state,
      autoReadingSettingsMap: [
        ...state.autoReadingSettingsMap,
        {
          rowId: uuid(),
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

  const onRemoveFields = item => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const oldState = [...state.autoReadingSettingsMap];
    oldState.splice(
      oldState.findIndex(siteReport => siteReport.rowId === item.rowId),
      1
    );
    setState({ ...state, autoReadingSettingsMap: oldState });
    if (item.id === 0) {
      toastAlerts('success', 'Site Report Deleted Successfully', 'bottom-end');
    } else {
      http
        .delete(`${SITE_REPORT_SETTINGS.delete_auto_reading_setting}/${item.id}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message, 'bottom-end');
          }
        })
        .catch(err => toastAlerts('err', internalServerError));
    }
  };

  const onEquipTagChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedEquipTag: newValue });
    } else {
      setState({ ...state, selectedEquipTag: null });
    }
  };

  const onStandByTagChange = (e, newValue) => {
    if (newValue) {
      setState({ ...state, selectedStandByTag: newValue });
    } else {
      setState({ ...state, selectedStandByTag: null });
    }
  };

  const onAutoReadingStatusChange = e => {
    const { name, checked } = e.target;
    setState({
      ...state,
      [name]: checked,
      autoReadingSettingsMap: checked
        ? state.autoReadingSettings.length
          ? [...state.autoReadingSettings]
          : [
              {
                rowId: uuid(),

                labShifts: state.labShifts,
                selectedLabShift: null,
                shifts: state.shifts,
                selectedShift: null,
                timeSlots: state.timeSlots,
                selectedTimeSlot: null,
                usePreviousDay: false
              }
            ]
        : []
    });
  };

  const onLabShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = newValue;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
    }
  };

  const onShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = newValue;
          item['timeSlots'] = [];
          item['selectedTimeSlot'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
      getTimeSlotsByOperationGroupAndShift(newValue.value, rowId);
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
    }
  };

  const onTimeSlotChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = newValue;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettingsMap];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettingsMap: newAutoReadingSettings });
    }
  };

  const onInputChange = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);

    try {
      const key = state.key;
      const id = state.id;
      const data = {
        id,
        key,
        siteSection: state.siteSection,
        equipTagId: state.selectedEquipTag ? state.selectedEquipTag.value : null,
        equipTagDisplayName: state.selectedEquipTag ? state.equipTagDisplayName : '',
        standByTagId: state.selectedStandByTag ? state.selectedStandByTag.value : null,
        standByTagDisplayName: state.selectedStandByTag ? state.standByTagDisplayName : '',
        getAutoReading: state.getAutoReading
      };

      if (state.getAutoReading) {
        data.autoReadingSettings = state.autoReadingSettingsMap.map(item => {
          const id = item.id;
          const siteReportSettingId = item.siteReportSettingId;
          const labShiftId = item.selectedLabShift ? item.selectedLabShift.value : null;
          const shiftId = item.selectedShift ? item.selectedShift.value : null;
          const timeSlotId = item.selectedTimeSlot ? item.selectedTimeSlot.value : null;
          return {
            id,
            siteReportSettingId,
            labShiftId,
            shiftId,
            timeSlotId
          };
        });
      }
      const res = await http.put(`${SITE_REPORT_SETTINGS.update}/${key}`, data);
      if (res.data.succeeded) {
        toastAlerts('success', res.data.message);
        history.goBack();
      } else {
        toastAlerts('error', res.data.message);
      }
    } catch (err) {
      toastAlerts('error', err);
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
    }
  };

  //#endregion

  return (
    <FormWrapper>
      <Form className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextInput name="selectedSection" label="Box Name" value={state.siteSection} disabled />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomAutoComplete
              ref={sectionRef}
              data={state.tagsDdl}
              label="Equipment Tag ID"
              value={state.selectedEquipTag}
              onChange={onEquipTagChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextInput
              name="equipTagDisplayName"
              label="Equip Tag Display Name"
              value={state.equipTagDisplayName}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomAutoComplete
              ref={refStandByTag}
              data={state.tagsDdl}
              label="Stand By Tag ID"
              value={state.selectedStandByTag}
              onChange={onStandByTagChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextInput
              name="standByTagDisplayName"
              label="Stand By Tag Display Name"
              value={state.standByTagDisplayName}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <FormControlLabel
              control={<Switch checked={state.getAutoReading} sx={{ m: 1 }} name="getAutoReading" />}
              label="Get Auto Reading"
              onChange={onAutoReadingStatusChange}
            />
          </Grid>
        </Grid>

        {state.autoReadingSettingsMap.map((item, index) => (
          <div key={item.rowId}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <CustomAutoComplete
                  ref={refLabShiftTimeSlot}
                  data={item.labShifts}
                  label="Lab Shift ID"
                  value={item.selectedLabShift}
                  onChange={(e, newValue) => onLabShiftChange(e, newValue, item.rowId)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <CustomAutoComplete
                  ref={refShiftName}
                  name="shiftId"
                  data={item.shifts}
                  label="Shift"
                  value={item.selectedShift}
                  onChange={(e, newValue) => onShiftChange(e, newValue, item.rowId)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2} lg={2}>
                <CustomAutoComplete
                  ref={refSlotName}
                  name="timeSlotId"
                  data={item.timeSlots}
                  label="Select Slot"
                  value={item.selectedTimeSlot}
                  onChange={(e, newValue) => onTimeSlotChange(e, newValue, item.rowId)}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={2} lg={2}>
                {index === state.autoReadingSettingsMap.length - 1 ? (
                  <Fab size="small" onClick={() => onAddFields(item)} className={classes.btnParent}>
                    <Add className={classes.btnChild} />
                  </Fab>
                ) : null}
                <Fab
                  className={classes.btnParent}
                  size="small"
                  disabled={state.autoReadingSettingsMap.length === 1}
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Site Report Setting?',
                      content: 'Are you sure to delete this site report setting??',
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

export default SiteReportEditForm;

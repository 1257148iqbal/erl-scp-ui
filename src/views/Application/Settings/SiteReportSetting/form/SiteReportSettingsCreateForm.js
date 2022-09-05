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
import { LAB_SHIFT, SHIFT, TAG, TIME_SLOT } from 'constants/ApiEndPoints/v1';
import { SITE_REPORT_SETTINGS } from 'constants/ApiEndPoints/v1/siteReportSetting';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import qs from 'querystring';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { stringifyConsole } from 'utils/commonHelper';
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
  siteSection: '',
  equipTagId: 0,
  equiTtagName: '',
  equipTagDisplayName: '',
  standByTagId: 0,
  standByTagName: '',
  standByTagDisplayName: '',
  getAutoReading: false,
  autoReadingSettings: []
};

const SiteReportSettingsCreateForm = props => {
  const classes = useStyles();
  const history = useHistory();
  const refShiftName = useRef();
  const refSlotName = useRef();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  //#region Refs
  const refSiteReportSection = useRef();
  const sectionRef = useRef();
  const refStandByTag = useRef();
  const refLabShiftTimeSlot = useRef();
  //#endregion

  //#region States

  const [state, setState] = useState(initialState);

  const [siteReportSections, setSiteReportSections] = useState([]);
  const [sitereportSection, setSiteReportSection] = useState(null);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);

  const [standByTags, setStandByTags] = useState([]);
  const [standByTag, setStandByTag] = useState(null);

  const [labShifts, setLabShifts] = React.useState([]);

  const [shifts, setShifts] = React.useState([]);

  // const [factor, setFactor] = React.useState([]);

  const [confirmDialog, setConfirmDialog] = React.useState({ title: '', content: '', isOpen: false });

  //#endregion

  //#region UDFs

  const getDependencies = async () => {
    Axios.all([http.get(SITE_REPORT_SETTINGS.get_all_site_sections), http.get(TAG.get_active)])
      .then(
        await Axios.spread((...responses) => {
          const siteSectionRepsonse = responses[0];
          const tagResponse = responses[1];
          if (siteSectionRepsonse.data.succeeded && tagResponse.data.succeeded) {
            const siteReportSections = siteSectionRepsonse.data.data.map(item => ({
              label: _.startCase(item),
              value: item
            }));

            const tags = tagResponse.data.data.map(item => ({
              label: `${item.tagName} (${item.details})`,
              value: item.id
            }));
            setSiteReportSections(siteReportSections);
            setTags(tags);
            setStandByTags(tags);
          } else {
            toastAlerts('error', 'Dependency not loaded');
          }
        })
      )
      .catch(err => toastAlerts('error', err));
  };

  const getLabShifts = () => {
    http
      .get(`${LAB_SHIFT.get_active}`)
      .then(res => {
        const timeSlots = res.data.data.map(item => ({ label: item.shiftName, value: item.id }));
        setLabShifts(timeSlots);
      })
      .catch(err => stringifyConsole(err));
  };

  const getActiveShifts = () => {
    http
      .get(SHIFT.get_active)
      .then(res => {
        if (res.data.succeeded) {
          const activeShifts = res.data.data.map(item => ({ label: item.shiftName, value: item.id }));
          setShifts(activeShifts);
        }
      })
      .catch(err => toastAlerts('error', err));
  };

  const getTimeSlotsByOperationGroupAndShift = (shiftId, rowId) => {
    const queryParam = {
      OperationGroupId: 2,
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
          const oldAutoReadingSettings = [...state.autoReadingSettings];
          const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
            if (item.rowId === rowId) {
              item['timeSlots'] = timeSlots;
            }
            return item;
          });
          setState({ ...state, autoReadingSettings: newAutoReadingSettings });
          // setTimeSlots(timeSlots);
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
    getLabShifts();
    getActiveShifts();
  }, []);

  //#endregion

  //#region Events
  const onAddFields = () => {
    setState({
      ...state,
      autoReadingSettings: [
        ...state.autoReadingSettings,
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

  const onRemoveFields = item => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    const oldState = [...state.autoReadingSettings];
    oldState.splice(
      oldState.findIndex(siteReport => siteReport.rowId === item.rowId),
      1
    );
    setState({ ...state, autoReadingSettings: oldState });
    if (item.id === 0) {
      toastAlerts('success', 'Site Report Deleted Successfully', 'bottom-end');
    } else {
      http
        .delete(`${SITE_REPORT_SETTINGS.delete}/${item.rowId}`)
        .then(res => {
          if (res.data.succeeded) {
            toastAlerts('success', res.data.message, 'bottom-end');
          }
        })
        .catch(err => toastAlerts('err', internalServerError));
    }
  };

  const onSiteReportSectionChange = (e, newValue) => {
    if (newValue) {
      setSiteReportSection(newValue);
      setState({ ...state, ddsSection: newValue.value });
    } else {
      setSiteReportSection(null);
      setState({ ...state, ddsSection: '' });
    }
  };

  const onTagChange = (e, newValue) => {
    if (newValue) {
      setTag(newValue);
      setState({ ...state, tagId: newValue.value, tagName: newValue.label });
    } else {
      setTag(null);
      setState({ ...state, tagId: 0, tagName: '' });
    }
  };

  const onStandByTagChange = (e, newValue) => {
    if (newValue) {
      setStandByTag(newValue);
      setState({ ...state, tagId: newValue.value, tagName: newValue.label });
    } else {
      setStandByTag(null);
      setState({ ...state, tagId: 0, tagName: '' });
    }
  };

  const onLabShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = newValue;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedLabShift'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
    }
  };

  const onShiftChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = newValue;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
      getTimeSlotsByOperationGroupAndShift(newValue.value, rowId);
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedShift'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
    }
  };

  const onTimeSlotChange = (e, newValue, rowId) => {
    if (newValue) {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = newValue;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
    } else {
      const oldAutoReadingSettings = [...state.autoReadingSettings];
      const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
        if (item.rowId === rowId) {
          item['selectedTimeSlot'] = null;
        }
        return item;
      });
      setState({ ...state, autoReadingSettings: newAutoReadingSettings });
    }
  };

  const onUsePreviousDayChange = (e, rowId) => {
    const { name, checked } = e.target;
    const oldAutoReadingSettings = [...state.autoReadingSettings];
    const newAutoReadingSettings = oldAutoReadingSettings.map(item => {
      if (item.rowId === rowId) {
        item[name] = checked;
      }
      return item;
    });
    setState({ ...state, autoReadingSettings: newAutoReadingSettings });
  };

  const onInputChange = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const onAutoReadingStatusChange = e => {
    const { name, checked } = e.target;
    setState({
      ...state,
      [name]: checked,
      autoReadingSettings: checked
        ? [
            ...state.autoReadingSettings,
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

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      siteSection: sitereportSection ? sitereportSection.value : '',
      equipTagId: tag ? tag.value : '',
      equipTagDisplayName: state.equipTagDisplayName,
      standByTagId: standByTag ? standByTag.value : '',
      standByTagDisplayName: state.standByTagDisplayName,
      getAutoReading: state.getAutoReading
    };

    if (state.getAutoReading) {
      data.autoReadingSettings = state.autoReadingSettings.map(item => {
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
      .post(`${SITE_REPORT_SETTINGS.create}`, data)
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
      <Form onSubmit={handleSubmit} className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomAutoComplete
              ref={refSiteReportSection}
              data={siteReportSections}
              label="Select Box Name"
              value={sitereportSection}
              onChange={onSiteReportSectionChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomAutoComplete ref={sectionRef} data={tags} label="Equipment Tag ID" value={tag} onChange={onTagChange} />
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
              data={standByTags}
              label="Stand By Tag ID"
              value={standByTag}
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

        {state.autoReadingSettings.map((item, index) => (
          <div key={item.rowId}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <CustomAutoComplete
                  ref={refLabShiftTimeSlot}
                  data={labShifts}
                  label="Lab Shift ID"
                  value={item.selectedLabShift}
                  onChange={(e, newValue) => onLabShiftChange(e, newValue, item.rowId)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2}>
                <CustomAutoComplete
                  ref={refShiftName}
                  name="shiftId"
                  data={shifts}
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
                <Checkbox
                  name="usePreviousDay"
                  label="Use Previous Day"
                  checked={item.usePreviousDay}
                  onChange={e => onUsePreviousDayChange(e, item.rowId)}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={2} lg={2}>
                {index === state.autoReadingSettings.length - 1 ? (
                  <Fab size="small" onClick={() => onAddFields()} className={classes.btnParent}>
                    <Add className={classes.btnChild} />
                  </Fab>
                ) : null}
                <Fab
                  className={classes.btnParent}
                  size="small"
                  disabled={state.autoReadingSettings.length === 1}
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Factor From Tag?',
                      content: 'Are you sure to delete this factor??',
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

export default SiteReportSettingsCreateForm;

/**
 * Title: Site Report Create Specific form
 * Description:
 * Author: Nasir Ahmed
 * Date: 19-May-2022
 * Modified: 19-May-2022
 **/

import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Box } from '@mui/system';
import clsx from 'clsx';
import {
  CancelButton,
  Checkbox,
  CustomAutoComplete,
  CustomDatePicker,
  CustomPreloder,
  CustomTimePicker,
  Form,
  FormWrapper,
  RadioGroup,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, SITE_REPORT, SITE_REPORT_SETTINGS } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useCallback, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';
import { getFloorTime, getTimeFromDate, serverDate, time24 } from 'utils/dateHelper';
import { onTextFieldFocus } from 'utils/keyControl';
import { v4 as uuid } from 'uuid';
import { useSiteReportStyles } from '../styles/siteReportStyle';

const gaPosition = [
  { label: 'On', value: 'On' },
  { label: 'Off', value: 'Off' }
];

const impingement = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
];

const SiteReport = () => {
  const classes = useSiteReportStyles();
  const history = useHistory();

  const { setOpenBackdrop, setLoading } = useBackDrop();

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region State
  const [state, setState] = useState([]);

  const [time, setTime] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  // const [currentShift, setCurrentShift] = useState(null);
  const [remark, setRemark] = useState('');
  const [remarks, setRemarks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [labShifts, setLabShifts] = useState([]);
  const [labShift, setLabShift] = useState(null);
  //#endregion

  //#region UDF's

  const fetchLabShift = useCallback(() => {
    trackPromise(
      http.get(LAB_SHIFT.get_active).then(res => {
        if (res.data.succeeded) {
          const labshifts = fillDropDown(res.data.data, 'shiftName', 'id');
          setLabShifts(labshifts);
          setIsPageLoaded(true);
        }
      })
    );
  }, []);

  // const getCurrentLabShift = useCallback(
  //   async callback => {
  //     try {
  //       const res = await http.get(LAB_SHIFT.get_current_shift, {
  //         params: {
  //           CurrentTime: time24(new Date())
  //         }
  //       });
  //       if (res.data.succeeded) {
  //         const currShift = res.data.data;
  //         const currentTime = getTimeFromDate(new Date());
  //         const shiftEndTime = getTimeFromDate(new Date(`0000-01-01 ${currShift.toTime}`));
  //         const entryTime = getTimeBefore(shiftEndTime, 60);
  //         const startOfTime = getFloorTime(shiftEndTime);

  //         if (currentTime <= entryTime && process.env.NODE_ENV === 'production') {
  //           sweetAlerts('warning', 'Alert', `Please Try again after ${entryTime}`);
  //           history.goBack();
  //         } else {
  //           setCurrentShift(currShift);
  //           setTime(new Date(`0000-01-01 ${startOfTime}`));
  //           callback(currShift.id);
  //         }
  //       }
  //     } catch (err) {
  //       toastAlerts('error', err);
  //     }
  //   },
  //   [history]
  // );

  const getSiteReportWithReading = (labShiftId, date) => {
    const queryParam = {
      date: serverDate(date),
      labShiftId: labShiftId
    };
    trackPromise(
      http.get(`${SITE_REPORT_SETTINGS.get_site_report_with_reading}?${qs.stringify(queryParam)}`).then(res => {
        if (res.data.succeeded) {
          const siteReport = res.data.data.reduce((acc, curr) => {
            curr.siteReportSettings.map(item => {
              const copiedItem = Object.assign({}, item);

              if (copiedItem.siteSection === 'Box-1') {
                copiedItem.equipStandByddl = [
                  { label: copiedItem.equipTagDisplayName, value: copiedItem.equipTagId },
                  { label: copiedItem.standByTagDisplayName, value: copiedItem.standByTagId }
                ];
                copiedItem.selectedEquip = copiedItem.equipStandByddl.find(
                  eq => eq.label === copiedItem.equipTagDisplayName
                );
                copiedItem.selectedStandby = copiedItem.equipStandByddl.find(
                  st => st.label === copiedItem.standByTagDisplayName
                );
              }

              acc.push({
                ...copiedItem,
                rowId: uuid(),
                siteReportMasterId: 0,
                siteReportSettingId: 0,
                equipCondition: '',
                standByCondition: '',
                discH_PRESS: '',
                amP_STROKE: '',
                amp: '',
                louv: '',
                isStandBy: false,
                load: '',
                n2_SEAL: '',
                time: '',
                leveL_CM: '',
                soln: '',
                hiC_3003: '',
                hiC_3023: '',
                drafT_MM_WC: '',
                noOfBurner: '',
                noOfPilot: '',
                flameColor: '',
                impingement: '',
                burner_1: '',
                burner_2: '',
                burner_3: '',
                burner_4: '',
                burner_5: '',
                burner_6: '',
                burner_7: '',
                burner_8: '',
                burner_9: '',
                burner_10: '',
                suC_BAR: '',
                disC_BAR: '',
                oiL_LEVEL: false,
                cW_FLOW: false,
                temP_1ST_D: '',
                temP_2ND_D: '',
                oiL_PRES: '',
                auto: false,
                piT_LEVEL: '',
                oiL_CHAM_LEVEL: '',
                gA_6062_POSITION: '',
                b_6071_LEVEL: '',
                seaL_WATER: false,
                steam: false,
                piloT_GAS_BAR: ''
              });
              return item;
            });
            return acc;
          }, []);
          setState(siteReport);
        }
      })
    );
  };
  //#End region

  //#region hooks

  useEffect(() => {
    // getCurrentLabShift(getSiteReportWithReading);
    fetchLabShift();
  }, [fetchLabShift]);
  //#endregion
  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }

  const box1 = state.filter(box => box.siteSection === 'Box-1');
  const box2 = state.filter(box => box.siteSection === 'Box-2');
  const box3 = state.filter(box => box.siteSection === 'Box-3');
  const box4 = state.filter(box => box.siteSection === 'Box-4');
  const box5 = state.filter(box => box.siteSection === 'Box-5');
  const box6 = state.filter(box => box.siteSection === 'Box-6');
  const box7 = state.filter(box => box.siteSection === 'Box-7');
  const box8 = state.filter(box => box.siteSection === 'Box-8');
  const box9 = state.filter(box => box.siteSection === 'Box-9');
  const box10 = state.filter(box => box.siteSection === 'Box-10');
  const box11 = state.filter(box => box.siteSection === 'Box-11');

  //#region

  //#region Events
  const onDateChange = date => {
    setDate(date);
  };

  const onLabShiftChange = (e, newValue, callback) => {
    if (newValue) {
      setLabShift(newValue);
      const shiftEndTime = getTimeFromDate(new Date(`0000-01-01 ${newValue.toTime}`));
      const startOfTime = getFloorTime(shiftEndTime);
      setTime(new Date(`0000-01-01 ${startOfTime}`));
      callback(newValue.id, date);
    } else {
      setLabShift(null);
    }
  };
  const onChange = (e, rowId, isNumberType = true) => {
    const { name, value, type, checked } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validInput = regx.test(value) ? value : '';

    const oldState = [...state];
    const oldObjIndex = oldState.findIndex(item => item.rowId === rowId);
    const oldObj = oldState[oldObjIndex];

    if (isNumberType) {
      oldObj[name] = validInput;
    } else {
      oldObj[name] = type === 'checkbox' ? checked : value;
    }

    oldState[oldObjIndex] = oldObj;
    setState(oldState);
  };

  const onEquipTagChange = (e, newValue, rowId) => {
    if (newValue) {
      const updatedState = [...state];
      const targetObj = updatedState.find(item => item.rowId === rowId);
      const targetObjIndex = updatedState.findIndex(item => item.rowId === rowId);
      targetObj.selectedEquip = newValue;
      targetObj.selectedStandby = targetObj.equipStandByddl.find(st => st.label !== newValue.label);
      updatedState[targetObjIndex] = targetObj;
      setState(updatedState);
    }
  };

  const onStandByChange = (e, rowId) => {
    const { name, checked } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section['amp'] = '';
        section['louv'] = '';
        section[name] = checked;
      }
      return section;
    });
    setState(updateState);
  };

  const onImpingementChange = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section[name] = value;
      }
      return section;
    });
    setState(updateState);
  };

  const onABChangeForBox9 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState(updateState);
  };

  const onABChangeForBox10 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState(updateState);
  };

  const onABChangeForBox11 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState(updateState);
  };

  const onGaPositionChange = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state];
    const updateState = oldState.map(section => {
      if (section.rowId === rowId) {
        section[name] = value;
      }
      return section;
    });
    setState(updateState);
  };
  //For Add Remarks
  const onAddRemak = () => {
    if (remark) {
      const _remarks = [...remarks].concat(remark);
      setRemarks(_remarks);
      setRemark('');
      const ele = document.querySelector('#remark');
      ele.focus();
    }
  };
  //For Remove Remarks
  const onRemoveRemark = index => {
    const _remarks = [...remarks];
    _remarks.splice(index, 1);
    setRemarks(_remarks);
  };
  //For key press
  const onPressRemark = e => {
    if (e.key === 'Enter') {
      onAddRemak();
    }
  };
  const onSubmit = async e => {
    e.preventDefault();
    setOpenBackdrop(true);
    setLoading(true);

    const postingDate = date;
    const data = {
      date: serverDate(postingDate),
      time: time24(time),
      labShiftId: labShift.id,
      remark: remarks.join('~'),
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName,
      siteReportDetails: state.map(item => ({
        id: 0,
        siteReportMasterId: 0,
        siteReportSettingId: item.id,
        siteSection: item.siteSection,
        equipTagId: item.siteSection === 'Box-1' ? item.selectedEquip.value : item.equipTagId,
        equipTagDisplayName: item.siteSection === 'Box-1' ? item.selectedEquip.label : item.equipTagDisplayName,
        equipCondition: item.equipCondition,
        standByTagId: item.siteSection === 'Box-1' ? item.selectedStandby.value : item.standByTagId,
        standByTagDisplayName: item.siteSection === 'Box-1' ? item.selectedStandby.label : item.standByTagDisplayName,
        standByCondition: item.standByCondition,
        getAutoReading: item.getAutoReading,
        discH_PRESS: item.discH_PRESS ? item.discH_PRESS : '',
        amP_STROKE: item.amP_STROKE ? item.amP_STROKE : '',
        amp: item.amp ? +item.amp : 0,
        louv: item.louv ? +item.louv : 0,
        isStandBy: item.isStandBy,
        load: item.load ? +item.load : 0,
        n2_SEAL: item.n2_SEAL ? +item.n2_SEAL : 0,
        time: time24(time),
        leveL_CM: item.leveL_CM ? +item.leveL_CM : 0,
        soln: item.soln ? +item.soln : 0,
        hiC_3003: item.hiC_3003 ? +item.hiC_3003 : 0,
        hiC_3023: item.hiC_3023 ? +item.hiC_3023 : 0,
        drafT_MM_WC: item.drafT_MM_WC ? +item.drafT_MM_WC : 0,
        noOfBurner: item.noOfBurner ? +item.noOfBurner : 0,
        noOfPilot: item.noOfPilot ? +item.noOfPilot : 0,
        flameColor: item.flameColor,
        impingement: item.impingement,
        burner_1: item.burner_1 ? +item.burner_1 : 0,
        burner_2: item.burner_2 ? +item.burner_2 : 0,
        burner_3: item.burner_3 ? +item.burner_3 : 0,
        burner_4: item.burner_4 ? +item.burner_4 : 0,
        burner_5: item.burner_5 ? +item.burner_5 : 0,
        burner_6: item.burner_6 ? +item.burner_6 : 0,
        burner_7: item.burner_7 ? +item.burner_7 : 0,
        burner_8: item.burner_8 ? +item.burner_8 : 0,
        burner_9: item.burner_9 ? +item.burner_9 : 0,
        burner_10: item.burner_10 ? +item.burner_10 : 0,
        suC_BAR: item.suC_BAR,
        disC_BAR: item.disC_BAR,
        oiL_LEVEL: item.oiL_LEVEL ? 'OK' : '',
        cW_FLOW: item.cW_FLOW ? 'OK' : '',
        temP_1ST_D: item.temP_1ST_D ? +item.temP_1ST_D : 0,
        temP_2ND_D: item.temP_2ND_D ? +item.temP_2ND_D : 0,
        oiL_PRES: item.oiL_PRES ? +item.oiL_PRES : 0,
        auto: item.auto ? 'OK' : '',
        piT_LEVEL: item.piT_LEVEL ? +item.piT_LEVEL : 0,
        oiL_CHAM_LEVEL: item.oiL_CHAM_LEVEL ? +item.oiL_CHAM_LEVEL : 0,
        gA_6062_POSITION: item.gA_6062_POSITION,
        b_6071_LEVEL: item.b_6071_LEVEL ? +item.b_6071_LEVEL : 0,
        seaL_WATER: item.seaL_WATER ? 'OK' : '',
        steam: item.steam ? 'OK' : '',
        piloT_GAS_BAR: item.piloT_GAS_BAR
      }))
    };

    try {
      const res = await http.post(SITE_REPORT.create, data);
      toastAlerts('success', res.data.message);
      history.goBack();
    } catch (error) {
      toastAlerts('error', error.response.data.Message);
    } finally {
      setOpenBackdrop(false);
      setLoading(false);
    }
  };
  //#region

  return (
    <PageContainer heading="Site Report (Create Specific)">
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CustomDatePicker label="Select Date" value={date} onChange={onDateChange} clearable={false} />
            </Grid>
            <Grid item xs={6}>
              <CustomAutoComplete
                name="labShiftId"
                data={labShifts}
                label="Select Shift"
                value={labShift}
                onChange={(e, newValue) => onLabShiftChange(e, newValue, getSiteReportWithReading)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5} style={{ boxSizing: 'border-box' }}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TableContainer component={Paper}>
                <Table stickyHeader className={classes.tableCumulative}>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                        Equip. No.
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                        Disch. Press Bar
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                        AMP/ %Stroke
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                        Stand By
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box1.map((item, index) => {
                      return (
                        <TableRow key={item.rowId}>
                          <TableCell size="small" style={{ minWidth: 250 }}>
                            <CustomAutoComplete
                              data={item.equipStandByddl}
                              label="Equip"
                              value={item.selectedEquip}
                              onChange={(e, newValue) => onEquipTagChange(e, newValue, item.rowId)}
                            />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              id={`discH_PRESS${index}`}
                              name="discH_PRESS"
                              value={item.discH_PRESS}
                              disabled={item.selectedEquip.label === 'None'}
                              onChange={e => onChange(e, item.rowId, false)}
                              onKeyDown={e => onTextFieldFocus(e, 'discH_PRESS', index, box1.length)}
                            />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              id={`amP_STROKE${index}`}
                              name="amP_STROKE"
                              value={item.amP_STROKE}
                              disabled={item.selectedEquip.label === 'None'}
                              onChange={e => onChange(e, item.rowId, false)}
                              onKeyDown={e => onTextFieldFocus(e, 'amP_STROKE', index, box1.length)}
                            />
                          </TableCell>

                          <TableCell size="small" style={{ minWidth: 250 }}>
                            <CustomAutoComplete
                              data={item.equipStandByddl}
                              label="Stand By"
                              value={item.selectedStandby}
                              disabled
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TableContainer component={Paper}>
                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                          Equip. No.
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                          AMP
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                          LOUV. %
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#045170' }}>
                          Stand By
                        </StyledTableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {box2.map((data, index) => (
                        <TableRow key={data.rowId}>
                          <TableCell style={{ minWidth: 130 }}>{data.equipTagDisplayName}</TableCell>

                          <TableCell>
                            <TextInput
                              id={`amp${index}`}
                              name="amp"
                              disabled={data.isStandBy}
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              value={data.amp}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'amp', index, box2.length)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              id={`louv${index}`}
                              name="louv"
                              disabled={data.isStandBy}
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              value={data.louv}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'louv', index, box2.length)}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Checkbox
                              name="isStandBy"
                              checked={data.isStandBy}
                              onChange={e => onStandByChange(e, data.rowId)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <br />

                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          Equip. No.
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          AMP
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          LOAD. %
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          N2 SEAL
                        </StyledTableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {box3.map((data, index) => (
                        <TableRow key={data.rowId}>
                          <TableCell style={{ minWidth: 130 }}>{data.equipTagDisplayName}</TableCell>
                          <TableCell>
                            <TextInput
                              id={`ampbox3${index}`}
                              name="amp"
                              className={classes.txtInput}
                              value={data.amp}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'ampbox3', index, box3.length)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              id={`load${index}`}
                              className={classes.txtInput}
                              name="load"
                              value={data.load}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'load', index, box3.length)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              id={`n2_SEAL${index}`}
                              name="n2_SEAL"
                              className={classes.txtInput}
                              value={data.n2_SEAL}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'n2_SEAL', index, box3.length)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <br />

                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          VESSEL
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          TIME
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          Level cm%
                        </StyledTableHeadCell>
                        <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                          % Soln
                        </StyledTableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {box4.map((data, index) => (
                        <TableRow key={data.rowId}>
                          <TableCell size="small" style={{ minWidth: 130 }}>
                            {data.equipTagDisplayName}
                          </TableCell>

                          <TableCell size="small">
                            <CustomTimePicker disabled label="Select Time" name="time" value={time} />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              id={`leveL_CM${index}`}
                              name="leveL_CM"
                              className={classes.txtInput}
                              value={data.leveL_CM}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'leveL_CM', index, box4.length)}
                            />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              id={`soln${index}`}
                              name="soln"
                              className={classes.txtInput}
                              value={data.soln}
                              onChange={e => onChange(e, data.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'soln', index, box4.length)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        HIC-3003 % Read
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        HIC-3023 %Read
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        Draft mm w.c
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        No. Of Burner
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        No. Of Pilot
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        Flame Color
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130, backgroundColor: '#37474F' }}>
                        IMPINGEMENT
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box5.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="hiC_3003"
                            value={data.hiC_3003}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="hiC_3023"
                            value={data.hiC_3023}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="drafT_MM_WC"
                            value={data.drafT_MM_WC}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="noOfBurner"
                            value={data.noOfBurner}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="noOfPilot"
                            value={data.noOfPilot}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="flameColor"
                            value={data.flameColor}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell align="center" size="small" style={{ minWidth: 210 }}>
                          <RadioGroup
                            groupName=""
                            name="impingement"
                            value={data.impingement}
                            onChange={e => onImpingementChange(e, data.rowId)}
                            items={impingement}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center">BURNER</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">01</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">02</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">03</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">04</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">05</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">06</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">07</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">08</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">09</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">10</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box6.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell size="small" style={{ minWidth: 130 }}>
                          {data.equipTagDisplayName}
                        </TableCell>

                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_1"
                            value={data.burner_1}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_2"
                            value={data.burner_2}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_3"
                            value={data.burner_3}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_4"
                            value={data.burner_4}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_5"
                            value={data.burner_5}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_6"
                            value={data.burner_6}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_7"
                            value={data.burner_7}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_8"
                            value={data.burner_8}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_9"
                            value={data.burner_9}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_10"
                            value={data.burner_10}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Equip.
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Suc. Bar
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Disc. Bar
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Stand By
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box7.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell style={{ minWidth: 130 }}>{data.equipTagDisplayName}</TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="suC_BAR"
                            value={data.suC_BAR}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="disC_BAR"
                            value={data.disC_BAR}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 130 }}>{data.standByTagDisplayName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Equip.
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        Oil Level
                      </StyledTableHeadCell>
                      <StyledTableHeadCell align="center" style={{ minWidth: 130 }}>
                        CW Flow
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box8.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell style={{ minWidth: 130 }}>{data.equipTagDisplayName}</TableCell>
                        <TableCell align="center" size="small">
                          <Checkbox
                            name="oiL_LEVEL"
                            label="OK"
                            checked={data.oiL_LEVEL}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>

                        <TableCell align="center" size="small">
                          <Checkbox
                            name="cW_FLOW"
                            label="OK"
                            checked={data.cW_FLOW}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center">Equip.</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">1St D. Temp</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">2nd D.Temp</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Oil Pres.</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Oil Level</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">CW Flow</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Stand By</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Auto</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box9.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}${data.equipCondition}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox9(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 130 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="temP_1ST_D"
                            value={data.temP_1ST_D}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>

                        <TableCell size="small" style={{ minWidth: 130 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="temP_2ND_D"
                            value={data.temP_2ND_D}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell align="center" size="small" style={{ minWidth: 130 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="oiL_PRES"
                            value={data.oiL_PRES}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Checkbox
                            name="oiL_LEVEL"
                            label="OK"
                            checked={data.oiL_LEVEL}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Checkbox
                            name="cW_FLOW"
                            label="OK"
                            checked={data.cW_FLOW}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.standByTagDisplayName}${data.standByCondition}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="standByCondition"
                              value={data.standByCondition}
                              onChange={e => onABChangeForBox9(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox name="auto" checked={data.auto} onChange={e => onChange(e, data.rowId, false)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center">PIT LEVEL %</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">PUMP IN AUTO</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">STAND-BY</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">OIL CHAM. LEVEL %</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">GA-6062 POSITION</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box10.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="piT_LEVEL"
                            value={data.piT_LEVEL}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox10(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>

                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.standByTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="standByCondition"
                              value={data.standByCondition}
                              onChange={e => onABChangeForBox10(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="oiL_CHAM_LEVEL"
                            value={data.oiL_CHAM_LEVEL}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center" style={{ minWidth: 210 }}>
                          <RadioGroup
                            groupName=""
                            name="gA_6062_POSITION"
                            value={data.gA_6062_POSITION}
                            onChange={e => onGaPositionChange(e, data.rowId)}
                            items={gaPosition}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center">B-6071 Level</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Pump In Auto</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Stand By</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Seal Water</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Steam</StyledTableHeadCell>
                      <StyledTableHeadCell align="center">Pilot Gas Bar.</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {box11.map(data => (
                      <TableRow key={data.rowId}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="b_6071_LEVEL"
                            value={data.b_6071_LEVEL}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox11(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.standByTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="standByCondition"
                              value={data.standByCondition}
                              onChange={e => onABChangeForBox11(e, data.rowId)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>

                        <TableCell size="small" align="center">
                          <Checkbox
                            name="seaL_WATER"
                            label="OK"
                            checked={data.seaL_WATER}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Checkbox
                            name="steam"
                            label="OK"
                            checked={data.steam}
                            onChange={e => onChange(e, data.rowId, false)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="piloT_GAS_BAR"
                            value={data.piloT_GAS_BAR}
                            onChange={e => onChange(e, data.rowId)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          {labShift && state.length > 0 && (
            <>
              <Grid item xs={12} style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
                <TextInput
                  id="remark"
                  className={clsx(classes.txtInput, classes.onPressRemark)}
                  label="Remarks"
                  name="remarks"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  onKeyPress={onPressRemark}
                />
                <Button variant="contained" color="primary" className={classes.addRemarkBtn} onClick={onAddRemak}>
                  <Add />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <ul className={classes.remarkList}>
                  {remarks.map((rm, rmIdx) => (
                    <li key={rmIdx + 1} className={classes.remarkListItem}>
                      <span style={{ paddingLeft: 5 }}>{rm}</span>
                      <span className={classes.removeIcon} onClick={() => onRemoveRemark(rmIdx)}>
                        X
                      </span>
                    </li>
                  ))}
                </ul>
              </Grid>
            </>
          )}

          {labShift && (
            <Grid item container justifyContent="flex-end">
              <SaveButton onClick={onSubmit} />
              <ResetButton onClick={() => {}} />
              <CancelButton
                onClick={() => {
                  history.goBack();
                }}
              />
            </Grid>
          )}
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default SiteReport;

/** Change Log
 * 22-February-2022 (nasir) : Equip and stand by tag dropdown add on Box-1
 * 26-February-2022 (nasir) : data validation add on specific fields
 **/

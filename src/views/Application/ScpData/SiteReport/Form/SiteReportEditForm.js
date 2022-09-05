/**
 * Title: Site Report Edit form
 * Description:
 * Author: Nasir Ahmed
 * Date: 'N/A'
 * Modified: 26-February-2022
 **/

import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import {
  CancelButton,
  Checkbox,
  CustomAutoComplete,
  CustomPreloder,
  CustomTimePicker,
  Form,
  FormWrapper,
  RadioGroup,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { StyledTableHeadCell } from 'components/CustomControls/TableRowHeadCell';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { SITE_REPORT } from 'constants/ApiEndPoints/v1/siteReport';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory, useLocation } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { serverDate } from 'utils/dateHelper';
import { useSiteReportStyles } from '../styles/siteReportStyle';

const gaPosition = [
  { label: 'On', value: 'On' },
  { label: 'Off', value: 'Off' }
];

const impingement = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
];

const SiteReportEditForm = () => {
  const classes = useSiteReportStyles();
  const history = useHistory();
  const location = useLocation();
  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region State
  const [state, setState] = React.useState([]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  const [remark, setRemark] = React.useState('');
  const [remarks, setRemarks] = useState([]);
  //#endregion

  //#region UDF's

  const getSiteReport = () => {
    trackPromise(
      http
        .get(`${SITE_REPORT.get_single}/${location.state}`)
        .then(res => {
          if (res.data.succeeded) {
            const data = {
              ...res.data.data,
              siteReportDetails: res.data.data.siteReportDetails.map(item => {
                const copiedItem = Object.assign({}, item);
                copiedItem.oiL_LEVEL = item.oiL_LEVEL === 'OK' ? true : false;
                copiedItem.cW_FLOW = item.cW_FLOW === 'OK' ? true : false;
                copiedItem.seaL_WATER = item.seaL_WATER === 'OK' ? true : false;
                copiedItem.steam = item.steam === 'OK' ? true : false;
                copiedItem.auto = item.auto === 'OK' ? true : false;
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
                return copiedItem;
              })
            };

            setState(data);
            setRemarks(data.remark.split('~'));
            setIsPageLoaded(true);
          } else {
            toastAlerts('error', res.data.message);
          }
        })
        .catch(err => toastAlerts('error', err))
    );
  };

  //#End region

  //#region hooks
  useEffect(() => {
    getSiteReport(location.state);
  }, []);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  const box1 = state.siteReportDetails.filter(box => box.siteSection === 'Box-1');
  const box2 = state.siteReportDetails.filter(box => box.siteSection === 'Box-2');
  const box3 = state.siteReportDetails.filter(box => box.siteSection === 'Box-3');
  const box4 = state.siteReportDetails.filter(box => box.siteSection === 'Box-4');
  const box5 = state.siteReportDetails.filter(box => box.siteSection === 'Box-5');
  const box6 = state.siteReportDetails.filter(box => box.siteSection === 'Box-6');
  const box7 = state.siteReportDetails.filter(box => box.siteSection === 'Box-7');
  const box8 = state.siteReportDetails.filter(box => box.siteSection === 'Box-8');
  const box9 = state.siteReportDetails.filter(box => box.siteSection === 'Box-9');
  const box10 = state.siteReportDetails.filter(box => box.siteSection === 'Box-10');
  const box11 = state.siteReportDetails.filter(box => box.siteSection === 'Box-11');

  //#region Events
  const onChange = (e, id, isNumberType = true) => {
    const { name, value, type, checked } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validInput = regx.test(value) ? value : '';
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === id) {
        if (isNumberType) {
          section[name] = validInput;
        } else {
          section[name] = type === 'checkbox' ? checked : value;
        }
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onEquipTagChange = (e, newValue, id) => {
    const updatedState = [...state.siteReportDetails];
    const targetObj = updatedState.find(item => item.id === id);
    const targetObjIndex = updatedState.findIndex(item => item.id === id);
    targetObj.selectedEquip = newValue;
    targetObj.selectedStandby = targetObj.equipStandByddl.find(st => st.label !== newValue.label);
    if (newValue.label === 'None') {
      targetObj.discH_PRESS = '';
      targetObj.amP_STROKE = '';
    }
    updatedState[targetObjIndex] = targetObj;
    setState(prev => ({ ...prev, siteReportDetails: updatedState }));
  };

  const onStandByChange = (e, id) => {
    const { name, checked } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === id) {
        section['amp'] = '';
        section['louv'] = '';
        section[name] = checked;
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onImpingementChange = (e, id) => {
    const { name, value } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === id) {
        section[name] = value;
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onABChangeForBox9 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onABChangeForBox10 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onABChangeForBox11 = (e, rowId) => {
    const { name, value } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === rowId) {
        section[name] = value;
        if (name === 'equipCondition') {
          section['standByCondition'] = value === 'A' ? 'B' : 'A';
        } else {
          section['equipCondition'] = value === 'A' ? 'B' : 'A';
        }
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
  };

  const onGaPositionChange = (e, id) => {
    const { name, value } = e.target;
    const oldState = [...state.siteReportDetails];
    const updateState = oldState.map(section => {
      if (section.id === id) {
        section[name] = value;
      }
      return section;
    });
    setState({ ...state, siteReportDetails: updateState });
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
    const data = {
      id: state.id,
      key: state.key,
      date: serverDate(state.date),
      time: state.time,
      labShiftId: state.labShiftId,
      remark: remarks.join('~'),
      operatorId: state.operatorId,
      empCode: state.employeeID,
      userName: state.userName,
      siteReportDetails: state.siteReportDetails.map(item => ({
        id: item.id,
        siteReportMasterId: item.siteReportMasterId,
        siteReportSettingId: item.siteReportSettingId,
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
        time: item.time,
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
    // return;
    try {
      const res = await http.put(`${SITE_REPORT.update}/${data.key}`, data);
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
    <PageContainer heading="Site Report (Update)">
      <FormWrapper>
        <Form>
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
                    {box1.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell size="small" style={{ minWidth: 250 }}>
                          <CustomAutoComplete
                            data={item.equipStandByddl}
                            label="Equip"
                            value={item.selectedEquip}
                            onChange={(e, newValue) => onEquipTagChange(e, newValue, item.id)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <TextInput
                            className={clsx(classes.txtInput, classes.txtInputDisabled)}
                            id={`discH_PRESS${index}`}
                            name="discH_PRESS"
                            value={item.discH_PRESS}
                            disabled={item.selectedEquip.label === 'None'}
                            onChange={e => onChange(e, item.id, false)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <TextInput
                            name="amP_STROKE"
                            className={clsx(classes.txtInput, classes.txtInputDisabled)}
                            value={item.amP_STROKE}
                            disabled={item.selectedEquip.label === 'None'}
                            onChange={e => onChange(e, item.id, false)}
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
                    ))}
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
                      {box2.map(data => (
                        <TableRow key={data.id}>
                          <TableCell>{data.equipTagDisplayName}</TableCell>

                          <TableCell>
                            <TextInput
                              disabled={data.isStandBy}
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              name="amp"
                              value={data.amp}
                              onChange={e => onChange(e, data.id)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              disabled={data.isStandBy}
                              className={clsx(classes.txtInput, classes.txtInputDisabled)}
                              name="louv"
                              value={data.louv}
                              onChange={e => onChange(e, data.id)}
                            />
                          </TableCell>

                          <TableCell>
                            <Checkbox
                              name="isStandBy"
                              checked={data.isStandBy}
                              onChange={e => onStandByChange(e, data.id)}
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
                      {box3.map(data => (
                        <TableRow key={data.id}>
                          <TableCell>{data.equipTagDisplayName}</TableCell>

                          <TableCell>
                            <TextInput
                              className={classes.txtInput}
                              name="amp"
                              value={data.amp}
                              onChange={e => onChange(e, data.id)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              className={classes.txtInput}
                              name="load"
                              value={data.load}
                              onChange={e => onChange(e, data.id)}
                            />
                          </TableCell>

                          <TableCell>
                            <TextInput
                              className={classes.txtInput}
                              name="n2_SEAL"
                              value={data.n2_SEAL}
                              onChange={e => onChange(e, data.id)}
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
                      {box4.map(data => (
                        <TableRow key={data.id}>
                          <TableCell size="small">{data.equipTagDisplayName}</TableCell>

                          <TableCell size="small">
                            <CustomTimePicker disabled label="Select Time" name="time" value={`0001-01-01 ${data.time}`} />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              className={classes.txtInput}
                              name="leveL_CM"
                              value={data.leveL_CM}
                              onChange={e => onChange(e, data.id)}
                            />
                          </TableCell>

                          <TableCell size="small">
                            <TextInput
                              className={classes.txtInput}
                              name="soln"
                              value={data.soln}
                              onChange={e => onChange(e, data.id)}
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
                      <TableRow key={data.id}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="hiC_3003"
                            value={data.hiC_3003}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="hiC_3023"
                            value={data.hiC_3023}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="drafT_MM_WC"
                            value={data.drafT_MM_WC}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="noOfBurner"
                            value={data.noOfBurner}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="noOfPilot"
                            value={data.noOfPilot}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="flameColor"
                            value={data.flameColor}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 210 }}>
                          <RadioGroup
                            groupName=""
                            name="impingement"
                            value={data.impingement}
                            onChange={e => onImpingementChange(e, data.id)}
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
                      <TableRow key={data.id}>
                        <TableCell size="small">{data.equipTagDisplayName}</TableCell>

                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_1"
                            value={data.burner_1}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_2"
                            value={data.burner_2}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_3"
                            value={data.burner_3}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_4"
                            value={data.burner_4}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_5"
                            value={data.burner_5}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_6"
                            value={data.burner_6}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_7"
                            value={data.burner_7}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_8"
                            value={data.burner_8}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_9"
                            value={data.burner_9}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 110 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="burner_10"
                            value={data.burner_10}
                            onChange={e => onChange(e, data.id)}
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
                      <TableRow key={data.id}>
                        <TableCell>{data.equipTagDisplayName}</TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="suC_BAR"
                            value={data.suC_BAR}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="disC_BAR"
                            value={data.disC_BAR}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>
                        <TableCell>{data.standByTagDisplayName}</TableCell>
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
                      <TableRow key={data.id}>
                        <TableCell>{data.equipTagDisplayName}</TableCell>
                        <TableCell size="small">
                          <Checkbox
                            name="oiL_LEVEL"
                            label="OK"
                            checked={data.oiL_LEVEL}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <Checkbox
                            name="cW_FLOW"
                            label="OK"
                            checked={data.cW_FLOW}
                            onChange={e => onChange(e, data.id, false)}
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
                      <TableRow key={data.id}>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}${data.equipCondition}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox9(e, data.id)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 120 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="temP_1ST_D"
                            value={data.temP_1ST_D}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>

                        <TableCell size="small" style={{ minWidth: 120 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="temP_2ND_D"
                            value={data.temP_2ND_D}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" style={{ minWidth: 120 }}>
                          <TextInput
                            className={classes.txtInput}
                            name="oiL_PRES"
                            value={data.oiL_PRES}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <Checkbox
                            name="oiL_LEVEL"
                            label="OK"
                            checked={data.oiL_LEVEL}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>

                        <TableCell size="small">
                          <Checkbox
                            name="cW_FLOW"
                            label="OK"
                            checked={data.cW_FLOW}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>

                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.standByTagDisplayName}${data.standByCondition}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="standByCondition"
                              value={data.standByCondition}
                              onChange={e => onABChangeForBox9(e, data.id)}
                              items={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' }
                              ]}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Checkbox name="auto" checked={data.auto} onChange={e => onChange(e, data.id, false)} />
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
                      <TableRow key={data.id}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="piT_LEVEL"
                            value={data.piT_LEVEL}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox10(e, data.id)}
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
                              onChange={e => onABChangeForBox10(e, data.id)}
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
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center" style={{ minWidth: 210 }}>
                          <RadioGroup
                            groupName=""
                            name="gA_6062_POSITION"
                            value={data.gA_6062_POSITION}
                            onChange={e => onGaPositionChange(e, data.id)}
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
                      <TableRow key={data.id}>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="b_6071_LEVEL"
                            value={data.b_6071_LEVEL}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 150 }} align="center">
                          <span>{`${data.equipTagDisplayName}`}</span>
                          <Box>
                            <RadioGroup
                              groupName=""
                              name="equipCondition"
                              value={data.equipCondition}
                              onChange={e => onABChangeForBox11(e, data.id)}
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
                              onChange={e => onABChangeForBox11(e, data.id)}
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
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Checkbox
                            name="steam"
                            label="OK"
                            checked={data.steam}
                            onChange={e => onChange(e, data.id, false)}
                          />
                        </TableCell>
                        <TableCell size="small">
                          <TextInput
                            className={classes.txtInput}
                            name="piloT_GAS_BAR"
                            value={data.piloT_GAS_BAR}
                            onChange={e => onChange(e, data.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

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
          <Grid item container justifyContent="flex-end">
            <SaveButton onClick={onSubmit} />
            <CancelButton
              onClick={() => {
                history.goBack();
              }}
            />
          </Grid>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default SiteReportEditForm;

/** Change Log
 * 26-February-2022 (nasir) : Equip and stand by tag dropdown add on Box-1, data validation add on specific fields
 **/

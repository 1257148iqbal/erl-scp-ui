import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import {
  CancelButton,
  CustomAutoComplete,
  CustomDateTimePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  Spinner,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, LAB_TEST, TEST_SAMPLE } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown } from 'utils/commonHelper';
import { serverDate, time24 } from 'utils/dateHelper';
import { onTextFieldFocus } from 'utils/keyControl';
import { v4 as uuid } from 'uuid';
import { StyledTableHeadCellLrv, StyledTableHeadCellWater, useLabTestCreateFormStyles } from '../styles';

const LabTestCreateSpecificForm = props => {
  const classes = useLabTestCreateFormStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history } = props;

  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region States
  const [state, setState] = useState([]);
  const [date, setDate] = useState(new Date());
  const [labShifts, setLabShifts] = useState([]);
  const [labShift, setLabShift] = useState(null);
  //#endregion

  //#region UDF's
  const fetchLabShift = () => {
    trackPromise(
      http.get(LAB_SHIFT.get_active).then(res => {
        if (res.data.succeeded) {
          const labshifts = fillDropDown(res.data.data, 'shiftName', 'id');
          setLabShifts(labshifts);
        }
      })
    );
  };
  //#endregion

  //#region hooks

  useEffect(() => {
    fetchLabShift();
  }, []);

  useEffect(() => {
    const fetchTestSamples = async () => {
      try {
        const res = await http.get(TEST_SAMPLE.get_all);
        if (res.data.succeeded) {
          const testSamples = res.data.data.map(sample => ({
            ...sample,
            rowId: uuid(),
            rvP_psi: '',
            colour_ASTM: '',
            fp: '',
            viscosity50: '',
            viscosity100: '',
            ppInC: '',
            astM_Distillation_IBP: '',
            astM_Distillation_5: '',
            astM_Distillation_10: '',
            astM_Distillation_50: '',
            astM_Distillation_90: '',
            astM_Distillation_FBP: '',
            uoP_BSW_FBP_Before: '',
            uoP_BSW_FBP_After: '',
            uoP_BSW_FBP_Report: '',
            fR_5: '',
            ph: '',
            cond: '',
            tds: '',
            ta: '',
            tac: '',
            naCI: '',
            h2S: '',
            nH3: ''
          }));
          setState(testSamples);
        }
      } catch (err) {
        toastAlerts('error', err);
      }
    };
    fetchTestSamples();
  }, []);

  //#endregion

  //#region EVENTS
  const onDateChange = date => {
    setDate(date);
  };

  const onLabShiftChange = (e, newValue) => {
    if (newValue) {
      setLabShift(newValue);
    } else {
      setLabShift(null);
    }
  };

  const onChange = (event, rowId) => {
    const { name, value } = event.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const updatedState = state.map(sample => {
      if (sample.rowId === rowId) {
        if (name === 'uoP_BSW_FBP_Report') {
          sample[name] = value;
        } else {
          const validFieldValue = regx.test(value) ? value : sample[name];
          sample[name] = validFieldValue;
        }
      }
      return sample;
    });
    setState(updatedState);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (date && labShift) {
      setLoading(true);
      setOpenBackdrop(true);

      const data = {
        date: serverDate(date),
        time: time24(date),
        shiftId: labShift.id,
        shiftName: labShift.shiftName,
        operatorId: operatorId,
        empCode: employeeID,
        userName: userName,
        labReportDetails: state.map(sample => {
          const copiedItem = Object.assign({}, sample);
          copiedItem.id = 0;
          copiedItem.labReportMasterId = 0;
          copiedItem.labUnitId = sample.labUnitId;
          copiedItem.labUnitName = sample.labUnitName.toLowerCase();
          copiedItem.testSampleId = sample.id;
          copiedItem.testSampleName = sample.sampleName;
          copiedItem.density = sample.density;

          copiedItem.rvP_psi = sample.rvP_psi ? +sample.rvP_psi : 0;
          copiedItem.colour_ASTM = sample.colour_ASTM ? +sample.colour_ASTM : 0;
          copiedItem.fp = sample.fp ? +sample.fp : 0;
          copiedItem.viscosity50 = sample.viscosity50 ? +sample.viscosity50 : 0;
          copiedItem.viscosity100 = sample.viscosity100 ? +sample.viscosity100 : 0;
          copiedItem.ppInC = sample.ppInC ? sample.ppInC : 0;
          copiedItem.astM_Distillation_IBP = sample.astM_Distillation_IBP ? +sample.astM_Distillation_IBP : 0;
          copiedItem.astM_Distillation_5 = sample.astM_Distillation_5 ? +sample.astM_Distillation_5 : 0;
          copiedItem.astM_Distillation_10 = sample.astM_Distillation_10 ? +sample.astM_Distillation_10 : 0;
          copiedItem.astM_Distillation_50 = sample.astM_Distillation_50 ? +sample.astM_Distillation_50 : 0;
          copiedItem.astM_Distillation_90 = sample.astM_Distillation_90 ? +sample.astM_Distillation_90 : 0;
          copiedItem.astM_Distillation_95 = sample.astM_Distillation_95 ? +sample.astM_Distillation_95 : 0;
          copiedItem.astM_Distillation_FBP = sample.astM_Distillation_FBP ? +sample.astM_Distillation_FBP : 0;
          copiedItem.uoP_BSW_FBP_Before = sample.uoP_BSW_FBP_Before ? +sample.uoP_BSW_FBP_Before : 0;
          copiedItem.uoP_BSW_FBP_After = sample.uoP_BSW_FBP_After ? +sample.uoP_BSW_FBP_After : 0;
          copiedItem.uoP_BSW_FBP_Report = sample.uoP_BSW_FBP_Report ? sample.uoP_BSW_FBP_Report : '';
          copiedItem.fR_5 = sample.fR_5 ? +sample.fR_5 : 0;

          copiedItem.ph = sample.ph ? +sample.ph : 0;
          copiedItem.cond = sample.cond ? +sample.cond : 0;
          copiedItem.tds = sample.tds ? +sample.tds : 0;
          copiedItem.ta = sample.ta ? +sample.ta : 0;
          copiedItem.tac = sample.tac ? +sample.tac : 0;
          copiedItem.naCI = sample.naCI ? +sample.naCI : 0;
          copiedItem.h2S = sample.h2S ? +sample.h2S : 0;
          copiedItem.nH3 = sample.nH3 ? +sample.nH3 : 0;

          delete copiedItem.key;
          delete copiedItem.alias;
          delete copiedItem.isActive;
          delete copiedItem.sampleName;
          delete copiedItem.rowId;
          return copiedItem;
        })
      };

      // return;
      try {
        const res = await http.post(LAB_TEST.create, data);
        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          toastAlerts('error', res.data.message);
        }
      } catch (err) {
        toastAlerts('error', err?.response?.data?.Message ? err?.response?.data?.Message : 'There was an error!!');
      } finally {
        setLoading(false);
        setOpenBackdrop(false);
      }
    } else {
      toastAlerts('warning', 'Plese Select Date-Time and Shift');
    }
  };

  const onCancel = () => {
    history.goBack();
  };
  //#endregion

  return (
    <PageContainer heading="Lab Test (Create Specific)">
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CustomDateTimePicker label="Select Date" value={date} onChange={onDateChange} clearable={false} />
            </Grid>
            <Grid item xs={6}>
              <CustomAutoComplete
                name="labShiftId"
                data={labShifts}
                label="Select Shift"
                value={labShift}
                onChange={onLabShiftChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table stickyHeader className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCellLrv rowSpan="3" align="center" style={{ position: 'sticky', left: 0, zIndex: 20 }}>
                        Unit
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv
                        rowSpan="3"
                        align="center"
                        style={{ position: 'sticky', left: 60, zIndex: 20, minWidth: 200 }}>
                        Sample
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        Density
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        rvP_psi
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        Color ASTM
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        FP
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv colSpan="2" rowSpan="2" align="center">
                        Viscosity
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        {'pp \u00b0C'}
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv colSpan="7" rowSpan="2" align="center">
                        ASTM Distillation
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv colSpan="3" align="center">
                        Stability (UOP)
                      </StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv rowSpan="3" align="center">
                        FR-5 %xylene
                      </StyledTableHeadCellLrv>
                    </TableRow>

                    <TableRow>
                      <StyledTableHeadCellLrv colSpan="3" align="center">
                        BSW
                      </StyledTableHeadCellLrv>
                    </TableRow>

                    <TableRow>
                      <StyledTableHeadCellLrv align="center">{'50 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'100 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">IBP</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'5 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'10 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'50 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'90 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">{'95 \u00b0C'}</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">FBP</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">Before Oxid.</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">After Oxid.</StyledTableHeadCellLrv>
                      <StyledTableHeadCellLrv align="center">Report</StyledTableHeadCellLrv>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state
                      .filter(unit => unit.labUnitName === 'LRV')
                      .map((sample, index, lrvdata) => (
                        <TableRow key={sample.id} className={classes.tableRow}>
                          <TableCell style={{ position: 'sticky', left: 0, zIndex: 20, background: '#ccdbd0' }}>
                            {sample.labUnitName}
                          </TableCell>
                          <TableCell
                            style={{
                              position: 'sticky',
                              left: 60,
                              zIndex: 20,
                              background: '#ccdbd0',
                              minWidth: 200
                            }}>
                            {sample.sampleName}
                          </TableCell>
                          {/* <TableCell style={{ minWidth: 120 }}>{sample.density}</TableCell> */}
                          <TableCell style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`density${index}`}
                              name="density"
                              value={sample.density}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'density', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`rvP_psi${index}`}
                              name="rvP_psi"
                              value={sample.rvP_psi}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'rvP_psi', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`colour_ASTM${index}`}
                              name="colour_ASTM"
                              value={sample.colour_ASTM}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'colour_ASTM', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`fp${index}`}
                              name="fp"
                              value={sample.fp}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'fp', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`viscosity50${index}`}
                              name="viscosity50"
                              value={sample.viscosity50}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'viscosity50', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`viscosity100${index}`}
                              name="viscosity100"
                              value={sample.viscosity100}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'viscosity100', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`ppInC${index}`}
                              name="ppInC"
                              value={sample.ppInC}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'ppInC', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_IBP${index}`}
                              name="astM_Distillation_IBP"
                              value={sample.astM_Distillation_IBP}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_IBP', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_5${index}`}
                              name="astM_Distillation_5"
                              value={sample.astM_Distillation_5}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_5', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_10${index}`}
                              name="astM_Distillation_10"
                              value={sample.astM_Distillation_10}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_10', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_50${index}`}
                              name="astM_Distillation_50"
                              value={sample.astM_Distillation_50}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_50', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_90${index}`}
                              name="astM_Distillation_90"
                              value={sample.astM_Distillation_90}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_90', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_95${index}`}
                              name="astM_Distillation_95"
                              value={sample.astM_Distillation_95}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_95', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`astM_Distillation_FBP${index}`}
                              name="astM_Distillation_FBP"
                              value={sample.astM_Distillation_FBP}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'astM_Distillation_FBP', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 130 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`uoP_BSW_FBP_Before${index}`}
                              name="uoP_BSW_FBP_Before"
                              value={sample.uoP_BSW_FBP_Before}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'uoP_BSW_FBP_Before', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`uoP_BSW_FBP_After${index}`}
                              name="uoP_BSW_FBP_After"
                              value={sample.uoP_BSW_FBP_After}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'uoP_BSW_FBP_After', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`uoP_BSW_FBP_Report${index}`}
                              name="uoP_BSW_FBP_Report"
                              value={sample.uoP_BSW_FBP_Report}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'uoP_BSW_FBP_Report', index, lrvdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`fR_5${index}`}
                              name="fR_5"
                              value={sample.fR_5}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'fR_5', index, lrvdata.length)}
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
                <Table stickyHeader className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCellWater align="center">Unit</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center" style={{ minWidth: 200 }}>
                        Sample
                      </StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">pH</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">COND µS</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">TDS ppm</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">TA ppm</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">TAC ppm</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">NaCl ppm</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">H2S ppm</StyledTableHeadCellWater>
                      <StyledTableHeadCellWater align="center">NH3 ppm</StyledTableHeadCellWater>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state
                      .filter(unit => unit.labUnitName === 'WATER')
                      .map((sample, index, waterdata) => (
                        <TableRow key={sample.id} className={classes.tableRow}>
                          <TableCell>{sample.labUnitName}</TableCell>
                          <TableCell style={{ minWidth: 200 }}>{sample.sampleName}</TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`ph${index}`}
                              name="ph"
                              value={sample.ph}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'ph', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`cond${index}`}
                              name="cond"
                              value={sample.cond}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'cond', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`tds${index}`}
                              name="tds"
                              value={sample.tds}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'tds', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`ta${index}`}
                              name="ta"
                              value={sample.ta}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'ta', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`tac${index}`}
                              name="tac"
                              value={sample.tac}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'tac', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`naCI${index}`}
                              name="naCI"
                              value={sample.naCI}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'naCI', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`h2S${index}`}
                              name="h2S"
                              value={sample.h2S}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'h2S', index, waterdata.length)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              id={`nH3${index}`}
                              name="nH3"
                              value={sample.nH3}
                              onChange={e => onChange(e, sample.rowId)}
                              onKeyDown={e => onTextFieldFocus(e, 'nH3', index, waterdata.length)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {state.length > 0 && (
            <Grid container justifyContent="flex-end" spacing={1}>
              <SaveButton onClick={onSubmit} />
              <ResetButton onClick={() => {}} />
              <CancelButton onClick={onCancel} />
            </Grid>
          )}
        </Form>
      </FormWrapper>
      <Spinner />
    </PageContainer>
  );
};

export default LabTestCreateSpecificForm;

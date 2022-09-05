import {
  Grid,
  lighten,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { CancelButton, CustomPreloder, Form, FormWrapper, SaveButton, TextInput } from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_TEST } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect } from 'react';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate, serverDate } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import { StyledTableHeadCellLrv, StyledTableHeadCellWater } from '../styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& .MuiPaper-root': {
      backgroundColor: lighten(theme.palette.background.paper, 0.1)
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  table: {
    minWidth: 800
  },
  masterInfoBoxTableCell: {
    paddingRight: 0,
    maxWidth: 16,
    [theme.breakpoints.down('md')]: {
      maxWidth: 55
    }
  }
}));

const LabTestEditForm = props => {
  const classes = useStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history, location } = props;
  //#region States
  const [state, setState] = React.useState([]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);

  //#endregion

  //#region UDF
  const getLabReport = () => {
    http.get(`${LAB_TEST.get_single}/${location.state}`).then(res => {
      if (res.data.succeeded) {
        const labReportInfo = {
          ...res.data.data,
          labReportDetails: res.data.data.labReportDetails.map(s => ({
            rowId: uuid(),
            ...s
          }))
        };
        setState(labReportInfo);
        setIsPageLoaded(true);
      } else {
        toastAlerts('error', 'Error with loading switches!!!');
      }
    });
  };
  //#endregion

  //#region Hook
  useEffect(() => {
    getLabReport();
  }, []);
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  //#region EVENTS
  const onChange = (event, rowId) => {
    const { name, value } = event.target;
    const oldState = { ...state };
    const updatedState = oldState.labReportDetails.map(sample => {
      if (sample.rowId === rowId) {
        if (name === 'uoP_BSW_FBP_Report') {
          sample[name] = value;
        } else {
          const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
          const validFieldValue = regx.test(value) ? value : sample[name];
          sample[name] = validFieldValue;
        }
      }
      return sample;
    });
    setState({ ...state, labReportDetails: updatedState });
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      id: state.id,
      key: state.key,
      date: serverDate(state.date),
      time: state.time,
      shiftId: state.shiftId,
      shiftName: state.shiftName,
      operatorId: state.operatorId,
      empCode: state.empCode,
      userName: state.userName,
      labReportDetails: state.labReportDetails.map(sample => {
        const copiedItem = Object.assign({}, sample);
        copiedItem.id = sample.id;
        copiedItem.labReportMasterId = sample.labReportMasterId;
        copiedItem.labUnitId = sample.labUnitId;
        copiedItem.labUnitName = sample.labUnitName.toLowerCase();
        copiedItem.testSampleId = sample.testSampleId;
        copiedItem.testSampleName = sample.testSampleName;
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

        delete copiedItem.rowId;
        return copiedItem;
      })
    };

    http
      .put(`${LAB_TEST.update}/${data.key}`, data)
      .then(res => {
        if (res.data.succeeded) {
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          setLoading(false);
          setOpenBackdrop(false);
          toastAlerts('error', res.data.message);
        }
      })
      .catch(err => {
        setLoading(false);
        setOpenBackdrop(false);
        toastAlerts('error', 'There was an error');
      });
  };

  const onCancel = () => {
    history.goBack();
  };
  //#endregion

  return (
    <PageContainer heading="Lab Test (Update)">
      <FormWrapper>
        <Form>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date:</TableCell>
                      <TableCell>{formattedDate(state.date)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Shift:</TableCell>
                      <TableCell>{state.shiftName}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table stickyHeader className={classes.table}>
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
                    {state.labReportDetails
                      .filter(unit => unit.labUnitName === 'lrv')
                      .map(sample => (
                        <TableRow key={sample.id} className={classes.tableRow}>
                          <TableCell style={{ position: 'sticky', left: 0, zIndex: 20, background: '#ccdbd0' }}>
                            {sample.labUnitName.toUpperCase()}
                          </TableCell>
                          <TableCell
                            style={{
                              position: 'sticky',
                              left: 60,
                              zIndex: 20,
                              background: '#ccdbd0',
                              minWidth: 120
                            }}>
                            {sample.testSampleName}
                          </TableCell>
                          <TableCell style={{ minWidth: 120 }}>{sample.density}</TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="rvP_psi"
                              value={sample.rvP_psi}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="colour_ASTM"
                              value={sample.colour_ASTM}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="fp"
                              value={sample.fp}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="viscosity50"
                              value={sample.viscosity50}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="viscosity100"
                              value={sample.viscosity100}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="ppInC"
                              value={sample.ppInC}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_IBP"
                              value={sample.astM_Distillation_IBP}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_5"
                              value={sample.astM_Distillation_5}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_10"
                              value={sample.astM_Distillation_10}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_50"
                              value={sample.astM_Distillation_50}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_90"
                              value={sample.astM_Distillation_90}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_95"
                              value={sample.astM_Distillation_95}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="astM_Distillation_FBP"
                              value={sample.astM_Distillation_FBP}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 130 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="uoP_BSW_FBP_Before"
                              value={sample.uoP_BSW_FBP_Before}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="uoP_BSW_FBP_After"
                              value={sample.uoP_BSW_FBP_After}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="uoP_BSW_FBP_Report"
                              value={sample.uoP_BSW_FBP_Report}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="fR_5"
                              value={sample.fR_5}
                              onChange={e => onChange(e, sample.rowId)}
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
                <Table stickyHeader className={classes.table}>
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
                    {state.labReportDetails
                      .filter(unit => unit.labUnitName === 'water')
                      .map(sample => (
                        <TableRow key={sample.id} className={classes.tableRow}>
                          <TableCell>{sample.labUnitName.toUpperCase()}</TableCell>
                          <TableCell style={{ minWidth: 200 }}>{sample.testSampleName}</TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="ph"
                              value={sample.ph}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="cond"
                              value={sample.cond}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="tds"
                              value={sample.tds}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="ta"
                              value={sample.ta}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="tac"
                              value={sample.tac}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="naCI"
                              value={sample.naCI}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="h2S"
                              value={sample.h2S}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 120 }}>
                            <TextInput
                              className={classes.txtInput}
                              name="nH3"
                              value={sample.nH3}
                              onChange={e => onChange(e, sample.rowId)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" spacing={1}>
            <SaveButton onClick={onSubmit} />
            <CancelButton onClick={onCancel} />
          </Grid>
        </Form>
      </FormWrapper>
    </PageContainer>
  );
};

export default LabTestEditForm;

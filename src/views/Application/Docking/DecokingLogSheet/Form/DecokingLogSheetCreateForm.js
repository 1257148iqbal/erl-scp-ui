import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import axios from 'axios';
import {
  CancelButton,
  Checkbox,
  CloseIcon,
  CustomAutoComplete,
  CustomDatePicker,
  CustomTimePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  Spinner,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { DECOKING_LOG, DECOKING_NUMBERS, DECOKING_PARAMETERS } from 'constants/ApiEndPoints/v1';
import { requiredMessage, requiredSelection } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { Fragment, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, getSign } from 'utils/commonHelper';
import { serverDate, time24 } from 'utils/dateHelper';
import { onTextFieldFocus } from 'utils/keyControl';
import { useStyles } from '../style';
const initialDecokingNumberFieldValues = {
  decokingNumber: '',
  details: '',
  fromDate: null,
  toDate: null,
  isActive: true
};
const DecokingLogSheetCreateForm = () => {
  const history = useHistory();
  const classes = useStyles();

  const { setOpenBackdrop, setLoading } = useBackDrop();

  //#region States
  const [decokingNumbers, setDecokingNumbers] = useState([]);
  const [decokingNumber, setDecokingNumber] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [state, setState] = useState([]);
  const [remark, setRemark] = useState('');
  const [decokingNumberModalOpen, setDecokingNumberModalOpen] = useState(false);
  const [decokingNumberState, setDecokingNumberState] = useState(initialDecokingNumberFieldValues);
  const [errors, setErrors] = React.useState({});
  // const [fromDate, setFromDate] = useState(null);
  // const [toDate, setToDate] = useState(null);
  //#endregion

  //#region UDF's
  const validate = (fieldValues = decokingNumberState) => {
    let temp = { ...errors };
    if ('decokingNumber' in fieldValues) {
      if (!fieldValues.decokingNumber) {
        temp.decokingNumber = requiredMessage;
      } else if (fieldValues.decokingNumber.length > 100) {
        temp.decokingNumber = 'Docking Number can not exceed hundred character';
      } else {
        temp.decokingNumber = '';
      }
    }

    if ('fromDate' in fieldValues) {
      if (!fieldValues.fromDate) {
        temp.fromDate = requiredSelection;
      } else {
        temp.fromDate = '';
      }
    }
    setErrors({ ...temp });
    if (fieldValues === decokingNumberState) return Object.values(temp).every(x => x === '');
  };
  //#endregion

  //#region hook
  useEffect(() => {
    const fetchDependencies = async () => {
      const decokingParameterReq = http.get(DECOKING_PARAMETERS.get_active);
      const decokingNumberReq = http.get(DECOKING_NUMBERS.get_active);

      const [decokingParameterRes, decokingNumberRes] = await axios.all([decokingParameterReq, decokingNumberReq]);

      if (decokingParameterRes.data.succeeded && decokingNumberRes.data.succeeded) {
        // Parameters
        const parameters = decokingParameterRes.data.data.map(item => ({
          ...item,
          reading: ''
        }));

        const uniqueGroupName = [...new Set(parameters.map(item => item.operationGroupName))];

        const parametersByGroupName = uniqueGroupName.reduce((accumulator, current) => {
          const filteredArray = parameters.filter(item => item.operationGroupName === current);
          const assignArray = { operationGroupName: current, parameters: filteredArray };
          accumulator.push(assignArray);
          return accumulator;
        }, []);

        // Decoking Numbers
        const activeDecokingNumber = decokingNumberRes.data.data.filter(dn => dn.isActive);
        const _decokingNumbers = fillDropDown(activeDecokingNumber, 'decokingNumber', 'id');

        setState(parametersByGroupName);
        setDecokingNumbers(_decokingNumbers);
      }
    };

    trackPromise(fetchDependencies());
  }, []);
  //#endregion

  //#region Events
  const onDecokingStateChange = e => {
    const { type, name, value, checked } = e.target;
    const filedValue = { [name]: value };
    setDecokingNumberState({
      ...decokingNumberState,
      [name]: type === 'checkbox' ? checked : value
    });
    validate(filedValue);
  };
  const onFromDateChange = fromDate => {
    const filedValue = { fromDate: fromDate };
    setDecokingNumberState({ ...decokingNumberState, fromDate: serverDate(fromDate) });
    validate(filedValue);
  };
  const onToDateChange = toDate => {
    if (toDate) {
      setDecokingNumberState({ ...decokingNumberState, toDate: serverDate(toDate) });
    } else {
      setDecokingNumberState({ ...decokingNumberState, toDate: null });
    }
  };
  const onDecokingNoChange = (e, newValue) => {
    if (newValue) {
      setDecokingNumber(newValue);
    } else {
      setDecokingNumber(null);
      setDate(null);
      setTime(null);
    }
  };
  const onDateChange = date => {
    setDate(date);
  };
  const onStartTimeChange = time => {
    setTime(time);
  };

  const onChange = (e, opGrIdx, paraIdx) => {
    const { value } = e.target;
    const regx = /^[+-]?\d*(?:[.,]\d*)?$/;
    const _state = [...state];
    const targetInputField = _state[opGrIdx].parameters[paraIdx];
    targetInputField['reading'] = regx.test(value) ? value : targetInputField['reading'];
    _state[opGrIdx].parameters[paraIdx] = targetInputField;
    setState(_state);
  };

  const onReset = () => {
    const resetedState = state.map(item => ({ ...item, parameters: item.parameters.map(p => ({ ...p, reading: '' })) }));
    setState(resetedState);
    setRemark('');
    setTime(null);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return false;
    } else {
      //setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  const onSubmitDecokingNumber = async e => {
    if (validate()) {
      const payload = {
        decokingNumber: decokingNumberState.decokingNumber,
        details: decokingNumberState.details,
        fromDate: decokingNumberState.fromDate ?? '',
        toDate: decokingNumberState.toDate ?? '',
        isActive: decokingNumberState.isActive
      };
      try {
        const res = await http.post(DECOKING_NUMBERS.create, payload);
        const savedDecokingNumber = { label: decokingNumberState.decokingNumber, value: res.data.data };
        toastAlerts('success', res.data.message);
        setDecokingNumbers(prev => [...prev, savedDecokingNumber]);
        setDecokingNumber(savedDecokingNumber);
        setDecokingNumberModalOpen(false);
      } catch (err) {
        toastAlerts('warning', err.message);
      }
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    try {
      const decokingLogDetails = state
        .map(item => item.parameters)
        .flat(1)
        .map(dld => ({
          parameterId: dld.id,
          sortOrder: dld.sortOrder,
          operationGroupId: dld.operationGroupId,
          operationGroupName: dld.operationGroupName,
          parameterName: dld.parameterName,
          details: dld.details,
          reading: dld.reading ? +dld.reading : 0,
          unitId: dld.unitId,
          unitName: dld.unitName
        }));
      const [hour, minute] = time24(time).split(':');
      const data = {
        date: serverDate(date),
        time: `${hour}:${minute}:00`,
        decokingNumberId: decokingNumber.value,
        number: decokingNumber.label,
        remark: remark,
        decokingLogDetails
      };

      const res = await http.post(DECOKING_LOG.create, data);
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
    <PageContainer heading="Decoking Log Sheet (Create)">
      <FormWrapper>
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.masterInfoBox}>
              <Paper>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Decoking No: </TableCell>
                      <TableCell style={{ display: 'flex' }}>
                        <CustomAutoComplete
                          label="Decoking Numbers"
                          data={decokingNumbers}
                          value={decokingNumber}
                          onChange={onDecokingNoChange}
                        />
                        <IconButton
                          size="small"
                          style={{ backgroundColor: '#34C303', borderRadius: 5, margin: 10 }}
                          disableRipple
                          onClick={() => {
                            setDecokingNumberModalOpen(true);
                          }}>
                          <Add style={{ color: '#fff' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Date: </TableCell>
                      <TableCell>
                        <CustomDatePicker
                          disabled={!decokingNumber}
                          label="Select Date"
                          value={date}
                          onChange={onDateChange}
                          minDate={decokingNumber?.fromDate}
                          {...(decokingNumber?.toDate && { maxDate: decokingNumber?.toDate })}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.masterInfoBoxTableCell}>Time: </TableCell>
                      <TableCell>
                        <CustomTimePicker
                          disabled={!decokingNumber}
                          label="Select Time"
                          views={['hours', 'minutes']}
                          format="HH:mm"
                          value={time}
                          onChange={onStartTimeChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            {state.map((item, opGrIdx) => (
              <Grid item xs={12} key={item.operationGroupName}>
                <Typography variant="h1" className={classes.operationGroup}>
                  {item.operationGroupName}
                </Typography>
                <TableContainer component={Paper} className={classes.root}>
                  <Table stickyHeader aria-label="caption table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ minWidth: 250, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                          Parameters
                        </TableCell>
                        <TableCell style={{ minWidth: 20, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                          Unit
                        </TableCell>
                        <TableCell style={{ minWidth: 200, backgroundColor: '#333333', color: '#FFFFFF' }} align="left">
                          Reading
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.parameters.map((para, paraIdx) => (
                        <TableRow key={para.id} className={classes.tableRow}>
                          <TableCell>{para.parameterName}</TableCell>
                          <TableCell>{getSign(para.unitName)}</TableCell>
                          <TableCell>
                            <TextInput
                              id={`reading${opGrIdx}${paraIdx}`}
                              name="reading"
                              value={para.reading}
                              className={classes.txtInput}
                              onChange={e => {
                                onChange(e, opGrIdx, paraIdx);
                              }}
                              onKeyDown={e => onTextFieldFocus(e, `reading${opGrIdx}`, paraIdx, item.parameters.length)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
            <Spinner type="Oval" />
          </Grid>

          {state.length > 0 && (
            <Fragment>
              <Grid item xs={12} style={{ marginTop: 15 }}>
                <TextInput
                  multiline
                  className={classes.txtInput}
                  label="Remark"
                  name="remark"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                />
              </Grid>

              <Grid item container justifyContent="flex-end">
                <SaveButton onClick={onSubmit} />
                <ResetButton onClick={onReset} />
                <CancelButton onClick={() => history.goBack()} />
              </Grid>
            </Fragment>
          )}
        </Form>
        <Dialog open={decokingNumberModalOpen} onClose={handleCloseDialog}>
          <DialogTitle id="decoking-number-dialog" style={{ padding: '5px 15px' }}>
            <Grid container alignItems="center">
              <Grid item container justifyContent="flex-start" xs={6}>
                <p>Add New</p>
              </Grid>
              <Grid item container justifyContent="flex-end" xs={6}>
                <CloseIcon onClick={() => setDecokingNumberModalOpen(false)} />
              </Grid>
            </Grid>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextInput
                  name="decokingNumber"
                  label="Decoking Number"
                  value={decokingNumberState.decokingNumber}
                  error={errors.decokingNumber}
                  onChange={onDecokingStateChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextInput
                  name="details"
                  label="Details"
                  value={decokingNumberState.details}
                  error={errors.details}
                  onChange={onDecokingStateChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomDatePicker
                  label="Select From Date"
                  value={decokingNumberState.fromDate}
                  onChange={onFromDateChange}
                  error={errors.fromDate}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomDatePicker
                  label="Select To Date"
                  value={decokingNumberState.toDate}
                  onChange={onToDateChange}
                  disablePast
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Checkbox
                  name="isActive"
                  label="Is Active"
                  checked={decokingNumberState.isActive}
                  onChange={onDecokingStateChange}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <SaveButton onClick={onSubmitDecokingNumber} />
            </Grid>
          </DialogContent>
        </Dialog>
      </FormWrapper>
    </PageContainer>
  );
};

export default DecokingLogSheetCreateForm;

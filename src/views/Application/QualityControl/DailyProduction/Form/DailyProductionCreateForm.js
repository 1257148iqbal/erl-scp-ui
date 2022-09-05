import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import {
  CancelButton,
  CustomDatePicker,
  Form,
  FormWrapper,
  ResetButton,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import { LAB_TEST } from 'constants/ApiEndPoints/v1';
import { DAILY_PRODUCTION } from 'constants/ApiEndPoints/v1/dailyProduction';
import { internalServerError } from 'constants/ErrorMessages';
import { useBackDrop } from 'hooks/useBackdrop';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { serverDate } from 'utils/dateHelper';
import { useDailyProductionFormStyles } from '../styles';

const initialFieldValues = {
  date: '',
  feed_ALC: '',
  feed_Murban: '',
  gas_Oil: '',
  residue: '',
  naptha: '',
  gas: '',
  steam: '',
  ng: '',
  power: '',
  nH3: '',
  ci: '',
  ao: '',
  note: ''
};

const DailyProductionCreateForm = props => {
  const classes = useDailyProductionFormStyles();
  const { setOpenBackdrop, setLoading } = useBackDrop();
  const { history } = props;
  const {
    authUser: { userName, employeeID, operatorId }
  } = useSelector(({ auth }) => auth);

  //#region State

  const [state, setState] = useState(initialFieldValues);

  const [date, setDate] = React.useState(new Date());
  const [temperature, setTemperature] = useState(0);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  //#region

  useEffect(() => {
    const queryParam = {
      Date: serverDate(date)
    };
    http
      .get(`${LAB_TEST.check_alc_or_murban}?${qs.stringify(queryParam)}`)
      .then(res => {
        if (res.data.succeeded) {
          const temp = res.data.data;
          setTemperature(temp);
        } else {
          setTemperature(0);
          toastAlerts('error', res.data.message);
        }
      })
      .catch(err => toastAlerts('error', internalServerError));
  }, [date]);

  //#region Events

  const onChange = e => {
    const { name, value } = e.target;
    const regxDensity = /^[+-]?\d*(?:[.,]\d*)?$/;
    const validDensity = regxDensity.test(value) ? value : state[name];
    if (name === 'note') {
      setState({
        ...state,
        [name]: value
      });
    } else {
      setState({
        ...state,
        [name]: validDensity
      });
    }
  };

  const onDateChange = date => {
    setDate(date);
  };
  //For Add Remarks
  const onAddRemak = () => {
    if (note) {
      const _notes = [...notes].concat(note);
      setNotes(_notes);
      setNote('');
      const ele = document.querySelector('#note');
      ele.focus();
    }
  };

  const onPressRemark = e => {
    if (e.key === 'Enter') {
      onAddRemak();
    }
  };
  //For Add Remarks
  const onRemoveRemark = index => {
    const _notes = [...notes];
    _notes.splice(index, 1);
    setNotes(_notes);
  };
  //For Submit
  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setOpenBackdrop(true);
    const data = {
      date: date,
      feed_ALC: state.feed_ALC ? +state.feed_ALC : 0,
      feed_Murban: state.feed_Murban ? +state.feed_Murban : 0,
      gas_Oil: state.gas_Oil ? +state.gas_Oil : 0,
      residue: state.residue ? +state.residue : 0,
      naptha: state.naptha ? +state.naptha : 0,
      gas: state.gas ? +state.gas : 0,
      steam: state.steam ? +state.steam : 0,
      ng: state.ng ? +state.ng : 0,
      power: state.power ? +state.power : 0,
      nH3: state.nH3 ? +state.nH3 : 0,
      ci: state.ci ? +state.ci : 0,
      ao: state.ao ? +state.ao : 0,
      note: notes.join('~'),
      operatorId: operatorId,
      empCode: employeeID,
      userName: userName
    };
    http
      .post(DAILY_PRODUCTION.create, data)
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
      .catch(err => toastAlerts('warning', err));
  };

  const onCancel = () => {
    history.goBack();
  };

  const onReset = () => {
    setState(initialFieldValues);
  };
  //#region

  return (
    <>
      <FormWrapper>
        <Form>
          <Grid container spacing={3} component={Paper} className={classes.root}>
            <Grid item xs={12}>
              <CustomDatePicker label="Select Date" value={date} onChange={onDateChange} />
            </Grid>
          </Grid>

          {temperature > 0 && (
            <React.Fragment>
              <Grid container spacing={3} component={Paper} className={classes.root}>
                <Grid item container xs={12} justifyContent="center">
                  <Typography component="h3" className={classes.headerContent}>
                    THROUGH PUT
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput
                    disabled={temperature < 150}
                    className={classes.txtInput}
                    name="feed_ALC"
                    label="Feed ALC"
                    value={state.feed_ALC}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput
                    disabled={temperature >= 150}
                    className={classes.txtInput}
                    name="feed_Murban"
                    label="Feed Murban"
                    value={state.feed_Murban}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} component={Paper} className={classes.root}>
                <Grid item container xs={12} justifyContent="center">
                  <Typography component="h3" className={classes.headerContent}>
                    PRODUCTION
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput
                    className={classes.txtInput}
                    name="gas_Oil"
                    label="Gas Oil (MT)"
                    value={state.gas_Oil}
                    onChange={onChange}
                  />
                  <TextInput
                    className={classes.txtInput}
                    name="residue"
                    label="Residue (MT)"
                    value={state.residue}
                    onChange={onChange}
                  />
                  <TextInput
                    className={classes.txtInput}
                    name="naptha"
                    label="NAPTHA (MT)"
                    value={state.naptha}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput
                    className={classes.txtInput}
                    name="gas"
                    label="GAS (N-m3)"
                    value={state.gas}
                    onChange={onChange}
                  />
                  <TextInput
                    className={classes.txtInput}
                    name="steam"
                    label="STEAM (MT)"
                    value={state.steam}
                    onChange={onChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} component={Paper} className={classes.root}>
                <Grid item container xs={12} justifyContent="center">
                  <Typography component="h3" className={classes.headerContent}>
                    CONSUMPTION
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput className={classes.txtInput} name="ng" label="NG (N-m3)" value={state.ng} onChange={onChange} />
                  <TextInput
                    className={classes.txtInput}
                    name="power"
                    label="POWER (kwh)"
                    value={state.power}
                    onChange={onChange}
                  />
                  <TextInput
                    className={classes.txtInput}
                    name="nH3"
                    label="NH3 (Kg)"
                    value={state.nH3}
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextInput className={classes.txtInput} name="ci" label="C.I (Ltr)" value={state.ci} onChange={onChange} />
                  <TextInput className={classes.txtInput} name="ao" label="A.O (Ltr)" value={state.ao} onChange={onChange} />
                </Grid>
              </Grid>

              <Grid container spacing={3} component={Paper} className={classes.root}>
                <Grid item xs={12} style={{ marginTop: 15, display: 'flex', alignItems: 'center' }}>
                  <TextInput
                    multiline
                    className={(classes.txtInput, classes.onPressRemark)}
                    name="note"
                    id="note"
                    label="Remarks"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onKeyPress={onPressRemark}
                  />
                  <Button variant="contained" color="primary" className={classes.addRemarkBtn} onClick={onAddRemak}>
                    <Add />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <ul className={classes.remarkList}>
                    {notes.map((nt, ntId) => (
                      <li key={ntId + 1} className={classes.remarkListItem}>
                        <span style={{ paddingLeft: 5 }}>{nt}</span>
                        <span className={classes.removeIcon} onClick={() => onRemoveRemark(ntId)}>
                          X
                        </span>
                      </li>
                    ))}
                  </ul>
                </Grid>
              </Grid>

              <Grid container justifyContent="flex-end" spacing={1}>
                <SaveButton onClick={onSubmit} />
                <ResetButton onClick={onReset} />
                <CancelButton onClick={onCancel} />
              </Grid>
            </React.Fragment>
          )}
        </Form>
      </FormWrapper>
    </>
  );
};

export default DailyProductionCreateForm;

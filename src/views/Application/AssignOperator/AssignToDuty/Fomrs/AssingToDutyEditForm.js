import { Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import axios from 'axios';
import {
  CancelButton,
  CustomAutoComplete,
  CustomBackDrop,
  CustomPreloder,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { OPERATOR, OPERATOR_DUTY_LOG_API, OPERATOR_GROUP } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, sleep, stringifyConsole } from 'utils/commonHelper';
import { serverDate } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';
import { useAssignToLabCreateSpecificStyles } from '../styles';

const AssingToDutyCreateForm = () => {
  //#region hooks
  const {
    authUser: { operatorId }
  } = useSelector(({ auth }) => auth);
  const { setOpenBackdrop } = useBackDrop();

  const classes = useAssignToLabCreateSpecificStyles();
  const history = useHistory();
  const location = useLocation();

  //#region

  //#region  States
  const [state, setState] = useState(null);
  const [operatorGroups, setOperatorGroups] = useState([]);
  const [operatorGroup, setOperatorGroup] = useState(null);
  const [operators, setoperators] = useState([]);
  const [operator, setOperator] = useState(null);

  const [selectedOperators, setSelectedOperators] = useState([]);

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  //#endregion

  //#region Effects
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchDependencies = async () => {
      try {
        const operatorGroupReq = http.get(OPERATOR_GROUP.get_all, { signal: controller.signal });
        const operatorReq = http.get(OPERATOR.get_active, { signal: controller.signal });
        const dutyLogReq = http.get(`${OPERATOR_DUTY_LOG_API.get_single}/${location.state}`);
        const [operatorGroupRes, operatorRes, dutyLogRes] = await axios.all([operatorGroupReq, operatorReq, dutyLogReq]);
        if (operatorGroupRes.data.succeeded && operatorRes.data.succeeded && dutyLogRes.data.succeeded) {
          const dutyLog = dutyLogRes.data.data;
          const selectedOperators = dutyLog.operatorDutyLogDetails.map(item => {
            const obj = {
              rowId: uuid(),
              departmentId: item.departmentId,
              departmentName: item.departmentName,
              designationId: item.designationId,
              designationName: item.designationName,
              email: item.email,
              operatorCode: item.operatorCode,
              operatorId: item.operatorId,
              operatorName: item.operatorName,
              phoneNumber: item.phoneNumber,
              shiftIncharge: item.shiftIncharge
            };
            return obj;
          });
          const operatorGroupsddl = fillDropDown(operatorGroupRes.data.data, 'groupName', 'id');
          const selectedOperatorGroup = operatorGroupsddl.find(opg => opg.id === dutyLog.operatorGroupId);
          const operatorsddl = operatorRes.data.data.map(op => ({
            ...op,
            label: `${op.operatorName} (${op.operatorCode})`,
            value: op.id
          }));

          if (isMounted) {
            setState(dutyLog);
            setOperatorGroups(operatorGroupsddl);
            setOperatorGroup(selectedOperatorGroup);
            setoperators(operatorsddl);
            setSelectedOperators(selectedOperators);
            setIsPageLoaded(true);
          }
        }
      } catch (error) {}
    };

    fetchDependencies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.state, operatorId]);
  //#endregion

  //#region Events
  const onOperatorGroupChange = (e, newValue) => {
    if (newValue) {
      setOperatorGroup(newValue);
    }
  };

  const onOperatorChange = (e, newValue) => {
    if (newValue) {
      setOperator(newValue);
    }
  };

  const onAddOperator = () => {
    if (operator && selectedOperators.findIndex(item => item.operatorId === operator.id) === -1) {
      const newOperator = {
        rowId: uuid(),
        departmentId: operator.departmentId,
        departmentName: operator.departmentName,
        designationId: operator.designationId,
        designationName: operator.designationName,
        email: operator.email,
        operatorCode: operator.operatorCode,
        operatorId: operator.id,
        operatorName: operator.operatorName,
        phoneNumber: operator.phoneNumber,
        shiftIncharge: false
      };
      setSelectedOperators(prev => [...prev, newOperator]);
      setOperator(null);
    } else {
      toastAlerts('warning', 'Operator already selected');
      setOperator(null);
    }
  };

  const onRemoveOperator = (operatorIndex, operator) => {
    const _selectedOperators = [...selectedOperators];
    _selectedOperators.splice(operatorIndex, 1);
    setSelectedOperators(_selectedOperators);
  };

  const onSubmit = async () => {
    if (state && operatorGroup && selectedOperators.length > 0) {
      setOpenBackdrop(true);
      const payload = {
        id: state.id,
        key: state.key,
        date: serverDate(state.date),
        shiftId: state.shiftId,
        operatorGroupId: operatorGroup.id,
        operatorGroupName: operatorGroup.groupName,
        operatorDutyLogs: selectedOperators.map(operator => ({
          operatorId: operator.operatorId,
          operatorCode: operator.operatorCode,
          operatorName: operator.operatorName,
          phoneNumber: operator.phoneNumber,
          email: operator.email,
          departmentId: operator.departmentId,
          departmentName: operator.departmentName,
          designationId: operator.designationId,
          designationName: operator.designationName,
          shiftIncharge: operator.shiftIncharge
        }))
      };
      stringifyConsole(payload, 'stringify');
      //return;
      await sleep(1000);
      try {
        const res = await http.put(`${OPERATOR_DUTY_LOG_API.update}/${payload.key}`, payload);

        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          toastAlerts('error', 'There is an error to update this record');
        }
      } catch (err) {
        toastAlerts('error', err.response.data.Message);
      } finally {
        setOpenBackdrop(false);
      }
    } else {
      toastAlerts('warning', 'Please select all necessary fields!!!');
    }
  };

  const onCancel = () => {
    history.goBack();
  };
  //#endregion

  //#region Pre Loader
  if (!isPageLoaded) {
    return <CustomPreloder />;
  }
  //#region

  return (
    <PageContainer heading="Update duty log">
      <Grid container>
        <Grid item container component={Paper} spacing={3} style={{ padding: 10, marginBottom: 20 }}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextInput label="Date" value={`${serverDate(state?.date)}`} disabled />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextInput label="Shift" value={state?.shiftName} disabled />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomAutoComplete
              label="Select Operator Group"
              data={operatorGroups}
              value={operatorGroup}
              onChange={onOperatorGroupChange}
            />
          </Grid>
          <Grid item container xs={12} sm={12} md={6} lg={6} xl={6} spacing={3} alignItems="center">
            <Grid item xs={11}>
              <CustomAutoComplete label="Select Operator" data={operators} value={operator} onChange={onOperatorChange} />
            </Grid>
            <Grid item xs={1}>
              <Button
                disabled={!operator}
                variant="contained"
                color="primary"
                size="small"
                disableRipple
                onClick={onAddOperator}
                startIcon={<Add />}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {selectedOperators.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} container component={Paper} spacing={3} style={{ padding: 10 }}>
              <Table>
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <TableCell className={classes.tableHeadCell}>Operator Code</TableCell>
                    <TableCell className={classes.tableHeadCell}>Operator Name</TableCell>
                    <TableCell className={classes.tableHeadCell}>Email</TableCell>
                    <TableCell className={classes.tableHeadCell}>Phone</TableCell>
                    <TableCell className={classes.tableHeadCell}>Designation</TableCell>
                    <TableCell className={classes.tableHeadCell}>Department</TableCell>
                    <TableCell className={classes.tableHeadCell}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOperators?.map((operator, operatorIndex) => {
                    return (
                      <TableRow classes={{ root: classes.tbodyRow }} key={operator.rowId}>
                        <TableCell className={classes.tableBodyCell}>{operator.operatorCode}</TableCell>
                        <TableCell className={classes.tableBodyCell}>{operator.operatorName}</TableCell>
                        <TableCell className={classes.tableBodyCell}>{operator.email}</TableCell>
                        <TableCell className={classes.tableBodyCell}>{operator.phoneNumber}</TableCell>
                        <TableCell className={classes.tableBodyCell}>{operator.designationName}</TableCell>
                        <TableCell className={classes.tableBodyCell}>{operator.departmentName}</TableCell>
                        <TableCell className={classes.tableBodyCell}>
                          {!operator.shiftIncharge && (
                            <IconButton
                              size="small"
                              style={{ backgroundColor: '#f50057', borderRadius: 5, margin: 10, padding: 0 }}
                              disableRipple
                              onClick={() => onRemoveOperator(operatorIndex, operator)}>
                              <Close style={{ color: '#fff' }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
            <Grid item container justifyContent="flex-end" spacing={1}>
              <SaveButton onClick={onSubmit} />
              <CancelButton onClick={onCancel} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <CustomBackDrop />
    </PageContainer>
  );
};

export default AssingToDutyCreateForm;

import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import {
  CancelButton,
  Checkbox,
  CustomAutoComplete,
  CustomBackDrop,
  CustomDatePicker,
  CustomPreloder,
  SaveButton,
  TextInput
} from 'components/CustomControls';
import PageContainer from 'components/PageComponents/layouts/PageContainer';
import { LAB_SHIFT, OPERATOR, OPERATOR_DUTY_LOG_API, OPERATOR_GROUP } from 'constants/ApiEndPoints/v1';
import { useBackDrop } from 'hooks/useBackdrop';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { fillDropDown, sleep, stringifyConsole } from 'utils/commonHelper';
import { serverDate, time24 } from 'utils/dateHelper';
import { useAssignToLabCreateSpecificStyles } from '../styles';

const AssingToDutyCreateForm = () => {
  //#region hooks
  const {
    authUser: { operatorId }
  } = useSelector(({ auth }) => auth);
  const { setOpenBackdrop } = useBackDrop();

  const classes = useAssignToLabCreateSpecificStyles();
  const history = useHistory();
  //#endregion

  //#region  States
  const [date] = useState(new Date());
  const [shift, setShift] = useState(null);
  const [operatorGroups, setOperatorGroups] = useState([]);
  const [operatorGroup, setOperatorGroup] = useState(null);
  const [state, setState] = useState([]);

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  //#endregion

  //#region Effects
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchDependencies = async () => {
      try {
        const currentShiftReq = http.get(LAB_SHIFT.get_current_shift, { params: { CurrentTime: time24(date) } });
        const operatorGroupReq = http.get(OPERATOR_GROUP.get_all, { signal: controller.signal });
        const operatorReq = http.get(OPERATOR.get_active, { signal: controller.signal });
        const [currentShiftRes, operatorGroupRes, operatorRes] = await axios.all([
          currentShiftReq,
          operatorGroupReq,
          operatorReq
        ]);
        if (currentShiftRes.data.succeeded && operatorGroupRes.data.succeeded && operatorRes.data.succeeded) {
          const currShift = currentShiftRes.data.data;
          const operatorGroupsddl = fillDropDown(operatorGroupRes.data.data, 'groupName', 'id');
          const operators = operatorRes.data.data
            .map(item => ({ ...item, status: false }))
            .filter(operator => operator.operatorGroupName);

          const groupWiseOperator = operatorGroupsddl.map(opg => {
            const obj = {
              tableId: _.uniqueId(),
              groupName: opg.groupName,
              operators: operators.filter(op => op.operatorGroupName === opg.groupName)
            };
            return obj;
          });

          if (isMounted) {
            setShift(currShift);
            setState(groupWiseOperator);

            setOperatorGroups(operatorGroupsddl);
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
  }, [date, operatorId]);
  //#endregion

  //#region Events
  const onOperatorGroupChange = (e, newValue) => {
    if (newValue) {
      setOperatorGroup(newValue);
    }
  };

  const onOperatorStatusChange = (e, groupIndex, operatorIndex) => {
    const { checked } = e.target;
    const _state = _.cloneDeep(state);

    const _targetGroup = _state[groupIndex];
    const targetOperator = _targetGroup.operators[operatorIndex];
    targetOperator.status = checked;
    _targetGroup.operators[operatorIndex] = targetOperator;
    _state[groupIndex] = _targetGroup;
    setState(_state);
  };

  const onSubmit = async () => {
    const selectedOperators = state
      .map(item => item.operators)
      .flat()
      .filter(item => item.status);
    if (shift && operatorGroup && selectedOperators.length > 0) {
      setOpenBackdrop(true);
      const payload = {
        date: serverDate(date),
        shiftId: shift.id,
        operatorGroupId: operatorGroup.id,
        operatorDutyLogs: selectedOperators?.map(operator => ({
          operatorId: operator.id,
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
      // stringifyConsole(payload, 'stringify');

      // return;
      await sleep(1000);
      try {
        const res = await http.post(OPERATOR_DUTY_LOG_API.create, payload);

        if (res.data.succeeded) {
          toastAlerts('success', res.data.message);
          history.goBack();
        } else {
          toastAlerts('error', 'There is an error to save this duty');
        }
      } catch (err) {
        toastAlerts('error', err.response.data.Message);
      } finally {
        setOpenBackdrop(false);
      }

      stringifyConsole(payload, 'stringify');
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
    <PageContainer heading="Assign Operator to Duty (Create)">
      <Grid container>
        <Grid item container component={Paper} spacing={3} style={{ padding: 10, marginBottom: 20 }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomDatePicker label="Select Date" value={date} disabled />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <TextInput label="Shift" value={shift?.shiftName} disabled />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <CustomAutoComplete
              label="Select Operator Group"
              data={operatorGroups}
              value={operatorGroup}
              onChange={onOperatorGroupChange}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={5} component={Paper}>
          {state?.map((group, groupIndex) => {
            return (
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={group.tableId}>
                <Table>
                  <TableHead classes={{ root: classes.thead }}>
                    <TableRow>
                      <TableCell className={classes.headCell} colSpan={3}>{`Operator Group ${group.groupName}`}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableHeadCell}>Operator Code</TableCell>
                      <TableCell className={classes.tableHeadCell}>Operator Name</TableCell>
                      <TableCell className={classes.tableHeadCell}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.operators?.map((operator, operatorIndex) => {
                      return (
                        <TableRow classes={{ root: classes.tbodyRow }} key={operator.id}>
                          <TableCell className={classes.tableBodyCell}>{operator.operatorCode}</TableCell>
                          <TableCell className={classes.tableBodyCell}>{operator.operatorName}</TableCell>
                          <TableCell className={classes.tableBodyCell}>
                            <Checkbox
                              checked={operator.status}
                              name="status"
                              onChange={e => onOperatorStatusChange(e, groupIndex, operatorIndex)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            );
          })}
          <Grid item container justifyContent="flex-end">
            <SaveButton onClick={onSubmit} />
            <CancelButton onClick={onCancel} />
          </Grid>
        </Grid>
      </Grid>
      <CustomBackDrop />
    </PageContainer>
  );
};

export default AssingToDutyCreateForm;

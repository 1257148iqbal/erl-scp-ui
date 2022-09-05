import { Grid } from '@material-ui/core';
import { OPERATOR_DUTY_LOG_API } from 'constants/ApiEndPoints/v1';
import React, { Fragment, useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';
import { formattedDate } from 'utils/dateHelper';
import { useAssignToLabCreateSpecificStyles } from '../styles';

const AssignToDutyDetails = ({ data }) => {
  const classes = useAssignToLabCreateSpecificStyles();

  //#region State
  const [state, setState] = useState({});
  //#endregion

  //#region Effects
  useEffect(() => {
    const fetchDutyLogs = async () => {
      try {
        const res = await http.get(`${OPERATOR_DUTY_LOG_API.get_single}/${data.key}`);
        const dutyLogs = res.data.data;
        setState(dutyLogs);
      } catch (err) {
        toastAlerts('warning', err);
      }
    };
    trackPromise(fetchDutyLogs());
  }, [data.key]);
  //#endregion
  return (
    <Fragment>
      <Grid container style={{ padding: 5, fontSize: 17, paddingBottom: 20, fontWeight: 'bold' }}>
        <Grid item xs={4}>
          Date: {formattedDate(data.date)}
        </Grid>
        <Grid item xs={4}>
          Shift Name: {data.shiftName}
        </Grid>
        <Grid item xs={4}>
          Operator Group Name: {data.operatorGroupName}
        </Grid>
      </Grid>
      <table className={classes.tableContainer}>
        <thead>
          <tr style={{ fontSize: 16 }}>
            <th className={classes.tableHead}>Operator Name</th>
            <th className={classes.tableHead}>Operator Code</th>
            <th className={classes.tableHead}>Current Group</th>
            <th className={classes.tableHead}>Phone Number</th>
            <th className={classes.tableHead}>Email</th>
            <th className={classes.tableHead}>Designation</th>
            <th className={classes.tableHead}>Department</th>
          </tr>
        </thead>
        <tbody>
          {state?.operatorDutyLogDetails?.map((item, index) => (
            <tr key={item.id}>
              <td className={classes.tableHead}>{item.operatorName}</td>
              <td className={classes.tableHead}>{item.operatorCode}</td>
              <td className={classes.tableHead}>{item.currentOperatorGroupName}</td>
              <td className={classes.tableHead}>{item.phoneNumber}</td>
              <td className={classes.tableHead}>{item.email}</td>
              <td className={classes.tableHead}>{item.designationName}</td>
              <td className={classes.tableHead}>{item.departmentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default AssignToDutyDetails;

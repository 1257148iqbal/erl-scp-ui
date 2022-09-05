import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { OPERATOR_DUTY_LOG_API } from 'constants/ApiEndPoints/v1';
import React, { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    borderWidth: 1,
    margin: '0px 0px 10px 20px'
  },
  rowContainerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  th: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '5px 2px',
    fontSize: 10
  },
  th_phone: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '5px 2px',
    fontSize: 10
  },
  th_department: {
    width: '14%',
    padding: '5px 2px',
    fontSize: 10
  },
  th_operatorName: {
    width: '18%',
    borderRight: '1px solid black',
    padding: '5px 2px',
    fontSize: 10,
    textAlign: 'center'
  },
  row_operatorName: {
    width: '18%',
    borderRight: '1px solid black',
    padding: '5px 4px',
    fontSize: 9,
    textAlign: 'left'
  },
  row: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '5px 2px',
    fontSize: 9,
    textAlign: 'center'
  },
  row_phone: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '5px 4px',
    fontSize: 9,
    textAlign: 'left'
  },
  row_department: {
    width: '14%',
    padding: '5px 4px',
    fontSize: 9,
    textAlign: 'left'
  },
  row_email: {
    width: '24%',
    borderRight: '1px solid black',
    padding: '5px 4px',
    fontSize: 9,
    textAlign: 'left'
  },
  email_head: {
    width: '24%',
    borderRight: '1px solid black',
    padding: '5px 2px',
    fontSize: 10
  }
});

const DataTable = ({ data }) => {
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
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainerHead}>
          <Text style={styles.th_operatorName}>Operator Name</Text>
          <Text style={styles.th}>Operator Code</Text>
          <Text style={styles.th}>Current Group</Text>
          <Text style={styles.th_phone}>Phone Number</Text>
          <Text style={styles.email_head}>Email</Text>
          <Text style={styles.th}>Designation</Text>
          <Text style={styles.th_department}>Department</Text>
        </View>

        {state?.operatorDutyLogDetails?.map((item, index) => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.row_operatorName}>{item.operatorName}</Text>
            <Text style={styles.row}>{item.operatorCode}</Text>
            <Text style={styles.row}>{item.currentOperatorGroupName}</Text>
            <Text style={styles.row_phone}>{item.phoneNumber}</Text>
            <Text style={styles.row_email}>{item.email}</Text>
            <Text style={styles.row}>{item.designationName}</Text>
            <Text style={styles.row_department}>{item.departmentName}</Text>
          </View>
        ))}
      </View>
    </div>
  );
};

export default DataTable;

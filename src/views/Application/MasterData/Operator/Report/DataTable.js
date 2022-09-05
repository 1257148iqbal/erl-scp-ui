import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 250,
    borderWidth: 1,
    margin: '0px 0px 10px 20px'
  },
  headerContainer: {
    flexDirection: 'row',
    aligndatas: 'center',
    textAlign: 'center',
    flexGrow: 1
  },
  footer: {
    flexDirection: 'row',
    flexGrow: 1,
    margin: '20px 10px 0px 20px'
  },
  rowContainer: {
    flexDirection: 'row',
    aligndatas: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  rowContainer_top: {
    flexDirection: 'row',
    aligndatas: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },
  th: {
    width: '17%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  thOperatorCode: {
    width: '13%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  thPhone: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  thEmail: {
    width: '22%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  row_sl: {
    width: '17%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: '4px'
  },
  rowOperatorCode: {
    width: '13%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: '4px'
  },
  rowEmail: {
    width: '22%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: '4px'
  },
  rowPhone: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: '4px'
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainer_top}>
          <Text style={styles.thOperatorCode}>Operator Code</Text>
          <Text style={styles.th}>Operator Name</Text>
          <Text style={styles.th}>Department Name</Text>
          <Text style={styles.th}>Designation Name</Text>
          <Text style={styles.thPhone}>Phone Number</Text>
          <Text style={styles.thEmail}>Email</Text>
        </View>

        {data.map(item => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.rowOperatorCode}>{item.operatorCode}</Text>
            <Text style={styles.row_sl}>{item.operatorName}</Text>
            <Text style={styles.row_sl}>{item.departmentName}</Text>
            <Text style={styles.row_sl}>{item.designationName}</Text>
            <Text style={styles.rowPhone}>{item.phoneNumber}</Text>
            <Text style={styles.rowEmail}>{item.email}</Text>
          </View>
        ))}
      </View>
    </div>
  );
};

export default DataTable;

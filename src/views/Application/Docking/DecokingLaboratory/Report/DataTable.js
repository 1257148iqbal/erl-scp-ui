import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { getTime } from 'utils/dateHelper';

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
    width: '50%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10,
    position: 'relative'
  },
  row_sl: {
    width: '50%',
    padding: '10.5px 0px',
    fontSize: 10,
    position: 'relative'
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainer_top}>
          <Text style={styles.th}>Time</Text>
          <Text style={styles.row_sl}>{getTime(data?.time, 'HH:mm')}</Text>
        </View>
        <View style={{ ...styles.rowContainer_top, borderTop: '1px solid black' }}>
          <Text style={styles.th}>Time Difference</Text>
          <Text style={styles.row_sl}>{data?.timeDifference}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>CO2 (%)</Text>
          <Text style={styles.row_sl}>{data?.cO2}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>CO (%)</Text>
          <Text style={styles.row_sl}>{data?.co}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>O2 (%)</Text>
          <Text style={styles.row_sl}>{data?.o2}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>Air Reading</Text>
          <Text style={styles.row_sl}>{data?.airReading}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>Coke Flow</Text>
          <Text style={styles.row_sl}>{data?.cokeFlow}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th}>Comment</Text>
          <Text style={styles.row_sl}>{data?.comment}</Text>
        </View>
      </View>
    </div>
  );
};

export default DataTable;

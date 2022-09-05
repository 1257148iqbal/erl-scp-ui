import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  masterContainer: {
    margin: '15px 10px 0px 20px',
    lineHeight: 1.2
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  headerContainerLast: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20
  },
  label: {
    fontSize: 12,
    fontWeight: 100,
    width: 150
  }
});

const MasterInfo = ({ data }) => {
  return (
    <View style={styles.masterContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Date</Text>
        <Text>{`: ${formattedDate(data.date)}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Shift</Text>
        <Text>{`: ${data.shiftName}`}</Text>
      </View>
      {/* <View style={styles.headerContainerLast}>
        <Text style={styles.label}>Employee Code</Text>
        <Text>{`: ${data.empCode}`}</Text>
      </View> */}
    </View>
  );
};

export default MasterInfo;

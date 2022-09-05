import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  masterContainer: {
    margin: '15px 10px 0px 30px',
    lineHeight: 1.2,
    flexDirection: 'column',
    display: 'flex',
    paddingBottom: 15
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    width: 130
  }
});

const MasterInfo = ({ data }) => {
  return (
    <View style={styles.masterContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.label} key={data?.id}>{`: ${formattedDate(data?.date)}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Shift Name</Text>
        <Text style={styles.label} key={data?.id}>{`: ${data?.shiftName}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Operator Group Name</Text>
        <Text style={styles.label} key={data?.id}>{`: ${data?.operatorGroupName}`}</Text>
      </View>
    </View>
  );
};

export default MasterInfo;

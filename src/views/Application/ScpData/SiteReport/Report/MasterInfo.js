import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  masterContainer: {
    margin: '15px 10px 0px 30px',
    lineHeight: 1.2
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    fontSize: 12,
    fontWeight: 100,
    width: 80
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
        <Text style={styles.label}>Time</Text>
        <Text>{`: ${data.time}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Serial</Text>
        <Text>{`: ${data.serial}`}</Text>
      </View>
    </View>
  );
};

export default MasterInfo;

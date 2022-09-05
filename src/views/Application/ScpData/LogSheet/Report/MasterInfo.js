import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  masterContainer: {
    lineHeight: 1.2,
    margin: '15px 10px 10px 20px'
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    fontSize: 12,
    fontWeight: 100,
    width: 150
  },
  value: {}
});

const MasterInfo = ({ data }) => {
  return (
    <View style={styles.masterContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Operation Group Name</Text>
        <Text>{`: ${data?.operationGroupName}`}</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.label}>Section Name</Text>
        <Text>{`: ${data?.sectionName}`}</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.label}>Shift Name</Text>
        <Text>{`: ${data?.shiftName}`}</Text>
      </View>
    </View>
  );
};

export default MasterInfo;

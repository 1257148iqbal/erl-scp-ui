import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate, getTime } from 'utils/dateHelper';

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
        <Text key={data?.id}>{`: ${formattedDate(data?.date)}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Time</Text>
        <Text key={data?.id}>{`: ${getTime(data?.time, 'HH:mm')}`}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Decoking No</Text>
        <Text key={data?.id}>{`: ${data?.number ? data?.number : ''}`}</Text>
      </View>
    </View>
  );
};

export default MasterInfo;

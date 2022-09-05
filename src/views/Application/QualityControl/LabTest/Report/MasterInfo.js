import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  masterContainer: {
    margin: '5px 5px 0px 10px',
    lineHeight: 1
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute'
  },
  label: {
    fontSize: 12,
    fontWeight: 100,
    marginRight: '5px'
  }
});

const MasterInfo = ({ data }) => {
  return (
    <View style={styles.masterContainer}>
      <View style={{ display: 'flex', flexDirection: 'row', bottom: 5, left: 10 }}>
        <Text style={styles.label}>Group</Text>
        <Text>{`: ${data.operatorGroup ?? ''}`}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: 5, left: 200 }}>
        <Text style={styles.label}>Shift Name</Text>
        <Text>{`: ${data.shiftName}`}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: 480, bottom: 5 }}>
        <Text style={styles.label}>Date</Text>
        <Text>{`: ${formattedDate(data.date)}`}</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: 700, bottom: 5 }}>
        <Text style={styles.label}>Time</Text>
        <Text>{`: ${data.time}`}</Text>
      </View>
    </View>
  );
};

export default MasterInfo;

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { getSign } from 'utils/commonHelper';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    borderWidth: 1,
    margin: '0px 0px 10px 20px'
  },
  footer: {
    flexDirection: 'row',
    flexGrow: 1,
    margin: '0px 5px 0px 20px'
  },
  headerContainer: {
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
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '4.9px 0px',
    fontSize: 10,
    position: 'relative'
  },
  th_parameter: {
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '4.9px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  row_sl: {
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '4.9px 0px',
    fontSize: 10
  },
  th_reading: {
    width: '33.33%',
    padding: '4.9px 0px',
    fontSize: 10
  },
  waterTest: {
    textAlign: 'center',
    width: '100%'
  },
  remark: {
    textAlign: 'left'
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.waterTest}>CONTROL ROOM</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th_parameter}>PARAMETERS</Text>
          <Text style={styles.th}>UNIT</Text>
          <Text style={styles.th_reading}>Reading</Text>
        </View>

        {data?.decokingLogDetails
          .filter(unit => unit.operationGroupName === 'Control Room')
          .map((item, index) => (
            <View style={styles.rowContainer} key={item.id}>
              <Text style={styles.th_parameter}>{item.parameterName}</Text>
              <Text style={styles.row_sl}>{getSign(item.unitName)}</Text>
              <Text style={styles.th_reading}>{item.reading ? item.reading : '-'}</Text>
            </View>
          ))}
        <View style={styles.rowContainer}>
          <Text style={styles.waterTest}>LOCAL READING</Text>
        </View>

        {data?.decokingLogDetails
          .filter(unit => unit.operationGroupName === 'Local')
          .map((item, index) => (
            <View style={styles.rowContainer} key={item.id}>
              <Text style={styles.th_parameter}>{item.parameterName}</Text>
              <Text style={styles.row_sl}>{getSign(item.unitName)}</Text>
              <Text style={styles.th_reading}>{item.reading ? item.reading : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.remark}>{`Remarks: ${data?.remark}`}</Text>
      </View>
    </div>
  );
};

export default DataTable;

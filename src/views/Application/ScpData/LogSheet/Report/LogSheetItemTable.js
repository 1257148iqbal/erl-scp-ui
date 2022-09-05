import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { getSign } from 'utils/commonHelper';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    margin: '0px 10px 10px 20px',
    borderWidth: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1
  },
  remarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    margin: '0px 10px 10px 20px',
    flexGrow: 1
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },

  sl: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },

  logInfo: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },

  unit: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },

  lastreading: {
    width: '15%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },

  reading: {
    width: '25%',
    padding: '4px 0px'
  },

  row_sl: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },
  row_logInfo: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    textAlign: 'left',
    paddingLeft: 10
  },
  row_unit: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },
  row_lastreading: {
    width: '15%',
    borderRight: '1px solid black',
    padding: '4px 0px'
  },
  row_reading: {
    width: '25%',
    padding: '4px 0px'
  },
  remark: {
    width: '100%',
    padding: '10px 20px',
    textAlign: 'left'
  }
});

const LogSheetItemTable = ({ data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.sl}>SL</Text>
          <Text style={styles.logInfo}>Log Info</Text>

          <Text style={styles.unit}>Unit</Text>
          <Text style={styles.lastreading}>Last Reading</Text>
          <Text style={styles.reading}>Reading</Text>
        </View>

        {data?.logSheetDetails.map((item, index) => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.row_sl}>{index + 1}</Text>
            <Text style={styles.row_logInfo}>{item.tagName}</Text>

            <Text style={styles.row_unit}>{getSign(item.unitName)}</Text>
            <Text style={styles.row_lastreading}>{item.lastReading ? item.lastReading : '-'}</Text>
            <Text style={styles.row_reading}>{item.reading ? item.reading : '-'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.remarkContainer}>
        <Text style={styles.remark}>{data?.remark}</Text>
      </View>
    </div>
  );
};

export default LogSheetItemTable;

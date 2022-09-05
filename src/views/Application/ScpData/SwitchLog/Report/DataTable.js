import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 250,
    borderWidth: 1,
    margin: '0px 10px 10px 20px'
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
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  row_sl: {
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainer_top}>
          <Text style={styles.th}>Switch Name</Text>
          <Text style={styles.th}>Operation</Text>
          <Text style={styles.th}>Condition</Text>
        </View>

        {data.switchLogDetails.map(item => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.row_sl}>{item.switchName}</Text>
            <Text style={styles.row_sl}>{item.operation}</Text>
            <Text style={styles.row_sl}>{item.condition}</Text>
          </View>
        ))}
      </View>
    </div>
  );
};

export default DataTable;

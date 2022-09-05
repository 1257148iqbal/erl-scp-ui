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
  rowContainer: {
    flexDirection: 'row',
    aligndatas: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  th: {
    width: '70%',
    padding: '4px 0px',
    textAlign: 'center',
    fontSize: 12
  },
  thPermission: {
    width: '30%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    textAlign: 'center',
    fontSize: 12
  },
  rowGroupName: {
    width: '30%',
    borderRight: '1px solid black',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 10
  },
  row_sl: {
    width: '70%',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 10
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <View style={{ textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
        <Text style={{ textDecoration: 'underline' }}>{`Role Name: ${data.name}`}</Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.thPermission}>Permissions</Text>
          <Text style={styles.th}>Details</Text>
        </View>

        {data.visualize.map((item, index) => (
          <View style={styles.rowContainer} key={index + 1}>
            <Text style={styles.rowGroupName}>{item.groupName}</Text>
            <Text style={styles.row_sl}>{item.permissions.join(', ')}</Text>
          </View>
        ))}
      </View>
    </div>
  );
};

export default DataTable;

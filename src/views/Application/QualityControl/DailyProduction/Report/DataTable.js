import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { serverDate } from 'utils/dateHelper';

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
    flexDirection: 'column',
    aligndatas: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },
  th: {
    width: '100%',
    borderRight: '1px solid black',
    borderTop: '1px solid black',
    padding: '10.5px 0px',
    textAlign: 'left',
    paddingLeft: '20px',
    fontSize: 10
  },
  tableHeading: {
    width: '100%',
    padding: '10.5px 0px',
    fontSize: 16,
    textAlign: 'center'
  },
  tableHeadingProduction: {
    width: '100%',
    padding: '10.5px 0px',
    fontSize: 16,
    borderTop: '1px solid black',
    textAlign: 'center'
  },
  row_sl: {
    width: '100%',
    borderTop: '1px solid black',
    padding: '10.5px 0px',
    textAlign: 'left',
    paddingLeft: '150px',
    fontSize: 10
  },
  remarks: {
    width: '100%',
    padding: '10.5px 20px',
    textAlign: 'left',
    fontSize: 11
  },
  date: {
    width: '100%',
    padding: '10.5px 20px',
    textAlign: 'center',
    fontSize: 12
  }
});

const DataTable = ({ data }) => {
  return (
    <div>
      <Text style={styles.date}>{`Date: ${serverDate(data.date)}`}</Text>

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeading}>THROUGH PUT</Text>
        <View style={styles.rowContainer_top}>
          <Text style={styles.th}>FEED ALC</Text>
          <Text style={styles.th}>FEED Murban</Text>
        </View>
        <View style={styles.rowContainer_top}>
          <Text style={styles.row_sl}>{data.feed_ALC ? data.feed_ALC : '-'}</Text>
          <Text style={styles.row_sl}>{data.feed_Murban ? data.feed_Murban : '-'}</Text>
        </View>

        <Text style={styles.tableHeadingProduction}>PRODUCTION</Text>
        <View style={styles.rowContainer_top}>
          <Text style={styles.th}>Gas Oil (MT)</Text>
          <Text style={styles.th}>Residue (MT)</Text>
          <Text style={styles.th}>NAPTHA (MT)</Text>
          <Text style={styles.th}>GAS (N-m3)</Text>
          <Text style={styles.th}>STEAM (MT)</Text>
        </View>
        <View style={styles.rowContainer_top}>
          <Text style={styles.row_sl}>{data.gas_Oil ? data.gas_Oil : '-'}</Text>
          <Text style={styles.row_sl}>{data.residue ? data.residue : '-'}</Text>
          <Text style={styles.row_sl}>{data.naptha ? data.naptha : '-'}</Text>
          <Text style={styles.row_sl}>{data.gas ? data.gas : '-'}</Text>
          <Text style={styles.row_sl}>{data.steam ? data.steam : '-'}</Text>
        </View>

        <Text style={styles.tableHeadingProduction}>CONSUMPTION</Text>
        <View style={styles.rowContainer_top}>
          <Text style={styles.th}>NG (N-m3)</Text>
          <Text style={styles.th}>POWER (kwh)</Text>
          <Text style={styles.th}>NH3 (Kg)</Text>
          <Text style={styles.th}>C.I (Ltr)</Text>
          <Text style={styles.th}>A.O (Ltr)</Text>
        </View>
        <View style={styles.rowContainer_top}>
          <Text style={styles.row_sl}>{data.ng ? data.ng : '-'}</Text>
          <Text style={styles.row_sl}>{data.power ? data.power : '-'}</Text>
          <Text style={styles.row_sl}>{data.nH3 ? data.nH3 : '-'}</Text>
          <Text style={styles.row_sl}>{data.ci ? data.ci : '-'}</Text>
          <Text style={styles.row_sl}>{data.ao ? data.ao : '-'}</Text>
        </View>
      </View>
      <Text style={styles.remarks}>{`Remarks: ${data.note ? data.note : ''}`}</Text>
    </div>
  );
};

export default DataTable;

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '10px 160px',
    borderWidth: 1
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  total_throughtput: {
    width: '100%',
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  td: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  th: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 12,
    fontWeight: 'bold'
  },
  th_particuler: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 12,
    fontWeight: 'bold',
    left: 10
  },
  td_left: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 10
  }
});

const TotalProduction = ({ data }) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.total_throughtput}>
          TOTAL THROUGHTPUT: {`${data.throughput} MT  = `}
          {`${Math.round(data.throughput * 6.69075)} BBL`}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.total_throughtput}>TOTAL PRODUCTION</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.th_particuler}>Particulars</Text>
        <Text style={styles.th}>Amount</Text>
        <Text style={styles.th}>Unit</Text>
        <Text style={styles.th}>%</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.td_left}>VB Residue</Text>
        <Text style={styles.td}>{data.residue_Total}</Text>
        <Text style={styles.td}>MT</Text>
        <Text style={styles.td}>{`${Number(data.residue_Percentage).toFixed(2)}%`}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.td_left}>Gas Oil</Text>
        <Text style={styles.td}>{data.gas_Oil_Total}</Text>
        <Text style={styles.td}>MT</Text>
        <Text style={styles.td}>{`${data.gas_Oil_Percentage}%`}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.td_left}>Naphtha</Text>
        <Text style={styles.td}>{data.naptha_Total}</Text>
        <Text style={styles.td}>MT</Text>
        <Text style={styles.td}>{`${data.naptha_Percentage}%`}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.td_left}>VB Gas</Text>
        <Text style={styles.td}>{data.gas_Total}</Text>
        <Text style={styles.td}>MT</Text>
        <Text style={styles.td}>{``} </Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.td_left}>Steam</Text>
        <Text style={styles.td}>{data.steam_Total}</Text>
        <Text style={styles.td}>MT</Text>
        <Text style={styles.td}>{``}</Text>
      </View>
    </View>
  );
};

export default TotalProduction;

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { isZeroCheck } from 'utils/commonHelper';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    borderWidth: 1,
    margin: '0px 0px 10px 20px'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
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
  throughput: {
    width: '27%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  production_consumption: {
    width: '37.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  date: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  nh3: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  ci: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  ao: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  th: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  row_sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  row_empty: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 10
  },
  throughput_bbl: {
    width: '60%',
    padding: '5px 0px',
    fontSize: 10,
    textAlign: 'left'
  },
  row_date: {
    width: '11%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10,
    textAlign: 'left',
    marginLeft: 8
  },
  row_throughput: {
    width: '15%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  row_production: {
    width: '15%',
    padding: '5px 0px',
    fontSize: 10
    //backgroundColor: 'red'
  },
  fontBold: {
    fontWeight: 'extrabold'
  }
});

const DataTable = ({ data }) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.throughput}>Throughput (MT)</Text>
        <Text style={styles.production_consumption}>Production (MT)</Text>
        <Text style={styles.production_consumption}>Consumption</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.date}>Month</Text>
        <Text style={styles.th}>ALC</Text>
        <Text style={styles.th}>Murban</Text>
        <Text style={styles.th}>Residue</Text>
        <Text style={styles.th}>Gas Oil</Text>
        <Text style={styles.th}>NAPTHA</Text>
        <Text style={styles.th}>GAS (N-m3)</Text>
        <Text style={styles.th}>STEAM</Text>
        <Text style={styles.th}>NG (N-m3)</Text>
        <Text style={styles.sl}>POWER (kwh)</Text>
        <Text style={styles.nh3}>NH3 (Kg)</Text>
        <Text style={styles.ci}>C.I (Ltr)</Text>
        <Text style={styles.ao}>A.O (Ltr)</Text>
      </View>

      {data.records?.map((item, index) => (
        <View style={styles.rowContainer} key={item.id}>
          <Text style={styles.row_date}>{isZeroCheck(item.month)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.feed_ALC)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.feed_Murban)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.residue)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.gas_Oil)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.naptha)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.gas)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.steam)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.ng)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.power)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.nH3)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.ci)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(item.ao)}</Text>
        </View>
      ))}

      <View style={styles.rowContainer}>
        <Text style={styles.row_date}>Total (MT)</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.feed_ALC_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.feed_Murban_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.residue_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.gas_Oil_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.naptha_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.gas_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.steam_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.ng_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.power_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.nH3_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.ci_Total)}</Text>
        <Text style={{ ...styles.row_sl, ...styles.fontBold }}>{isZeroCheck(data.ao_Total)}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.row_date}>Throughput (MT)</Text>
        <Text style={styles.row_throughput}>{data.throughput}</Text>
        <Text style={styles.row_production}>Throughput (BBL)</Text>
        <Text style={styles.throughput_bbl}>{`${Math.round(data.throughput * 6.69075)}`}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.row_date}>Percent</Text>
        <Text style={styles.row_sl}>{`${Number(data.feed_Murban_Percentage).toFixed(2)}%`}</Text>
        <Text style={styles.row_sl}>{`${Number(data.feed_ALC_Percentage).toFixed(2)}%`}</Text>
        <Text style={styles.row_sl}>{`${Number(data.residue_Percentage).toFixed(2)}%`}</Text>
        <Text style={styles.row_sl}>{`${Number(data.gas_Oil_Percentage).toFixed(2)}%`}</Text>
        <Text style={styles.row_sl}>{`${Number(data.naptha_Percentage).toFixed(2)}%`}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
        <Text style={styles.row_empty}>{``}</Text>
      </View>
    </View>
  );
};

export default DataTable;

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { isZeroCheck } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '15px 15px 5px 20px',
    borderWidth: 1
  },
  rowContainerHead: {
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
  throughput: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  production_consumption: {
    width: '37.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  consumption: {
    width: '37.5%',
    padding: '5px 0px',
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  date: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 9
  },
  nh3: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 9
  },
  ci: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 9
  },
  ao: {
    width: '7.5%',
    padding: '10px 0px',
    fontSize: 9
  },
  sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 9
  },
  row_sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_empty: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '7.5px 0px',
    fontSize: '8px'
  },
  row_ao: {
    width: '7.5%',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_date: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_throughput: {
    width: '15%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_consumption: {
    width: '15%',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_production: {
    width: '22.5%',
    padding: '3px 0px',
    fontSize: '8px'
  },
  row_note: {
    width: '85%',
    fontSize: 10,
    textAlign: 'left',
    marginLeft: '8px'
  },
  footer: {
    flexDirection: 'row',
    flexGrow: 1
  },
  remark: {
    textAlign: 'left',
    textDecoration: 'underline',
    margin: '0px 5px 0px 20px',
    display: 'block'
  },
  note: {
    textAlign: 'left',
    margin: '0px 70px 0px 2px',
    paddingRight: 15
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  }
});

const DataTable = ({ data, fromDate }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainerHead}>
          <Text style={styles.throughput}>Through Put</Text>
          <Text style={styles.production_consumption}>Production</Text>
          <Text style={styles.consumption}>Consumption</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.date}>Day</Text>
          <Text style={styles.sl}>Feed (ALC)</Text>
          <Text style={styles.sl}>Feed (Murban)</Text>
          <Text style={styles.sl}>Gas Oil (MT)</Text>
          <Text style={styles.sl}>Residue (MT)</Text>
          <Text style={styles.sl}>NAPTHA (MT)</Text>
          <Text style={styles.sl}>GAS (N-m3)</Text>
          <Text style={styles.sl}>STEAM (MT)</Text>
          <Text style={styles.sl}>NG (N-m3)</Text>
          <Text style={styles.sl}>POWER (kwh)</Text>
          <Text style={styles.nh3}>NH3 (Kg)</Text>
          <Text style={styles.ci}>C.I (Ltr)</Text>
          <Text style={styles.ao}>A.O (Ltr)</Text>
        </View>

        {data.records.map((item, index) => {
          if (item.feed_ALC || item.feed_Murban) {
            return (
              <View style={styles.rowContainer} key={item.id}>
                <Text style={styles.row_date}>{formattedDate(item.date, 'DD-MM-yyyy')}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.feed_ALC)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.feed_Murban)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.gas_Oil)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.residue)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.naptha)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.gas)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.steam)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.ng)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.power)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.nH3)}</Text>
                <Text style={styles.row_sl}>{isZeroCheck(item.ci)}</Text>
                <Text style={styles.row_ao}>{isZeroCheck(item.ao)}</Text>
              </View>
            );
          } else {
            return (
              <View style={styles.rowContainer} key={item.id}>
                <Text style={styles.row_date}>{formattedDate(item.date, 'DD-MM-yyyy')}</Text>
                <Text style={styles.row_note}>{``}</Text>
              </View>
            );
          }
        })}

        <View style={styles.rowContainer}>
          <Text style={styles.row_date}>Total</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.feed_ALC_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.feed_Murban_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.gas_Oil_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.residue_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.naptha_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.gas_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.steam_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.ng_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.power_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.nH3_Total)}</Text>
          <Text style={styles.row_sl}>{isZeroCheck(data.ci_Total)}</Text>
          <Text style={styles.row_ao}>{isZeroCheck(data.ao_Total)}</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.row_date}>Throughput</Text>
          <Text style={styles.row_throughput}> {data.throughput}</Text>
          <Text style={styles.row_production}>{/* Production: */}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_production}>{/* Consumption: */}</Text>
          <Text style={styles.row_consumption}>{''}</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.row_date}>Percent</Text>
          <Text style={styles.row_sl}>{`${isZeroCheck(data.feed_ALC_Percentage)}%`}</Text>
          <Text style={styles.row_sl}>{`${isZeroCheck(data.feed_Murban_Percentage)}%`}</Text>
          <Text style={styles.row_sl}>{`${isZeroCheck(data.gas_Oil_Percentage)}%`}</Text>
          <Text style={styles.row_sl}>{`${isZeroCheck(data.residue_Percentage)}%`}</Text>
          <Text style={styles.row_sl}>{`${isZeroCheck(data.naptha_Percentage)}%`}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_empty}>{''}</Text>
          <Text style={styles.row_ao}>{''}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.remark}>{`Remarks: `}</Text>
        <Text style={styles.note}>{`${data.records[0].note ? data.records[0].note : ''}`}</Text>
      </View>

      <View style={styles.tableRow}>
        <View
          style={{
            fontSize: 9,
            left: 460,
            top: 30
          }}>
          <Text style={{ borderTop: '1px solid black', width: 80 }}></Text>
          <Text style={{ left: 30 }}>SIGN </Text>
          <Text>Name: </Text>
        </View>
      </View>
    </div>
  );
};

export default DataTable;

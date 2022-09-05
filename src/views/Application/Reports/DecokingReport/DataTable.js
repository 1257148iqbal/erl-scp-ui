import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    margin: '10px 0 0 0',
    lineHeight: 1.2,
    position: 'relative'
  },
  reportTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  reportSubTitle: {
    color: '#000000',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 100
  },
  report: {
    color: '#000000',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 100,
    marginBottom: 20
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 150,
    top: 5
  },
  tableContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: '5px 2px 5px 10px',
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
  time: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '5px 5px',
    fontSize: 10,
    textAlign: 'left'
  },
  parameterName: {
    width: '50%',
    borderRight: '1px solid black',
    padding: '5px 5px',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 900
  },
  unit: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  airCharge: {
    width: '44%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  unitHead: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  results: {
    width: '30%',
    padding: '5px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  singMorning: {
    left: 70,
    top: 952
  },
  singEvening: {
    left: 260,
    top: 930
  },
  singNight: {
    left: 430,
    top: 905
  }
});

const DataTable = ({ data }) => {
  return (
    <View>
      <View style={styles.titleContainer} break>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
        <Text style={styles.reportSubTitle}>SECONDARY CONVERSION PLANT</Text>
        <Text style={styles.reportSubTitle}>LONG RESIDUE VISBREAKING UNIT</Text>
        <Text style={styles.report}>DECOKING REOPRT</Text>
      </View>
      <View>
        <View style={styles.tableContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.parameterName}>Parameter Name</Text>
            <Text style={styles.unitHead}>Unit</Text>
            <Text style={styles.results}>Results</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Decoking Number</Text>
            <Text style={styles.unitHead}>No.</Text>
            <Text style={styles.results}>{data.number}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Start Date</Text>
            <Text style={styles.unitHead}>{'-'}</Text>
            <Text style={styles.results}>{formattedDate(data.fromDate)}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>End Date</Text>
            <Text style={styles.unitHead}>{'-'}</Text>
            <Text style={styles.results}>{formattedDate(data.toDate)}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Time Duration</Text>
            <Text style={styles.unitHead}>Day</Text>
            <Text style={styles.results}>{data.duration}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Steam Consumption</Text>
            <Text style={styles.unitHead}>MT</Text>
            <Text style={styles.results}>{data.steamConsumption}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Fuel consumption</Text>
            <Text style={styles.unitHead}>NH3</Text>
            <Text style={styles.results}>{data.fuelConsumption}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{ ...styles.parameterName, textAlign: 'left' }}>Amount of Coke Burnt</Text>
            <Text style={styles.unitHead}>kg</Text>
            <Text style={styles.results}>{data.cokeBurnt}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DataTable;

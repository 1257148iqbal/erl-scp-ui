import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React from 'react';
import { stringifyConsole } from 'utils/commonHelper';
import { formattedDate, getTime } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';

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
    padding: '3px 5px',
    fontSize: 10,
    textAlign: 'left'
  },
  timeHead: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 900
  },
  unit: {
    width: '11%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  airCharge: {
    width: '44%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  unitHead: {
    width: '11%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  comment: {
    width: '20%',
    padding: '3px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  commentRow: {
    width: '20%',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left'
  },
  sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
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
        <Text style={styles.report}>DECOKING LABORATORY RESULT</Text>
      </View>
      {data?.map((decoking, index) => (
        <View key={index + 1}>
          <View style={{ display: 'flex', position: 'relative' }}>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 11,
                position: 'absolute'
              }}>{`Decoking Number: ${decoking.number}`}</Text>
            <Text style={{ marginRight: 10, fontSize: 11, textAlign: 'right' }}>{`Date: ${formattedDate(
              decoking.date
            )}`}</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.timeHead}>TIME (hrs.)</Text>
              <Text style={styles.unitHead}>TIME Diffe.</Text>
              <Text style={styles.unitHead}>CO2 (%)</Text>
              <Text style={styles.unitHead}>CO (%)</Text>
              <Text style={styles.unitHead}>O2 (%)</Text>
              <Text style={styles.unitHead}>Air Reading</Text>
              <Text style={styles.unitHead}>Coke Flow</Text>
              <Text style={styles.comment}>Comment</Text>
            </View>
            {decoking.details?.map((reading, index) => {
              stringifyConsole(decoking.details);
              if (reading.cO2 === 0 && reading.co === 0 && reading.o2 === 0) {
                const firstReading = decoking.details[0];
                return (
                  <View key={uuid()}>
                    <View key={index + 1} style={styles.rowContainer}>
                      <View style={{ flexDirection: 'row', display: 'block', flexWrap: 'wrap' }}>
                        <Text style={styles.time}>{getTime(firstReading.time, 'HH:mm')}</Text>
                        <Text style={styles.airCharge}>{'AIR CHARGE'}</Text>
                        <Text style={styles.unit}>{firstReading.airReading ? firstReading.airReading : '-'}</Text>
                        <Text style={styles.unit}>{firstReading.cokeFlow ? firstReading.cokeFlow : '-'}</Text>
                        <Text style={styles.commentRow}>{firstReading.comment}</Text>
                      </View>
                    </View>
                    {firstReading === !reading && (
                      <View key={index + 1} style={styles.rowContainer}>
                        <View style={{ flexDirection: 'row', display: 'block', flexWrap: 'wrap' }}>
                          <Text style={styles.time}>{getTime(reading.time, 'HH:mm')}</Text>
                          <Text style={styles.unit}>{reading.timeDifference ? reading.timeDifference : '-'}</Text>
                          <Text style={styles.unit}>{reading.cO2 ? reading.cO2 : '-'}</Text>
                          <Text style={styles.unit}>{reading.co ? reading.co : '-'}</Text>
                          <Text style={styles.unit}>{reading.o2 ? reading.o2 : '-'}</Text>
                          <Text style={styles.unit}>{reading.airReading ? reading.airReading : '-'}</Text>
                          <Text style={styles.unit}>{reading.cokeFlow ? reading.cokeFlow : '-'}</Text>
                          <Text style={styles.commentRow}>{reading.comment}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View key={index + 1} style={styles.rowContainer}>
                    <View style={{ flexDirection: 'row', display: 'block', flexWrap: 'wrap' }}>
                      <Text style={styles.time}>{getTime(reading.time, 'HH:mm')}</Text>
                      <Text style={styles.unit}>{reading.timeDifference ? reading.timeDifference : '-'}</Text>
                      <Text style={styles.unit}>{reading.cO2 ? reading.cO2 : '-'}</Text>
                      <Text style={styles.unit}>{reading.co ? reading.co : '-'}</Text>
                      <Text style={styles.unit}>{reading.o2 ? reading.o2 : '-'}</Text>
                      <Text style={styles.unit}>{reading.airReading ? reading.airReading : '-'}</Text>
                      <Text style={styles.unit}>{reading.cokeFlow ? reading.cokeFlow : '-'}</Text>
                      <Text style={styles.commentRow}>{reading.comment}</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export default DataTable;

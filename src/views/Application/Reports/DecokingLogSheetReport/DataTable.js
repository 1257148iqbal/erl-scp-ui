import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDateTime } from 'utils/dateHelper';
import { v4 as uuid } from 'uuid';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    margin: '10px 0 5px 0',
    lineHeight: 1.2,
    position: 'relative'
  },
  reportTitle: {
    color: '#000000',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  reportSubTitle: {
    color: '#000000',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 300
  },
  section: {
    color: '#000000',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 300
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
    left: 148,
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
  parameter: {
    width: '28%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 8,
    textAlign: 'left',
    left: 5
  },
  parameterHead: {
    width: '28%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 10,
    textAlign: 'center',
    left: 5,
    fontWeight: 900
  },
  unit: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 8
  },
  unitHead: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  dateTimeHead: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 10,
    fontWeight: 900
  },
  dateTimeHeadBlank: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '10px 0px',
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
      {data?.map((decoking, index) => (
        <View key={index + 1}>
          <View style={styles.titleContainer} break>
            <Image style={styles.logo} src={logo} />
            <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
            <Text style={styles.reportSubTitle}>SECONDARY CONVERSION PLANT</Text>
            <Text style={styles.section}>Decoking Log Sheet</Text>
          </View>

          <View style={{ display: 'flex', position: 'relative' }}>
            <Text
              style={{
                fontSize: 13,
                position: 'absolute',
                textAlign: 'center',
                fontWeight: 'bold',
                left: 203,
                marginTop: 0
              }}>{`${decoking.number} LRV Heater Coil Decoking `}</Text>
            <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 15 }}>CONTROL ROOM</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.parameterHead}>PARAMETERS</Text>
              <Text style={styles.unitHead}>UNIT</Text>
              {decoking.headings.map(heading => (
                <Text key={uuid()} style={heading ? styles.dateTimeHead : styles.dateTimeHeadBlank}>
                  {heading ? formattedDateTime(heading, 'DD-MMM-yyyy HH:mm') : '-'}
                </Text>
              ))}
            </View>
            {decoking.details
              .filter(og => og.operationGroupName === 'Control Room')
              .map((details, index) => (
                <View key={uuid()} style={styles.rowContainer}>
                  <View style={{ flexDirection: 'row', display: 'block', flexWrap: 'wrap' }}>
                    <Text style={styles.parameter}>{details.parameterName}</Text>
                    <Text style={styles.unit}>{getSign(details.unitName)}</Text>
                    {details.readings.map(reading => (
                      <Text key={uuid()} style={styles.unit}>
                        {reading.reading === '0' || '' || 0 ? '-' : reading.reading}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            <View>
              <Text style={{ textAlign: 'center', borderTop: '1px solid black', padding: '5px' }}>LOCAL READING</Text>
            </View>
            {decoking.details
              .filter(og => og.operationGroupName === 'Local')
              .map((details, index) => (
                <View key={uuid()} style={styles.rowContainer}>
                  <View style={{ flexDirection: 'row', display: 'block', flexWrap: 'wrap' }}>
                    <Text style={styles.parameter}>{details.parameterName}</Text>
                    <Text style={styles.unit}>{getSign(details.unitName)}</Text>
                    {details.readings.map(reading => (
                      <Text key={uuid()} style={styles.unit}>
                        {reading.reading === '0' || '' || 0 ? '-' : reading.reading}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default DataTable;

import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
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
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 100
  },
  report: {
    color: '#000000',
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 100
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 150,
    top: 5
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 1
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
  rowContainerCR: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block',
    height: 20
  },
  rowContainerSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  rowContainerLocal: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block',
    height: 23
  },
  head: {
    width: '6%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  shift: {
    width: '21%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  shiftRow: {
    width: '21%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  head_local: {
    width: '11%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  readingLocal: {
    width: '11%',
    borderRight: '1px solid black',
    padding: '5.5px 0px',
    fontSize: 10
  },
  readingCR: {
    width: '6%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 10
  },
  time: {
    width: '18%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  tagName: {
    width: '18%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  switch: {
    width: '18%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  time_local: {
    width: '22%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  tagNameLocal: {
    width: '22%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  unit: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  unitCR: {
    width: '10%',
    borderRight: '1px solid black',
    padding: '4px 0px',
    fontSize: 10
  },
  operation: {
    width: '27%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  operationRow: {
    width: '27%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    textAlign: 'center',
    paddingLeft: 5,
    fontSize: 10
  },
  unit_local: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 10
  },
  unitLocal: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '5.5px 0px',
    fontSize: 10
  },
  sl: {
    width: '7.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
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
    <View style={{ margin: '0px 10px 0px 15px' }}>
      {data
        .filter(ogn => ogn.operationGroupName === 'Control Room')
        .map((section, index) => (
          <View key={index + 1}>
            <View style={styles.titleContainer} break>
              <Image style={styles.logo} src={logo} />
              <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
              <Text style={styles.reportSubTitle}>SECONDARY CONVERSION PLANT</Text>
              <Text style={styles.report}>LRV LOG SHEET/CONTROL ROOM</Text>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 9, marginBottom: 10 }}>{section.sectionName}</Text>

            <View style={styles.tableContainer}>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 10,
                  width: '27.1%',
                  padding: '4px 4px',
                  borderRight: '1px solid black'
                }}>{`Date: ${formattedDate(section.date)}`}</Text>

              <Text
                style={{
                  fontSize: 10,
                  padding: '4px 4px',
                  width: '24%',
                  borderRight: '1px solid black'
                }}>{`Group: ${section.operatorGroup[0]}`}</Text>
              <Text
                style={{
                  fontSize: 10,
                  padding: '4px 4px',
                  width: '24%',
                  borderRight: '1px solid black'
                }}>{`Group: ${section.operatorGroup[1]}`}</Text>
              <Text
                style={{
                  fontSize: 10,
                  width: '20%',
                  padding: '4px 4px'
                }}>{`Group: ${section.operatorGroup[2]}`}</Text>

              <View style={styles.rowContainer}>
                <Text style={styles.time}>TIME</Text>
                <Text style={styles.unit}>UNIT</Text>
                {section.timeSlotName.map(ts => (
                  <Text key={ts} style={styles.head}>
                    {ts}
                  </Text>
                ))}
              </View>
              {section.tags.map(tag => (
                <View key={tag.id} style={styles.rowContainerCR}>
                  <View style={styles.tagName}>
                    <Text>{tag.tagName}</Text>
                    <Text style={{ fontSize: 7 }}>{tag.details}</Text>
                  </View>

                  <Text style={styles.unitCR}>{getSign(tag.unitName)}</Text>
                  {tag.timeSlotWiseReadings.map(reading => (
                    <Text key={uuid()} style={styles.readingCR}>
                      {reading.reading ? reading.reading : '-'}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* Remarks */}
            <View style={{ marginLeft: 5, fontSize: 10 }}>
              <Text style={{ fontSize: 11, marginBottom: 5, textDecoration: 'underline' }}>Remarks : </Text>
              {section.remarks?.split('~').map((re, idx) => {
                return (
                  <View key={idx + 1}>
                    <Text style={{ fontSize: 10 }}>{` ${'# '} ${re}`}</Text>
                  </View>
                );
              })}
            </View>

            {/* Switch Section */}
            {section.switches && (
              <View style={{ border: '1px solid black', width: '100%', top: 10 }}>
                <View style={styles.rowContainer}>
                  <Text style={styles.time}>SWITCH</Text>
                  <Text style={styles.operation}>OPERATION</Text>
                  {section.shiftName.map(shift => (
                    <Text key={shift} style={styles.shift}>
                      {shift}
                    </Text>
                  ))}
                </View>
                {section.switches?.map(item => (
                  <View key={item.id} style={styles.rowContainerSwitch}>
                    <View style={styles.switch}>
                      <Text>{item.switchName}</Text>
                    </View>

                    <Text style={styles.operationRow}>{item.operation}</Text>
                    {item.shiftWiseReadings.map(reading => (
                      <Text key={uuid()} style={styles.shiftRow}>
                        {reading.reading ? reading.reading : 'N/A'}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            <View style={{ position: 'absolute', display: 'flex' }}>
              <View>
                <Text style={styles.singMorning}>SIGNATURE</Text>
                <Text style={styles.singMorning}>MORNING</Text>
              </View>
              <View>
                <Text style={styles.singEvening}>SIGNATURE</Text>
                <Text style={styles.singEvening}>EVENING</Text>
              </View>
              <View>
                <Text style={styles.singNight}>SIGNATURE</Text>
                <Text style={styles.singNight}>NIGHT</Text>
              </View>
            </View>
          </View>
        ))}

      {data
        .filter(ogn => ogn.operationGroupName === 'Local')
        .map((section, index) => (
          <View key={index + 1}>
            <View style={styles.titleContainer} break>
              <Image style={styles.logo} src={logo} />
              <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
              <Text style={styles.reportSubTitle}>SECONDARY CONVERSION PLANT</Text>
              <Text style={styles.report}>LRV UNIT / LOCAL LOG SHEET</Text>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 9 }}>{section.sectionName}</Text>
            <View style={{ position: 'absolute' }}>
              <Text style={{ marginLeft: 450, marginTop: 48, fontSize: 10 }}>{`Date : ${formattedDate(section.date)}`}</Text>
            </View>
            <View style={styles.tableContainer}>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 10,
                  width: '33.1%',
                  padding: '4px 4px',
                  borderRight: '1px solid black'
                }}>{`LOCAL INSTRUMENTS ${''}`}</Text>

              <Text
                style={{
                  fontSize: 10,
                  padding: '4px 4px',
                  width: '22%',
                  borderRight: '1px solid black'
                }}>{`Group: ${section.operatorGroup[0]}`}</Text>
              <Text
                style={{
                  fontSize: 10,
                  padding: '4px 4px',
                  width: '22%',
                  borderRight: '1px solid black'
                }}>{`Group: ${section.operatorGroup[1]}`}</Text>
              <Text
                style={{
                  fontSize: 10,
                  width: '21%',
                  padding: '4px 4px'
                }}>{`Group: ${section.operatorGroup[2]}`}</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.time_local}>TIME</Text>
                <Text style={styles.unit_local}>UNIT</Text>
                {section.timeSlotName.map(ts => (
                  <Text key={ts} style={styles.head_local}>
                    {ts}
                  </Text>
                ))}
              </View>
              {section.tags.map(tag => (
                <View key={tag.id} style={styles.rowContainerLocal}>
                  <View style={styles.tagNameLocal}>
                    <Text>{tag.tagName}</Text>
                    <Text style={{ fontSize: 7 }}>{tag.details}</Text>
                  </View>
                  <Text style={styles.unitLocal}>{getSign(tag.unitName)}</Text>
                  {tag.timeSlotWiseReadings.map(reading => (
                    <Text key={uuid()} style={styles.readingLocal}>
                      {reading.reading ? reading.reading : '-'}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* Remarks */}
            <View style={{ marginLeft: 5, fontSize: 10 }}>
              <Text style={{ fontSize: 11, marginBottom: 5, textDecoration: 'underline' }}>Remarks : </Text>
              {section.remarks?.split('~').map((re, idx) => {
                return (
                  <View key={idx + 1}>
                    <Text style={{ fontSize: 10 }}>{` ${'# '} ${re}`}</Text>
                  </View>
                );
              })}
            </View>

            <View style={{ position: 'absolute' }}>
              <View>
                <Text style={styles.singMorning}>SIGNATURE</Text>
                <Text style={styles.singMorning}>MORNING</Text>
              </View>
              <View>
                <Text style={styles.singEvening}>SIGNATURE</Text>
                <Text style={styles.singEvening}>EVENING</Text>
              </View>
              <View>
                <Text style={styles.singNight}>SIGNATURE</Text>
                <Text style={styles.singNight}>NIGHT</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

export default DataTable;

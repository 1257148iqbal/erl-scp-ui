import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React, { Fragment } from 'react';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    margin: 0,
    lineHeight: 1.2,
    position: 'relative'
  },
  reportTitle: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center'
  },
  reportSubTitle: {
    color: '#000000',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 100
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 140,
    top: 5
  }
});

const LogSheetTitle = ({ title }) => (
  <Fragment>
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={logo} />
      <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
      <Text style={styles.reportSubTitle}>SECONDARY CONVERSION PLANT </Text>
      <Text style={styles.reportSubTitle}>LRV LOG SHEET/CONTROL ROOM </Text>
    </View>
  </Fragment>
);

export default LogSheetTitle;

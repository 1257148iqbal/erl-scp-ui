import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React, { Fragment } from 'react';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    margin: 0,
    lineHeight: 1.2,
    position: 'relative',
    marginBottom: 0
  },
  reportTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  reportSubTitle: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 100
  },
  report: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 100
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 240,
    top: 5
  }
});

const HeaderTitle = ({ title }) => (
  <Fragment>
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={logo} />
      <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
      <Text style={styles.reportSubTitle}>Secondary Conversion Plant</Text>
      <Text style={styles.report}>Assign Operator to Duty</Text>
    </View>
  </Fragment>
);

export default HeaderTitle;

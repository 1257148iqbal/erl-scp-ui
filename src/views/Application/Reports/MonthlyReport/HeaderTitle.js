import { Font, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import kalpurushFontSrc from 'assets/fonts/kalpurush.ttf';
import logo from 'assets/images/logo_erl.jpg';
import { COMPANY_NAME } from 'constants/CompanyName';
import React, { Fragment } from 'react';

Font.register({
  family: 'kalpurush',
  src: kalpurushFontSrc
});

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    margin: '10px 0px 2px 0px',
    lineHeight: 1.2,
    position: 'relative'
  },
  reportTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  reportSubTitle: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 100
  },
  report: {
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

const HeaderTitle = ({ month, year }) => (
  <Fragment>
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={logo} />
      <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
      <Text style={styles.reportSubTitle}>LRV UNIT </Text>
      <Text style={styles.report}>MONTHLY PRODUCTION REPORT </Text>
      <Text style={{ left: 440 }}>{`Month: ${month}, ${year}`}</Text>
    </View>
  </Fragment>
);

export default HeaderTitle;

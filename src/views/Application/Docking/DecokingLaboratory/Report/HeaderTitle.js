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
    margin: 0,
    lineHeight: 1.2,
    position: 'relative',
    marginBottom: 20
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
    fontWeight: 100,
    marginBottom: 5
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 100,
    top: 5
  }
});

const HeaderTitle = ({ title }) => (
  <Fragment>
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={logo} />
      <Text style={styles.reportTitle}>{COMPANY_NAME}</Text>
      <Text style={styles.reportSubTitle}>LONG RESIDUE VISBREAKING UNIT</Text>
      <Text style={styles.report}>DECOKING LABORATORY RESULT</Text>
    </View>
  </Fragment>
);

export default HeaderTitle;

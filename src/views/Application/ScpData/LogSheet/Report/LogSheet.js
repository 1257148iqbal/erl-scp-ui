import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import LogSheetItemTable from './LogSheetItemTable';
import LogSheetTitle from './LogSheetTitle';
import MasterInfo from './MasterInfo';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 10,
    flexDirection: 'column'
  },
  logo: {
    width: 200,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

const LogSheet = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <LogSheetTitle />
        <MasterInfo data={data} />
        <LogSheetItemTable data={data} />
      </Page>
    </Document>
  );
};

export default LogSheet;

import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import DataTable from './DataTable';
import HeaderTitle from './HeaderTitle';
import TotalProduction from './TotalProduction';

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

const PDFView = ({ data, fromDate, toDate }) => {
  return (
    <Document>
      <Page size="a4" orientation="landscape" style={styles.page}>
        <HeaderTitle title={data} fromDate={fromDate} toDate={toDate} />
        <DataTable data={data} />
      </Page>
      <Page size="a4" orientation="landscape" style={styles.page}>
        <HeaderTitle title={data} fromDate={fromDate} toDate={toDate} />
        <TotalProduction data={data} />
      </Page>
    </Document>
  );
};

export default PDFView;

import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import DataTable from './DataTable';
import HeaderTitle from './HeaderTitle';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 10,
    flexDirection: 'column'
  }
});

const PDFView = ({ data, fromDate }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderTitle month={data.month} year={data.year} />
        <DataTable data={data} fromDate={fromDate} />
      </Page>
    </Document>
  );
};

export default PDFView;

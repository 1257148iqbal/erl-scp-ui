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

const PDFView = ({ details, data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderTitle />
        <DataTable details={details} data={data} />
      </Page>
    </Document>
  );
};

export default PDFView;

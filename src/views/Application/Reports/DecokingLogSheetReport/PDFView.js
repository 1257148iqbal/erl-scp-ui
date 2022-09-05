import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import DataTable from './DataTable';

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
  }
});

const PDFView = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <DataTable data={data} />
      </Page>
    </Document>
  );
};

export default PDFView;

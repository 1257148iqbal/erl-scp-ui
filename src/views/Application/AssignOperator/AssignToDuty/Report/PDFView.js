import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import DataTable from './DataTable';
import HeaderTitle from './HeaderTitle';
import MasterInfo from './MasterInfo';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 10,
    flexDirection: 'column'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
});

const PDFView = ({ data }) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <HeaderTitle />
        <MasterInfo data={data} />
        <DataTable data={data} />
        {/* <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        /> */}
      </Page>
    </Document>
  );
};

export default PDFView;

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
      <Page size="LEGAL" style={styles.page}>
        <HeaderTitle />
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

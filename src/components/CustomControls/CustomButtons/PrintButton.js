import { Button, makeStyles } from '@material-ui/core';
import { Print } from '@material-ui/icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  buttonPrint: {
    margin: 5,
    border: 'none',
    height: 42,
    backgroundColor: '#FFFFFF',
    color: '#FEA362',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#FEA362',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const PrintButton = props => {
  const classes = useStyles();
  const { fileName, document, disabled } = props;
  return (
    <>
      <PDFDownloadLink fileName={`${fileName}`} document={document}>
        {({ bold, url, loading, error }) =>
          loading ? (
            'loading document...'
          ) : (
            <Button
              variant="contained"
              disabled={disabled}
              color="default"
              className={classes.buttonPrint}
              endIcon={<Print />}>
              Print
            </Button>
          )
        }
      </PDFDownloadLink>
    </>
  );
};

PrintButton.propTypes = {
  document: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

PrintButton.defaultProps = {
  fileName: 'DocumentPrint'
};

export default PrintButton;

const { makeStyles, lighten } = require('@material-ui/core');

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
    '& .MuiTableCell-sizeSmall': {
      padding: '0px 24px 0px 16px'
    }
  },
  table: {
    minWidth: 800
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#EAF8E6'
    },
    '&:hover': {
      backgroundColor: '#ACE095',
      cursor: 'pointer'
    }
  },
  txtInput: {
    backgroundColor: '#FFFFFF'
  },
  masterInfoBox: {
    padding: 50,
    [theme.breakpoints.down('xs')]: {
      padding: 0
    }
  },
  masterInfoBoxTableCell: {
    maxWidth: 30,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 85
    }
  },
  operationGroup: {
    backgroundColor: '#325F8A',
    color: '#FFF',
    margin: '5px auto',
    padding: '5px',
    height: '40px',
    textAlign: 'center'
  }
}));

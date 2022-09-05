const { makeStyles } = require('@material-ui/core');

export const useSiteReportStyles = makeStyles(theme => ({
  table: {
    minWidth: 800
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#EAF8E6',
      border: '1px solid #FFF'
    },
    '&:hover': {
      backgroundColor: '#ACE0120',
      border: '1px solid #FFF',
      cursor: 'pointer'
    }
  },
  txtInput: {
    color: '#FFFFFF',
    backgroundColor: '#FFFFFF'
  },
  onPressRemark: {
    width: '95%'
  },
  addRemarkBtn: {
    width: '5%',
    marginLeft: 5
  },
  remarkList: {
    listStyle: 'none'
  },
  remarkListItem: {
    position: 'relative',
    width: '100%',
    padding: '10px 0',
    backgroundColor: 'rgba(0,0,255,.07)',
    borderRadius: '5px',
    marginBottom: 5
  },
  removeIcon: {
    width: '15px',
    height: '15px',
    display: 'flex',
    padding: '10px',
    position: 'absolute',
    alignItems: 'center',
    borderRadius: '30%',
    justifyContent: 'center',
    backgroundColor: 'red',
    cursor: 'pointer',
    right: '0',
    top: '0',
    color: '#FFF'
  },
  txtInputDisabled: {
    '& .MuiInputBase-input.Mui-disabled': {
      backgroundColor: '#EDEDED',
      color: '#000'
    }
  },
  tableCumulative: {
    minWidth: 700
  }
}));

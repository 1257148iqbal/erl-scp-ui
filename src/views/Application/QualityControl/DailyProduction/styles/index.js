import { makeStyles } from '@material-ui/core';

export const useDailyProductionFormStyles = makeStyles(theme => ({
  root: {
    padding: 10,
    marginBottom: 20,
    marginTop: 10
  },
  txtInput: {
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
  headerContent: {
    backgroundColor: '#045170',
    color: 'white',
    padding: '5px 10px',
    borderRadius: 10,
    textAlign: 'center',
    width: '20%',
    minWidth: '150px'
  },
  fieldset: {
    padding: 15,
    height: 310,
    [theme.breakpoints.down('sm')]: {
      height: 315
    }
  }
}));

export const useDailyProductionListStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  filteredItems: {
    padding: 10,
    backgroundColor: '#ECF0F6',
    borderRadius: 5,
    margin: 10
  },
  actionButton: {
    marginLeft: 5
  },
  filterBoxBackground: {
    backgroundColor: '#FFFFFF'
  },
  btnPDF: {
    height: 40
  }
}));

const { makeStyles, lighten } = require('@material-ui/core');

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  btnSpecific: {
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: 5
    }
  },
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
    backgroundColor: '#FFFFFF'
  },
  tableCumulative: {
    minWidth: 700
  },
  tableCell: {
    minWidth: 90,
    display: 'block',
    paddingLeft: 20,
    textAlign: 'left'
  },
  symbol: {
    minWidth: 130
  },
  tankIcon: {
    backgroundColor: 'red',
    color: 'white',
    width: 15,
    height: 15,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '-5px',
    right: 0,
    cursor: 'pointer'
  },
  btnChild: {
    color: '#3F51B5'
  },
  btnParent: {
    minWidth: 40,
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#3F51B5',
      '& $btnChild': {
        color: '#FFFFFF'
      }
    }
  },
  imageContainer: {
    margin: '15px 0',
    backgroundColor: 'rgba(30, 78, 124, 0.2)',
    overflowX: 'scroll'
  },
  image01: {
    width: '100%'
  },
  images: {
    padding: 20,
    position: 'relative',
    minWidth: '1280px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  imagesReading: {
    fontSize: 23,
    color: 'green',
    fontWeight: '800'
  },
  textRedColor: {
    color: 'red'
  },
  fileOneti04Left: { position: 'absolute', left: '34%', top: '13%' },
  fileOneti04Right: { position: 'absolute', left: '59.5%', top: '13%' },
  fileOnefic02: { position: 'absolute', left: '17%', top: '12%' },
  fileOnefic01: { position: 'absolute', left: '82%', top: '12%' },
  fileOnepi02: { position: 'absolute', left: '68%', top: '12%' },
  fileOnepi03: { position: 'absolute', left: '27%', top: '9%' },
  fileOnet05: { position: 'absolute', left: '63%', top: '48%' },
  fileOnet06: { position: 'absolute', left: '34%', top: '48%' },
  fileOnepi06: { position: 'absolute', left: '91%', top: '78%' },
  fileOnepi07: { position: 'absolute', left: '6%', top: '75%' },
  fileOnet07: { position: 'absolute', left: '85.5%', top: '78%' },
  fileOnet08: { position: 'absolute', left: '14.5%', top: '73.5%' },
  fileOnet09: { position: 'absolute', left: '80%', top: '78%' },
  fileOnepic19: { position: 'absolute', left: '38.5%', top: '78%' },
  fileOneo2: { position: 'absolute', left: '48%', top: '4.5%' },
  fileOnet10: { position: 'absolute', left: '58%', top: '68.5%' },
  fileOnet11: { position: 'absolute', left: '60%', top: '57%' },
  fileOnet12: { position: 'absolute', left: '35%', top: '68.5%' },
  fileOnet13: { position: 'absolute', left: '35%', top: '57%' },
  fileOnet14: { position: 'absolute', left: '50%', top: '49%' },
  fileOnet15: { position: 'absolute', left: '41%', top: '49%' },
  fileOnet64: { position: 'absolute', left: '51%', top: '34%' },
  fileOnet65: { position: 'absolute', left: '41.5%', top: '34%' },
  fileOneft37: { position: 'absolute', left: '31%', top: '79%' },
  fileOnestrokePass1: { position: 'absolute', left: '84%', top: '28%' },
  fileOnestrokePass2: { position: 'absolute', left: '13%', top: '28%' },
  fileOnehic03: { position: 'absolute', left: '50.5%', top: '13%' },
  fileOnehic23: { position: 'absolute', left: '44%', top: '13%' },
  fileOnepi52: { position: 'absolute', left: '48%', top: '41%' },
  fileOnefuelType: {
    position: 'absolute',
    left: '9%',
    top: '87%',
    width: 200,
    fontSize: 23
  },

  masterInfoBoxTableCell: {
    maxWidth: 30,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 85
    }
  },

  gridItemWrapper: {
    display: 'table',
    width: '100%'
  },
  gridItem: {
    display: 'table-cell'
  },
  gridItemTitle: {
    margin: '10px 0px',
    textAlign: 'center',
    borderBottom: '1px solid #ccc'
  },
  boxWrapper: {
    padding: 5,
    backgroundColor: 'rgba(201, 211, 223, 0.2)'
  },
  boxTitle: {
    textAlign: 'left',
    filesize: 15,
    color: '#000',
    margin: '5px 10px'
  },
  tableContainer: {
    padding: 15,
    marginBottom: 5,
    display: 'table-cell',
    '& .MuiTableCell-root': {
      border: '1px solid black'
    }
  },
  sectionHead: {
    backgroundColor: '#d0d5db',
    color: '#000',
    border: '1px solid #000',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'small'
  },
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  }
}));

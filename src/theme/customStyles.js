import { alpha, lighten } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
const customStyles = makeStyles(theme => ({
  //Form Control
  formLabel: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
      fontWeight: 'bold'
    }
  },
  labelBox: {
    margin: '5px',
    width: '20%',
    padding: '5px'
  },
  doclabelBox: {
    margin: '5px',
    padding: '5px'
  },
  fileInfoBox: {
    margin: '5px',
    padding: '5px'
  },
  inputField: {
    paddingRight: '35px',
    width: '100%'
  },
  inputBox: {
    margin: '5px',
    width: '80%',
    padding: '5px'
  },
  checkBox: {
    margin: '5px',
    width: '80%',
    padding: '5px'
  },
  inputOwnStyleBox: {
    margin: '5px',
    width: '20%',
    padding: '5px'
  },
  inputDocBox: {
    marginTop: '15px',
    marginBottom: '30px',
    width: '100%',
    height: '100px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '80px'
    }
  },
  dropzoneBox: {
    height: '120px',
    width: '100%',
    backgroundColor: '#EDEDED',
    // padding: theme.spacing(3),
    border: ' #C6C6C6 dotted',
    '&:hover': {
      background: '#D1E3F5'
    },
    [theme.breakpoints.down('sm')]: {
      height: '190px'
    }
  },
  fileList: {
    margin: 'auto'
  },
  labelDescriptionBox: {
    margin: '5px',
    width: '10%',
    padding: '5px',
    [theme.breakpoints.down('sm')]: {
      margin: '5px',
      width: '20%',
      padding: '5px'
    }
  },
  inputDescriptionBox: {
    margin: '5px',
    width: '90%',
    padding: '5px',
    [theme.breakpoints.down('sm')]: {
      margin: '5px',
      width: '80%',
      padding: '5px'
    }
  },

  buttonBox: {
    marginLeft: '0.90rem',
    marginTop: '0.90rem'
  },

  ///Color
  colorBox: {
    width: '30px',
    height: '30px',
    marginRight: '10px'
  },

  //Sample Photo
  thumbsContainer: {
    // display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    marginTop: 16
    // marginLeft: 20,
  },

  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  },

  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },

  img: {
    display: 'block',
    width: '100px',
    height: '100px',
    margin: '10px',
    border: '#EDEDED solid'
  },
  shape: {
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40
  },
  overLappingButton: {
    position: 'absolute',
    float: 'right',
    backgroundColor: '#EDEDED',
    borderRadius: '50%'
  },
  //for ActionButton
  addButton: {
    color: 'green',
    '&:hover $addButton': {
      color: 'white',
      backgroundColor: 'green',
      cursor: 'pointer'
    }
  },

  editButton: {
    color: '#4CAF50',
    '&:hover $editButton': {
      color: 'white',
      backgroundColor: '#4CAF50',
      cursor: 'pointer'
    }
  },
  deleteButton: {
    color: '#E90052',
    '&:hover $deleteButton': {
      color: 'white',
      backgroundColor: '#E90052',
      cursor: 'pointer'
    }
  },
  crosButton: {
    color: '#E90052',
    '&:hover $crosButton': {
      color: 'white',
      backgroundColor: '#E90052',
      cursor: 'pointer',
      borderRadius: '50%'
    }
  },
  removeButton: {
    color: '#E90052',
    '&:hover $removeButton': {
      color: 'white',
      backgroundColor: '#E90052',
      cursor: 'pointer'
    }
  },

  viewButton: {
    color: '#0795F4',
    '&:hover $viewButton': {
      color: 'white',
      backgroundColor: '#0795F4',
      cursor: 'pointer'
    }
  },
  SettingsButton: {
    color: '#38003C'
  },
  printButton: {
    color: '#018786',
    '&:hover $printButton': {
      color: 'white',
      backgroundColor: '#018786',
      cursor: 'pointer'
    }
  },
  CancelButton: {
    color: '#C76300'
  },
  CheckButton: {
    color: '#4CAF50'
  },
  toolTip: {},
  ConfirmButton: {
    color: '#115293'
  },
  filterButton: {
    color: '#115293'
  },
  accountButton: {
    backgroundColor: 'white'
  },
  moreButton: {
    backgroundColor: ''
  },
  cancelFilterButton: {
    color: 'red'
  },
  searchBoxButton: {
    color: 'green'
  },
  passwordButton: {
    '&.password': {
      backgroundColor: alpha(theme.palette.success.main, 0.18),
      color: 'green'
    }
  },
  iconButton: {
    fontWeight: '800',
    '&.new': {
      border: 'solid 1.5px green',
      color: 'green'
    },
    '&.new:hover': {
      backgroundColor: 'green',
      color: 'white',
      cursor: 'pointer'
    },
    '&.submit': {
      marginLeft: '5px',
      marginTop: '5px',
      border: 'solid 1.5px #1976D2',
      color: '#1976D2'
    },
    '&.submit:hover': {
      backgroundColor: '#1976D2',
      color: '#fff',
      cursor: 'pointer'
    },
    '&.cancel': {
      marginLeft: '5px',
      marginTop: '5px',
      border: 'solid 1.5px #E86C63',
      color: '#E86C63'
    },
    '&.cancel:hover': {
      backgroundColor: '#E86C63',
      color: '#fff',
      cursor: 'pointer'
    },
    '&.reset': {
      marginLeft: '5px',
      marginTop: '5px',
      border: 'solid 1.5px #AAAAAA',
      color: '#AAAAAA'
    },
    '&.reset:hover': {
      backgroundColor: '#AAAAAA',
      color: '#fff',
      cursor: 'pointer'
    }
  },
  //For Stepper
  stepperRoot: {
    width: '100%'
  },
  stepperButton: {
    marginRight: theme.spacing(2)
  },
  stepperButtonInstructions: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(12)
  },
  stepperDivInstructions: {
    padding: '25px',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    backgroundColor: 'white'
  },
  tableRoot: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  table: {
    marginTop: '25px',
    marginBottom: '25px',
    minWidth: 750,
    border: '1.5px #C6C6C6 solid',
    '& thead th': {
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#EAEFF3',
      border: '1.5px #C6C6C6 solid'
    },
    '& tbody td': {
      fontWeight: 'normal',
      border: '1.5px #C6C6C6 solid'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },

  ///CollapsableTable
  collapsabletable: {
    marginTop: '25px',
    marginBottom: '25px',
    minWidth: 750,
    border: '1.5px #C6C6C6 solid',
    '& thead th': {
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#EAEFF3',
      border: '1.5px #C6C6C6 solid'
    },
    '& tbody td': {
      fontWeight: 'bold',
      border: '1.5px #C6C6C6 solid'
    },
    '& tbody tr': {
      border: '1.5px #C6C6C6 solid',
      fontWeight: 'bold',

      fontStyle: 'oblique'
    },
    '& tbody tr:hover': {
      backgroundColor: alpha('#C76300', 0.1),
      cursor: 'pointer'
    },
    '& tbody tr:active': {
      backgroundColor: '#FF8C00'
    },
    '& table thead th': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      border: '1.5px #C6C6C6 solid',
      cursor: 'pointer'
    },
    '& table tbody tr': {
      border: '1.5px #C6C6C6 solid',
      fontWeight: 'bold',
      fontStyle: 'normal',
      backgroundColor: alpha(theme.palette.warning.main, 0.15),
      color: theme.palette.success.main
    }
  },
  //Confirm Dialog
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  dialogContent: {
    textAlign: 'center'
  },
  dialogAction: {
    justifyContent: 'center'
  },
  dialogTitle: {
    textAlign: 'center'
  },
  titleIcon: {
    backgroundColor: '#C6C6C6',
    color: 'red',
    '& :hover': {
      backgroundColor: theme.palette.secondary.light,
      cursor: 'default'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem'
    }
  },
  //Filter Toolbar
  rootToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlightToolbar:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark
        },
  titleToolbar: {
    flex: '1 1 100%'
  },
  filterMainBox: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      display: 'block'
    }
  },
  AddMainBox: {
    border: 'solid 2px #EAEFF3'
  }
}));

export default customStyles;

// [theme.breakpoints.down('sm')]: {
//       margin: '5px',
//       width: '80%',
//       padding: '5px',
//     },

const { makeStyles, lighten } = require('@material-ui/core');

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  tableCumulative: {
    minWidth: 700
  },

  tableTui: {
    minWidth: 500
  },
  txtInput: {
    backgroundColor: '#FFFFFF'
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  masterInfoBoxTableCell: {
    maxWidth: 30,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 85
    }
  },
  masterInfoBox: {
    padding: 50,
    [theme.breakpoints.down('xs')]: {
      padding: 0
    }
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
  }
}));

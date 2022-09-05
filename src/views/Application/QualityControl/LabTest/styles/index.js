import { lighten, makeStyles, TableCell, withStyles } from '@material-ui/core';

export const useLabTestListStyles = makeStyles(theme => ({
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
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  },
  btnSpecific: {
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: 5
    }
  }
}));

export const useLabTestCreateFormStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& .MuiPaper-root': {
      backgroundColor: lighten(theme.palette.background.paper, 0.1)
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  table: {
    minWidth: 800
  }
}));

export const StyledTableHeadCellLrv = withStyles(theme => ({
  head: {
    backgroundColor: '#045170',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    boxShadow: '5px 5px 5px grey'
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

export const StyledTableHeadCellWater = withStyles(theme => ({
  head: {
    backgroundColor: '#1F6075',
    color: '#FFFFFF',
    border: '1px solid #FFFFFF',
    boxShadow: '5px 5px 5px grey'
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

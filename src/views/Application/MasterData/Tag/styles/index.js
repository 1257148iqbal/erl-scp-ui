import { lighten, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    minWidth: 800
  },
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#546E7A',
      '& > .MuiTableCell-root': {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
      }
    }
  },
  tableCell: {
    backgroundColor: '#37474F',
    color: '#FFFFFF'
  },
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
  }
}));

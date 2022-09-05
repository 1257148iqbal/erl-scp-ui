import { makeStyles } from '@material-ui/core';

export const useAssignToLabCreateSpecificStyles = makeStyles(theme => ({
  toolbar: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  newBtn: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  thead: {
    '& th:first-child': {
      borderRadius: '5px 0 0 0'
    },
    '& th:last-child': {
      borderRadius: '0 5px 0 0'
    }
  },
  tableHeadCell: {
    padding: '7px 5px',
    background: '#215280',
    color: '#fff'
  },
  headCell: {
    padding: '7px 5px',
    background: '#978db8',
    color: '#222',
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 18
  },
  tbodyRow: {
    '&:hover': {
      background: '#ddd'
    }
  },
  tableBodyCell: {
    padding: '5px'
  },
  tableContainer: {
    width: '100%',
    border: '1px solid black',
    borderCollapse: 'collapse'
  },
  tableHead: {
    border: '1px solid black',
    padding: '7px 5px',
    borderCollapse: 'collapse'
  }
}));

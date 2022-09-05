import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExitToApp from '@material-ui/icons/ExitToApp';
import PropTypes from 'prop-types';
import React from 'react';
const useStyles = makeStyles(theme => ({
  actionButton: {
    margin: 5,
    border: 'none',
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

const Cancel = props => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <Button variant="contained" color="default" endIcon={<ExitToApp />} className={classes.actionButton} onClick={onClick}>
      Cancel
    </Button>
  );
};

Cancel.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Cancel;

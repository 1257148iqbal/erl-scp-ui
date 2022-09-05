import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { RotateLeft } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
const useStyles = makeStyles(theme => ({
  actionButton: {
    margin: 5,
    border: 'none',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: 'none'
    }
  }
}));

const ResetButton = props => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <Button
      variant="contained"
      color="default"
      size="small"
      endIcon={<RotateLeft />}
      className={classes.actionButton}
      onClick={onClick}>
      Reset
    </Button>
  );
};

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ResetButton;

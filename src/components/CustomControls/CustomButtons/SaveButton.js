import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Save } from '@material-ui/icons';
import { useBackDrop } from 'hooks/useBackdrop';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative'
  },
  buttonSuccess: {
    margin: 5,
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#62AD2D',
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    },
    '&:hover': {
      backgroundColor: '#62AD2D',
      color: '#FFFFFF',
      border: 'none'
    }
  },

  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

const SaveButton = React.forwardRef((props, ref) => {
  const { type, onClick, ...rest } = props;
  const { loading } = useBackDrop();

  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Button
        ref={ref}
        type={type || 'button'}
        variant="contained"
        color="default"
        endIcon={<Save />}
        className={classes.buttonSuccess}
        disabled={loading}
        onClick={onClick}
        {...rest}>
        Save
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </Box>
  );
});

SaveButton.propTypes = {
  loading: PropTypes.bool,
  onClick: PropTypes.func
};

export default SaveButton;

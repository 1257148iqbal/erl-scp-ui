import { Fab, makeStyles } from '@material-ui/core';
import { Lock } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles(theme => ({
  btnLockChild: {
    color: '#FF8C00'
  },
  btnLockParent: {
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FF8C00',
      '& $btnLockChild': {
        color: '#FFFFFF'
      }
    }
  }
}));

const FabLock = props => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <Fab size="small" className={classes.btnLockParent} onClick={onClick}>
      <Lock className={classes.btnLockChild} />
    </Fab>
  );
};

export default FabLock;

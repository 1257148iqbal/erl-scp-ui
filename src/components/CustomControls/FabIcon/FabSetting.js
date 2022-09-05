import { Fab, makeStyles } from '@material-ui/core';
import { Lock } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  btnSettingChild: {
    color: '#465B6F'
  },
  btnSettingParent: {
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#465B6F',
      '& $btnSettingChild': {
        color: '#FFFFFF'
      }
    }
  }
}));

const FabSetting = props => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <Fab size="small" className={classes.btnSettingParent} onClick={onClick}>
      <Lock className={classes.btnSettingChild} />
    </Fab>
  );
};

FabSetting.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default FabSetting;

import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { CancelPresentation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  btnChild: {
    color: '#F44336'
  },
  btnParent: {
    '&:hover': {
      backgroundColor: '#F44336',
      '& $btnChild': {
        color: '#FFFFFF'
      }
    }
  }
}));

const CloseIcon = props => {
  const classes = useStyles({});
  const { onClick } = props;
  return (
    <Tooltip arrow title="Close" placement="right">
      <IconButton className={classes.btnParent} onClick={onClick}>
        <CancelPresentation className={classes.btnChild} />
      </IconButton>
    </Tooltip>
  );
};

CloseIcon.propTypes = {
  onClick: PropTypes.func.isRequired
};

CloseIcon.defaultProps = {
  onClick: () => {
    // eslint-disable-next-line no-console
    console.error(`'onClick' event not passed!!`);
  }
};

export default CloseIcon;

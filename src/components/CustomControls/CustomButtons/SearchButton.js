import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Search } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  actionButton: {
    margin: 5,
    [theme.breakpoints.up('xs')]: {
      marginRight: 0
    }
  }
}));

const SearchButton = props => {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      endIcon={<Search />}
      className={classes.actionButton}
      onClick={onClick}>
      Search
    </Button>
  );
};

SearchButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default SearchButton;

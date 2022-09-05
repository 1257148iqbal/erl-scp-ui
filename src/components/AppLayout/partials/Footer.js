import { Box, makeStyles, Typography } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import React, { useContext } from 'react';
import { THEME_TYPES } from '../../../constants/ThemeOptions';
import AppContext from '../../contextProvider/AppContextProvider/AppContext';
import FooterLogo from './FooterLogo';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnRoot: {
    [theme.breakpoints.down('xs')]: {
      padding: '6px 12px',
      fontSize: 11
    }
  }
}));

const Footer = props => {
  const classes = useStyles();
  const { themeType } = useContext(AppContext);
  const date = new Date();

  return (
    <Box className={classes.root} {...props}>
      <Box display="flex" alignItems="center">
        <Hidden xsDown>
          <FooterLogo mr={5} color={themeType === THEME_TYPES.DARK ? 'white' : ''} />
        </Hidden>
        <Typography fontSize={{ xs: 12, sm: 14 }} component="p">
          {/* Quadrion © {date.getFullYear()} */}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center"></Box>
    </Box>
  );
};

export default Footer;

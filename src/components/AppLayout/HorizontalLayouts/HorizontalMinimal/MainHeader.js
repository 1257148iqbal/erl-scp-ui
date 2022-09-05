import SidebarToggleHandler from '@coremat/CmtLayouts/Horizontal/SidebarToggleHandler';
import { Box, darken, Hidden, makeStyles, Toolbar } from '@material-ui/core';
import React from 'react';
import HeaderNotifications from '../../partials/Header/HeaderNotifications';
import Logo from '../../partials/Logo';
import UserDropDown from '../../partials/UserDropDown';
import HeaderMenu from './HeaderMenu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: 0,
    minHeight: 10,
    [theme.breakpoints.down('md')]: {
      paddingTop: 12,
      paddingBottom: 12
    },
    '& .Cmt-appIcon': {
      color: theme.palette.text.secondary,
      '&:hover, &:focus': {
        color: darken(theme.palette.text.secondary, 0.2)
      },
      [theme.breakpoints.down('xs')]: {
        padding: 7
      }
    },
    '& .Cmt-horizontalNavMenu': {
      position: 'static',
      '& .Cmt-navMegaBtn, & > .Cmt-navCollapse > .Cmt-navCollapseBtn': {
        minHeight: 64
      }
    }
  }
}));

const MainHeader = () => {
  const classes = useStyles();

  return (
    <Toolbar className={classes.root}>
      <SidebarToggleHandler edge="start" color="inherit" aria-label="menu" />
      <Logo mr={{ xs: 2, sm: 4, lg: 6, xl: 8 }} color="white" />
      <Hidden mdDown>
        <HeaderMenu />
      </Hidden>
      <Box display="flex" alignItems="center" ml="auto">
        <HeaderNotifications />
        <UserDropDown />
      </Box>
    </Toolbar>
  );
};

export default MainHeader;

import { List } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import NavCollapse from './NavCollapse';
import NavMenuItem from './NavMenuItem';
import NavSection from './NavSection';

const useStyles = makeStyles(theme => ({
  sideNavMenu: {
    position: 'relative',
  },
}));

const CmtVertical = props => {
  const { menuItems } = props;
  const classes = useStyles();
  return (
    <List component="nav" disablePadding className={classes.sideNavMenu}>
      {menuItems.map((item, index) => {
        switch (item.type) {
          case 'section':
            return <NavSection {...item} key={index} />;
          case 'collapse':
            return <NavCollapse {...item} key={index} />;
          case 'item':
            return <NavMenuItem {...item} key={index} />;
          default:
            return null;
        }
      })}
    </List>
  );
};

export default CmtVertical;

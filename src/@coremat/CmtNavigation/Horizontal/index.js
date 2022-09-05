import { List } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import NavCollapse from './NavCollapse';
import NavMega from './NavMega';
import NavMenuItem from './NavMenuItem';

const useStyles = makeStyles(theme => ({
  horizontalNavMenu: {
    position: 'relative',
    display: 'flex',
    marginLeft: -14,
    marginRight: -14
  }
}));

const CmtHorizontal = props => {
  const { menuItems } = props;
  const classes = useStyles();
  return (
    <List component="nav" disablePadding className={clsx(classes.horizontalNavMenu, 'Cmt-horizontalNavMenu')}>
      {menuItems.map((item, index) => {
        switch (item.type) {
          case 'collapse':
          case 'section':
            return <NavCollapse {...item} key={index} />;
          case 'mega':
            return <NavMega {...item} key={index} />;
          case 'item':
            return <NavMenuItem {...item} key={index} />;
          default:
            return null;
        }
      })}
    </List>
  );
};

export default CmtHorizontal;

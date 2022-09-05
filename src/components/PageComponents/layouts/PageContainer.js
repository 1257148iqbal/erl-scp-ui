import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { PageHeader } from '../index';

const useStyles = makeStyles(theme => ({
  pageFull: {
    width: '100%'
  }
}));

const PageContainer = ({ heading, breadcrumbs, children, className, restProps }) => {
  const classes = useStyles();

  return (
    <Slide in={true} direction="up" mountOnEnter unmountOnExit>
      <Box className={clsx(classes.pageFull, className)} {...restProps}>
        <PageHeader heading={heading} />

        {children}
      </Box>
    </Slide>
  );
};

export default PageContainer;

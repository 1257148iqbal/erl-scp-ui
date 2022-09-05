import React, { useEffect, useState } from 'react';
import { Box, alpha, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  headerMain: {
    width: '100%',
    boxSizing: 'border-box',
    '.Cmt-sticky-header &': {
      position: 'fixed',
      top: 0,
      backgroundImage: 'URL(/images/horizontal-header-bg-pattern.png)',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      color: theme.palette.common.white,
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: alpha(theme.palette.primary.main, 0.47)
      }
    }
  },
  '@global': {
    '.Cmt-container': {
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingLeft: 15,
      paddingRight: 15,
      width: '100%',
      boxSizing: 'border-box',
      [theme.breakpoints.up('md')]: {
        width: '93%'
      },
      [theme.breakpoints.up('lg')]: {
        width: '93%'
      },
      [theme.breakpoints.up('xl')]: {
        width: '93%'
      }
    }
  }
}));

const CmtHeaderMain = React.forwardRef(function HeaderMain(props, ref) {
  const { children } = props;

  const contentRef = React.useRef();
  const classes = useStyles();

  useEffect(() => {
    if (contentRef && contentRef.current) {
      window.onscroll = () => {
        if (window.pageYOffset > 46) {
          document.body.classList.add('Cmt-sticky-header');
        } else {
          document.body.classList.remove('Cmt-sticky-header');
        }
      };
    }
  }, []);

  return (
    <Box ref={contentRef} className={clsx(classes.headerMain, 'Cmt-headerMain')} {...props}>
      <Box className="Cmt-container" position="relative" zIndex={3}>
        {children}
      </Box>
    </Box>
  );
});

export default CmtHeaderMain;

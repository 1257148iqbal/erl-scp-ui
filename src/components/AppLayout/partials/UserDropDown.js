import CmtAvatar from '@coremat/CmtAvatar';
import CmtDropdownMenu from '@coremat/CmtDropdownMenu';
import { alpha, Box, makeStyles, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AuhMethods } from 'services/auth';
import { CurrentAuthMethod } from '../../../constants/AppConstants';

const useStyles = makeStyles(theme => ({
  profileRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 20,
      paddingRight: 20
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 2,
      zIndex: 2,
      height: 35,
      width: 1,
      backgroundColor: alpha(theme.palette.common.dark, 0.15)
    }
  },
  userNameRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 20,
      paddingRight: 20
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      zIndex: 2,
      height: 35,
      width: 1
    }
  },
  userName: {
    paddingLeft: 10
  }
}));

const actionsList = [
  {
    icon: <PersonIcon />,
    label: 'Account'
  },
  {
    icon: <ExitToAppIcon />,
    label: 'Logout'
  }
];

const UserDropDown = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const onItemClick = item => {
    if (item.label === 'Logout') {
      dispatch(AuhMethods[CurrentAuthMethod].onLogout());
    }
    if (item.label === 'Account') {
      history.replace('/profile');
    }
  };

  return (
    <>
      <Box className={clsx(classes.profileRoot, 'Cmt-profile-pic')}>
        <CmtDropdownMenu
          onItemClick={onItemClick}
          TriggerComponent={<CmtAvatar size="small" src={`${REACT_APP_BASE_URL}/${authUser?.media?.fileUrl}`} />}
          items={actionsList}
        />
      </Box>
      <Box className={clsx(classes.userNameRoot, 'Cmt-profile-pic')}>
        <Typography className={classes.userName}>{authUser?.fullName}</Typography>
      </Box>
    </>
  );
};

export default UserDropDown;

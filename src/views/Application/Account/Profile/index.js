import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
import CmtImage from '@coremat/CmtImage';
import { alpha, Box, Button, Collapse, FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { AssignmentInd, LocalPhone, MailOutline, PhotoCamera, Work } from '@material-ui/icons';
import clsx from 'clsx';
import { TextInput } from 'components/CustomControls';
import GridContainer from 'components/GridContainer';
import { USERS } from 'constants/ApiEndPoints/v1';
import { CurrentAuthMethod } from 'constants/AppConstants';
import React, { useState } from 'react';
import { MdLogin } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, updateLoadUser } from 'redux/actions/Auth';
import { AuhMethods } from 'services/auth';
import { http } from 'services/httpService';
import { sweetAlerts, toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  pageFull: {
    width: '99.6%'
  },
  profileSidebar: {
    '@media screen and (min-width: 1280px) and (max-width: 1499px)': {
      flexBasis: '100%',
      maxWidth: '100%'
    }
  },
  headerRoot: {
    position: 'relative',
    margin: '-30px -15px 0 -15px',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 30,
    paddingBottom: 20,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 56
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: -50,
      marginRight: -50,
      paddingLeft: 50,
      paddingRight: 50
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: -65,
      marginRight: -65,
      paddingLeft: 65,
      paddingRight: 65
    },
    [theme.breakpoints.up('xl')]: {
      marginLeft: -88,
      marginRight: -88,
      paddingLeft: 88,
      paddingRight: 88
    }
  },
  headerBgImg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    minHeight: 370,
    zIndex: 0,
    [theme.breakpoints.up('sm')]: {
      minHeight: 270
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: alpha(theme.palette.primary.main, 0.5)
    },
    '& img': {
      width: '100%',
      height: '100%'
    }
  },
  headerContent: {
    position: 'relative',
    zIndex: 3
  },
  titleRoot: {
    color: theme.palette.common.white,
    marginBottom: 4
  },
  subTitleRoot: {
    color: alpha(theme.palette.common.white, 0.74)
  },
  iconView: {
    backgroundColor: alpha(blue['500'], 0.1),
    color: blue['500'],
    padding: 8,
    borderRadius: 4,
    '& .MuiSvgIcon-root': {
      display: 'block'
    },
    '&.web': {
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    },
    '&.phone': {
      backgroundColor: alpha(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },
    '&.department': {
      backgroundColor: alpha('#6618D1', 0.15),
      color: '#6618D1'
    },
    '&.userName': {
      backgroundColor: alpha('#4C7317', 0.15),
      color: '#4C7317'
    },
    '&.empId': {
      backgroundColor: alpha('#0097A7', 0.15),
      color: '#0097A7'
    }
  },
  wordAddress: {
    wordBreak: 'break-all',
    cursor: 'pointer'
  }
}));

const useActionButtonStyles = makeStyles({
  btnEditVisibility: {
    display: props => (props.onEditMode ? 'inline' : 'none'),
    margin: 5
  },
  btnUpdateVisibility: {
    display: props => (props.onEditMode ? 'none' : 'inline'),
    margin: 5
  }
});

const Profile = () => {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();

  const dispatch = useDispatch();
  const { authUser } = useSelector(({ auth }) => auth);
  const [onEditMode, setOnEditMode] = useState(false);
  const classes2 = useActionButtonStyles({ onEditMode });

  //#region State
  const [state, setState] = useState(authUser);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fileInfo, setFileInfo] = useState({
    file: null,
    fileUrl: `${REACT_APP_BASE_URL}/${state.media?.fileUrl}`,
    fileName: ''
  });

  //#endregion

  //#region  UDF's
  const updateAuthUserInfo = () => {
    http
      .get(USERS.get_me)
      .then(({ data }) => {
        dispatch(setAuthUser(data));
      })
      .catch(({ response }) => {
        if (response === undefined || response || response.status === 401) {
          dispatch(updateLoadUser(true));
        }
      });
  };
  //#endregion

  //#region Event's
  const onImageChange = e => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    setFileInfo({ ...fileInfo, file, fileUrl, fileName });
    setOnEditMode(true);
  };

  const onChange = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    const data = {
      id: state.id,
      userName: state.userName,
      departmentName: state.departmentName,
      fullName: state.fullName,
      email: state.email,
      currentPassword: currentPassword,
      newPassword: confirmPassword,
      roles: state.roles,
      phoneNumber: state.phoneNumber,
      jobTitle: state.jobTitle,
      employeeID: state.employeeID
    };

    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (fileInfo.file) {
      formData.append('File', fileInfo.file, fileInfo.fileName);
    }

    http.put(`${USERS.update_user_me}`, formData).then(res => {
      if (res.status === 200) {
        if (currentPassword && confirmPassword) {
          dispatch(AuhMethods[CurrentAuthMethod].onLogout());
        } else {
          sweetAlerts('success', 'Success', 'Infor Updated');
          updateAuthUserInfo();
          setOnEditMode(false);
        }
      } else {
        toastAlerts('warning', 'Info no updated');
      }
    });
  };

  //#endregion

  return (
    <React.Fragment>
      {authUser && (
        <form autoComplete="off">
          <Box className={classes.pageFull}>
            {/* start profile header */}
            <Box className={classes.headerRoot}>
              <Box className={classes.headerBgImg}>
                <CmtImage src={'/images/profile-bg-img.png'} />
              </Box>
              <Box className={classes.headerContent}>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" mb={4}>
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
                    <Box mr={{ sm: 4, md: 5, lg: 6 }} mb={{ xs: 3, sm: 0 }}>
                      <CmtAvatar size={100} src={fileInfo.fileUrl} alt={state.fullName} />
                    </Box>

                    <Box>
                      <Typography className={classes.titleRoot} component="div" variant="h1">
                        {state.fullName}
                      </Typography>
                      <Typography className={classes.subTitleRoot}>{state.jobTitle}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="input-user-image"
                    multiple
                    type="file"
                    onChange={onImageChange}
                  />
                  <label htmlFor="input-user-image">
                    <Button variant="contained" color="primary" component="span" endIcon={<PhotoCamera />}>
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Box>
            </Box>
            {/* end profile header */}

            {/* start addtional info */}
            <GridContainer>
              <Grid item xs={12} className={classes.profileSidebar}>
                <Box mb={6}>
                  <CmtCard>
                    <CmtCardHeader title="Contact" />
                    <CmtCardContent>
                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={clsx(classes.iconView, 'userName')}>
                          <MdLogin />
                        </Box>
                        <Box ml={5}>
                          <Box component="span" fontSize={12} color="text.secondary">
                            User Name
                          </Box>
                          <Box className={classes.wordAddress} fontSize={16}>
                            <Box>{state.userName}</Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={clsx(classes.iconView, 'empId')}>
                          <AssignmentInd />
                        </Box>
                        <Box ml={5}>
                          <Box component="span" fontSize={12} color="text.secondary">
                            Employee ID
                          </Box>
                          <Box className={classes.wordAddress} fontSize={16}>
                            <Box>{state.employeeID}</Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={classes.iconView}>
                          <MailOutline />
                        </Box>
                        <Box ml={5}>
                          <Box component="span" fontSize={12} color="text.secondary">
                            Email
                          </Box>
                          <Box className={classes.wordAddress} fontSize={16}>
                            {onEditMode ? (
                              <TextInput name="email" value={state.email} onChange={onChange} />
                            ) : (
                              <Box component="a" href={`mailto:${state.email}`}>
                                {state.email}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={clsx(classes.iconView, 'phone')}>
                          <LocalPhone />
                        </Box>
                        <Box ml={5}>
                          <Box component="span" fontSize={12} color="text.secondary">
                            Phone
                          </Box>
                          <Box className={classes.wordAddress} fontSize={16}>
                            {onEditMode ? (
                              <TextInput name="phoneNumber" value={state.phoneNumber} onChange={onChange} />
                            ) : (
                              <Box>{state.phoneNumber}</Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={clsx(classes.iconView, 'department')}>
                          <Work />
                        </Box>
                        <Box ml={5}>
                          <Box component="span" fontSize={12} color="text.secondary">
                            Department
                          </Box>
                          <Box className={classes.wordAddress} fontSize={16}>
                            <Box>{state.departmentName}</Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Box className={clsx(classes.iconView, 'department')}>
                          <FormControlLabel
                            control={<Switch checked={changePassword} onChange={() => setChangePassword(prev => !prev)} />}
                            label="Change Password"
                          />
                        </Box>
                      </Box>

                      <Box display="flex">
                        <Collapse in={changePassword}>
                          <TextInput
                            label="Current Password"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                          />
                          <TextInput
                            label="New Password"
                            value={confirmPassword}
                            name="confirmPassword"
                            onChange={e => setConfirmPassword(e.target.value)}
                          />
                        </Collapse>
                      </Box>

                      <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes2.btnEditVisibility}
                          onClick={onSubmit}>
                          Update
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes2.btnUpdateVisibility}
                          onClick={() => setOnEditMode(prev => !prev)}>
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes2.btnEditVisibility}
                          onClick={() => setOnEditMode(prev => !prev)}>
                          Cancel
                        </Button>
                      </Box>
                    </CmtCardContent>
                  </CmtCard>
                </Box>
              </Grid>
            </GridContainer>
            {/* end addtional info */}
          </Box>
        </form>
      )}
    </React.Fragment>
  );
};

export default Profile;

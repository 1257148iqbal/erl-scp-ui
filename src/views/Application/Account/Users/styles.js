import { makeStyles } from '@material-ui/core';

export const useUserStyles = makeStyles(theme => ({
  root: {
    maxWidth: 330
  },
  text: {
    textAlign: 'center'
  },
  addPhoto: {
    width: '240px'
  },
  imageBox: {
    maxWidth: 'calc(100% - 120px)',
    margin: '0 auto'
  }
}));

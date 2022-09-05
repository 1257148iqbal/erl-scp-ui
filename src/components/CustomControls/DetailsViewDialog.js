import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from 'components/CustomControls/IconButtons/CloseIcon';
import React from 'react';
import PrintButton from './CustomButtons/PrintButton';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(4)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2)
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <span className={classes.closeButton}>
          <CloseIcon onClick={onClose} />
        </span>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  }
}))(MuiDialogActions);

const CustomizedDialogs = ({ open, setOpen, title, children, ...rest }) => {
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return false;
    } else {
      setOpen(false);
    }
  };

  return (
    <Box>
      <Dialog maxWidth="xl" onClose={handleClose} open={open}>
        <DialogTitle onClose={handleClose}>{title}</DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <PrintButton fileName={rest.fileName} document={rest.document} />

          <Button autoFocus variant="contained" onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomizedDialogs;

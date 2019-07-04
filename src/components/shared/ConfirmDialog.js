import CircularProgress  from '@material-ui/core/CircularProgress';
import Dialog            from '@material-ui/core/Dialog';
import DialogActions     from '@material-ui/core/DialogActions';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle       from '@material-ui/core/DialogTitle';
import { makeStyles }    from '@material-ui/styles';
import PropTypes         from 'prop-types';
import React             from 'react';
import Button            from '../CustomButtons/Button';

const useStyles = makeStyles(theme => ({
  relative: {
    position: 'relative',
    left: '0px',
    top: '0px',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 16px)',
    top: 'calc(50% - 16px)',
  },
}));

const ConfirmDialog = ({
  open,
  busy = false,
  onYes,
  onCancel,
  title = 'Confirm',
  message = '',
}) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent className={classes.relative}>
        {busy && (
          <CircularProgress size={32} thickness={4} className={classes.busy} />
        )}
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} autoFocus>
            Cancel
          </Button>
        )}
        <Button onClick={onYes} color="primary">
          {onCancel ? 'Yes' : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  busy: PropTypes.bool,
  onYes: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ConfirmDialog;

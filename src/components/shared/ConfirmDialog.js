

import React from 'react';
import PropTypes from 'prop-types';

import {
    makeStyles, Button,
    Dialog, DialogActions, CircularProgress,
    DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    relative: {
        position: "relative",
        left: "0px",
        top: "0px"
    },
    busy: {
        position: "absolute",
        left: "calc(50% - 16px)",
        top: "calc(50% - 16px)"
    }
}));

export const ConfirmDialog = ({ open, busy, onYes, onCancel, title = 'Confirm', message = '' }) => {

    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent className={classes.relative}>
                {busy && <CircularProgress size={32} thickness={4} className={classes.busy} />}
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {onCancel && (
                    <Button onClick={onCancel} color="primary" autoFocus>
                        Cancel
                    </Button>
                )}
                <Button onClick={onYes} color="primary">
                    {onCancel ? 'Yes' : 'OK'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    busy: PropTypes.bool,
    onYes: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string
};


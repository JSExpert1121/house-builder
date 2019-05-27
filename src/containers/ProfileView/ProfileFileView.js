import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CircularProgress, IconButton, Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent, Button } from '@material-ui/core';
import CustomizedSnackbars from '../../components/shared/CustomSnackbar';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';
import CustomTableCell from '../../components/shared/CustomTableCell';

import { uploadFiles, getContractorDetailById, removeFile, updateContractor } from '../../actions/cont-actions';

const styles = theme => ({
    root: {
        position: "relative",
        left: "0px",
        top: "0px",
        flexGrow: 1,
        padding: "10px 10px 10px 10px",
        height: "calc(100vh - 64px - 72px - 48px - 20px)",
        overflow: "auto",
        overflowX: "hidden"
    },
    waitingSpin: {
        position: "relative",
        left: "calc(50% - 10px)",
        top: "calc(40vh)",
    },
    dropzone: {
        width: "300px",
        [theme.breakpoints.up('sm')]: {
            width: '500px'
        }
    },
    busy: {
        position: "absolute",
        left: "calc(50% - 16px)",
        top: "calc(50% - 16px)",
        zIndex: "2000"
    }
});

class ProfileFileView extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        uploadFiles: PropTypes.func.isRequired,
        getContractorDetailById: PropTypes.func.isRequired,
        removeFile: PropTypes.func.isRequired,
        files: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })),
        user: PropTypes.shape({
            user_metadata: PropTypes.shape({
                contractor_id: PropTypes.string.isRequired
            }).isRequired
        }).isRequired
    };

    state = {
        openUploadForm: false,
        showMessage: false,
        loading: true,
        busy: false,
        message: '',
        variant: 'success',
        showConfirmDlg: false,
        nameToDel: ''
    }

    async componentDidMount() {

        this.setState({ loading: true });
        let message = 'Loaded successfully.'
        let id = this.props.user.user_metadata.contractor_id;

        try {
            await this.props.getContractorDetailById(id);
        } catch (error) {
            message = 'Some error occured.';
        }

        this.setState({
            openUploadForm: false, loading: false
        });
    }

    handleUploadFiles = async (files) => {

        const { user } = this.props;
        this.setState({ busy: true });
        let message = 'Files were uploaded successfully.'
        let variant = 'success';
        let id = this.props.user.user_metadata.contractor_id;

        try {
            await this.props.uploadFiles(id, files);
            await this.props.getContractorDetailById(id);
        } catch {
            message = 'Some error occured.';
            variant = 'error';
        }

        this.setState({
            openUploadForm: false, busy: false, showMessage: true, message, variant
        });
    }

    closeConfirmDialog = () => {
        this.setState({ showConfirmDlg: false });
    }

    handleDelete = (name) => {
        this.setState({ showConfirmDlg: true, nameToDel: name });
    }

    handleremoveFile = async () => {

        this.setState({ busy: true });
        let id = this.props.user.user_metadata.contractor_id;
        let message = 'File deleted successfully.';
        let variant = 'success';

        try {
            await this.props.removeFile(id, this.state.nameToDel);
            await this.props.getContractorDetailById(id);
        } catch (error) {
            message = 'Some error occured.' + error.toString();
            variant = 'error';
        }

        this.setState({
            showConfirmDlg: false, busy: false, showMessage: true, message, variant
        });
    }

    render() {
        const { classes, files, user } = this.props;
        // const projectFiles = selectedProject.projectFiles;

        if (this.state.loading)
            return <div className={classes.root} >
                <CircularProgress className={classes.waitingSpin} /> </div>;

        return (
            <div className={classes.root} >
                {this.state.busy && <CircularProgress size={32} thickness={4} className={classes.busy} />}
                <Table className={classes.relative}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Name</CustomTableCell>
                            <CustomTableCell align="center">
                                <IconButton style={{ color: "#FFFFFF" }} onClick={() => this.setState({ openUploadForm: true })}>
                                    <NoteAddIcon />
                                </IconButton>
                            </CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell component="th" scope="row" align="center">
                                    <a download={row.name} href={process.env.PROJECT_API + "/contractors/" + user.user_metadata.contractor_id + "/files/" + row.name}>{row.name}</a>
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <IconButton className={classes.button} aria-label="Delete" color="primary" onClick={() => this.handleDelete(row.name)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <DropzoneDialog
                    open={this.state.openUploadForm}
                    onSave={this.handleUploadFiles}
                    maxFileSize={52428800}
                    showFileNamesInPreview={true}
                    acceptedFiles={['text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*']}
                    filesLimit={100}
                    dropzoneText='select files to upload(< 50mb)'
                    dropZoneClass={classes.dropzone}
                    onClose={() => this.setState({ openUploadForm: false })} />
                <CustomizedSnackbars
                    variant={this.state.variant}
                    message={this.state.message}
                    open={this.state.showMessage}
                    handleClose={() => this.setState({ showMessage: false })} />
                {/* <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={this.state.showMessage}
                    onClose={() => this.setState({ showMessage: false })}
                    autoHideDuration={4000}
                    ContentProps={{ 'aria-describedby': 'message-id' }}
                    message={
                        <span id="message-id">
                            {this.state.message}
                        </span>
                    } /> */}
                <Dialog
                    open={this.state.showConfirmDlg}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title">
                    <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                    <DialogContent className={classes.relative}>
                        {this.state.saving && <CircularProgress size={32} thickness={4} className={classes.busy} />}
                        <DialogContentText id="alert-dialog-description">
                            Do you really want to delete this specialty?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={this.handleremoveFile} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // selectedProject: state.gen_data.selectedProject,
        files: state.cont_data.files,
        user: state.global_data.userProfile
    };
};

const mapDispatchToProps = dispatch => {
    return {
        uploadFiles: (id, files) => dispatch(uploadFiles(id, files)),
        getContractorDetailById: (id) => dispatch(getContractorDetailById(id)),
        removeFile: (id, name) => dispatch(removeFile(id, name))
    }
}

const CnProfileFileView = connect(mapStateToProps, mapDispatchToProps)(ProfileFileView);

export default withStyles(styles)(CnProfileFileView);
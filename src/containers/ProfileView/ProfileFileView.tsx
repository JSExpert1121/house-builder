import React from 'react';
import {connect} from 'react-redux';

import {Theme, withStyles} from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import {DropzoneDialog} from 'material-ui-dropzone';

import CustomizedSnackbars from '../../components/shared/CustomSnackbar';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from '../../components/shared/CustomTableCell';

import {getContractorDetailById, removeFile, uploadFiles,} from '../../actions/cont-actions';
import {File, MaterialThemeHOC, UserProfile} from '../../types/global';

const styles = (theme: Theme) => ({
  root: {
    position: 'relative',
    left: '0px',
    top: '0px',
    flexGrow: 1,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: 'calc(100vh - 152px)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 20px)',
    top: 'calc(40vh)',
  },
  dropzone: {
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      width: '500px',
    },
  },
  button: {
    padding: '6px',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 16px)',
    top: 'calc(50% - 16px)',
    zIndex: '2000',
  },
});

interface ProfileFileViewProps extends MaterialThemeHOC {
  user: UserProfile;
  getContractorDetailById: (id: number) => any;
  uploadFiles: (id: number, file: string) => any;
  removeFile: (id: number, name: string) => any;
  files: File[];
}

interface ProfileFileViewState {
  openUploadForm: boolean;
  showMessage: boolean;
  loading: boolean;
  busy: boolean;
  message: string;
  variant: string;
  showConfirmDlg: boolean;
  nameToDel: string;
  saving: boolean;
}

class ProfileFileView extends React.Component<
  ProfileFileViewProps,
  ProfileFileViewState
> {
  state = {
    openUploadForm: false,
    showMessage: false,
    loading: true,
    busy: false,
    message: '',
    variant: 'success',
    showConfirmDlg: false,
    nameToDel: '',
    saving: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    // let message = 'Loaded successfully.';
    let id = this.props.user.user_metadata.contractor_id;

    try {
      await this.props.getContractorDetailById(id);
    } catch (error) {
      // message = 'Some error occured.';
    }

    this.setState({
      openUploadForm: false,
      loading: false,
    });
  }

  handleUploadFiles = async files => {
    const { user } = this.props;
    this.setState({ busy: true });
    let message = 'Files were uploaded successfully.';
    let variant = 'success';
    let id = user.user_metadata.contractor_id;

    try {
      await this.props.uploadFiles(id, files);
      await this.props.getContractorDetailById(id);
    } catch {
      message = 'Some error occured.';
      variant = 'error';
    }

    this.setState({
      openUploadForm: false,
      busy: false,
      showMessage: true,
      message,
      variant,
    });
  };

  closeConfirmDialog = () => {
    this.setState({ showConfirmDlg: false });
  };

  handleDelete = name => {
    this.setState({ showConfirmDlg: true, nameToDel: name });
  };

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
      showConfirmDlg: false,
      busy: false,
      showMessage: true,
      message,
      variant,
    });
  };

  render() {
    const { classes, files, user } = this.props;
    // const projectFiles = selectedProject.projectFiles;

    if (this.state.loading)
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.waitingSpin} />{' '}
        </div>
      );

    return (
      <Paper className={classes.root}>
        {this.state.busy && (
          <CircularProgress size={32} thickness={4} className={classes.busy} />
        )}
        <Table className={classes.relative} size="small">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Name</CustomTableCell>
              <CustomTableCell align="center">
                <IconButton
                  className={classes.button}
                  aria-label="Add"
                  style={{ color: '#FFFFFF' }}
                  onClick={() => this.setState({ openUploadForm: true })}
                >
                  <NoteAddIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell component="th" scope="row" align="center">
                  <a
                    download={row.name}
                    href={
                      process.env.REACT_APP_PROJECT_API +
                      '/contractors/' +
                      user.user_metadata.contractor_id +
                      '/files/' +
                      row.name
                    }
                  >
                    {row.name}
                  </a>
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    color="primary"
                    onClick={() => this.handleDelete(row.name)}
                  >
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
          // showFileNamesInPreview={true}
          acceptedFiles={[
            'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
          ]}
          filesLimit={100}
          // dropzoneText="select files to upload(< 50mb)"
          // dropZoneClass={classes.dropzone}
          onClose={() => this.setState({ openUploadForm: false })}
        />
        <CustomizedSnackbars
          variant={this.state.variant}
          message={this.state.message}
          open={this.state.showMessage}
          handleClose={() => this.setState({ showMessage: false })}
        />
        <Dialog
          open={this.state.showConfirmDlg}
          onClose={this.closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
          <DialogContent className={classes.relative}>
            {this.state.saving && (
              <CircularProgress
                size={32}
                thickness={4}
                className={classes.busy}
              />
            )}
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
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  files: state.cont_data.files,
  user: state.global_data.userProfile,
});

const mapDispatchToProps = dispatch => ({
  uploadFiles: (id, files) => dispatch(uploadFiles(id, files)),
  getContractorDetailById: id => dispatch(getContractorDetailById(id)),
  removeFile: (id, name) => dispatch(removeFile(id, name)),
});

const CnProfileFileView = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileFileView);

export default withStyles({ ...styles })(CnProfileFileView);

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';

import { addFilesToProject, deleteFileFromProject, getProjectData } from '../../actions/global-actions';
import CustomSnackbar from '../shared/CustomSnackbar';
import CustomTableCell from '../shared/CustomTableCell';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
    position: 'relative'
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: 'calc(50% - 20px)',
  },
});

class ProjectFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openUploadForm: false,
      showMessage: false,
      variant: 'success',
      isBusy: false,
      message: '',
    };
  }

  handleUploadFiles = async files => {
    const { project } = this.props;

    this.setState({ isBusy: true });
    try {
      await this.props.addFiles(project.id, files);
      await this.props.getProjectData(project.id);
      this.setState({
        isBusy: false,
        showMessage: true,
        message: 'File Upload Success',
        variant: 'success',
        openUploadForm: false
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isBusy: false,
        showMessage: true,
        message: 'File Upload Failed',
        variant: 'error',
        openUploadForm: false
      });
    }
  };

  handleDeleteFile = async name => {
    const { project } = this.props;

    this.setState({ isBusy: true });
    try {
      await this.props.deleteFile(project.id, name);
      this.setState({
        isBusy: false,
        showMessage: true,
        message: 'Delete file succeeded',
        variant: 'success'
      });
      await this.props.getProjectData(project.id);
    } catch (error) {
      console.log(error);
      this.setState({
        isBusy: false,
        showMessage: true,
        message: 'Delete file failed',
        variant: 'error'
      });
    }
  };

  render() {
    const { classes, project, location } = this.props;
    const projectFiles = project.projectFiles;

    const readonly = location.pathname.includes('/projects');

    return (
      <div className={classes.root}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Name</CustomTableCell>
              {
                !readonly && (
                  <CustomTableCell align="center">
                    <IconButton
                      style={{ color: '#fff' }}
                      onClick={() => this.setState({ openUploadForm: true })}
                    >
                      <NoteAddIcon />
                    </IconButton>
                  </CustomTableCell>
                )
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {projectFiles.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell component="th" scope="row" align="center">
                  <a
                    download={row.name}
                    href={
                      process.env.REACT_APP_PROJECT_API +
                      '/projects/' +
                      project.id +
                      '/files/' +
                      row.name
                    }
                  >
                    {row.name}
                  </a>
                </CustomTableCell>
                {
                  !readonly && (
                    <CustomTableCell align="center">
                      <IconButton
                        className={classes.button}
                        aria-label="Delete"
                        color="primary"
                        onClick={() => this.handleDeleteFile(row.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CustomTableCell>
                  )
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DropzoneDialog
          open={this.state.openUploadForm}
          onSave={this.handleUploadFiles}
          maxFileSize={52428800}
          showFileNamesInPreview={true}
          acceptedFiles={[
            'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
          ]}
          filesLimit={100}
          dropzoneText="select files to upload(< 50mb)"
          onClose={() => this.setState({ openUploadForm: false })}
        />
        <CustomSnackbar
          open={this.state.showMessage}
          variant={this.state.variant}
          message={this.state.message}
          handleClose={() => this.setState({ showMessage: false })}
        />
        {this.state.isBusy && <CircularProgress className={classes.busy} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.global_data.project,
});

const mapDispatchToProps = {
  addFiles: addFilesToProject,
  getProjectData,
  deleteFile: deleteFileFromProject,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectFiles);

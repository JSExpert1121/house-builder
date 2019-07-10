import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from "redux";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import { createStyles, withStyles } from '@material-ui/core/styles';

import Button from "components/CustomButtons/Button.jsx";
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import 'easymde/dist/easymde.min.css';
// import SimpleMDE from 'react-simplemde-editor';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   DatePicker,
// } from '@material-ui/pickers';

import { addFilesToProject, addProject } from 'actions/global-actions';
import CustomSnackbar from 'components/shared/CustomSnackbar';
import ProjectEditView from 'components/ProjectDetailView/ProjectEditView';

const styles = theme => createStyles({
  root: {
    position: 'relative',
    paddingTop: theme.spacing(1)
  },
  mainBoard: {
    width: '100%',
    height: '100%',
    borderBottom: '5px solid ' + theme.palette.primary.light,
    padding: theme.spacing(1, 2),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: 'calc(50% - 20px)',
  },
  fileUpload: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fileItem: {
    margin: '6px',
    padding: theme.spacing(1),
    border: '1px solid #CCC',
  },
  textFieldHalf: {
    width: 'calc(50% - 8px)',
    paddingRight: theme.spacing(1)
  },
});

class AddProjectView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      price: 0,
      description: '',
      dueDate: new Date(),
      isBusy: false,
      files: [],
      showMessage: false,
      message: '',
      variant: 'error',
    };
  }

  handleAddProject = async () => {
    const { userProfile } = this.props;
    const { files, title, description, price, dueDate } = this.state;
    if (title.length === 0 || description === 0 || price.length === 0) {
      this.setState({
        showMessage: true,
        message: 'You must fill in all the items',
      });
      return;
    }

    const projectData = {
      title,
      description,
      budget: price,
      updatedBy: userProfile.email,
      due: dueDate
    };

    this.setState({ isBusy: true });

    let projectId = null;
    try {
      projectId = await this.props.addProject(userProfile.user_metadata.contractor_id, projectData);
      // console.log('Add Project', projectId);
      await this.props.addFiles(projectId, files);
      this.setState({ isBusy: false });
      this.props.history.push('/gen-contractor');
    } catch (error) {
      this.setState({
        isBusy: false,
        showMessage: true,
        message: 'Add project failed.',
      });
    }
  };

  handleFileChange = e => {
    // console.log(this.state.files, e.target.files);
    this.setState({ files: [...this.state.files, ...e.target.files] });
  };

  handleRemove = file => {
    const { files } = this.state;

    for (let i = 0; i < files.length; i++) {
      if (files[i].name === file.name && files[i].size === file.size) {
        files.splice(i, 1);
        break;
      }
    }

    this.setState({ files: [...files] });
  };

  handleDateChange = (date) => {
    this.setState({ dueDate: date });
  };

  handleDescChange = value => {
    this.setState({ description: value });
  };

  handleTitleChange = value => {
    this.setState({ title: value });
  }

  handlePriceChange = value => {
    this.setState({ price: value });
  }

  render() {
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <Card className={classes.mainBoard}>
          <ProjectEditView
            title={this.state.title}
            price={this.state.price}
            dueDate={this.state.dueDate}
            description={this.state.description}
            handleTitleChange={this.handleTitleChange}
            handlePriceChange={this.handlePriceChange}
            handleDateChange={this.handleDateChange}
            handleDescChange={this.handleDescChange}
          />
          <Box className={classes.fileUpload}>
            <input
              accept="text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*"
              id="upload-file"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={this.handleFileChange}
            />
            <label htmlFor="upload-file" style={{ display: 'inline' }}>
              <Button
                variant="contained"
                component="span"
              >
                <CloudUploadIcon />
                &nbsp;&nbsp;Upload
              </Button>
            </label>
            {this.state.files.map(file => (
              <span className={classes.fileItem} key={file.name + file.size}>
                {file.name}
                <IconButton
                  onClick={() => this.handleRemove(file)}
                  style={{ padding: '0px' }}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            ))}
          </Box>
          <Box style={{ width: '100%', textAlign: 'center' }}>
            <Button
              color="primary"
              disabled={this.state.isBusy}
              className={classes.submitButton}
              onClick={this.handleAddProject}
            >
              Add Project
            </Button>
          </Box>
          {this.state.isBusy && <CircularProgress className={classes.busy} />}
          <CustomSnackbar
            open={this.state.showMessage}
            variant={this.state.variant}
            message={this.state.message}
            handleClose={() => this.setState({ showMessage: false })}
          />
        </Card>
      </Box>
    );
  }
}

const mapDispatchToProps = {
  addProject,
  addFiles: addFilesToProject,
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles),
)(AddProjectView);

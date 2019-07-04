import Box                        from '@material-ui/core/Box';
import Card                       from '@material-ui/core/Card';
import CircularProgress           from '@material-ui/core/CircularProgress';
import IconButton                 from '@material-ui/core/IconButton';
import Paper                      from '@material-ui/core/Paper';
import {createStyles, withStyles} from '@material-ui/core/styles';
import CloudUploadIcon            from '@material-ui/icons/CloudUpload';
import DeleteIcon                 from '@material-ui/icons/Delete';

import Button             from "components/CustomButtons/Button.jsx";
import CustomInput        from "components/CustomInput/CustomInput.jsx";
import 'easymde/dist/easymde.min.css';
import React, {Component} from 'react';
import {connect}          from 'react-redux';
import {withRouter}       from 'react-router-dom';
import SimpleMDE          from 'react-simplemde-editor';
import {compose}          from "redux";

import {addFilesToProject, addProject} from '../../../actions/global-actions';
import CustomSnackbar                  from '../../../components/shared/CustomSnackbar';

const styles = theme => createStyles({
  root: {
    position: 'relative',
    marginTop: theme.spacing(1),
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
    border: '1px solid #CCC',
  },
});

class AddProjectView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      price: 0,
      description: '',
      isBusy: false,
      files: [],
      showMessage: false,
      message: '',
      variant: 'error',
    };
  }

  handleAddProject = async () => {
    const { userProfile } = this.props;
    const { files, title, description, price } = this.state;
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
    };

    this.setState({ isBusy: true });

    let projectId = null;
    try {
      projectId = await this.props.addProject(
        userProfile.user_metadata.contractor_id,
        projectData
      );
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
    console.log(this.state.files, e.target.files);
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

  handleDescChange = value => {
    this.setState({ description: value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Card className={classes.mainBoard}>
          <CustomInput
            labelText="Project Title"
            id="title"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: this.state.title,
              onChange: val => this.setState({ title: val.target.value })
            }}
          />
          <CustomInput
            labelText="Price"
            id="price"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: this.state.price,
              onChange: val => this.setState({ price: val.target.value })
            }}
          />
          <SimpleMDE
            value={this.state.description}
            onChange={this.handleDescChange}
            options={{
              placeholder: 'Description here',
            }}
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
      </Paper>
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

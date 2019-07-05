import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from "redux";

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import { createStyles, withStyles } from '@material-ui/core/styles';

import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { addFilesToProject, addProject } from 'actions/global-actions';
import CustomSnackbar from 'components/shared/CustomSnackbar';

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
      console.log('Add Project', projectId);
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

  handleDateChange = (date) => {
    this.setState({ dueDate: date });
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
          <Grid container justify="space-around">
            <TextField
              label="Price"
              className={classes.textFieldHalf}
              value={this.state.lastname}
              onChange={val => this.setState({ lastname: val.target.value })}
              margin="normal"
              type='number'
              value={this.state.price}
              onChange={val => this.setState({ price: val.target.value })}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.textFieldHalf}
                margin="normal"
                id="mui-pickers-date"
                label="Date picker"
                value={this.state.dueDate}
                onChange={this.handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
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

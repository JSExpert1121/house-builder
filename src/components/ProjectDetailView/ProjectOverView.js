import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GenContractor from '../Contractor';

import ProjectView from './ProjectView';
import ProjectEditView from './ProjectEditView';
import { updateProject, getProjectData } from 'actions/global-actions';
import CustomSnackbar from 'components/shared/CustomSnackbar';

const styles = theme => ({
  root: {
    position: 'relative'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.palette.primary.light,
    textDecoration: 'none',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: 'calc(50% - 20px)',
  },
});

class ProjectOverView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      title: '',
      price: 0,
      dueDate: new Date(),
      description: '',
      showMessage: false,
      variant: 'success',
      message: '',
      isBusy: false
    };
  }

  setEdit = async (editing, save = true) => {
    if (editing) {
      this.setState({
        editing,
        title: this.props.project.title,
        price: this.props.project.budget,
        dueDate: this.props.project.due,
        description: this.props.project.description
      });
    } else {
      if (save) {
        this.setState({ isBusy: true });
        try {
          const proj = {
            title: this.state.title,
            budget: this.state.price,
            due: this.state.dueDate,
            description: this.state.description
          };

          await this.props.updateProject(this.props.project.id, proj);
          await this.props.getProjectData(this.props.project.id);
          this.setState({
            editing: false,
            showMessage: true,
            variant: 'success',
            message: 'Update Project Success',
            isBusy: false
          });
        } catch (error) {
          this.setState({
            showMessage: true,
            variant: 'error',
            message: 'Update Project failed',
            isBusy: false
          });
          console.log(error);
        }
      } else {
        this.setState({ editing: false });
      }
    }
  }

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

  gotoContractor = (id) => {
    const { match } = this.props;
    if (match.url.includes('gen-contractor')) {
      this.props.history.push(`/gen-contractor/contractor_detail/${id}`);
    }
    if (match.url.includes('s_cont')) {
      this.props.history.push(`/s_cont/contractor_detail/${id}`);
    }
  }

  render() {
    const { classes, project, match } = this.props;
    const { editing, showMessage, variant, message } = this.state;
    if (!project) {
      return <Box>No project is selected</Box>;
    }

    const editFn = match.url.includes('gen-contractor') ? this.setEdit : undefined;
    return (
      <Box className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={9}>
            {!editing && <ProjectView project={project} setEdit={editFn} showFiles={false} />}
            {editing &&
              <ProjectEditView
                title={this.state.title}
                price={this.state.price}
                dueDate={this.state.dueDate}
                description={this.state.description}
                handleDone={(save) => this.setEdit(false, save)}
                handleTitleChange={this.handleTitleChange}
                handlePriceChange={this.handlePriceChange}
                handleDateChange={this.handleDateChange}
                handleDescChange={this.handleDescChange}
              />
            }
          </Grid>
          <Grid item xs={12} md={3}>
            <GenContractor
              contractor={project.genContractor}
              onClick={() => this.gotoContractor(project.genContractor.id)}
            />
          </Grid>
        </Grid>
        {showMessage && <CustomSnackbar
          open={showMessage}
          variant={variant}
          message={message}
          handleClose={() => this.setState({ showMessage: false })}
        />}
        {this.state.isBusy && <CircularProgress className={classes.busy} />}
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  project: state.global_data.project,
})

const mapDispatchToProps = {
  updateProject,
  getProjectData
}


export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(ProjectOverView);

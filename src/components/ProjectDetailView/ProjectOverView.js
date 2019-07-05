import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import GenContractor from '../Contractor/GenContractor';

import ProjectView from './ProjectView';

const styles = theme => ({
  root: {
    padding: theme.spacing(1, 1),
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
});

class ProjectOverView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes, project } = this.props;
    if (!project) {
      return <Box>No project is selected</Box>;
    }

    return (
      <Box className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={8} style={{ paddingLeft: '8px' }}>
            <ProjectView project={project} showFiles={false} />
          </Grid>
          <Grid item xs={12} md={4} style={{ paddingLeft: '8px' }}>
            <GenContractor contractor={project.genContractor} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  project: state.global_data.project,
})

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ProjectOverView);

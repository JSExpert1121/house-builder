import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Switch } from 'react-router-dom';
import { compose } from 'redux';

import { IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getProjectData } from 'actions/global-actions';
import SecuredRoute from 'routers/SecuredRoute';

import ProjectBidders from './ProjectBidders';
import ProjectFiles from './ProjectFiles';
import ProjectOverView from './ProjectOverView';
import ProjectProposals from './ProjectProposals';
import ProjectTemplates from './ProjectTemplates';
import ProposalsCompare from './ProposalsCompare';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  backBtn: {
    color: theme.palette.primary.dark,
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
    flexGrow: 1,
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class ProjectDetailView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const { match } = this.props;
    await this.props.getProjectData(match.params.id);
  }

  handleBack = () => {
    const { match } = this.props;
    if (match.url.includes('gen-contractor'))
      this.props.history.push('/gen-contractor');
    if (match.url.includes('s_cont')) this.props.history.push('/s_cont');
    else if (match.url.includes('projects'))
      this.props.history.push('/projects');
  };

  render() {
    const { classes, match, project, location } = this.props;
    const owner = match.url.includes('/gen-contractor');

    const tabNo = [
      match.url + '/overview',
      match.url + '/files',
      match.url + '/templates',
      match.url + '/proposals',
      match.url + '/bidders',
      match.url + '/compare',
    ];

    let curTabPos = 0;

    for (let i = 0; i < tabNo.length; i++) {
      if (tabNo[i] === location.pathname) {
        curTabPos = i;
        break;
      }
    }

    if (location.pathname === match.url) curTabPos = 0;

    if (!project) return <div />;

    return (
      <div className={classes.root}>
        <Paper square style={{ height: '100%', overflow: 'auto' }}>
          <div style={{ display: 'flex' }}>
            <IconButton className={classes.backBtn} onClick={this.handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Tabs
              value={curTabPos}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="off"
              className={classes.toolbarstyle}
            >
              <Tab
                component={Link}
                to={`${match.url}/overview`}
                label="Overview"
              />
              <Tab component={Link} to={`${match.url}/files`} label="Files" />
              <Tab
                component={Link}
                to={`${match.url}/templates`}
                label="Templates"
              />
              <Tab
                component={Link}
                to={`${match.url}/proposals`}
                label="Proposals"
              />
              <Tab
                component={Link}
                to={`${match.url}/bidders`}
                label="Bidders"
              />
              {owner && (
                <Tab
                  component={Link}
                  to={`${match.url}/compare`}
                  label="Compare"
                />
              )}
            </Tabs>
          </div>

          <Switch>
            <SecuredRoute
              path={`${match.url}/overview`}
              component={ProjectOverView}
            />
            <SecuredRoute
              path={`${match.url}/files`}
              component={ProjectFiles}
            />
            <SecuredRoute
              path={`${match.url}/templates`}
              component={ProjectTemplates}
            />
            <SecuredRoute
              path={`${match.url}/proposals`}
              component={ProjectProposals}
            />
            <SecuredRoute
              path={`${match.url}/bidders`}
              component={ProjectBidders}
            />
            {owner && (
              <SecuredRoute
                path={`${match.url}/compare`}
                component={ProposalsCompare}
              />
            )}
            <Redirect path={`${match.url}`} to={`${match.url}/overview`} />
          </Switch>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.global_data.project,
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    {
      getProjectData,
    }
  )
)(ProjectDetailView);

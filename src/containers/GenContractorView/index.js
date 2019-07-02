import NoSsr                from '@material-ui/core/NoSsr';
import {withStyles}         from '@material-ui/core/styles';
import NavPills             from "components/NavPills/NavPills.jsx";
import React                from 'react';
import {connect}            from 'react-redux';
import {Redirect, Switch}   from 'react-router-dom';
import {compose}            from 'redux';
import ProjectDetailView    from '../../components/ProjectDetailView';
import ProposalDetailView   from '../../components/ProposalDetailView';
import SecuredRoute         from '../../routers/SecuredRoute';
import AddProjectView       from './AddProjectView';
import ContractorDetailView from './ContractorDetailView';
import CurrentProjectView   from './CurrentProjectView';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class GenContView extends React.Component {
  render() {
    const { classes, userProfile, match, location } = this.props;

    const tabNo = {
      '/gen-contractor': 0,
      '/gen-contractor/current_pros': 0,
      '/gen-contractor/add_project': 1,
    };

    let curTabPos = tabNo[location.pathname];

    if (
      location.pathname.includes('proposal_detail') ||
      location.pathname.includes('project_detail')
    )
      curTabPos = 0;

    if (
      !userProfile.user_metadata.roles.includes('Gen') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <NavPills
              color="primary"
              tabs={[
                {
                  tabButton: "Current Projects",
                  href: `${match.url}/current_pros`,
                },
                {
                  tabButton: "Add Project",
                  href: `${match.url}/add_project`,
                }
              ]}
          >
            <Switch>
              <SecuredRoute
                  path={`${match.url}/current_pros`}
                  component={CurrentProjectView}
              />
              <SecuredRoute
                  path={`${match.url}/add_project`}
                  component={AddProjectView}
              />
              <SecuredRoute
                  path={`${match.url}/proposal_detail/:id`}
                  component={ProposalDetailView}
              />
              <SecuredRoute
                  path={`${match.url}/project_detail/:id`}
                  component={ProjectDetailView}
              />
              <SecuredRoute
                  path={`${match.url}/contractor_detail`}
                  component={ContractorDetailView}
              />
              <Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
            </Switch>
          </NavPills>
          {/*<AppBar position="static" color="default">
            <Tabs
              value={curTabPos}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                component={Link}
                to={`${match.url}/current_pros`}
                label="Current Projects"
                icon={<AppsIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/add_project`}
                label="Add Project"
                icon={<PlaylistAddIcon />}
              />
            </Tabs>
          </AppBar>*/}


        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(GenContView);

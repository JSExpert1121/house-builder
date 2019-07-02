import NoSsr                  from '@material-ui/core/NoSsr';
import {withStyles}           from '@material-ui/core/styles';
import NavPills               from "components/NavPills/NavPills.jsx";
import React                  from 'react';
import {connect}              from 'react-redux';
import {Redirect, Switch}     from 'react-router-dom';
import {compose}              from 'redux';
import ProjectDetailView      from '../../components/ProjectDetailView';
import ProposalDetailView     from '../../components/ProposalDetailView';
import SecuredRoute           from '../../routers/SecuredRoute';
import AddProjectView         from './AddProjectView';
import ContractorDetailView   from './ContractorDetailView';
import CurrentProjectView     from './CurrentProjectView';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  }
});

class GenContView extends React.Component {
  render() {
    const { classes, userProfile, match } = this.props;

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

import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ArchiveIcon from '@material-ui/icons/Archive';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { compose } from 'redux';
import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import CustomTabs from "components/shared/CustomTabs";
import ContractorDetailView from 'components/ContractorDetailView';
import SecuredRoute from 'routers/SecuredRoute';
import AddProjectView from './AddProjectView';
import CurrentProjectView from './CurrentProjectView';
import ArchivedProject from './ArchivedProjectView';

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
          <CustomTabs
            tabs={[{
              label: 'Current Projects',
              href: `${match.url}/current_pros`,
              icon: ViewComfyIcon
            }, {
              label: 'Add Project',
              href: `${match.url}/add_project`,
              icon: PlaylistAddIcon
            },
            {
              label: 'Archived',
              href: `${match.url}/archived`,
              icon: ArchiveIcon
            }
            ]}
          />
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
              path={`${match.url}/archived`}
              component={ArchivedProject}
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
              path={`${match.url}/contractor_detail/:id`}
              component={ContractorDetailView}
            />
            <Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
          </Switch>
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

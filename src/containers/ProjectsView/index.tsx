import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import AppsIcon from '@material-ui/icons/Apps';

import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import CustomTabs from 'components/shared/CustomTabs';
import SecuredRoute from 'routers/SecuredRoute';
import CurrentProjectView from './CurrentProjectView/index';
import { UserProfile } from 'types/global'


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  contentWrapper: {
    marginTop: theme.spacing(1),
  },
  buttonAdditional: {
    position: 'absolute',
    float: 'right',
    right: 0,
  }
}));

interface IProjectsViewProps extends RouteComponentProps {
  userProfile: UserProfile;
}

const ProjectsView: React.FunctionComponent<IProjectsViewProps> = (props) => {

  const classes = useStyles({});
  const { userProfile } = props;

  if (!userProfile.user_metadata.roles.includes('Gen') &&
    !userProfile.user_metadata.roles.includes('GenSub') &&
    !userProfile.user_metadata.roles.includes('SuperAdmin')) {
    return <div> Access Forbidden </div>;
  }

  return (
    <Box className={classes.root}>
      <CustomTabs
        tabs={[{
          href: `/projects/current`,
          label: "Current Projects",
          icon: AppsIcon,
        }]}
      />
      <main className={classes.contentWrapper}>
        <Switch>
          <SecuredRoute
            path="/projects/current"
            component={CurrentProjectView}
          />
          <SecuredRoute
            path="/projects/proposal_detail/:id"
            component={ProposalDetailView}
          />
          <SecuredRoute
            path="/projects/project_detail/:id"
            component={ProjectDetailView}
          />
          <Redirect path="/projects" to={`/projects/current`} />
        </Switch>
      </main>
    </Box>
  )
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
})

export default connect(mapStateToProps)(ProjectsView);



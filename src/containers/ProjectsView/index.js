import NoSsr                          from '@material-ui/core/NoSsr';
import {withStyles}                   from '@material-ui/core/styles';
import AppsIcon                       from '@material-ui/icons/Apps';
import React                          from 'react';
import {connect}                      from 'react-redux';
import {Redirect, Switch, withRouter} from 'react-router-dom';
import {compose}                      from 'redux';
import ProjectDetailView              from '../../components/ProjectDetailView';
import ProposalDetailView             from '../../components/ProposalDetailView';
import CustomTabs                     from "../../components/shared/CustomTabs";
import SecuredRoute                   from '../../routers/SecuredRoute';
import CurrentProjectView             from './CurrentProjectView/index';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  contentWrapper: {
    marginTop: theme.spacing(1),
  },
  buttonAdditional: {
    position: 'absolute',
    float: 'right',
    right: '0',
  },
});

class ProjectsView extends React.Component {
  render() {
    const { classes, userProfile } = this.props;
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
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
})

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps)
)(ProjectsView);

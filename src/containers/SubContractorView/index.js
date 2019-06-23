import React                      from 'react';
import { connect }                from 'react-redux';
import { Link, Redirect, Switch } from 'react-router-dom';
import SecuredRoute               from '../../routers/SecuredRoute';

import { withStyles }    from '@material-ui/core/styles';
import AppBar            from '@material-ui/core/AppBar';
import Tabs              from '@material-ui/core/Tabs';
import NoSsr             from '@material-ui/core/NoSsr';
import Tab               from '@material-ui/core/Tab';
import TableChartIcon    from '@material-ui/icons/TableChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TuneIcon          from '@material-ui/icons/Tune';
import AssignmentIcon    from '@material-ui/icons/Assignment';
import SettingsIcon      from '@material-ui/icons/Settings';

import SCVPipelineView      from './SCVPipelineView/index';
import SCVCalendarView      from './SCVCalendarView';
import SCVReportsView       from './SCVReportsView';
import SCVAnalyticsView     from './SCVAnalyticsView';
import SCVSettingsView      from './SCVSettingsView';
import ProposalDetailView   from '../../components/ProposalDetailView';
import ProjectDetailView    from '../../components/ProjectDetailView';
import ContractorDetailView from './ContractorDetailView';

import style       from './index.style';
import { compose } from 'redux';

class SubContractorView extends React.Component {
  render() {
    const { classes, match, userProfile, location } = this.props;

    const tabName = [
      match.url + '/pipeline',
      match.url + '/calendar',
      match.url + '/analytics',
      match.url + '/reports',
      match.url + '/settings',
    ];

    let curTabPos;

    for (let i = 0; i < tabName.length; i++) {
      if (location.pathname.includes(tabName[i])) {
        curTabPos = i;
        break;
      }
    }

    if (
      location.pathname === match.url ||
      location.pathname.includes(match.url + '/proposal_detail')
    )
      curTabPos = 0;

    if (
      !userProfile.user_metadata.roles.includes('Sub') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" className={classes.toolbarstyle}>
            <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
              <Tab
                component={Link}
                to={`${match.url}/pipeline`}
                label="Pipeline"
                icon={<TableChartIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/calendar`}
                label="Calendar"
                icon={<CalendarTodayIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/analytics`}
                label="Analytics"
                icon={<TuneIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/reports`}
                label="Reports"
                icon={<AssignmentIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/settings`}
                label="Setting"
                icon={<SettingsIcon />}
              />
            </Tabs>
          </AppBar>
          <main className={classes.mainWrapper}>
            <Switch>
              <SecuredRoute
                path={`${match.url}/pipeline`}
                component={SCVPipelineView}
              />
              <SecuredRoute
                path={`${match.url}/calendar`}
                component={SCVCalendarView}
              />
              <SecuredRoute
                path={`${match.url}/analytics`}
                component={SCVAnalyticsView}
              />
              <SecuredRoute
                path={`${match.url}/reports`}
                component={SCVReportsView}
              />
              <SecuredRoute
                path={`${match.url}/settings`}
                component={SCVSettingsView}
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
              <Redirect path="/s_cont" to={`${match.url}/pipeline`} />
            </Switch>
          </main>
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  connect(mapStateToProps),
  withStyles(style)
)(SubContractorView);

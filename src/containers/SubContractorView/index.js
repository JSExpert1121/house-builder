import NoSsr from '@material-ui/core/NoSsr';
import {withStyles}         from '@material-ui/core/styles';
import AssignmentIcon       from '@material-ui/icons/Assignment';
import CalendarTodayIcon    from '@material-ui/icons/CalendarToday';
import SettingsIcon         from '@material-ui/icons/Settings';
import TableChartIcon       from '@material-ui/icons/TableChart';
import TuneIcon             from '@material-ui/icons/Tune';
import React                from 'react';
import {connect}            from 'react-redux';
import {Redirect, Switch}   from 'react-router-dom';
import {compose}            from 'redux';
import ProjectDetailView    from '../../components/ProjectDetailView';
import ProposalDetailView   from '../../components/ProposalDetailView';
import CustomTabs           from "../../components/shared/CustomTabs";
import SecuredRoute         from '../../routers/SecuredRoute';
import ContractorDetailView from './ContractorDetailView';

import style            from './index.style';
import SCVAnalyticsView from './SCVAnalyticsView';
import SCVCalendarView  from './SCVCalendarView';

import SCVPipelineView from './SCVPipelineView/index';
import SCVReportsView  from './SCVReportsView';
import SCVSettingsView from './SCVSettingsView';

class SubContractorView extends React.Component {
  render() {
    const { classes, match, userProfile } = this.props;

    if (
      !userProfile.user_metadata.roles.includes('Sub') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <CustomTabs
            tabs={[
              {
                href: `${match.url}/pipeline`,
                label: 'Pipeline',
                icon: TableChartIcon,
              },
              {
                href: `${match.url}/calendar`,
                label: 'Calendar',
                icon: CalendarTodayIcon,
              },
              {
                href: `${match.url}/analytics`,
                label: 'Analytics',
                icon: TuneIcon,
              },
              {
                href: `${match.url}/reports`,
                label: 'Reports',
                icon: AssignmentIcon,
              },
              {
                href: `${match.url}/settings`,
                label: 'Setting',
                icon: SettingsIcon,
              },
            ]}
          />
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

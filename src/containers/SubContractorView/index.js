import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../routers/SecuredRoute';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import TableChartIcon from '@material-ui/icons/TableChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TuneIcon from '@material-ui/icons/Tune';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';

import SCVPipelineView from './SCVPipelineView/index';
import SCVCalendarView from './SCVCalendarView';
import SCVReportsView from './SCVReportsView';
import SCVAnalyticsView from './SCVAnalyticsView';
import SCVSettingsView from './SCVSettingsView';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},
	buttonAdditional: {
		position: "absolute",
		float: "right",
		right: "0"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedSubContView extends React.Component {
	constructor(props) {
		super(props);
	}

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

		if (location.pathname === match.url || location.pathname.includes(match.url + '/proposal_detail'))
			curTabPos = 0;

		if (!userProfile.user_metadata.roles.includes("Sub") &&
			!userProfile.user_metadata.roles.includes("GenSub") &&
			!userProfile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							variant="scrollable"
							scrollButtons="on">

							<Tab component={Link} to={`${match.url}/pipeline`} label="Pipeline" icon={<TableChartIcon />} />
							<Tab component={Link} to={`${match.url}/calendar`} label="Calendar" icon={<CalendarTodayIcon />} />
							<Tab component={Link} to={`${match.url}/analytics`} label="Analytics" icon={<TuneIcon />} />
							<Tab component={Link} to={`${match.url}/reports`} label="Reports" icon={<AssignmentIcon />} />
							<Tab component={Link} to={`${match.url}/settings`} label="Setting" icon={<SettingsIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path={`${match.url}/pipeline`} component={SCVPipelineView} />
						<SecuredRoute path={`${match.url}/calendar`} component={SCVCalendarView} />
						<SecuredRoute path={`${match.url}/analytics`} component={SCVAnalyticsView} />
						<SecuredRoute path={`${match.url}/reports`} component={SCVReportsView} />
						<SecuredRoute path={`${match.url}/settings`} component={SCVSettingsView} />
						<Redirect path='/s_cont' to={`${match.url}/pipeline`} />
					</Switch>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
	};
};

const mapDispatchToProps = dispatch => {
	return {

	};
};

const SubContractorView = connect(mapStateToProps, mapDispatchToProps)(ConnectedSubContView);

SubContractorView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SubContractorView));
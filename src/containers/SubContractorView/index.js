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

import SCVPipelineView from './SCVPipelineView';
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
		const { classes, userProfile, location } = this.props;

		const tabNo = {
			'/s_cont': 0,
			'/s_cont/pipeline': 0,
			'/s_cont/calendar': 1,
			'/s_cont/analytics': 2,
			'/s_cont/reports': 3,
			'/s_cont/settings': 4
		};

		const curTabPos = tabNo[location.pathname];

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
							onChange={this.handleTabChange}
							variant="scrollable"
							scrollButtons="on">

							<Tab component={Link} to={`/s_cont/pipeline`} label="Pipeline" icon={<TableChartIcon />} />
							<Tab component={Link} to={`/s_cont/calendar`} label="Calendar" icon={<CalendarTodayIcon />} />
							<Tab component={Link} to={`/s_cont/analytics`} label="Analytics" icon={<TuneIcon />} />
							<Tab component={Link} to={`/s_cont/reports`} label="Reports" icon={<AssignmentIcon />} />
							<Tab component={Link} to={`/s_cont/settings`} label="Setting" icon={<SettingsIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/s_cont/pipeline' component={SCVPipelineView} />
						<SecuredRoute path='/s_cont/calendar' component={SCVCalendarView} />
						<SecuredRoute path='/s_cont/analytics' component={SCVAnalyticsView} />
						<SecuredRoute path='/s_cont/reports' component={SCVReportsView} />
						<SecuredRoute path='/s_cont/settings' component={SCVSettingsView} />
						<Redirect path='/s_cont' to={`/s_cont/pipeline`} />
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
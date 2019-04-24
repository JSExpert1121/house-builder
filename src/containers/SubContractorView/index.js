import React from 'react';
import { connect } from 'react-redux';

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

import SCVPipelineView from '../../components/SCVPipelineView';
import SCVCalendarView from '../../components/SCVCalendarView';
import SCVReportsView from '../../components/SCVReportsView';
import SCVAnalyticsView from '../../components/SCVAnalyticsView';
import { CircularProgress } from '@material-ui/core';
import auth0Client from '../../auth0/auth';

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
	}
});

class ConnectedSubContView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curTabPos: 0,
			profile: null
		};
	}

	async componentWillMount() {
		const userProfile = auth0Client.userProfile;
		if (!userProfile) {
			await auth0Client.getProfile((profile) => {
				this.setState({
					profile: profile
				});
			});
		} else {
			this.setState({
				profile: userProfile
			});
		}
	}

	handleTabChange = (event, value) => {
		this.setState({
			curTabPos: value
		});
	}

	render() {
		const { classes } = this.props;
		const { curTabPos } = this.state;
		const profile = this.state.profile;

		if (profile === null)
			return (<div> <CircularProgress /></div>);

		if (profile.app_metadata.role !== "SuperAdmin" && profile.app_metadata.role !== "Sub")
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

							<Tab label="Pipeline" icon={<TableChartIcon />} />
							<Tab label="Calendar" icon={<CalendarTodayIcon />} />
							<Tab label="Analytics" icon={<TuneIcon />} />
							<Tab label="Reports" icon={<AssignmentIcon />} />
							<Tab label="Setting" icon={<SettingsIcon />} />
						</Tabs>
					</AppBar>

					{curTabPos === 0 && <SCVPipelineView />}
					{curTabPos === 1 && <SCVCalendarView />}
					{curTabPos === 2 && <SCVAnalyticsView />}
					{curTabPos === 3 && <SCVReportsView />}
					{curTabPos === 4 && <div />}
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
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

export default withStyles(styles)(SubContractorView);
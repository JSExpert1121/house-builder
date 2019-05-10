import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../routers/SecuredRoute';

// Redux
import { connect } from 'react-redux';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { CircularProgress } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import DoneAllIcon from '@material-ui/icons/DoneAll';

// local components
import CurrentProjectView from './CurrentProjectView/index';
import ProjectDetailView from './ProjectDetailView/index';
import ProposalDetailView from './ProposalDetailView/index';

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

class ConnectedGenContView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes, userProfile, location } = this.props;
		
		const tabNo = {
			'/g_cont': 0,
			'/g_cont/current_pros': 0,
			'/g_cont/project_detail': 1,
			'/g_cont/propose_detail': 2
		};

		const curTabPos = tabNo[location.pathname];

		if (!userProfile.user_metadata.roles.includes("Gen") &&
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

							<Tab component={Link} to={`/g_cont/current_pros`} label="Current Projects" icon={<AppsIcon />} />
							<Tab component={Link} to={`/g_cont/project_detail`} label="Project Detail" icon={<BallotIcon />} />
							<Tab component={Link} to={`/g_cont/propose_detail`} label="Proposal Detail" icon={<DoneAllIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/g_cont/current_pros' component={CurrentProjectView} />
						<SecuredRoute path='/g_cont/project_detail' component={ProjectDetailView} />
						<SecuredRoute path='/g_cont/propose_detail' component={ProposalDetailView} />
						<Redirect path='/g_cont' to={`/g_cont/current_pros`} />
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

const GeneralContractorView = connect(mapStateToProps, null)(ConnectedGenContView);

GeneralContractorView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(GeneralContractorView));
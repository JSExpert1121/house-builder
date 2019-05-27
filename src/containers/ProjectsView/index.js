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
import ProposalDetailView from './ProposalDetailView';

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
			'/a_pros': 0,
			'/a_pros/current_pros': 0,
			'/a_pros/project_detail': 1,
			'/a_pros/proposal_detail/v': 2,
			'/a_pros/proposal_detail/c': 2,
		};

		let curTabPos = tabNo[location.pathname];
		if(location.pathname.includes("/a_pros/project_detail"))
			curTabPos = 1;

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

							<Tab component={Link} to={`/a_pros/current_pros`} label="Current Projects" icon={<AppsIcon />} />
							<Tab component={Link} to={`/a_pros/project_detail`} label="Project Detail" icon={<BallotIcon />} />
							<Tab component={Link} to={`/a_pros/proposal_detail/v`} label="Proposal Detail" icon={<BallotIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/a_pros/current_pros' component={CurrentProjectView} />
						<SecuredRoute path='/a_pros/project_detail' component={ProjectDetailView} />
						<SecuredRoute path='/a_pros/proposal_detail/:mode' component={ProposalDetailView} />
						<Redirect path='/a_pros' to={`/a_pros/current_pros`} />
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
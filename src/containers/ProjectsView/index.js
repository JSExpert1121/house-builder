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
import AppsIcon from '@material-ui/icons/Apps';

// local components
import CurrentProjectView from './CurrentProjectView/index';
import ProjectDetailView from '../../components/ProjectDetailView';
import ProposalDetailView from '../../components/ProposalDetailView';

const styles = theme => ({
	"@global": {
		".MuiTab-labelIcon": {
			margin: '0px',
			lineHeight: '1',
			padding: '0px',
			minHeight: '56px',
			'& .MuiTab-wrapper': {
				'& > *:first-child': {
					marginBottom: '0px'
				}
			}
		},
	},
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
		};

		let curTabPos = tabNo[location.pathname];
		//if (location.pathname.includes("/a_pros/project_detail"))
		curTabPos = 0;

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
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/a_pros/current_pros' component={CurrentProjectView} />
						<SecuredRoute path="/a_pros/proposal_detail/:id" component={ProposalDetailView} />
						<SecuredRoute path="/a_pros/project_detail/:id" component={ProjectDetailView} />
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
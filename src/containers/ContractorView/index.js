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
import { CircularProgress } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

// local components
import AllContractorsView from './AllContractorsView';
import ContractorDetailView from './ContractorDetailView';
// import CategoryDetailView from './CategoryDetailView';
// import OptionDetailView from './OptionDetailView';

// local components

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedTemplatesView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes, userProfile, location } = this.props;

		const tabNo = {
			'/m_cont': 0,
			'/m_cont/all_contractors': 0,
			'/m_cont/contractor_detail': 1,
			// '/m_temp/category_detail': 2,
			// '/m_temp/option_detail': 3,
		};

		const curTabPos = tabNo[location.pathname];

		if (!userProfile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							variant="scrollable"
							scrollButtons="on">

							<Tab component={Link} to={`/m_cont/all_contractors`} label="All Contractors" icon={<AppsIcon />} />
							<Tab component={Link} to={`/m_cont/contractor_detail`} label="Contractor Detail" icon={<BallotIcon />} />
							{/* <Tab component={Link} to={`/m_temp/category_detail`} label="Category Detail" icon={<ViewHeadlineIcon />} />
							<Tab component={Link} to={`/m_temp/option_detail`} label="Option Detail" icon={<ViewHeadlineIcon />} /> */}
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/m_cont/all_contractors' component={AllContractorsView} />
						<SecuredRoute path='/m_cont/contractor_detail' component={ContractorDetailView} />
						{/* <SecuredRoute path='/m_temp/category_detail' component={CategoryDetailView} />
						<SecuredRoute path='/m_temp/option_detail' component={OptionDetailView} /> */}
						<Redirect path='/m_cont' to={`/m_cont/all_contractors`} />
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

const TemplatesView = connect(mapStateToProps, null)(ConnectedTemplatesView);

TemplatesView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TemplatesView));
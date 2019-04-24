import React from 'react';
import { Route, Switch, withRouter, } from 'react-router-dom';

import Header from 'components/Header';
import HomePage from 'components/HomePage';
import BidderListingView from 'containers/BidderListingView';
import SubContractorView from 'containers/SubContractorView';
import GeneralContractorView from 'containers/GeneralContractorView';
import ProfileView from 'components/ProfileView';
import SettingsView from 'components/SettingsView';
import NotFoundPage from 'components/NotFoundPage';
import Callback from '../callback';

import MenuList from 'components/MenuList';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SecuredRoute from './SecuredRoute';
import auth0Client from '../Auth';
import ManageTemplateView from '../containers/ManageTemplateView';

const styles = theme => ({
	viewarea: {
		width: "calc(100% - 60px)",
		float: 'left',
		borderRadius: "0",
		height: 'calc(100vh - 64px)',
		[theme.breakpoints.up('md')]: {
			width: '85%',
		}
	}
});

class AppRouter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checkingSession: true,
		}
	}
	async componentDidMount() {
		if (this.props.location.pathname === '/callback' || auth0Client.isAuthenticated()) {
			this.setState({ checkingSession: false });
			return;
		}
		try {
			await auth0Client.silentAuth();
			this.forceUpdate();
		} catch (err) {
			if (err.error !== 'login_required') console.log(err.error);
		}
		this.setState({ checkingSession: false });
	}
	render() {
		const { classes } = this.props;
		return (
			<div>
				<Header />
				<MenuList />
				<Card className={classes.viewarea}>
					<Switch>
						<Route path="/" component={HomePage} exact={true} />
						<SecuredRoute path="/bid_list_view" component={BidderListingView} checkingSession={this.state.checkingSession} />
						<SecuredRoute path="/sub_cont_view" component={SubContractorView} checkingSession={this.state.checkingSession} />
						<SecuredRoute path="/gen_cont_view" component={GeneralContractorView} checkingSession={this.state.checkingSession} />
						<SecuredRoute path="/man_temp_view" component={ManageTemplateView} checkingSession={this.state.checkingSession} />
						<SecuredRoute path="/profile" component={ProfileView} checkingSession={this.state.checkingSession} />
						<SecuredRoute path="/settings" component={SettingsView} checkingSession={this.state.checkingSession} />
						<Route exact path='/callback' component={Callback} />
						<Route component={NotFoundPage} />
					</Switch>
				</Card>
			</div>
		);
	}
};

AppRouter.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AppRouter));
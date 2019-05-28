import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';

// Material import 
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';

// local import
import GenContractorView from '../containers/GenContractorView';
import SubContractorView from '../containers/SubContractorView';
import BidderListingView from '../containers/BidderListingView';
import TemplatesView from '../containers/TemplateView';
import SpecialtyView from '../containers/SpecialtyView';
import ContractorView from '../containers/ContractorView';
import ProjectsView from '../containers/ProjectsView';
import HomeView from '../containers/HomeView';
import ProfileView from '../containers/ProfileView';
import SettingsView from '../components/SettingsView';
import MenuList from '../components/MenuList';
import Header from '../components/Header';
import Callback from '../auth0/callback';
import auth0Client from '../auth0/auth';

// Redux 
import { connect } from 'react-redux';
import { setUserProfile } from '../actions';
import { CircularProgress } from '@material-ui/core/es';

import SecuredRoute from './SecuredRoute';

const styles = theme => ({
	viewarea: {
		width: "calc(100% - 60px)",
		float: 'left',
		borderRadius: "0",
		height: 'calc(100vh - 64px)',
		[theme.breakpoints.up('md')]: {
			width: '85%',
		}
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50vw - 10px)",
		top: "calc(50vh - 10px)",
	}
});

class AppRouterConnect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checkingSession: true
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

		if (auth0Client.isAuthenticated()) {
			try {
				await auth0Client.getProfile((profile) => this.props.setUserProfile(profile));
			} catch (err) {
				console.log(err.error);
			}
		}

		this.setState({ checkingSession: false });
	}
	render() {
		const { userProfile, classes } = this.props;
		if (this.state.checkingSession || (auth0Client.isAuthenticated() && userProfile === null)) return <CircularProgress className={classes.waitingSpin} />;

		return (
			<div>
				<Header />
				<MenuList />
				<Card className={classes.viewarea}>
					<Switch>
						<Route exact path='/' component={HomeView} />
						<SecuredRoute path='/g_cont' component={GenContractorView} />
						<SecuredRoute path='/s_cont' component={SubContractorView} />
						<SecuredRoute path='/b_list' component={BidderListingView} />
						<SecuredRoute path='/a_pros' component={ProjectsView} />
						<SecuredRoute path='/m_temp' component={TemplatesView} />
						<SecuredRoute path='/m_spec' component={SpecialtyView} />
						<SecuredRoute path='/m_cont' component={ContractorView} />
						<SecuredRoute path="/profile" component={ProfileView} />
						<SecuredRoute path="/settings" component={SettingsView} />
						<Route exact path='/callback' component={Callback} />
						<Redirect to="/" />
					</Switch>
				</Card>
			</div>
		);
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setUserProfile: profile => dispatch(setUserProfile(profile))
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const AppRouter = connect(mapStateToProps, mapDispatchToProps)(AppRouterConnect);

AppRouter.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AppRouter));
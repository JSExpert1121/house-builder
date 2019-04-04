import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import Header from 'components/Header';
import HomePage from 'components/HomePage';
import BidderListingView from 'components/BidderListingView';
import SubContractorView from 'components/SubContractorView';
import GeneralContractorView from 'components/GeneralContractorView';
import NotFoundPage from 'components/NotFoundPage';

import MenuList from 'components/MenuList';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	viewarea: {
		width: '83%',
		float: 'left', 
		borderRadius: "0",
		padding: "0 1% 0 1%",
		height: 'calc(100vh - 64px - 20px)'
	}
}

class AppRouter extends React.Component {
	
	render() {
		const { classes } = this.props;
		return(
			<BrowserRouter>
				<div>
					<Header />
					<MenuList />
					<Card className = {classes.viewarea}>
						<Switch>
							<Route path="/" component={HomePage} exact={true} />
							<Route path="/bid_list_view" component={BidderListingView} />
							<Route path="/sub_cont_view" component={SubContractorView} />
							<Route path="/gen_cont_view" component={GeneralContractorView} />
							<Route component={NotFoundPage} />
						</Switch>
					</Card>
				</div>
			</BrowserRouter>
		);
	}
};

AppRouter.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppRouter);
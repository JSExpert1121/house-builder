import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import Header from 'components/Header';
import HomePage from 'components/HomePage';
import BidderListingView from 'components/BidderListingView';
import SubContractorView from 'components/SubContractorView';
import GeneralContractorView from 'components/GeneralContractorView';
import NotFoundPage from 'components/NotFoundPage';

import MenuList from 'components/MenuList';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	viewarea: {
		width: '83%',
		float: 'left', 
		padding: "1% 1% 1% 1%"
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
					<div className = {classes.viewarea}>
						<Switch>
							<Route path="/" component={HomePage} exact={true} />
							<Route path="/bid_list_view" component={BidderListingView} />
							<Route path="/sub_cont_view" component={SubContractorView} />
							<Route path="/gen_cont_view" component={GeneralContractorView} />
							<Route component={NotFoundPage} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		);
	}
};

AppRouter.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppRouter);
import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import Header from 'components/Header';
import HomePage from 'components/HomePage';
import BidderListingView from 'components/BidderListingView';
import SubContractorView from 'components/SubContractorView';
import GeneralContractorView from 'components/GeneralContractorView';
import NotFoundPage from 'components/NotFoundPage';

const AppRouter = () => (
	<BrowserRouter>
		<div>
			<Header />
			<Switch>
				<Route path="/" component={HomePage} exact={true} />
				<Route path="/bid_list_view" component={BidderListingView} />
				<Route path="/sub_cont_view" component={SubContractorView} />
				<Route path="/gen_cont_view" component={GeneralContractorView} />
				<Route component={NotFoundPage} />
			</Switch>
		</div>
	</BrowserRouter>
);
export default AppRouter;
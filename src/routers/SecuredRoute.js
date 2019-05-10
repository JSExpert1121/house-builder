import React from 'react';
import { Route } from 'react-router-dom';
import auth0Client from '../auth0/auth';

function SecuredRoute(props) {
	const { component: Component, path } = props;

	if (!auth0Client.isAuthenticated()) {
		auth0Client.signIn();
		return <div> Please Sign In</div>;
	}
	return (
		<Route path={path} component={Component} />
	);
}

export default SecuredRoute;
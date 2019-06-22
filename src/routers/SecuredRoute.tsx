import React       from 'react';
import { Route }   from 'react-router-dom';
import auth0Client from '../auth0/auth';

const SecuredRoute = ({ component: Component, ...rest }) => {
  if (!auth0Client.isAuthenticated()) {
    auth0Client.signIn();
    return <div> Please Sign In</div>;
  }
  return <Route {...rest} component={Component} />;
};

export default SecuredRoute;

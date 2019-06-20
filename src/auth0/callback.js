import React, {Component} from 'react';
import {withRouter}       from 'react-router-dom';
import auth0Client        from '../auth0/auth';

import {connect}          from 'react-redux';
import {setUserProfile}   from '../actions';
import {CircularProgress} from '@material-ui/core/es';

class connectedCallback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    await auth0Client.getProfile(profile => this.props.setUserProfile(profile));
    this.props.history.replace('/');
  }

  render() {
    return <CircularProgress />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserProfile: profile => dispatch(setUserProfile(profile)),
  };
};

const mapStateToProps = state => {
  return {};
};

const Callback = connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedCallback);

export default withRouter(Callback);

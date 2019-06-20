import React                          from 'react';
import {Redirect, Switch, withRouter} from 'react-router-dom';
import SecuredRoute                   from '../../routers/SecuredRoute';
// Redux
import {connect}                      from 'react-redux';
// material ui
import PropTypes                      from 'prop-types';
import {withStyles}                   from '@material-ui/core/styles';
import NoSsr                          from '@material-ui/core/NoSsr';
// local components
import ContractorDetailView           from './ContractorDetailView';
import SearchBidderListView           from './SearchBidderListView';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class ConnectedBidderListingView extends React.Component {
  render() {
    const { classes, userProfile, match } = this.props;

    if (
      !userProfile.user_metadata.roles.includes('Gen') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <Switch>
            <SecuredRoute
              path={`${match.url}/search_bidder`}
              component={SearchBidderListView}
            />
            <SecuredRoute
              path={`${match.url}/contractor_detail`}
              component={ContractorDetailView}
            />
            <Redirect path={`${match.url}`} to={`${match.url}/search_bidder`} />
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

const BidderListingView = connect(
  mapStateToProps,
  null
)(ConnectedBidderListingView);

BidderListingView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(BidderListingView));

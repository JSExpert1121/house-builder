import React                from 'react';
import { Redirect, Switch } from 'react-router-dom';
import SecuredRoute         from '../../routers/SecuredRoute';
import { connect }          from 'react-redux';
import { withStyles }       from '@material-ui/core/styles';
import NoSsr                from '@material-ui/core/NoSsr';
import ContractorDetailView from './ContractorDetailView';
import SearchBidderListView from './SearchBidderListView';
import { compose }          from 'redux';

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

class BidderListingView extends React.Component {
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

const mapStateToProps = state => ({userProfile: state.global_data.userProfile});

export default compose(
  connect(
    mapStateToProps
  ),
  withStyles(styles)
)(BidderListingView)

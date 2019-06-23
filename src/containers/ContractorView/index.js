import React                      from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import SecuredRoute               from '../../routers/SecuredRoute';
import { connect }                from 'react-redux';
import { withStyles }             from '@material-ui/core/styles';
import AppBar                     from '@material-ui/core/AppBar';
import Tabs                       from '@material-ui/core/Tabs';
import NoSsr                      from '@material-ui/core/NoSsr';
import Tab                        from '@material-ui/core/Tab';
import AppsIcon                   from '@material-ui/icons/Apps';
import AllContractorsView         from './AllContractorsView';
import ContractorDetailView       from './ContractorDetailView';
import { compose }                from 'redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  contentWrapper: {
    marginTop: theme.spacing(1)
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

class TemplatesView extends React.Component {
  render() {
    const { classes, userProfile, location } = this.props;

    const tabNo = {
      '/m_cont': 0,
      '/m_cont/all_contractors': 0,
    };

    let curTabPos = tabNo[location.pathname];
    curTabPos = 0;

    if (!userProfile.user_metadata.roles.includes('SuperAdmin'))
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" className={classes.toolbarstyle}>
            <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
              <Tab
                component={Link}
                to={`/m_cont/all_contractors`}
                label="All Contractors"
                icon={<AppsIcon />}
              />
            </Tabs>
          </AppBar>

          <main className={classes.contentWrapper}>
            <Switch>
              <SecuredRoute
                path="/m_cont/all_contractors"
                component={AllContractorsView}
              />
              <SecuredRoute
                path="/m_cont/contractor_detail"
                component={ContractorDetailView}
              />
              <Redirect path="/m_cont" to={`/m_cont/all_contractors`} />
            </Switch>
          </main>
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
})

export default compose(
  connect(
    mapStateToProps,
    null
  ),
  withStyles(styles)
)(TemplatesView)

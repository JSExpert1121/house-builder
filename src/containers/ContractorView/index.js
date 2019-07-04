import NoSsr                from '@material-ui/core/NoSsr';
import {withStyles}         from '@material-ui/core/styles';
import AppsIcon             from '@material-ui/icons/Apps';
import React                from 'react';
import {connect}            from 'react-redux';
import {Redirect, Switch}   from 'react-router-dom';
import {compose}            from 'redux';
import CustomTabs           from '../../components/shared/CustomTabs';
import SecuredRoute         from '../../routers/SecuredRoute';
import AllContractorsView   from './AllContractorsView';
import ContractorDetailView from './ContractorDetailView';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  contentWrapper: {
    marginTop: theme.spacing(1),
  },
});

class TemplatesView extends React.Component {
  render() {
    const { classes, userProfile } = this.props;
    if (!userProfile.user_metadata.roles.includes('SuperAdmin'))
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <CustomTabs
            tabs={[
              {
                href: `/m_cont/all_contractors`,
                label: 'All Contractors',
                icon: AppsIcon,
              },
            ]}
          />
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
});

export default compose(
  connect(
    mapStateToProps,
  ),
  withStyles(styles)
)(TemplatesView);

import {NoSsr, withStyles}                      from '@material-ui/core';
import {Apps as AppsIcon, Ballot as BallotIcon} from '@material-ui/icons';
import {createStyles}                           from '@material-ui/styles';
import React, {Component}                       from 'react';
import {connect}                                from 'react-redux';
import {Redirect, Switch, withRouter}           from 'react-router-dom';
import {compose}                                from 'redux';
import CustomTabs                               from '../../components/shared/CustomTabs';
import SecuredRoute                             from '../../routers/SecuredRoute';
import AllSpecialties                           from './AllSpecialties';
import SpecialtyDetailView                      from './SpecialtyDetailView';

const styles = theme =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    contentWrapper: {
      marginTop: theme.spacing(1),
    },
  });

export class SpecialtyView extends Component {
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
                href: `/m_spec/all_specialties`,
                label: 'All Specialties',
                icon: AppsIcon,
              },
              {
                href: `/m_spec/specialty_detail`,
                label: 'Specialty Detail',
                icon: BallotIcon,
              },
            ]}
          />
          <main className={classes.contentWrapper}>
            <Switch>
              <SecuredRoute
                path="/m_spec/all_specialties"
                component={AllSpecialties}
              />
              <SecuredRoute
                path="/m_spec/specialty_detail"
                component={SpecialtyDetailView}
              />
              <Redirect path="/m_spec" to={`/m_spec/all_specialties`} />
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
  withRouter,
  withStyles(styles),
  connect(mapStateToProps)
)(SpecialtyView);

import React                             from 'react';
import { Link, Redirect, Switch }        from 'react-router-dom';
import SecuredRoute                      from '../../routers/SecuredRoute';
import { connect }                       from 'react-redux';
import { Theme, withStyles }             from '@material-ui/core/styles';
import AppBar                            from '@material-ui/core/AppBar';
import Tabs                              from '@material-ui/core/Tabs';
import NoSsr                             from '@material-ui/core/NoSsr';
import Tab                               from '@material-ui/core/Tab';
import AppsIcon                          from '@material-ui/icons/Apps';
import BallotIcon                        from '@material-ui/icons/Ballot';
import ViewHeadlineIcon                  from '@material-ui/icons/ViewHeadline';
import AllTemplatesView                  from './AllTemplatesView';
import TempDetailView                    from './TempDetailView';
import CategoryDetailView                from './CategoryDetailView';
import OptionDetailView                  from './OptionDetailView';
import { MaterialThemeHOC, UserProfile } from '../../types/global';

const styles = (theme: Theme) => ({
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

interface TemplatesViewProps extends MaterialThemeHOC {
  userProfile: UserProfile;
  location: Location;
}

class TemplatesView extends React.Component<TemplatesViewProps> {
  render() {
    const { classes, userProfile, location } = this.props;
    const tabNo = {
      '/m_temp': 0,
      '/m_temp/all_templates': 0,
      '/m_temp/template_detail': 1,
      '/m_temp/category_detail': 2,
      '/m_temp/option_detail': 3,
    };

    const curTabPos = tabNo[location.pathname];

    if (!userProfile.user_metadata.roles.includes('SuperAdmin'))
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" className={classes.toolbarstyle}>
            <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
              <Tab
                component={Link}
                to={`/m_temp/all_templates`}
                label="All Templates"
                icon={<AppsIcon />}
              />
              <Tab
                component={Link}
                to={`/m_temp/template_detail`}
                label="Template Detail"
                icon={<BallotIcon />}
              />
              <Tab
                component={Link}
                to={`/m_temp/category_detail`}
                label="Category Detail"
                icon={<ViewHeadlineIcon />}
              />
              <Tab
                component={Link}
                to={`/m_temp/option_detail`}
                label="Option Detail"
                icon={<ViewHeadlineIcon />}
              />
            </Tabs>
          </AppBar>

          <Switch>
            <SecuredRoute
              path="/m_temp/all_templates"
              component={AllTemplatesView}
            />
            <SecuredRoute
              path="/m_temp/template_detail"
              component={TempDetailView}
            />
            <SecuredRoute
              path="/m_temp/category_detail"
              component={CategoryDetailView}
            />
            <SecuredRoute
              path="/m_temp/option_detail"
              component={OptionDetailView}
            />
            <Redirect path="/m_temp" to={`/m_temp/all_templates`} />
          </Switch>
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

const ConnectedTemplatesView = connect(mapStateToProps)(TemplatesView);

export default withStyles({ ...styles })(ConnectedTemplatesView);

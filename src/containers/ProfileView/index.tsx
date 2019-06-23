import React                               from 'react';
import { Link, Switch }                    from 'react-router-dom';
import SecuredRoute                        from '../../routers/SecuredRoute';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import AppBar                              from '@material-ui/core/AppBar';
import Tabs                                from '@material-ui/core/Tabs';
import NoSsr                               from '@material-ui/core/NoSsr';
import Tab                                 from '@material-ui/core/Tab';

import BallotIcon        from '@material-ui/icons/Ballot';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import ProfileEditView      from './ProfileEditView';
import ProfileFileView      from './ProfileFileView';
import { MaterialThemeHOC } from '../../types/global';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  buttonAdditional: {
    position: 'absolute',
    float: 'right',
    right: '0',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

const PROFILE_OVERVIEW = '/profile';
const PROFILE_CONTRACT = '/profile/files';

interface ProfileViewProps extends MaterialThemeHOC {
  location: Location;
}

class ProfileView extends React.Component<ProfileViewProps> {
  render() {
    const { classes, location } = this.props;
    const URLS = ['/profile', '/profile/files'];

    let curTabPos = URLS.indexOf(location.pathname);
    if (curTabPos < 0) curTabPos = 0;
    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" className={classes.toolbarstyle}>
            <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
              <Tab
                component={Link}
                to={PROFILE_OVERVIEW}
                label="Profile Detail"
                icon={<AccountCircleIcon />}
              />
              <Tab
                component={Link}
                to={PROFILE_CONTRACT}
                label="Files"
                icon={<BallotIcon />}
              />
            </Tabs>
          </AppBar>

          <Switch>
            <SecuredRoute
              exact
              path={PROFILE_OVERVIEW}
              component={ProfileEditView}
            />
            <SecuredRoute path={PROFILE_CONTRACT} component={ProfileFileView} />
          </Switch>
        </div>
      </NoSsr>
    );
  }
}

export default withStyles(styles)(ProfileView);

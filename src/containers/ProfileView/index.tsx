import NoSsr                               from '@material-ui/core/NoSsr';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import AccountCircleIcon                   from '@material-ui/icons/AccountCircle';
import BallotIcon                          from '@material-ui/icons/Ballot';
import CustomTabs                          from "components/shared/CustomTabs";
import React                               from 'react';
import { Switch }                          from 'react-router-dom';
import SecuredRoute                        from '../../routers/SecuredRoute';
import { MaterialThemeHOC }                from 'types/global';

import ProfileEditView from './ProfileEditView';
import ProfileFileView from './ProfileFileView';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  });

const PROFILE_OVERVIEW = '/profile';
const PROFILE_CONTRACT = '/profile/files';

interface ProfileViewProps extends MaterialThemeHOC {
  location: Location;
}

class ProfileView extends React.Component<ProfileViewProps> {
  render() {
    const { classes } = this.props;

    return (
      <NoSsr>
        <div className={classes.root}>
          <CustomTabs
            tabs={[
              {
                href: { PROFILE_OVERVIEW },
                label: 'Profile Detail',
                icon: AccountCircleIcon,
              },
              {
                href: { PROFILE_CONTRACT },
                label: 'Files',
                icon: BallotIcon,
              },
            ]}
          />
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

import NoSsr                               from '@material-ui/core/NoSsr';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import AppsIcon                            from '@material-ui/icons/Apps';
import BallotIcon                          from '@material-ui/icons/Ballot';
import ViewHeadlineIcon                  from '@material-ui/icons/ViewHeadline';
import CustomTabs                        from 'components/shared/CustomTabs';
import React                             from 'react';
import { connect }                       from 'react-redux';
import { Redirect, Switch }              from 'react-router-dom';
import { compose }                       from 'redux';
import SecuredRoute                      from '../../routers/SecuredRoute';
import { MaterialThemeHOC, UserProfile } from 'types/global';
import AllTemplatesView                  from './AllTemplatesView';
import CategoryDetailView                from './CategoryDetailView';
import OptionDetailView                  from './OptionDetailView';
import TempDetailView                    from './TempDetailView';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    contentWrapper: {
      marginTop: theme.spacing(1),
    },
  });

interface TemplatesViewProps extends MaterialThemeHOC {
  userProfile: UserProfile;
  location: Location;
}

class TemplatesView extends React.Component<TemplatesViewProps> {
  render() {
    const {classes, userProfile} = this.props;
    if (!userProfile.user_metadata.roles.includes('SuperAdmin'))
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <CustomTabs
            tabs={[
              {
                href: `/m_temp/all_templates`,
                label: 'All Templates',
                icon: AppsIcon,
              },
              {
                href: `/m_temp/template_detail`,
                label: 'Template Detail',
                icon: BallotIcon,
              },
              {
                href: `/m_temp/category_detail`,
                label: 'Category Detail',
                icon: ViewHeadlineIcon,
              },
              {
                href: `/m_temp/option_detail`,
                label: 'Option Detail',
                icon: ViewHeadlineIcon,
              },
            ]}
          />
          <main className={classes.contentWrapper}>
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
              <Redirect path="/m_temp" to={`/m_temp/all_templates`}/>
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
  connect(mapStateToProps),
  withStyles(styles)
)(TemplatesView);

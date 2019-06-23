import React                from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect }          from 'react-redux';
import { compose }          from 'redux';

import List         from '@material-ui/core/List';
import ListItem     from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon     from '@material-ui/icons/Home';
import MessageIcon  from '@material-ui/icons/Message';
import PagesIcon    from '@material-ui/icons/Pages';
import WidgetsIcon  from '@material-ui/icons/Widgets';

import { withStyles } from '@material-ui/core/styles';

import ServiceIcon  from '@material-ui/icons/GroupWork';
import HelpIcon     from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';

import auth0Client     from '../../auth0/auth';
import { UserProfile } from '../../types/global';
import styles          from './MenuList.style';

interface ConnectedMenuListProps {
  classes: any;
  userProfile: UserProfile;
  location: Location;
}

class MenuList extends React.Component<ConnectedMenuListProps> {
  render() {
    const { classes, userProfile, location } = this.props;
    const pathname = location.pathname;

    if (!auth0Client.isAuthenticated())
      return (
        <List>
          <ListItem
            button
            component={Link}
            to="/"
            className={pathname === '/' ? classes.selectedStyle : ''}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" className={classes.listItemText} />
          </ListItem>
        </List>
      );

    const roles = userProfile.user_metadata.roles;

    return (
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          className={pathname === '/' ? classes.selectedStyle : ''}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" className={classes.listItemText} />
        </ListItem>
        {(roles.includes('Gen') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/gen-contractor"
            className={
              pathname.includes('/gen-contractor') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText
              primary="General Contractor"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Sub') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/s_cont"
            className={
              pathname.includes('/s_cont') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <ServiceIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sub Contractor"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Gen') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/b_list"
            className={
              pathname.includes('/b_list') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText
              primary="Bidder Listing"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Sub') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/projects"
            className={
              pathname.includes('/projects') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <WidgetsIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" className={classes.listItemText} />
          </ListItem>
        )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_temp"
            className={
              pathname.includes('/m_temp') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <PagesIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Templates"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_cont"
            className={
              pathname.includes('/m_cont') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Contractor"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_spec"
            className={
              pathname.includes('/m_spec') ? classes.selectedStyle : ''
            }
          >
            <ListItemIcon>
              <PagesIcon />
            </ListItemIcon>
            <ListItemText
              primary="Manage Specialty"
              className={classes.listItemText}
            />
          </ListItem>
        )}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withStyles(styles)
)(MenuList);

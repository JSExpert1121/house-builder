import React, { MouseEvent } from 'react';
import clsx                  from 'clsx';

import { withRouter } from 'react-router-dom';
import { connect }    from 'react-redux';
import { compose }    from 'redux';
import auth0Client    from '../../auth0/auth';
import { History }    from 'history';

import { withStyles }  from '@material-ui/core/styles';
import AppBar          from '@material-ui/core/AppBar';
import Divider         from '@material-ui/core/Divider';
import Drawer          from '@material-ui/core/Drawer';
import Toolbar         from '@material-ui/core/Toolbar';
import Typography      from '@material-ui/core/Typography';
import MenuIcon        from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button          from '@material-ui/core/Button';
import IconButton      from '@material-ui/core/IconButton';

import Badge                             from '@material-ui/core/Badge';
import AccountCircle                     from '@material-ui/icons/AccountCircle';
import NotificationsIcon                 from '@material-ui/icons/Notifications';
import MoreIcon                          from '@material-ui/icons/MoreVert';
import { MaterialThemeHOC, UserProfile } from '../../types/global';
import styles                            from './Header.style';
import MenuList                          from '../MenuList';

interface HeaderProps extends MaterialThemeHOC {
  profile: UserProfile;
  history: History;
}

interface HeaderState {
  anchorEl: Element | EventTarget;
  mobileMoreAnchorEl: React.ReactNode;
  open: boolean;
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      open: true,
    };
  }

  handleProfileMenuOpen = (event: MouseEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event: MouseEvent) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleUserLogIn = () => {
    auth0Client.signIn();
  };

  handleUserLogOut = () => {
    auth0Client.signOut();
    this.handleMenuClose();
  };

  handleDrawerOpen = () =>
    this.setState({
      open: true,
    });

  handleDrawerClose = () =>
    this.setState({
      open: false,
    });

  render() {
    const { anchorEl, open } = this.state;
    const { classes, profile } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    const rightApp = auth0Client.isAuthenticated() ? (
      <div>
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit">
            <Badge badgeContent={17} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <span style={{ fontSize: '16px' }}>
              {profile.email}&nbsp;&nbsp;
            </span>
            <AccountCircle />
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-haspopup="true"
            onClick={this.handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
      </div>
    ) : (
      <Button color="inherit" onClick={this.handleUserLogIn}>
        Login
      </Button>
    );

    return (
      <>
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
            {rightApp}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <MenuList />
          <Divider />
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  profile: state.global_data.userProfile,
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps)
)(Header);

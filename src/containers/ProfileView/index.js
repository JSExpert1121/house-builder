
import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../routers/SecuredRoute';
import PropTypes from 'prop-types';

// material ui
import { withStyles, AppBar, Tabs, NoSsr, Tab, Button, Toolbar, CircularProgress } from '@material-ui/core';
import { Apps as AppsIcon, Ballot as BallotIcon, DoneAll as DoneAllIcon, AccountCircle } from '@material-ui/icons';

import ProfileEditView from './ProfileEditView';
import ProfileFileView from './ProfileFileView';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    toolbarstyle: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.dark
    },
    buttonAdditional: {
        position: "absolute",
        float: "right",
        right: "0"
    },
    waitingSpin: {
        position: "relative",
        left: "calc(50% - 10px)",
        top: "calc(40vh)",
    }
});

const PROFILE_OVERVIEW = '/profile';
const PROFILE_CONTRACT = '/profile/files';

class ProfileView extends React.Component {
    render() {
        const { classes, location } = this.props;
        const tabNo = {
            [PROFILE_OVERVIEW]: 0,
            [PROFILE_CONTRACT]: 1
        };

        const curTabPos = tabNo[location.pathname];
        return (
            <NoSsr>
                <div className={classes.root}>
                    <AppBar position="static" className={classes.toolbarstyle}>
                        <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
                            <Tab component={Link} to={PROFILE_OVERVIEW} label="Profile Detail" icon={<AccountCircle />} />
                            <Tab component={Link} to={PROFILE_CONTRACT} label="Files" icon={<BallotIcon />} />
                        </Tabs>
                    </AppBar>

                    <Switch>
                        <SecuredRoute exact path={PROFILE_OVERVIEW} component={ProfileEditView} />
                        <SecuredRoute path={PROFILE_CONTRACT} component={ProfileFileView} />
                    </Switch>
                </div>
            </NoSsr>
        )
    }
}

export default withRouter(withStyles(styles)(ProfileView));


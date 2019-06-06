import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppBar, Tabs, Tab, NoSsr } from '@material-ui/core';
import { Apps as AppsIcon, Ballot as BallotIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import SecuredRoute from '../../routers/SecuredRoute';
import AllSpecialties from './AllSpecialties';
import SpecialtyDetailView from './SpecialtyDetailView';

const styles = theme => ({
	"@global": {
		".MuiTab-labelIcon": {
			margin: '0px',
			lineHeight: '1',
			padding: '0px',
			minHeight: '56px',
			'& .MuiTab-wrapper': {
				'& > *:first-child': {
					marginBottom: '0px'
				}
			}
		},
	},
    root: {
        flexGrow: 1,
    },
    toolbarstyle: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.dark
    },
    waitingSpin: {
        position: "relative",
        left: "calc(50% - 10px)",
        top: "calc(40vh)",
    }
});

export class SpecialtyView extends Component {

    static propTypes = {
        userProfile: PropTypes.shape({
            user_metadata: PropTypes.shape({
                roles: PropTypes.arrayOf(PropTypes.string)
            })
        }).isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }

    state = {

    }

    render() {
        const { classes, userProfile, location } = this.props;

        const tabNo = {
            '/m_spec': 0,
            '/m_spec/all_specialties': 0,
            '/m_spec/specialty_detail': 1
        };

        const curTabPos = tabNo[location.pathname];

        if (!userProfile.user_metadata.roles.includes("SuperAdmin"))
            return (<div> Access Forbidden </div>);


        return (
            <NoSsr>
                <div className={classes.root}>
                    <AppBar position="static" className={classes.toolbarstyle}>
                        <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
                            <Tab component={Link} to={`/m_spec/all_specialties`} label="All Specialties" icon={<AppsIcon />} />
                            <Tab component={Link} to={`/m_spec/specialty_detail`} label="Specialty Detail" icon={<BallotIcon />} />
                        </Tabs>
                    </AppBar>

                    <Switch>
                        <SecuredRoute path='/m_spec/all_specialties' component={AllSpecialties} />
                        <SecuredRoute path='/m_spec/specialty_detail' component={SpecialtyDetailView} />
                        <Redirect path='/m_spec' to={`/m_spec/all_specialties`} />
                    </Switch>
                </div>
            </NoSsr>
        );
    }
}

const mapStateToProps = (state) => ({
    userProfile: state.global_data.userProfile
})

const mapDispatchToProps = {

}


const ConnectedSpecialtyView = connect(mapStateToProps, mapDispatchToProps)(SpecialtyView);

export default withRouter(withStyles(styles)(ConnectedSpecialtyView));

import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../routers/SecuredRoute';

// Redux
import { connect } from 'react-redux';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import { CircularProgress } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

// local components
import AllTemplatesView from './AllTemplatesView';
import TempDetailView from './TempDetailView';
import CategoryDetailView from './CategoryDetailView';
import OptionDetailView from './OptionDetailView';

// local components

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

class ConnectedTemplatesView extends React.Component {
	constructor(props) {
		super(props);
	}

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

		if (!userProfile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							variant="scrollable"
							scrollButtons="on">

							<Tab component={Link} to={`/m_temp/all_templates`} label="All Templates" icon={<AppsIcon />} />
							<Tab component={Link} to={`/m_temp/template_detail`} label="Template Detail" icon={<BallotIcon />} />
							<Tab component={Link} to={`/m_temp/category_detail`} label="Category Detail" icon={<ViewHeadlineIcon />} />
							<Tab component={Link} to={`/m_temp/option_detail`} label="Option Detail" icon={<ViewHeadlineIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path='/m_temp/all_templates' component={AllTemplatesView} />
						<SecuredRoute path='/m_temp/template_detail' component={TempDetailView} />
						<SecuredRoute path='/m_temp/category_detail' component={CategoryDetailView} />
						<SecuredRoute path='/m_temp/option_detail' component={OptionDetailView} />
						<Redirect path='/m_temp' to={`/m_temp/all_templates`} />
					</Switch>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
	};
};

const TemplatesView = connect(mapStateToProps, null)(ConnectedTemplatesView);

TemplatesView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TemplatesView));
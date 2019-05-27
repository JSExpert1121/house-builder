import React from 'react';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../../routers/SecuredRoute';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import ProjectOverView from './ProjectOverView';
import ProjectBidders from './ProjectBidders';
import ProjectFiles from './ProjectFiles';
import ProjectMessages from './ProjectMessages';
import ProjectProposals from './ProjectProposals';
import ProjectTemplates from './ProjectTemplates';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px",
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},

	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
});

class ConnectedProjectDetailView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, match, selectedProject, location } = this.props;

		const tabNo = {
			'/g_cont/project_detail': 0,
			'/g_cont/project_detail/overview': 0,
			'/g_cont/project_detail/bidders': 1,
			'/g_cont/project_detail/files': 2,
			'/g_cont/project_detail/messages': 3,
			'/g_cont/project_detail/proposals': 4,
			'/g_cont/project_detail/templates': 5,
		};

		const curTabPos = tabNo[location.pathname];

		if (selectedProject === null)
			return <div />;

		return (

			<NoSsr>
				<div className={classes.root}>
					<Paper square >
						<Tabs
							value={curTabPos}
							variant="scrollable"
							indicatorColor="primary"
							textColor="primary"
							scrollButtons="on"
							className={classes.toolbarstyle}
						>
							<Tab component={Link} to={`${match.url}/overview`} label="Overview" />
							<Tab component={Link} to={`${match.url}/bidders`} label="Bidders" />
							<Tab component={Link} to={`${match.url}/files`} label="Files" />
							<Tab component={Link} to={`${match.url}/messages`} label="Messages" />
							<Tab component={Link} to={`${match.url}/proposals`} label="Proposals" />
							<Tab component={Link} to={`${match.url}/templates`} label="Templates" />
						</Tabs>

						<Switch>
							<SecuredRoute path={`${match.url}/overview`} component={ProjectOverView} />
							<SecuredRoute path={`${match.url}/bidders`} /* component={ProjectBidders} */ render={<div />} />
							<SecuredRoute path={`${match.url}/files`} component={ProjectFiles} />
							<SecuredRoute path={`${match.url}/messages`} /*component={ProjectMessages}*/ render={<div />} />
							<SecuredRoute path={`${match.url}/proposals`} component={ProjectProposals} />
							<SecuredRoute path={`${match.url}/templates`} component={ProjectTemplates} />
							<Redirect path={`${match.url}`} to={`${match.url}/overview`} />
						</Switch>
					</Paper>
				</div></NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.gen_data.selectedProject
	};
};

const ProjectDetailView = connect(mapStateToProps)(ConnectedProjectDetailView);

ProjectDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProjectDetailView));
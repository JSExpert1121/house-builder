import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import DashboardIcon from '@material-ui/icons/Dashboard';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import DescriptionIcon from '@material-ui/icons/Description';
import MessageIcon from '@material-ui/icons/Message';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import ProjectOverView from './ProjectOverView';
import ProjectBidders from './ProjectBidders';
import ProjectFiles from './ProjectFiles';
import ProjectMessages from './ProjectMessages';
import ProjectProposals from './ProjectProposals';
import { CircularProgress } from '@material-ui/core';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
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
			curDetailTab: 0
		}
	}

	handleTabChange = (event, value) => {
		this.setState({
			curDetailTab: value
		});
	}

	render() {
		const { classes, selectedProject } = this.props;
		const curDetailTab = this.state.curDetailTab;

		if (selectedProject === null)
			return <div />;

		return (

			<NoSsr>
				<div className={classes.root}>
					<Paper square >
						<Tabs
							value={curDetailTab}
							onChange={this.handleTabChange}
							variant="scrollable"
							indicatorColor="primary"
							textColor="primary"
							scrollButtons="on"
							className={classes.toolbarstyle}
						>
							<Tab label="Overview" />
							<Tab label="Bidders" />
							<Tab label="Files" />
							<Tab label="Messages" />
							<Tab label="Proposals" />
						</Tabs>

						{curDetailTab === 0 && <ProjectOverView />}
						{curDetailTab === 1 && /*<ProjectBidders />*/ <div />}
						{curDetailTab === 2 && /*<ProjectFiles />*/ <div />}
						{curDetailTab === 3 && /*<ProjectMessages />*/ <div />}
						{curDetailTab === 4 && /*<ProjectProposals />*/ <div />}
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

export default withStyles(styles)(ProjectDetailView);
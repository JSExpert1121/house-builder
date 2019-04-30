import React from 'react';
import { connect } from 'react-redux';

import { setCurTabPos } from '../../actions';

import AllProjectView from '../../components/AllProjectView';
import ProjectDetailView from '../../components/ProjectDetailView';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import { CircularProgress } from '@material-ui/core';
import auth0Client from '../../auth0/auth';

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
	}
});

class ConnectedProjectsView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			profile: null
		}
	}

	async componentWillMount() {
		const userProfile = auth0Client.userProfile;
		if (!userProfile) {
			await auth0Client.getProfile((profile) => {
				this.setState({
					profile: profile
				});
			});
		} else {
			this.setState({
				profile: userProfile
			});
		}
	}

	handleTabChange = (event, value) => {
		this.props.setCurTabPos(value);
	}

	render() {
		const { classes, curTabPos } = this.props;
		const profile = this.state.profile;

		if (profile === null)
			return (<div> <CircularProgress /></div>);

		if (profile.app_metadata.role !== "SuperAdmin" && profile.app_metadata.role !== "Sub")
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							onChange={this.handleTabChange}
							variant="scrollable"
							scrollButtons="on">

							<Tab label="Projects" icon={<AppsIcon />} />
							<Tab label="Project Detail" icon={<BallotIcon />} />
						</Tabs>
					</AppBar>

					{curTabPos === 0 && <AllProjectView />}
					{curTabPos === 1 && <ProjectDetailView />}
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		projects: state.genContViewData.projects,
		curTabPos: state.genContViewData.curTabPos,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCurTabPos: tabPos => dispatch(setCurTabPos(tabPos)),
	};
};

const ProjectsView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectsView);

ProjectsView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectsView);
import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ArchiveIcon from '@material-ui/icons/Archive';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px"
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	}
});

class ConnectedSCVPipelineView extends React.Component {
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
		const { classes } = this.props;
		const curDetailTab = this.state.curDetailTab;

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
							<Tab icon={<DashboardIcon />} />
							<Tab icon={<ControlCameraIcon />} />
							<Tab icon={<DoneIcon />} />
							<Tab icon={<DoneAllIcon />} />
							<Tab icon={<ArchiveIcon />} />
						</Tabs>

						{curDetailTab === 0 && <div>Undecided </div>}
						{curDetailTab === 1 && <div>Accepted</div>}
						{curDetailTab === 2 && <div>Submitted</div>}
						{curDetailTab === 3 && <div>Won</div>}
						{curDetailTab === 4 && <div>Archived</div>}
					</Paper>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const SCVPipelineView = connect(mapStateToProps)(ConnectedSCVPipelineView);

SCVPipelineView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SCVPipelineView);
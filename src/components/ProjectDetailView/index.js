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

import PDetailOverView from '../PDetailOverview';
import PDetailBidders from '../PDetailBidders';
import PDetailFiles from '../PDetailFiles';
import PDetailMessages from '../PDetailMessages';
import PDetailProposals from '../PDetailProposals';

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

class ConnectedProDetailView extends React.Component {
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
							<Tab icon={<LoyaltyIcon />} />
							<Tab icon={<DescriptionIcon />} />
							<Tab icon={<MessageIcon />} />
							<Tab icon={<AssignmentIndIcon />} />
						</Tabs>

						{curDetailTab === 0 && <PDetailOverView />}
						{curDetailTab === 1 && <PDetailBidders />}
						{curDetailTab === 2 && <PDetailFiles />}
						{curDetailTab === 3 && <PDetailMessages />}
						{curDetailTab === 4 && <PDetailProposals />}
					</Paper>
				</div></NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.genContViewData.selectedProject
	};
};

const ProjectDetailView = connect(mapStateToProps)(ConnectedProDetailView);

ProjectDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectDetailView);
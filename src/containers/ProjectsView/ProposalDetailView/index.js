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

import ProposalDetailFiles from './ProposalDetailFiles';
import ProposalDetailOverview from './ProposalDetailOverview';

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

class ConnectedProposalDetailView extends React.Component {
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
		const { classes, match, selectedProposal } = this.props;
		const curDetailTab = this.state.curDetailTab;

		if (selectedProposal === null && match.params.mode !== 'c')
			return (
				<div> no proposal is selected </div>
			);

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
							<Tab label="Detail" />
							{selectedProposal && <Tab label="Files" />}
						</Tabs>

						{curDetailTab === 0 && <ProposalDetailOverview />}
						{curDetailTab === 1 && <ProposalDetailFiles />}
					</Paper>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailView = connect(mapStateToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailView);
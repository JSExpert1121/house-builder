import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import ProposalDetailFiles from './ProposalDetailFiles';
import ProposalDetailOverview from './ProposalDetailOverview';
import { CircularProgress } from '@material-ui/core';

import { getProposalData } from "../../actions/index";

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px"
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

class ConnectedProposalDetailView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curDetailTab: 0
		}
	}

	async componentDidMount() {
		const { match } = this.props;

		if (match.params.id !== '-1')
			await this.props.getProposalData(match.params.id);
	}

	handleTabChange = (event, value) => {
		this.setState({
			curDetailTab: value
		});
	}

	render() {
		const { classes, match, proposal, redirectTo } = this.props;
		const curDetailTab = this.state.curDetailTab;

		if (proposal === null && match.params.id !== '-1')
			return (
				<CircularProgress className={classes.waitingSpin} />
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
							{
								match.params.id !== '-1' && <Tab label="Files" />
							}
						</Tabs>

						{curDetailTab === 0 && <ProposalDetailOverview />}
						{curDetailTab === 1 && <ProposalDetailFiles />}
					</Paper>
				</div>
			</NoSsr>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProposalData: (id) => dispatch(getProposalData(id))
	}
}

const mapStateToProps = state => {
	return {
		proposal: state.global_data.proposal,
		redirectTo: state.global_data.redirectTo
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailView));
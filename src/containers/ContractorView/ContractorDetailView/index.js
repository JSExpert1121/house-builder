import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import ContractorInfo from './ContractorInfo';
import ContractorSpecialties from './ContractorSpecialties';
import ContractorFiles from './ContractorFiles';
// import ContractorMessages from './ContractorMessages';
// import ContractorProposals from './ContractorProposals';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	}
});

class ConnectedContractorDetailView extends React.Component {
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
		const { classes, selectedContractor } = this.props;
		const curDetailTab = this.state.curDetailTab;

		if (selectedContractor === null)
			return (
				<div> no project is selected </div>
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
							<Tab label="Info" />
							<Tab label="Files" />
							<Tab label="Specialties" />
						</Tabs>

						{curDetailTab === 0 && <ContractorInfo />}						
						{curDetailTab === 1 && <ContractorFiles />}
						{curDetailTab === 2 && <ContractorSpecialties />}
					</Paper>
				</div></NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedContractor: state.cont_data.selectedContractor
	};
};

const ContractorDetailView = connect(mapStateToProps)(ConnectedContractorDetailView);

ContractorDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractorDetailView);
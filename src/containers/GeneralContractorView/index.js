import React from 'react';
import { connect } from 'react-redux';

import { setCurTabPos } from '../../actions';

import CurrentProjectView from '../../components/CurrentProjectView';
import ProjectDetailView from '../../components/ProjectDetailView';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ProposalDetailView from '../../components/ProposalDetailView';
import { redBright } from 'ansi-colors';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},
	grow: {
		position: "absolute",
		float: "right",
		right: "0"
	}
});

class ConnectedGenContView extends React.Component {
	constructor(props) {
		super(props);
	}

	handleTabChange = (event, value) => {
		this.props.setCurTabPos(value);
	}

	render() {
		const { classes, curTabPos } = this.props;

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							onChange={this.handleTabChange}
							variant="scrollable"
							scrollButtons="on">

							<Tab label="Project View" icon={<AppsIcon />} />
							<Tab label="Project Detail" icon={<BallotIcon />} />
							<Tab label="Proposal Detail" icon={<DoneAllIcon />} />
						</Tabs>

						<Toolbar
							className={classes.grow}>
							<Button color="inherit" onClick={() => {
								this.props.setCurTabPos(3);
							}}>Add Project</Button>
						</Toolbar>
					</AppBar>

					{curTabPos === 0 && <CurrentProjectView />}
					{curTabPos === 1 && <ProjectDetailView />}
					{curTabPos === 2 && <ProposalDetailView />}
					{curTabPos === 3 && <div />}
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	console.log(state);
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

const GeneralContractorView = connect(mapStateToProps, mapDispatchToProps)(ConnectedGenContView);

GeneralContractorView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeneralContractorView);
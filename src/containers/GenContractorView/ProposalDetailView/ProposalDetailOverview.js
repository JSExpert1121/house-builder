import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Card, Button, Snackbar, CircularProgress, Link } from '@material-ui/core';
import { submitProposal, deleteProposal, setSelectedProposal, getProjectDetailById, awardProject } from '../../../actions/gen-actions';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		padding: "10px"
	},
	editField: {
		lineHeight: '1.5rem',
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	submitBtn: {
		border: "1px solid #4a148c",
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		margin: 5,
		float: "right",
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
	},
	width_300: {
		width: 300,
		marginRight: 10,
	},
});

class ConnectedProposalDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSaving: false,
			snackBar: false,
			snackBarContent: false,
		}
	}

	handleAwardProject = async () => {
		const { proposal } = this.props;

		this.setState({
			isSaving: true
		});

		await this.props.awardProject(proposal.id, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res ? 'award project success' : 'award project failed'
			});

			this.props.setSelectedProposal(proposal.id);
		});
	}

	handleBack = async () => {
		const { proposal } = this.props;

		await this.props.selectProject(proposal.project.id);
		this.props.history.push("/g_cont/project_detail/proposals");
	}

	render() {
		const { classes, proposal } = this.props;

		if (proposal === null)
			return <Card className={classes.root} ></Card>

		console.log(proposal.project);
		return (
			<div className={classes.root}>
				<Link onClick={this.handleBack}> Back to all proposals</Link>
				<div>
					<TextField
						autoFocus
						margin="normal"
						label="project name"
						type="text"
						fullWidth
						className={classes.width_300}
						value={proposal.project.title}
						readOnly={true}
					/>
					<TextField
						autoFocus
						margin="normal"
						label="project budget"
						type="number"
						fullWidth
						className={classes.width_300}
						value={proposal.project.budget}
						readOnly={true}
					/>
					<TextField
						margin="normal"
						label="project description"
						type="text"
						fullWidth
						className={classes.width_300}
						value={proposal.project.description}
						readOnly={true}
					/>
				</div>
				<div>
					<TextField
						autoFocus
						margin="normal"
						label="budget"
						type="number"
						fullWidth
						className={classes.width_300}
						value={proposal.budget}
						readOnly={true}
					/>
					<TextField
						autoFocus
						margin="normal"
						label="duration"
						type="number"
						fullWidth
						className={classes.width_300}
						value={proposal.duration}
						readOnly={true}
					/>
					<TextField
						margin="normal"
						label="status"
						type="text"
						fullWidth
						className={classes.width_300}
						value={proposal.status}
						readOnly={true}
					/>
					<TextField
						margin="normal"
						label="description"
						type="text"
						multiline
						rows="10"
						fullWidth
						value={proposal.description}
						readOnly={true}
					/>
					<Button disabled={this.state.isSaving || proposal.status === 'AWARDED'} className={classes.submitBtn} onClick={
						this.handleAwardProject
					}> Award Project {this.state.isSaving && <CircularProgress
						disableShrink
						size={24}
						thickness={4} />} </Button>
				</div>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					open={this.state.snackBar}
					onClose={() => this.setState({
						snackBar: false
					})}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={
						<span id="message-id"> {
							this.state.snackBarContent
						}</span>
					}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitProposal: (cont_id, pro_id, proposal, cb) => dispatch(submitProposal(cont_id, pro_id, proposal, cb)),
		setSelectedProposal: (id) => dispatch(setSelectedProposal(id)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
		selectProject: (id) => dispatch(getProjectDetailById(id)),
		awardProject: (id, cb) => dispatch(awardProject(id, cb))
	};
}

const mapStateToProps = state => {
	return {
		project: state.gen_data.selectedProject,
		userProfile: state.global_data.userProfile,
		proposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailView));
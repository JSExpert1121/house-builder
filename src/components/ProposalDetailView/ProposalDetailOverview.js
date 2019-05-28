import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Card, Button, Snackbar, CircularProgress, Link } from '@material-ui/core';

import { getProposalData, deleteProposal, submitProposal } from '../../actions/index';
import { awardProject } from '../../actions/gen-actions';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 48px - 20px)",
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
	width_300: {
		width: 300,
		marginRight: 10,
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
		'&:readOnly': {
			backgroundColor: "#FFFFFF"
		}
	}
});

class ConnectedProposalDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			budget: 0,
			duration: 0,
			description: "",
			snackBar: false,
			snackBarContent: "",
			isSaving: false,
		}
	}

	handleDeleteProposal = async () => {
		const { proposal } = this.props;
		this.setState({
			isSaving: true
		})

		await this.props.deleteProposal(proposal.id, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res ? 'delete proposal success' : "delete proposal failed"
			});

			if (res) {
				this.props.history.push("/s_cont/pipeline/submitted");
			}
		})
	}

	handleSubmitProposal = async () => {
		const { userProfile, project } = this.props;
		this.setState({
			isSaving: true,
		});

		const proposalData = {
			"budget": this.state.budget,
			"duration": this.state.duration,
			"description": this.state.description,
			"updatedBy": userProfile.email
		};

		await this.props.submitProposal(userProfile.user_metadata.contractor_id, project.id, proposalData, async (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res !== 'false' ? "submit proposal success" : "submit proposal failed"
			});

			if (res) {
				await this.props.getProposalData(res);
				this.props.history.push("/proposal_detail/" + res);
			}
		});
	}

	handleAwardProject = async () => {
		const { proposal } = this.props;
		this.setState({
			isSaving: true
		})

		await this.props.awardProject(proposal.id, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res ? 'award project success' : "award project failed"
			});

			this.props.getProposalData(proposal.id);
		})
	}

	handleBack = () => {
		const { proposal } = this.props;
		switch (this.props.redirectTo) {
			case '/g_cont':
				this.props.history.push("/project_detail/" + proposal.project.id + "/proposals");
				break;
			case '/s_cont':
				this.props.history.push('/s_cont/pipeline/' + proposal.status.toLowerCase());
				break;
			case '/a_pros':
				this.props.history.push("/project_detail/" + proposal.project.id + "/proposals");
				break;
			default:
				break;
		}
	}

	render() {
		const { classes, match, proposal, redirectTo, project } = this.props;
		let mode = match.params.id === '-1' ? 'c' : 'v';
		let c_project;

		if(proposal === null && project === null)
			return <div className = {classes.root} />;

		c_project = mode === 'v' ? proposal.project : project;
		
		return (
			<div className={classes.root}>
				<Link onClick={this.handleBack}> Back to proposals</Link>
				<div>
					<TextField
						autoFocus
						margin="normal"
						label="project name"
						type="text"
						fullWidth
						className={classes.width_300}
						value={c_project.title}
						readOnly={true}
					/>
					<TextField
						autoFocus
						margin="normal"
						label="project budget"
						type="number"
						fullWidth
						className={classes.width_300}
						value={c_project.budget}
						readOnly={true}
					/>
					<TextField
						margin="normal"
						label="project description"
						type="text"
						fullWidth
						className={classes.width_300}
						value={c_project.description}
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
						value={mode === 'v' ? proposal.budget : this.state.budget}
						readOnly={mode === 'v'}
						onChange={(val) => this.setState({ budget: val.target.value })}
					/>
					<TextField
						margin="normal"
						label="duration"
						type="number"
						fullWidth
						className={classes.width_300}
						value={mode === 'v' ? proposal.duration : this.state.duration}
						readOnly={mode === 'v'}
						onChange={(val) => this.setState({ duration: val.target.value })}
					/>
					{
						mode === 'v' && <TextField
							margin="normal"
							label="status"
							type="text"
							fullWidth
							className={classes.width_300}
							value={proposal.status}
							readOnly={true}
						/>
					}
					<TextField
						margin="normal"
						label="description"
						type="text"
						multiline
						rows="10"
						fullWidth
						value={mode === 'v' ? proposal.description : this.state.description}
						readOnly={mode === 'v'}
						onChange={(val) => this.setState({ description: val.target.value })}
					/>
					{
						redirectTo === '/s_cont' &&
						<Button readOnly={this.state.isSaving} className={classes.submitBtn} onClick={this.handleDeleteProposal}>
							Delete Proposal {
								this.state.isSaving && <CircularProgress
									size={24}
									thickness={4} />
							}
						</Button>
					}
					{
						redirectTo === '/g_cont' &&
						<Button readOnly={this.state.isSaving} className={classes.submitBtn} onClick={this.handleAwardProject}>
							Award Project {
								this.state.isSaving && <CircularProgress
									size={24}
									thickness={4} />
							}
						</Button>
					}
					{
						mode === 'c' &&
						<Button readOnly={this.state.isSaving} className={classes.submitBtn} onClick={this.handleSubmitProposal}>
							Submit Proposal {
								this.state.isSaving && <CircularProgress
									size={24}
									thickness={4} />
							}
						</Button>
					}
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
		getProposalData: (id) => dispatch(getProposalData(id)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
		awardProject: (id, cb) => dispatch(awardProject(id, cb)),
		submitProposal: (cont_id, pro_id, proposal, cb) => dispatch(submitProposal(cont_id, pro_id, proposal, cb))
	};
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		proposal: state.global_data.proposal,
		project: state.global_data.project,
		redirectTo: state.global_data.redirectTo
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailView));
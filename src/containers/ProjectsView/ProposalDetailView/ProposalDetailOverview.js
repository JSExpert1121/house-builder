import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Card, Button, Snackbar, CircularProgress, Link } from '@material-ui/core';
import { submitProposal, deleteProposal, setSelectedProposal, getProjectsByGenId } from '../../../actions/gen-actions';

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
		'&:disabled': {
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

		await this.props.submitProposal(userProfile.user_metadata.contractor_id, project.id, proposalData, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res !== 'false' ? "submit proposal success" : "submit proposal failed"
			});

			if (res) {
				this.props.setSelectedProposal(res);
				this.props.history.push("/a_pros/proposal_detail/v");
			}
		});
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
				this.props.history.push("/a_pros/project_detail/proposals");
			}
		})
	}

	handleBack = async () => {
		const { proposal } = this.props;

		await this.props.selectProject(proposal.project.id);
		this.props.history.push("/a_pros/project_detail/proposals");
	}

	render() {
		const { classes, match, proposal } = this.props;
		const mode = match.params.mode;

		if (proposal === null && mode === 'v')
			return <Card className={classes.root} ></Card>

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
						mode === 'c' && <Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={
							this.handleSubmitProposal
						}> Submit Proposal {this.state.isSaving && <CircularProgress
							disableShrink
							size={24}
							thickness={4} />} </Button>/* : <Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={
								this.handleDeleteProposal
							}> Delete Proposal {this.state.isSaving && <CircularProgress
								disableShrink
								size={24}
								thickness={4} />} </Button>*/
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
		submitProposal: (cont_id, pro_id, proposal, cb) => dispatch(submitProposal(cont_id, pro_id, proposal, cb)),
		setSelectedProposal: (id) => dispatch(setSelectedProposal(id)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
		selectProject: (id) => dispatch(getProjectsByGenId(id))
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
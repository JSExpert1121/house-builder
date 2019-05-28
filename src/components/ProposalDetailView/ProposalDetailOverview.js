import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Card, Button, Snackbar, CircularProgress, Link } from '@material-ui/core';

import { getProposalData, deleteProposal } from '../../actions/index';

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
		const { classes, proposal } = this.props;
		const project = proposal.project;

		if (proposal === null)
			return <Card className={classes.root} ></Card>

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
						value={project.title}
						readOnly={true}
					/>
					<TextField
						autoFocus
						margin="normal"
						label="project budget"
						type="number"
						fullWidth
						className={classes.width_300}
						value={project.budget}
						readOnly={true}
					/>
					<TextField
						margin="normal"
						label="project description"
						type="text"
						fullWidth
						className={classes.width_300}
						value={project.description}
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
						readOnly
					/>
					<TextField
						margin="normal"
						label="duration"
						type="number"
						fullWidth
						className={classes.width_300}
						value={proposal.duration}
						readOnly
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
						readOnly
					/>
					<Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={
						this.handleDeleteProposal
					}> Delete Proposal {this.state.isSaving && <CircularProgress

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
		getProposalData: (id) => dispatch(getProposalData(id)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
	};
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		proposal: state.global_data.proposal,
		redirectTo: state.global_data.redirectTo
	};
};

const ProposalDetailView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailView);

ProposalDetailView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProposalDetailView));
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import ProjectView from './ProjectView';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import CustomTableCell from '../../components/shared/CustomTableCell';

const styles = (theme) => ({
	root: {
		position: 'relative',
		width: '100%',
		height: "calc(100vh - 64px - 72px - 48px - 24px)",
		overflow: "auto",
		flexGrow: 1,
		padding: theme.spacing(1)
	},
	tableWrap: {
		overflow: "auto",
		marginTop: '20px'
	},
	editField: {
		lineHeight: '1.5rem',
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	busy: {
		position: "absolute",
		left: "calc(50% - 20px)",
		top: "calc(50% - 20px)",
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

class ConnectedProposalDetailOverview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			budget: props.brief.budget,
			duration: props.brief.duration,
			description: props.brief.description,
			snackBar: false,
			snackBarContent: "",
			isSaving: false,
			showConfirm: false,
			message: 'Would you like to submit your proposal?',
			handleOK: null
		}
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });
	};

	componentWillUnmount() {
		this.props.handleOverviewChange({ budget: this.state.budget, duration: this.state.duration, description: this.state.description });
	}

	submit = async () => {
		this.setState({ showConfirm: true, message: 'Would you like to submit your proposal?', handleOK: this.handleSubmit });
	}

	handleSubmit = () => {
		this.setState({ showConfirm: false, isSaving: true });
		this.props.handleSubmit({ budget: this.state.budget, duration: this.state.duration, description: this.state.description });
	}

	delete = () => {
		this.setState({ showConfirm: true, message: 'Would you like to delete your proposal?', handleOK: this.handleDelete });
	}

	handleDelete = () => {
		this.setState({ showConfirm: false, isSaving: true });
		this.props.handleDelete(this.props.proposal.id);
	}

	award = () => {
		this.setState({ showConfirm: true, message: 'Would you like to award this proposal?', handleOK: this.handleAward });
	}
	handleAward = () => {
		this.setState({ showConfirm: false, isSaving: true });
		this.props.handleAward(this.props.proposal.id);
	}

	render() {
		const { classes, match, proposal, edit } = this.props;

		// let edit = match.params.id === '-1';
		const project = (edit && !match.url.includes('/s_cont')) ? this.props.project : proposal.proposal.project;

		if (!project) return <div className={classes.root} />;
		if (!edit && !proposal) return <div className={classes.root} />;

		let c_project = edit ? project : proposal.proposal.project;

		return (
			<Paper className={classes.root}>
				<ProjectView project={c_project} />
				<Box className={classes.tableWrap}>
					<Card id='brief-desc' style={{ display: 'flex', flexWrap: 'wrap' }}>
						<TextField disabled={!edit}
							label="Budget *" id="budget" type='number'
							className={clsx(classes.margin, classes.textField)}
							value={this.state.budget}
							onChange={this.handleChange('budget')}
							InputProps={{
								endAdornment: <InputAdornment position="start">USD</InputAdornment>,
							}}
						/>
						<TextField disabled={!edit}
							label="Duration *" type='number'
							className={clsx(classes.margin, classes.textField)}
							value={this.state.duration}
							onChange={this.handleChange('duration')}
							InputProps={{
								endAdornment: <InputAdornment position="start">days</InputAdornment>,
							}}
						/>
						<FormControl fullWidth className={classes.margin}>
							<InputLabel htmlFor="description">Description *</InputLabel>
							<Input disabled={!edit}
								id="description"
								value={this.state.description}
								onChange={this.handleChange('description')}
								multiline={true}
							/>
						</FormControl>
					</Card>

					<Typography variant="subtitle1" noWrap style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '16px' }}>Project Templates</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<CustomTableCell>Name</CustomTableCell>
								<CustomTableCell align="center">Discription</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody >
							{
								project && project.projectTemplates.map((templ, index) => (
									<TableRow className={classes.row} key={index} hover
										onClick={() => this.props.templateSelected(index)}>
										<CustomTableCell component="th" scope="row">
											{templ.template.name}
										</CustomTableCell>
										<CustomTableCell align="center">{templ.template.description}</CustomTableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</Box>
				{/* <div>
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
				</div> */}
				<Box style={{ textAlign: 'right', paddingTop: '16px' }}>
					{/* <TextField
						autoFocus
						margin="normal"
						label="budget"
						type="number"
						fullWidth
						className={classes.width_300}
						value={!edit ? proposal.budget : this.state.budget}
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
						value={!edit ? proposal.description : this.state.description}
						readOnly={!edit}
						onChange={(val) => this.setState({ description: val.target.value })}
					/> */}
					{
						match.url.includes('/s_cont') &&
						<Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={this.handleDeleteProposal}>
							Delete Proposal
						</Button>
					}
					{
						match.url.includes('/g_cont') &&
						<Button disabled={this.state.isSaving || proposal.status === 'AWARDED'} className={classes.submitBtn} onClick={this.handleAwardProject}>
							Award Project
						</Button>
					}
					{
						edit &&
						<Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={this.handleSubmit}>
							Submit Proposal
						</Button>
					}
				</Box>
				{this.state.isSaving && <CircularProgress className={classes.busy} />}
				<ConfirmDialog open={this.state.showConfirm} message={this.state.message} onYes={this.state.handleOK} onCancel={this.closeConfirm} />
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
			</Paper>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProposalData: (id) => dispatch(getProposalData(id)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
		awardProject: (id, cb) => dispatch(awardProject(id, cb)),
	};
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		proposal: state.global_data.proposalDetail,
		project: state.global_data.project,
	};
};

const ProposalDetailOverview = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailOverview);

ProposalDetailOverview.propTypes = {
	classes: PropTypes.object.isRequired,
	edit: PropTypes.bool.isRequired,
	project: PropTypes.object,
	handleOverviewChange: PropTypes.func.isRequired,
	templateSelected: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func,
	handleAward: PropTypes.func,
	handleDelete: PropTypes.func,
};

export default withRouter(withStyles(styles)(ProposalDetailOverview));
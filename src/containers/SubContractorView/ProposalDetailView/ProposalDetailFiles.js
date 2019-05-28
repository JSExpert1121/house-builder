import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from '../../../components/shared/CustomTableCell';

import { DropzoneDialog } from 'material-ui-dropzone';
import { getProposalData, addFilesToProposal, deleteProposalFile } from '../../../actions/sub-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedProposalDetailFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openUploadForm: false,
			snackBar: false,
			snackBarContent: ''
		}
	}

	handleUploadFiles = async (files) => {
		const { proposal } = this.props;

		await this.props.addFilesToProposal(proposal.id, files, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'File Upload Success' : 'File Upload Failed',
				openUploadForm: false
			});

			if (res)
				this.props.getProposalData(proposal.id);
		});
	}

	handleDeletefile = async (name) => {
		const { proposal } = this.props;

		await this.props.deleteProposalFile(proposal.id, name, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'File Delete Success' : 'File Delete Failed'
			});
			if (res)
				this.props.getProposalData(proposal.id);
		});
	}

	render() {
		const { classes, proposal } = this.props;

		return (
			<div className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">
								<IconButton style={{ color: "#FFFFFF" }} onClick={() => this.setState({ openUploadForm: true })}>
									<NoteAddIcon />
								</IconButton>
							</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							proposal.proposalFiles.map((row) => (
								<TableRow key={row.id} hover>
									<CustomTableCell align="center">
										<a download={row.name} href={process.env.PROJECT_API + "/proposals/" + proposal.id + "/files/" + row.name}>{row.name}</a>
									</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
											() => this.handleDeletefile(row.name)
										}>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>

				<DropzoneDialog
					open={this.state.openUploadForm}
					onSave={this.handleUploadFiles}
					maxFileSize={52428800}
					showFileNamesInPreview={true}
					acceptedFiles={['text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*']}
					filesLimit={100}
					dropzoneText='select files to upload(< 50mb)'
					onClose={() => this.setState({ openUploadForm: false })}
				/>

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
		addFilesToProposal: (id, files, cb) => dispatch(addFilesToProposal(id, files, cb)),
		deleteProposalFile: (id, name, cb) => dispatch(deleteProposalFile(id, name, cb))
	}
}

const mapStateToProps = state => {
	return {
		proposal: state.sub_data.proposal
	};
};

const ProposalDetailFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailFiles);

ProposalDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailFiles);
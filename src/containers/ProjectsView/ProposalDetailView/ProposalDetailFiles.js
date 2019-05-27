import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import List from '@material-ui/core/List';
import { DropzoneDialog } from 'material-ui-dropzone';
import { setSelectedProposal, addFilesToProposal, deleteProposalFile } from '../../../actions/gen-actions';

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

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
		color: theme.palette.primary.light
	},
}))(TableCell);

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
		const { selectedProposal } = this.props;

		await this.props.addFilesToProposal(selectedProposal.id, files, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'File Upload Success' : 'File Upload Failed',
				openUploadForm: false
			});

			if (res)
				this.props.setSelectedProposal(selectedProposal.id);
		});
	}

	handleDeletefile = async (name) => {
		const { selectedProposal } = this.props;

		await this.props.deleteProposalFile(selectedProposal.id, name, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'File Delete Success' : 'File Delete Failed'
			});
			if (res)
				this.props.setSelectedProposal(selectedProposal.id);
		});
	}

	render() {
		const { classes, selectedProposal } = this.props;

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
							selectedProposal.proposalFiles.map((row) => (
								<TableRow key={row.id} hover>
									<CustomTableCell align="center">
										<a download={row.name} href={process.env.PROJECT_API + "/proposals/" + selectedProposal.id + "/files/" + row.name}>{row.name}</a>
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
		setSelectedProposal: (id) => dispatch(setSelectedProposal(id)),
		addFilesToProposal: (id, files, cb) => dispatch(addFilesToProposal(id, files, cb)),
		deleteProposalFile: (id, name, cb) => dispatch(deleteProposalFile(id, name, cb))
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailFiles);

ProposalDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailFiles);
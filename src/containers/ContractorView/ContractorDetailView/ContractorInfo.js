import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';
import { approveContractor, rejectContractor, updateContractor } from '../../../actions/cont-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(1),
		height: "calc(100vh - 184px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	textField: {
		boxShadow: "0 0 5px #999999",
		width: "100%",
	},
	buttons: {
		marginTop: theme.spacing(1),
		textAlign: "center",
	},
	approve: {
		backgroundColor: "purple",
	},
	reject: {
		backgroundColor: "lightblue",
	},
	button: {
		margin: theme.spacing(1),
	},
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

class ConnectedContractorInfoView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openUploadForm: false,
			snackBar: false,
			isProcessing: false,
			snackBarContent: ''
		}
	}


	render() {
		const { classes, selectedContractor } = this.props;
		const contractorFiles = selectedContractor.contractorFiles;

		if (this.state.isProcessing)
			return <div className={classes.root} >
				<CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root} >
				<Table className={classes.table} size='small'>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Email</CustomTableCell>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">City</CustomTableCell>
							<CustomTableCell align="center">Street</CustomTableCell>
							<CustomTableCell align="center">Status</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow className={classes.row} hover>
							<CustomTableCell component="th" scope="row" align="center">
								{selectedContractor ? selectedContractor.email : "N/A"}
							</CustomTableCell>
							<CustomTableCell align="center">
								{selectedContractor.address ? selectedContractor.address.name : "N/A"}
							</CustomTableCell>
							<CustomTableCell align="center">
								{selectedContractor.address ? selectedContractor.address.city : "N/A"}
							</CustomTableCell>
							<CustomTableCell align="center">
								{selectedContractor.address ? selectedContractor.address.street : "N/A"}
							</CustomTableCell>
							<CustomTableCell align="center">
								{selectedContractor.status ? selectedContractor.status : "N/A"}
							</CustomTableCell>
						</TableRow>
					</TableBody>
				</Table>
				<br />
				Approve/Reject Reason
				<br /><br />
				<TextField
					placeholder=""
					multiline={true}
					rows={4}
					className={classes.textField}
				/>
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
				<div className={classes.buttons}>
					<Button variant="contained" color="primary" className={classes.button} onClick={() => this.props.approveContractor(selectedContractor.id, { "status": "ACTIVE" }, (result) => {
						if (result)
							this.props.updateContractor(selectedContractor.id);
					}
					)}>Approve</Button>
					<Button variant="contained" color="default" className={classes.button} onClick={() => this.props.rejectContractor(selectedContractor.id, { "status": "REJECTED" }, (result) => {
						if (result)
							this.props.updateContractor(selectedContractor.id);
					}
					)}>Reject</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedContractor: state.cont_data.selectedContractor
	};
};

const mapDispatchToProps = dispatch => {
	return {
		approveContractor: (id, data, cb) => dispatch(approveContractor(id, data, cb)),
		rejectContractor: (id, data, cb) => dispatch(rejectContractor(id, data, cb)),
		updateContractor: (id) => dispatch(updateContractor(id)),
	}
}
const ContractorInfoView = connect(mapStateToProps, mapDispatchToProps)(ConnectedContractorInfoView);

ContractorInfoView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractorInfoView);
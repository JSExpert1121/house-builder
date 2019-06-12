import React from 'react';
import { connect } from 'react-redux';

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

import { addFiles, getContractorDetailById, deleteFile, updateContractor } from '../../../actions/cont-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(1),
		height: "calc(100vh -184px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	titleBtn: {
		color: "#FFFFFF",
		padding: "6px"
	},
	button: {
		padding: "6px"
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

class ConnectedContractorFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openUploadForm: false,
			snackBar: false,
			isProcessing: false,
			snackBarContent: ''
		}
	}

	componentDidMount() {
	}

	handleUploadFiles = async (files) => {
		const { selectedContractor } = this.props;
		this.setState({ isProcessing: true });

		await this.props.addFiles(selectedContractor.id, files, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'File Upload Success' : 'File Upload Failed'
			});
			if (res)
				this.props.updateContractor(selectedContractor.id);
		})
		await this.props.getContractorDetailById(selectedContractor.id);

		this.setState({
			openUploadForm: false,
			isProcessing: false
		})
	}

	handleDeleteFile = async (name) => {
		const { selectedContractor } = this.props;

		this.setState({
			isProcessing: true
		});

		await this.props.deleteFile(selectedContractor.id, name, (res) => {
			this.setState({
				snackBar: true,
				snackBarContent: res ? 'delete file success' : 'delete file failed'
			});
			if (res)
				this.props.updateContractor(selectedContractor.id);
		});

		await this.props.getContractorDetailById(selectedContractor.id);

		this.setState({
			isProcessing: false
		});
	}

	render() {
		const { classes, selectedContractor } = this.props;
		const contractorFiles = selectedContractor.contractorFiles;

		if (this.state.isProcessing)
			return <div className={classes.root} >
				<CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root} >
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">
								<IconButton className={classes.titleBtn} onClick={() => this.setState({ openUploadForm: true })}>
									<NoteAddIcon />
								</IconButton>
							</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{contractorFiles.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell component="th" scope="row" align="center">
									<a download={row.name} href={process.env.PROJECT_API + "/contractors/" + selectedContractor.id + "/files/" + row.name}>{row.name}</a>
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton className={classes.button} aria-label="Delete" color="primary"
										onClick={() => this.handleDeleteFile(row.name)}>
										<DeleteIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						))}
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

const mapStateToProps = state => {
	return {
		selectedContractor: state.cont_data.selectedContractor,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addFiles: (id, files, cb) => dispatch(addFiles(id, files, cb)),
		getContractorDetailById: (id) => dispatch(getContractorDetailById(id)),
		deleteFile: (id, name, cb) => dispatch(deleteFile(id, name, cb)),
		updateContractor: (id) => dispatch(updateContractor(id))
	}
}

const ContractorFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedContractorFiles);

ContractorFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractorFiles);
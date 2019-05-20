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

import { addFiles, getProjectDetailById } from '../../../actions/gen-actions';

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

class ConnectedProjectFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openUploadForm: false,
			snackBar: false,
			isSuccess: false,
			isUploadingFile: false
		}
	}

	componentDidMount() {
	}

	handleUploadFiles = async (files) => {
		const { selectedProject } = this.props;
		this.setState({ isUploadingFile: true });

		await this.props.addFiles(selectedProject.id, files, (res) => this.setState({
			isSuccess: res,
			snackBar: true
		}));
		await this.props.getProjectDetailById(selectedProject.id);

		this.setState({
			openUploadForm: false,
			isUploadingFile: false
		})
	}

	render() {
		const { classes, selectedProject } = this.props;
		const projectFiles = selectedProject.projectFiles;

		if (this.state.isUploadingFile)
			return <div className={classes.root} >
				<CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root} >
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
						{projectFiles.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell component="th" scope="row" align="center">
									<a href={process.env.PROJECT_API + "/projects/" + selectedProject.id + "/files/" + row.name}>{row.name}</a>
								</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton className={classes.button} aria-label="Delete" color="primary">
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
					/*acceptedFiles = {['asterisk']}*/
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
							this.state.isSuccess ? 'file upload success!' : 'file upload failed!'
						}</span>
					}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.gen_data.selectedProject,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addFiles: (id, files, cb) => dispatch(addFiles(id, files, cb)),
		getProjectDetailById: (id) => dispatch(getProjectDetailById(id))
	}
}

const ProjectFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectFiles);

ProjectFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectFiles);
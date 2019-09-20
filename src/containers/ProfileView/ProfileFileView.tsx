import React from 'react';
import { connect } from 'react-redux';
import { withStyles, StyledComponentProps } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { DropzoneDialog } from 'material-ui-dropzone';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from 'components/shared/CustomTableCell';

import * as ContActions from 'store/actions/cont-actions';
import ContApi from 'services/contractor';
import { UserProfile } from 'types/global';
import { compose } from 'redux';
import styles from './ProfileFileView.style'
import Button from 'components/CustomButtons/Button';

import ProfileLicensesView from './ProfileLicenses';
import ProfileProjectsView from './ProfileProjects';
import ProfilePhotosView from './ProfilePhotos';
import ProfileSocialView from './ProfileSocial';


interface ProfileFileViewProps extends StyledComponentProps, withSnackbarProps {
	user: UserProfile;
	contractor: any;
	selectContractor: (id: string) => any;
	uploadFiles: (id: string, file: string) => any;
	removeFile: (id: string, name: string) => any;
}

interface ProfileFileViewState {
	isBusy: boolean;
	openUploadForm: boolean;
	showConfirmDlg: boolean;
	nameToDel: string;
}

class ProfileFileView extends React.Component<ProfileFileViewProps, ProfileFileViewState> {
	constructor(props: Readonly<ProfileFileViewProps>) {
		super(props);

		this.state = {
			openUploadForm: false,
			showConfirmDlg: false,
			isBusy: false,
			nameToDel: '',
		};
	}

	handleUploadFiles = async files => {
		const { user, uploadFiles, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		let id = user.user_metadata.contractor_id;

		try {
			await uploadFiles(id, files);
			await selectContractor(id);
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files uploaded');
		} catch (error) {
			console.log('ProfileFileView.handleUploadFiles: ', error);
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files upload failed');
		}
	};

	closeConfirmDialog = () => {
		this.setState({ showConfirmDlg: false });
	};

	handleDelete = name => {
		this.setState({ showConfirmDlg: true, nameToDel: name });
	};

	handleremoveFile = async () => {
		this.setState({ isBusy: true });
		const { user, removeFile, selectContractor, showMessage } = this.props;
		let id = user.user_metadata.contractor_id;

		try {
			await removeFile(id, this.state.nameToDel);
			await selectContractor(id);
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files deleted');
		} catch (error) {
			this.setState({
				openUploadForm: false,
				isBusy: false,
			});
			showMessage(true, 'Files delete failed');
		}
	};

	uploadLicense = async (city: string, type: string, number: string, file: File) => {
		const { user, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		try {
			const id = user.user_metadata.contractor_id;
			await ContApi.uploadLicense(id, file, city, type, number);
			await selectContractor(id);
			showMessage(true, 'License uploaded');
			this.setState({ isBusy: false });
		} catch (error) {
			console.log('ProfileLicensesView.handleSubmit: ', error);
			showMessage(false, 'License upload failed');
			this.setState({ isBusy: false });
		}
	}

	uploadProject = async (title: string, price: number, location: string, service: string, duration: number, unit: string, year: number, desc: string, files: File[]) => {
		let period = 0;
		if (unit.startsWith('day')) period = duration;
		else if (unit.startsWith('week')) period = duration * 7;
		else period = duration * 30;

		const { user, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		try {
			const id = user.user_metadata.contractor_id;
			await ContApi.uploadPastProject(id, title, desc, price, year, period, service)
			await selectContractor(id);
			this.setState({ isBusy: false });
			showMessage(true, 'Project uploaded');
		} catch (error) {
			console.log('ProfileFileView.uploadProject: ', error);
			this.setState({ isBusy: false });
			showMessage(false, 'Project upload failed');
		}
	}

	uploadPhoto = async (file: File) => {
		const { user, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		try {
			const id = user.user_metadata.contractor_id;
			await ContApi.uploadFiles(id, [file]);
			await selectContractor(id);
			showMessage(true, 'Photo uploaded');
			this.setState({ isBusy: false });
		} catch (error) {
			console.log('ProfileFileView.uploadPhoto: ', error);
			showMessage(false, 'Photo upload failed');
			this.setState({ isBusy: false });
		}
	}

	uploadVideo = async (file: string) => {
		console.log('ProfileFileView.uploadVideo: ');
	}

	updateTitle = async (id: string, title: string) => {
		console.log('ProfileFileView.updateTitle: ');
	}

	deletePV = async (name: string) => {
		const { user, selectContractor, showMessage } = this.props;
		this.setState({ isBusy: true });
		try {
			const id = user.user_metadata.contractor_id;
			await ContApi.deleteFile(id, name);
			await selectContractor(id);
			showMessage(true, 'Photo deleted');
			this.setState({ isBusy: false });
		} catch (error) {
			console.log('ProfileFileView.deletePV: ', error);
			showMessage(false, 'Photo delete failed');
			this.setState({ isBusy: false });
		}
	}

	saveSocial = async (facebook: string, instagram: string, twitter: string) => {
		console.log('ProfileFileView.saveSocial: ');
	}

	render() {
		const { classes, contractor, user } = this.props;
		const { isBusy } = this.state;
		const files = contractor.contractorFiles;

		return (
			<Box className={classes.root}>
				{isBusy && <CircularProgress size={32} thickness={4} />}
				<Paper className={classes.contents}>
					<Table className={classes.relative} size="small">
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Name</CustomTableCell>
								<CustomTableCell align="center">
									<IconButton
										className={classes.button}
										aria-label="Add"
										style={{ color: '#FFFFFF' }}
										onClick={() => this.setState({ openUploadForm: true })}
									>
										<NoteAddIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{files.map(row => (
								<TableRow className={classes.row} key={row.id} hover>
									<CustomTableCell component="th" scope="row" align="center">
										<a
											download={row.name}
											href={
												process.env.REACT_APP_PROJECT_API +
												'/contractors/' +
												user.user_metadata.contractor_id +
												'/files/' +
												row.name
											}
										>
											{row.name}
										</a>
									</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton
											className={classes.button}
											aria-label="Delete"
											color="primary"
											onClick={() => this.handleDelete(row.name)}
										>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<ProfileLicensesView userProfile={user} handleSubmit={this.uploadLicense} />
					<ProfileProjectsView handleSubmit={this.uploadProject} />
					<ProfilePhotosView
						photos={[]}
						videos={[]}
						uploadPhoto={this.uploadPhoto}
						uploadVideo={this.uploadVideo}
						updateTitle={this.updateTitle}
						delete={this.deletePV}
					/>
					<ProfileSocialView handleSubmit={this.saveSocial} />
				</Paper>
				<DropzoneDialog
					open={this.state.openUploadForm}
					onSave={this.handleUploadFiles}
					maxFileSize={52428800}
					acceptedFiles={[
						'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
					]}
					filesLimit={100}
					onClose={() => this.setState({ openUploadForm: false })}
				/>
				<Dialog
					open={this.state.showConfirmDlg}
					onClose={this.closeConfirmDialog}
					aria-labelledby="alert-dialog-title"
				>
					<DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
					<DialogContent className={classes.relative}>
						<DialogContentText id="alert-dialog-description">
							Do you really want to delete this file?
            			</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeConfirmDialog} autoFocus>
							Cancel
            			</Button>
						<Button onClick={this.handleremoveFile} color="primary">
							Yes
            			</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	contractor: state.cont_data.selectedContractor,
	user: state.global_data.userProfile,
});
const mapDispatchToProps = {
	selectContractor: ContActions.selectContractor,
	uploadFiles: ContActions.uploadFiles,
	removeFile: ContActions.removeFile,
};

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(withSnackbar(ProfileFileView));

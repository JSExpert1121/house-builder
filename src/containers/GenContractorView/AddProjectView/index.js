import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css"

import { addFilesToProject, addProject } from '../../../actions';
import CustomSnackbar from '../../../components/shared/CustomSnackbar';

const styles = theme => ({
	"@global": {
		".MuiInputBase-input": {
			padding: '2px 0 3px',
		},
		".MuiFormControl-marginNormal": {
			margin: '8px 0 4px'
		},
		".MuiFormControl-root": {
			margin: '4px 0'
		}
	},
	root: {
		position: 'relative',
		flexGrow: 1,
		height: "calc(100vh - 128px)",
		margin: theme.spacing(1),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	mainBoard: {
		width: "100%",
		height: "100%",
		borderBottom: "5px solid " + theme.palette.primary.light,
		padding: theme.spacing(2),
		// [theme.breakpoints.up('sm')]: {
		// 	width: 700,
		// },
		display: 'flex',
		flexDirection: "column",
		overflow: "auto",
	},
	paper_title: {
		width: '100%'
	},
	paper_price: {
		width: '100%'
	},
	paper_job_detail: {
		width: '100%'
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	submitButton: {
		border: "1px solid " + theme.palette.primary.light,
		marginTop: theme.spacing(1),
		width: 120,
		[theme.breakpoints.up('sm')]: {
			width: 170,
		},
		color: "white",
		backgroundColor: theme.palette.primary.light,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		}
	},
	editField: {
		lineHeight: "1.5rem",
		height: '1.5rem'
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)'
	},
	fileUpload: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	fileItem: {
		margin: '6px',
		border: '1px solid #CCC'
	}
});

class connectedAddProjectView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			price: 0,
			description: '',
			isBusy: false,
			files: [],
			showMessage: false,
			message: '',
			variant: 'error'
		};
	}

	handleAddProject = async () => {
		const { userProfile } = this.props;
		const { files, title, description, price } = this.state;
		if (title.length === 0 || description === 0 || price.length === 0) {
			this.setState({
				showMessage: true,
				message: 'You must fill in all the items'
			})
			return;
		}

		const projectData = {
			title, description,
			budget: price,
			updatedBy: userProfile.email
		};

		this.setState({ isBusy: true });

		let projectId = null;
		try {
			projectId = await this.props.addProject(userProfile.user_metadata.contractor_id, projectData);
			await this.props.addFiles(projectId, files);
			this.setState({ isBusy: false });
			this.props.history.push('/g_cont');
		} catch (error) {
			console.log('AddProjectView: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Add project failed.'
			})
		}
	}

	handleFileChange = (e) => {
		console.log(this.state.files, e.target.files);
		this.setState({ files: [...this.state.files, ...e.target.files] })
	}

	handleRemove = (file) => {
		const { files } = this.state;

		for (let i = 0; i < files.length; i++) {
			if (files[i].name === file.name && files[i].size === file.size) {
				files.splice(i, 1);
				break;
			}
		}

		this.setState({ files: [...files] });
	}

	handleDescChange = (value) => {
		this.setState({ description: value });
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Card className={classes.mainBoard} >
					<TextField
						label="Project Title"
						className={classes.paper_title}
						value={this.state.title}
						onChange={(val) => this.setState({ title: val.target.value })}
						InputProps={{ classes: { input: classes.editField } }}
					/>
					<TextField
						type="number"
						label="Price"
						className={classes.paper_price}
						value={this.state.price}
						type="number"
						onChange={(val) => this.setState({ price: val.target.value })}
						InputProps={{ classes: { input: classes.editField } }}
					/>
					<SimpleMDE
						style={{ height: '209px', overflow: 'auto', marginBottom: '8px' }}
						value={this.state.description}
						onChange={this.handleDescChange}
						options={{
							placeholder: 'Description here'
						}}
					/>
					<Box className={classes.fileUpload}>
						<input
							accept="text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*"
							id="upload-file"
							multiple
							type="file"
							style={{ display: 'none' }}
							onChange={this.handleFileChange}
						/>
						<label htmlFor="upload-file" style={{ display: 'inline' }}>
							<Button variant="contained" color="default" className={classes.button} component="span">
								<CloudUploadIcon className={classes.rightIcon} />
								&nbsp;&nbsp;Upload
							</Button>
						</label>
						{this.state.files.map(file => (
							<span className={classes.fileItem} key={file.name + file.size}>
								{file.name}
								<IconButton onClick={() => this.handleRemove(file)} style={{ padding: '0px' }}>
									<DeleteIcon />
								</IconButton>
							</span>
						))}
					</Box>
					<Box style={{ width: '100%', textAlign: 'center' }}>
						<Button disabled={this.state.isBusy} className={classes.submitButton} onClick={this.handleAddProject}>
							Add Project
						</Button>
					</Box>
					{this.state.isBusy && <CircularProgress className={classes.busy} />}
					<CustomSnackbar
						open={this.state.showMessage}
						variant={this.state.variant}
						message={this.state.message}
						handleClose={() => this.setState({ showMessage: false })} />
				</Card>
			</Paper >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addProject: (id, data) => dispatch(addProject(id, data)),
		addFiles: (id, files) => dispatch(addFilesToProject(id, files))
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const AddProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedAddProjectView);

connectedAddProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
	userProfile: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(AddProjectView));
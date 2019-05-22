import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, TextField, Button } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import { addProject, addFiles } from '../../../actions/gen-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	mainBoard: {
		width: "90%",
		borderBottom: "5px solid " + theme.palette.primary.light,
		height: "90%",
		padding: "20px",
		[theme.breakpoints.up('sm')]: {
			width: 700,
		},
		display: 'flex',
		flexDirection: "column",
		overflow: "scroll",
	},
	paper_title_price: {
		display: 'flex',
		alignItems: "stretch",
	},
	paper_title: {
		marginRight: 8,
		flexGrow: 9
	},
	paper_price: {
		flexGrow: 1
	},
	paper_job_detail: {
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	submitButton: {
		border: "1px solid " + theme.palette.primary.light,
		marginTop: "10px",
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
		lineHeight: "1.5rem"
	}
});

class connectedAddProjectView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			price: 0,
			description: "",
			isSaving: false,
			files: [],
		};
	}

	componentDidMount() {
	}

	handleAddProject = async () => {
		const { userProfile } = this.props;
		const files = this.state.files;

		const projectData = {
			"title": this.state.title,
			"description": this.state.description,
			"budget": this.state.price,
			"updatedBy": userProfile.email
		};

		this.setState({
			isSaving: true
		});

		let projectId = null;
		await this.props.addProject(userProfile.user_metadata.contractor_id, projectData, (res) => {
			if (res === false) {
				this.setState({ isSaving: false });
				return;
			}
			projectId = res;
		});

		await this.props.addFiles(projectId, files);

		this.setState({
			isSaving: false
		});
		this.props.history.push("/g_cont");
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Card className={classes.mainBoard} >
					<div className={classes.paper_title_price}>
						<TextField
							label="project title"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							className={classes.paper_title}
							value={this.state.title}
							onChange={(val) => this.setState({ title: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							type="number"
							label="price"
							margin="normal"
							InputLabelProps={{
								shrink: true,
							}}
							className={classes.paper_price}
							value={this.state.price}
							onChange={(val) => this.setState({ price: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
					</div>
					<TextField
						label="detail"
						multiline
						rows="10"
						className={classes.paper_job_detail}
						margin="normal"
						InputLabelProps={{
							shrink: true,
						}}
						value={this.state.description}
						onChange={(val) => this.setState({ description: val.target.value })}
					/>
					<div
						style={{ overflow: 'scroll', minHeight: '250px' }}>
						<DropzoneArea
							onChange={(files) => {
								this.setState({ files: files })
							}}
							maxFileSize={52428800}
							showFileNamesInPreview={true}
							filesLimit={100}
							dropzoneText='select files to upload(< 50mb)'
						/>
					</div>
					<Button disabled={this.state.isSaving} className={classes.submitButton} onClick={this.handleAddProject}>
						Add Project
							{
							this.state.isSaving &&
							<CircularProgress
								disableShrink
								size={24}
								thickness={4}
							/>
						}
					</Button>
				</Card>
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		addProject: (id, data, cb) => dispatch(addProject(id, data, cb)),
		addFiles: (id, files) => dispatch(addFiles(id, files))
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const AddProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedAddProjectView);

AddProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AddProjectView));
import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, TextField, InputAdornment, Input, Button, Divider } from '@material-ui/core';
import { hover } from 'glamor';
import axios from 'axios';

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
		padding: "20px",
		[theme.breakpoints.up('sm')]: {
			width: 700,
		},
		display: 'flex',
		flexDirection: "column",
		overflow: "auto",
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
	}
});

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			price: 0,
			description: "",
			isSaving: false
		};
	}

	componentDidMount() {
	}

	handleAddProject = () => {
		const { userProfile } = this.props;

		const projectData = {
			"title": this.state.title,
			"description": this.state.description,
			"budget": this.state.price,
			"updatedBy": userProfile.email
		};

		this.setState({
			isSaving: true
		});

		axios.post("https://bcbe-service.herokuapp.com/contractors/" + userProfile.user_metadata.contractor_id + "/projects",
			projectData)
			.then((response) => {
				console.log(response);
				this.setState({
					isSaving: false
				});
				this.props.history.push("/g_cont");
			}).catch(err => {
				console.log(err.message);

				this.setState({
					isSaving: false
				});
			});
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
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const CurrentProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedCurProView);

CurrentProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CurrentProjectView));
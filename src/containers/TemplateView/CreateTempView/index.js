import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { createTemplate } from '../../../actions/tem-actions';

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
	paper_title: {
		marginRight: 8,
		flexGrow: 9
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

class ConnCreateTempView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			isSaving: false
		};
	}

	componentDidMount() {
	}

	handleAddProject = async () => {
		const { userProfile } = this.props;

		this.setState({
			isSaving: true
		});

		const template = {
			"name": this.state.name,
			"description": this.state.description,
			"updatedBy": userProfile.email
		}

		await this.props.createTemplate(template);

		this.setState({
			isSaving: false
		});

		this.props.history.push("/m_temp");
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Card className={classes.mainBoard} >
					<TextField
						label="template title"
						margin="normal"
						InputLabelProps={{
							shrink: true,
						}}
						className={classes.paper_title}
						value={this.state.name}
						onChange={(val) => this.setState({ name: val.target.value })}
					/>
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
						Add Template
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
		createTemplate: template => dispatch(createTemplate(template))
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const CreateTempView = connect(mapStateToProps, mapDispatchToProps)(ConnCreateTempView);

CreateTempView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CreateTempView));
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Card, Avatar, Button, CircularProgress } from '@material-ui/core';
import auth0Client from '../../auth0/auth';

import TSnackbarContent from '../SnackBarContent';

const styles = theme => ({
	root: {
		display: 'flex',
		justifyContent: "center",
		alignItems: "center",
		height: "calc(100vh - 64px)",
		overflow: "auto"
	},
	container: {
		width: "300px",
		height: "500px",
		padding: "10px 10px 10px 10px",
		borderRadius: "0",
		[theme.breakpoints.up('sm')]: {
			width: '400px',
		}
	},
	textFieldHalf: {
		margin: "10px 10px 0px 10px",
		width: "120px",
		[theme.breakpoints.up('sm')]: {
			width: '170px',
		}
	},
	textFieldFull: {
		margin: "10px 10px 0px 10px",
		width: "260px",

		[theme.breakpoints.up('sm')]: {
			width: '360px',
		}
	},
	avatar: {
		marginLeft: 60,
		marginTop: 20,
		marginBottom: 30,
		width: 160,
		height: 160,
		[theme.breakpoints.up('sm')]: {
			marginLeft: 110,
		}
	},
	submitButton: {
		border: "1px solid #4a148c",
		margin: "50px 10px 10px 10px",
		width: 120,
		[theme.breakpoints.up('sm')]: {
			width: 170,
		},
		color: "white",
		backgroundColor: theme.palette.primary.light,
	},
	cancelButton: {
		border: "1px solid #c7a4ff",
		margin: "50px 10px 10px 10px",
		width: 120,
		[theme.breakpoints.up('sm')]: {
			width: 170,
		},
	},

	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ProfileView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			firstname: "",
			lastname: "",
			email: "",
			picture: "",
			password: "",
			passwordc: "",
			profile: null,
			isSuccess: false,
		}
	}

	componentDidMount() {
		{
			auth0Client.getProfile((profile) => {
				this.setState({
					firstname: profile.user_metadata.firstname,
					lastname: profile.user_metadata.lastname,
					email: profile.email,
					picture: profile.picture,
					profile: profile
				});
			});
		}

	}

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ isSuccess: false });
	};

	render() {
		const { classes } = this.props;

		if (this.state.profile === null) {
			return (<div> <CircularProgress className={classes.waitingSpin} /></div>);
		}

		return (
			<div className={classes.root}>
				<form noValidate autoComplete="off">
					<Card className={classes.container}>
						{
							this.state.isSuccess ?
								<TSnackbarContent
									onClose={this.handleClose}
									variant="success"
									message="Your profile has been saved!"
								/> : <div></div>
						}

						<Avatar alt="Ivan" src={this.state.picture} className={classes.avatar} />
						<TextField
							label="first name"
							className={classes.textFieldHalf}
							value={this.state.firstname}
							onChange={(val) => this.setState({ firstname: val.target.value })}
							margin="normal"
						/>

						<TextField
							label="last name"
							className={classes.textFieldHalf}
							value={this.state.lastname}
							onChange={(val) => this.setState({ lastname: val.target.value })}
							margin="normal"
						/>

						<TextField
							disabled
							label="email"
							className={classes.textFieldFull}
							value={this.state.email}
							onChange={(val) => this.setState({ email: val.target.value })}
							margin="normal"
						/>
						<Button className={classes.cancelButton} onClick={
							() => this.props.history.replace("/")
						}> Cancel</Button>
						<Button className={classes.submitButton} onClick={

							async () => {
								this.setState({
									isSuccess: false,
								})
								const new_prof = {
									user_metadata: {
										firstname: "",
										lastname: ""
									},
								};
								new_prof.user_metadata.firstname = this.state.firstname;
								new_prof.user_metadata.lastname = this.state.lastname;
								await auth0Client.updateProfile(new_prof, () => {
									this.setState({
										isSuccess: true
									})
								});
							}
						}>
							Confirm
						</Button>
					</Card>
				</form>
			</div >
		);
	}
}

ProfileView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProfileView));
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Card, Avatar, Button, CircularProgress } from '@material-ui/core';
import auth0Client from '../../auth0/auth';

import TSnackbarContent from '../SnackBarContent';
import axios from 'axios';
import uuidv1 from 'uuid';

const styles = theme => ({
	root: {
		display: 'flex',
		justifyContent: "center",
		alignItems: "center",
		height: "calc(100vh - 64px)",
		overflow: "auto",
		flexDirection: "column"
	},
	container: {
		width: "300px",
		height: "620px",
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
		marginLeft: 90,
		marginTop: 20,
		marginBottom: 30,
		width: 100,
		height: 100,
		[theme.breakpoints.up('sm')]: {
			marginLeft: 140,
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
	},

	successAlert: {
		width: "400px",
		marginBottom: "10px"
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
			company: "",
			street: "",
			city: "",
			phone: "",
			isGenChecked: false,
			isSubChecked: false,
			address: null
		}
	}

	componentDidMount() {
		{
			auth0Client.getProfile((profile, address) => {
				this.setState({
					address: address,
					company: address.name,
					street: address.street,
					city: address.city,
					phone: address.phone,
					firstname: profile.user_metadata.firstname,
					lastname: profile.user_metadata.lastname,
					email: profile.email,
					picture: profile.picture,
					isGenChecked: profile.user_metadata.roles.includes("Gen") || profile.user_metadata.roles.includes("GenSub") ? true : false,
					isSubChecked: profile.user_metadata.roles.includes("Sub") || profile.user_metadata.roles.includes("GenSub") ? true : false,
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

	handleRoleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	handleConfirm = async () => {
		this.setState({
			isSuccess: false,
		})

		let addressData = {
			"email": this.state.profile.email,
			"updatedBy": this.state.profile.email,
			"address": {
				"updatedBy": this.state.profile.email,
				"name": this.state.company,
				"street": this.state.street,
				"city": this.state.city,
				"phone": this.state.phone
			}
		};

		let userId = this.state.profile.user_metadata.id;
		console.log(userId);
		if (userId !== "") {
			addressData.id = userId;
			if (this.state.isGenChecked) {
				await axios.put("https://bcbe-service.herokuapp.com/gencontractors/" + userId, addressData)
					.then(response => {
						console.log(response);
					})
					.catch(error => {
						if (error.response.status === 404) {
							axios.post("https://bcbe-service.herokuapp.com/gencontractors/", addressData)
								.then(response => {
									console.log(response);
								})
								.catch(error => console.log(error.message));
						}
					});
			}
			if (this.state.isSubChecked) {
				await axios.put("https://bcbe-service.herokuapp.com/subcontractors/" + userId, addressData)
					.then(response => {
						console.log(response);
					})
					.catch(error => {
						if (error.response.status === 404) {
							axios.post("https://bcbe-service.herokuapp.com/subcontractors/", addressData)
								.then(response => {
									console.log(response);
								})
								.catch(error => console.log(error.message));
						}
					});
			}
		}

		else {
			if (this.state.isGenChecked)
				await axios.post("https://bcbe-service.herokuapp.com/gencontractors", addressData)
					.then(response => {
						userId = response.data.id;
						console.log(response);
					})
					.catch(error => console.log(error.message));

			addressData.id = userId;
			if (this.state.isSubChecked) {
				await axios.post("https://bcbe-service.herokuapp.com/subcontractors", addressData)
					.then(response => {
						if (userId === '')
							userId = response.data.id;
						console.log(response);
					})
					.catch(error => console.log(error.message));
			}
		}

		let userRole = [];
		if (this.state.isGenChecked)
			userRole.push("Gen");
		if (this.state.isSubChecked)
			userRole.push("Sub");

		const new_prof = {
			user_metadata: {
				firstname: "",
				lastname: "",
				id: userId,
				roles: userRole
			}
		};

		new_prof.user_metadata.firstname = this.state.firstname;
		new_prof.user_metadata.lastname = this.state.lastname;
		await auth0Client.updateProfile(new_prof, (profile, address) => {
			this.setState({
				isSuccess: true,
				profile: profile
			})
		});
	}

	render() {
		const { classes } = this.props;

		if (this.state.profile === null || this.state.address === null) {
			return (<div> <CircularProgress className={classes.waitingSpin} /></div>);
		}

		return (
			<div className={classes.root}>{
				this.state.isSuccess ?
					<TSnackbarContent
						className={classes.successAlert}
						onClose={this.handleClose}
						variant="success"
						message="Your profile has been saved!"
					/> : <div></div>
			}
				<form noValidate autoComplete="off">
					<Card className={classes.container}>


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
						<TextField
							label="company"
							className={classes.textFieldFull}
							value={this.state.company}
							onChange={(val) => this.setState({ company: val.target.value })}
							margin="normal"
						/>

						<TextField
							label="street"
							className={classes.textFieldHalf}
							value={this.state.street}
							onChange={(val) => this.setState({ street: val.target.value })}
							margin="normal"
						/>

						<TextField
							label="city"
							className={classes.textFieldHalf}
							value={this.state.city}
							onChange={(val) => this.setState({ city: val.target.value })}
							margin="normal"
						/>

						<TextField
							label="phone"
							className={classes.textFieldFull}
							value={this.state.phone}
							onChange={(val) => this.setState({ phone: val.target.value })}
							margin="normal"
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.isGenChecked}
									onChange={this.handleRoleChange('isGenChecked')}
									value="isGenChecked"
								/>
							}
							label="Gen Contractor"
							className={classes.textFieldHalf}
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={this.state.isSubChecked}
									onChange={this.handleRoleChange('isSubChecked')}
									value="isSubChecked"
								/>
							}
							label="Sub Contractor"
							className={classes.textFieldHalf}
						/>

						<Button className={classes.cancelButton} onClick={
							() => this.props.history.replace("/")
						}> Cancel</Button>
						<Button className={classes.submitButton} onClick={this.handleConfirm}>
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
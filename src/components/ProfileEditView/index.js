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

import { connect } from 'react-redux';
import { setUserProfile } from '../../actions';
import { white } from 'ansi-colors';

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
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
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

class connectedProfileView extends Component {

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
			isSaving: false,
			isDataLoaded: false
		}
	}

	async componentDidMount() {
		const { userProfile } = this.props;

		let address = {
			name: "",
			city: "",
			street: "",
			phone: ""
		}

		await axios.get(process.env.PROJECT_API + "contractors/" + userProfile.user_metadata.contractor_id)
			.then(async response => {
				if (response.data.address !== null)
					address = response.data.address;
			}).catch(err => console.log(err.message));

		this.setState({
			company: address.name,
			street: address.street,
			city: address.city,
			phone: address.phone,
			firstname: userProfile.user_metadata.firstname,
			lastname: userProfile.user_metadata.lastname,
			email: userProfile.email,
			picture: userProfile.picture,
			isGenChecked: userProfile.user_metadata.roles.includes("Gen") || userProfile.user_metadata.roles.includes("GenSub") ? true : false,
			isSubChecked: userProfile.user_metadata.roles.includes("Sub") || userProfile.user_metadata.roles.includes("GenSub") ? true : false,
			isDataLoaded: true
		});

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
		const { userProfile } = this.props;

		this.setState({
			isSuccess: false,
			isSaving: true
		})

		let cont_id = userProfile.user_metadata.contractor_id;

		/*
		let contractorData = {
			"email": userProfile.email,
			"updatedBy": userProfile.email,
		};

		if (cont_id !== "") {
			contractorData.userId = cont_id;

			if (this.state.isGenChecked) {
				await axios.put(process.env.PROJECT_API + "gencontractors/" + cont_id, contractorData)
					.then(response => {
						console.log(response);
					})
					.catch(error => {
						if (error.response.status === 404) {
							axios.post(process.env.PROJECT_API + "gencontractors/", contractorData)
								.then(response => {
									console.log(response);
								})
								.catch(error => console.log(error.message));
						}
					});
			}
			if (this.state.isSubChecked) {
				await axios.put(process.env.PROJECT_API + "subcontractors/" + cont_id, contractorData)
					.then(response => {
						console.log(response);
					})
					.catch(error => {
						if (error.response.status === 404) {
							axios.post(process.env.PROJECT_API + "subcontractors/", contractorData)
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
				await axios.post(process.env.PROJECT_API + "gencontractors", contractorData)
					.then(response => {
						cont_id = response.data.id;
						console.log(response);
					})
					.catch(error => console.log(error.message));

			if (this.state.isSubChecked) {
				await axios.post(process.env.PROJECT_API + "subcontractors", contractorData)
					.then(response => {
						if (cont_id === '')
							cont_id = response.data.id;
						console.log(response);
					})
					.catch(error => console.log(error.message));
			}
		} */

		let addr;
		await axios.get(process.env.PROJECT_API + "contractors/" + cont_id)
			.then(response => {
				addr = response.data.address;
			})
			.catch(error => {
				console.log(error.message);
			});

		let addressData = {
			"name": this.state.company,
			"street": this.state.street,
			"city": this.state.city,
			"phone": this.state.phone,
		};

		await axios.post(process.env.PROJECT_API + "contractors/" + cont_id, {
			"email": userProfile.user_metadata.email,
			"updatedBy" : userProfile.user_metadata.email,
			"address": addressData
		})

		/*let userRole = [];
		if (this.state.isGenChecked)
			userRole.push("Gen");
		if (this.state.isSubChecked)
			userRole.push("Sub");*/

		const new_prof = {
			user_metadata: {
				firstname: this.state.firstname,
				lastname: this.state.lastname,
				// contractor_id: cont_id,
				// roles: userRole
			}
		};

		await auth0Client.updateProfile(new_prof, (profile) => {
			this.props.setUserProfile(profile);
			this.setState({
				isSuccess: true,
				isSaving: false
			});
		});
	}

	render() {
		const { classes, userProfile } = this.props;

		if (this.state.isDataLoaded === false)
			return (
				<CircularProgress className={classes.waitingSpin} />
			);

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
						{
							/*
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
							/> */
						}

						<Button className={classes.cancelButton} onClick={
							() => this.props.history.replace("/")
						}> Cancel </Button>
						<Button disabled={this.state.isSaving} className={classes.submitButton} onClick={this.handleConfirm}>
							Confirm
							{
								this.state.isSaving &&
								<CircularProgress
									size={24}
									thickness={4}
								/>
							}
						</Button>
					</Card>
				</form>
			</div >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setUserProfile: profile => dispatch(setUserProfile(profile))
	};
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile
	};
};

const ProfileView = connect(mapStateToProps, mapDispatchToProps)(connectedProfileView);

ProfileView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProfileView));
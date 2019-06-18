import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Card, Avatar, Button, CircularProgress, Box } from '@material-ui/core';

import auth0Client from '../../auth0/auth';

import TSnackbarContent from '../../components/SnackBarContent';
import axios from 'axios';

import { connect } from 'react-redux';
import { setUserProfile } from '../../actions';

const styles = theme => ({
	root: {
		display: 'flex',
		justifyContent: "center",
		alignItems: "center",
		height: "calc(100vh - 136px)",
		marginTop: 'auto',
		marginBottom: 'auto',
		overflow: "auto",
		flexDirection: "column"
	},
	container: {
		position: "relative",
		left: "0px",
		right: "0px",
		width: "300px",
		height: "auto",
		margin: theme.spacing(1),
		padding: theme.spacing(1),
		borderRadius: "0",
		[theme.breakpoints.up('sm')]: {
			width: '400px',
		}
	},
	textFieldHalf: {
		margin: theme.spacing(1),
		width: "120px",
		[theme.breakpoints.up('sm')]: {
			width: '170px',
		}
	},
	textFieldFull: {
		margin: theme.spacing(1),
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
	status: {
		position: "absolute",
		left: "20px",
		top: "10px",
		color: "blue",
		fontSize: "12px"
	},
	btnBox: {
		margin: theme.spacing(1),
	},
	submitButton: {
		width: 120,
		[theme.breakpoints.up('sm')]: {
			width: 170,
		},
		border: "1px solid #4a148c",
		color: "white",
		marginLeft: '20px',
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
		width: 120,
		[theme.breakpoints.up('sm')]: {
			width: 170,
		},
	},
	busy: {
		position: 'absolute',
		left: "calc(50% - 20px)",
		top: "calc(50% - 20px)",
		zIndex: '2000'
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
			isDataLoaded: false,
			hasFiles: false,
			status: ''
		}
	}

	async componentDidMount() {
		const { userProfile } = this.props;

		try {
			let res = await axios.get(process.env.PROJECT_API + "contractors/" + userProfile.user_metadata.contractor_id);
			let address = res.data.address || {
				name: "",
				city: "",
				street: "",
				phone: ""
			};
			let status = res.data.status;
			this.setState({
				status: status,
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

		} catch (error) {
			console.log(error.message);
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
			"updatedBy": userProfile.user_metadata.email,
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
		const { classes } = this.props;
		const status = "Status: " + this.state.status.toUpperCase();
		if (this.state.isDataLoaded === false)
			return <CircularProgress className={classes.waitingSpin} />;

		return (
			<div className={classes.root}>
				{
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
						<Box component='div' className={classes.status}>
							{status}
						</Box>

						<Box className={classes.btnBox}>
							<Button className={classes.cancelButton} onClick={() => this.props.history.replace("/")}> Cancel </Button>
						<Button disabled={this.state.isSaving} className={classes.submitButton} onClick={this.handleConfirm}>
							Confirm
							</Button>
						</Box>
							{
							this.state.isSaving && <CircularProgress className={classes.busy} />
							}
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
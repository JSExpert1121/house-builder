import React from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import auth0Client from '../../auth0/auth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';

import { CircularProgress, Button, MenuItem, Radio, Divider } from '@material-ui/core';
import { FormControl, InputLabel, Select, Checkbox } from '@material-ui/core';
import TSnackbarContent from '../SnackBarContent';

import { connect } from 'react-redux';
import { setUserProfile } from '../../actions';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		margin: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 20px)",
		overflow: "auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	settingView: {
		width: 500,
		padding: "5px",
	},
	saveBtn: {
		border: "1px solid #4a148c",
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		margin: 5,
		float: "right",
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
	},
	cancelBtn: {
		border: "1px solid #c7a4ff",
		margin: 5,
		float: "right"
	},
	formControl: {
		color: theme.palette.primary.light,
		margin: theme.spacing.unit,
		minWidth: 120,
		[theme.breakpoints.up('md')]: {
			minWidth: 240,
		},
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

class connectedSettingsView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			setting1: 10,
			setting2: "a",
			checkedA: false,
			checkedB: false,
			checkedC: false,
			isSaving: false,
			isSuccess: false
		}
	}
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	componentWillMount() {
		const { userProfile } = this.props;

		this.setState({
			setting1: userProfile.user_metadata.settings.setting1,
			setting2: userProfile.user_metadata.settings.setting2,
			checkedA: userProfile.user_metadata.settings.checkedA,
			checkedB: userProfile.user_metadata.settings.checkedB,
			checkedC: userProfile.user_metadata.settings.checkedC,

		});
	}

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ isSuccess: false });
	};

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<Card className={classes.settingView}>
					{
						this.state.isSuccess ?
							<div><TSnackbarContent
								onClose={this.handleClose}
								variant="success"
								message="Your settings has been saved!"
							/> <Divider /></div> : <div></div>
					}
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Setting</CustomTableCell>
								<CustomTableCell align="center">Value</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting1</CustomTableCell>
								<CustomTableCell align="center">
									<FormControl className={classes.formControl}>
										<Select
											value={this.state.setting1}
											onChange={
												(event) => {
													this.setState({ setting1: event.target.value });
												}
											}
											inputProps={{
												name: 'age',
												id: 'age-simple',
											}}
										>
											<MenuItem value={10}>s1v1</MenuItem>
											<MenuItem value={20}>s1v2</MenuItem>
											<MenuItem value={30}>s1v3</MenuItem>
										</Select>
									</FormControl>
								</CustomTableCell>
							</TableRow>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting2</CustomTableCell>
								<CustomTableCell align="center">
									<Radio
										checked={this.state.setting2 === 'a'}
										onChange={
											(event) => {
												this.setState({
													setting2: event.target.value
												});
											}
										}
										value="a"
										name="radio-button-demo"
										aria-label="A"
									/>
									<Radio
										checked={this.state.setting2 === 'b'}
										onChange={
											(event) => {
												this.setState({
													setting2: event.target.value
												});
											}
										}
										value="b"
										name="radio-button-demo"
										aria-label="B"
									/>
									<Radio
										checked={this.state.setting2 === 'c'}
										onChange={
											(event) => {
												this.setState({
													setting2: event.target.value
												});
											}
										}
										value="c"
										name="radio-button-demo"
										aria-label="C"
									/>
								</CustomTableCell>
							</TableRow>
							<TableRow className={classes.row} hover>
								<CustomTableCell align="center">Setting3</CustomTableCell>
								<CustomTableCell align="center">
									<Checkbox
										checked={this.state.checkedA}
										onChange={this.handleChange('checkedA')}
										value="checkedA"
									/>
									<Checkbox
										checked={this.state.checkedB}
										onChange={this.handleChange('checkedB')}
										value="checkedB"
									/>
									<Checkbox
										checked={this.state.checkedC}
										onChange={this.handleChange('checkedC')}
										value="checkedC"
									/>
								</CustomTableCell>
							</TableRow>
						</TableBody>
					</Table>
					<Button disabled={this.state.isSaving} className={classes.saveBtn} onClick={
						() => {
							this.setState({
								isSaving: true
							});

							const newSet = {
								user_metadata: {
									settings: {
										setting1: this.state.setting1,
										setting2: this.state.setting2,
										checkedA: this.state.checkedA,
										checkedB: this.state.checkedB,
										checkedC: this.state.checkedC,
									}
								}
							}

							auth0Client.updateSet(newSet,
								() => {
									auth0Client.getProfile(
										profile => {
											this.props.setUserProfile(profile);
										}
									);
									this.setState({
										isSuccess: true,
										isSaving: false
									});
								});
						}}>
						Save &nbsp;
						{
							this.state.isSaving &&
							<CircularProgress
								disableShrink
								size={24}
								thickness={4}
							/>
						}
					</Button>
					<Button className={classes.cancelBtn} onClick={
						() => this.props.history.replace("/")}>
						Cancel
					</Button>
				</Card >
			</div>
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

const SettingsView = connect(mapStateToProps, mapDispatchToProps)(connectedSettingsView);

SettingsView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SettingsView));
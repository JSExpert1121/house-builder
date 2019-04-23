import React from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import auth0Client from '../../Auth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import { fade } from '@material-ui/core/styles/colorManipulator';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { CircularProgress, Button, MenuItem, Radio } from '@material-ui/core';
import { FormControl, InputLabel, Select, Checkbox } from '@material-ui/core/es';
import { green } from '@material-ui/core/es/colors';

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
	total: {
		width: "500px",
		left: "calc(50% - 250px)",
	},
	saveBtn: {
		border: "1px solid #4a148c",
		backgroundColor: theme.palette.primary.light,
		borderRadius: 0,
		marginTop: 2
	},
	cancelBtn: {
		border: "1px solid #c7a4ff",
		borderRadius: 0,
		marginTop: 2
	},
	formControl: {
		color: theme.palette.primary.light,
		margin: theme.spacing.unit,
		minWidth: 120,
		[theme.breakpoints.up('md')]: {
			minWidth: 240,
		},
	},
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

class SettingsView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setting1: 10,
			setting2: "a",
			checkedA: false,
			checkedB: false,
			checkedC: false,
			profile: null,
		}
	}
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	async componentWillMount() {
		await auth0Client.getProfile((profile) => {
			console.log(profile);
			this.setState({
				setting1: profile.user_metadata.settings.setting1,
				setting2: profile.user_metadata.settings.setting2,
				checkedA: profile.user_metadata.settings.checkedA,
				checkedB: profile.user_metadata.settings.checkedB,
				checkedC: profile.user_metadata.settings.checkedC,
				profile: profile
			});
		});
	}

	render() {
		const { classes } = this.props;
		const profile = this.state.profile;

		if (profile === null)
			return (<div> <CircularProgress /></div>);

		return (
			<Card className={classes.root}>
				<Card className={classes.total}>
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
					<Button className={classes.saveBtn} onClick={
						() => {
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
							console.log(newSet);
							auth0Client.updateSet(newSet);
						}
					}> Save </Button>
					<Button className={classes.cancelBtn} onClick={
						() => this.props.history.replace("/")
					}> Cancel</Button>
				</Card >
			</Card>
		);
	}
}

SettingsView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SettingsView));
import React       from 'react'
import { connect } from 'react-redux';

import PropTypes                                            from 'prop-types';
import { emphasize, withStyles }                            from '@material-ui/core/styles';
import {
	Button,
	Card,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography
}                                                           from '@material-ui/core';
import classNames                                           from 'classnames';
import Select                                               from 'react-select';
import Chip                                                 from '@material-ui/core/Chip';
import MenuItem                                             from '@material-ui/core/MenuItem';
import CancelIcon                                           from '@material-ui/icons/Cancel';
import { searchFilter }                                     from '../../../actions';
import { getContrators0, getSpecialties, selectContractor } from '../../../actions/cont-actions';
import { match }                                            from "react-router";

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 136px)",
		margin: theme.spacing(1),
		overflow: "scroll"
	},
	tableWrap: {
		overflow: "auto",
		maxHeight: "calc(100vh - 192px)",
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	input: {
		display: 'flex',
		padding: 0,
		height: 'auto',
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	},
	successAlert: {
		marginBottom: "10px"
	},
	editField: {
		lineHeight: '1.5rem',
	},
	title: {
		padding: '20px',
		fontSize: '21px',
		color: 'grey'
	},
	pos: {
		marginBottom: 12,
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden'
	},
	chip: {
		margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
	},
	chipFocused: {
		backgroundColor: emphasize(
				theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
				0.08,
		),
	},
	noOptionsMessage: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
	},
	singleValue: {
		fontSize: 16,
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16,
	},
	card: {
		width: '100%',
		marginBottom: '20px',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'lightgrey'
	},
	button: {
		margin: theme.spacing(1),
	},
});

function NoOptionsMessage(props) {
	return (
			<Typography
					color="textSecondary"
					className={props.selectProps.classes.noOptionsMessage}
					{...props.innerProps}
			>
				{props.children}
			</Typography>
	);
}

function inputComponent({inputRef, ...props}) {
	return <div ref={inputRef} {...props} />;
}

function Control(props) {
	return (
			<TextField
					fullWidth
					InputProps={{
						inputComponent,
						inputProps: {
							className: props.selectProps.classes.input,
							inputRef: props.innerRef,
							children: props.children,
							...props.innerProps,
						},
					}}
					{...props.selectProps.textFieldProps}
			/>
	);
}

function Option(props) {
	return (
			<MenuItem
					buttonRef={props.innerRef}
					selected={props.isFocused}
					component="div"
					style={{
						fontWeight: props.isSelected ? 500 : 400,
					}}
					{...props.innerProps}
			>
				{props.children}
			</MenuItem>
	);
}

function Placeholder(props) {
	return (
			<Typography
					color="textSecondary"
					className={props.selectProps.classes.placeholder}
					{...props.innerProps}
			>
				{props.children}
			</Typography>
	);
}

function SingleValue(props) {
	return (
			<Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
				{props.children}
			</Typography>
	);
}

function ValueContainer(props) {
	return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
	return (
			<Chip
					tabIndex={-1}
					label={props.children}
					className={classNames(props.selectProps.classes.chip, {
						[props.selectProps.classes.chipFocused]: props.isFocused,
					})}
					onDelete={props.removeProps.onClick}
					deleteIcon={<CancelIcon {...props.removeProps} />}
			/>
	);
}

function Menu(props) {
	return (
			<Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
				{props.children}
			</Paper>
	);
}

const components = {
	Control,
	Menu,
	MultiValue,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer,
};

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

interface BidderListingProps {
	match: match
	getSpecialties: any
	getContrators0: any
}

interface BidderListingState {
	rowsPerPage: any
	currentPage: any
	isSaving: any
	openCategoryForm: any
	name: any
	filterName: any
	filterCity: any
	description: any
	snackBar: any
	SnackBarContent: any
	order: any
	multi: any
	contractors: any
	rowsPerPage1: any
}

class ConnectedBidderListingView extends React.Component<BidderListingProps, BidderListingState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isSaving: false,
			openCategoryForm: false,
			name: "",
			filterName: "",
			filterCity: "",
			description: "",
			snackBar: false,
			SnackBarContent: '',
			order: 'desc',
			multi: null,
			contractors: null,
			rowsPerPage1: null
		}
	}

	async componentDidMount() {
		await this.props.getSpecialties();
		await this.props.getContrators0(0, 20);
	}

	componentWillReceiveProps({contractors, searchResult}) {
		this.setState({contractors: contractors});
		if (searchResult)
			this.setState({contractors: {...contractors, content: searchResult}})
	}

	handleChangePage = (event, page) => {
		this.setState({currentPage1: page});
		this.props.getContrators0(page, this.state.rowsPerPage1);
	};

	handleChangeRowsPerPage = event => {
		const {contractors} = this.state;
		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= contractors.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getContrators0(currentPage, rowsPerPage);
	};

	onNameChange = e => {
		this.setState({filterName: e.target.value});
	};

	onCityChange = e => {
		this.setState({filterCity: e.target.value});
	};

	handleChangeMulti = (value) => {
		// setMulti(value);
	};

	handleSearch = () => {
		const multi = this.state.multi
				? this.state.multi.map(specialty => (specialty.value))
				: [];

		this.props.searchFilter(this.state.filterName, this.state.filterCity, multi, (result) => {
					if (result) {
						// this.props.updateContractor(selectedContractor.id);
					}
				}
		)
	}

	handleChange = name => value => {
		this.setState({
			[name]: value,
		});
	};

	render() {
		const {classes, theme, specialties, searchResult, match, userProfile} = this.props;
		const {contractors} = this.state;
		const suggestions = specialties ? specialties.content.map(specialty => ({
			value: specialty.id,
			label: specialty.name,
		})) : [];
		const selectStyles = {
			input: base => ({
				...base,
				color: theme.palette.text.primary,
			}),
		};

		if (contractors === null) {
			return <CircularProgress className={classes.waitingSpin}/>;
		}


		if (!userProfile.user_metadata.roles.includes("Gen") &&
				!userProfile.user_metadata.roles.includes("GenSub") &&
				!userProfile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
				<div className={classes.root}>
					<Card className={classes.card}>
						<TextField
								id="name"
								label="Name"
								className={classes.textField}
								value={this.state.filterName}
								onChange={e => this.onNameChange(e)}
								margin="normal"
						/>
						<TextField
								id="city"
								label="City"
								className={classes.textField}
								value={this.state.filterCity}
								onChange={e => this.onCityChange(e)}
								margin="normal"
						/>
						<Select
								classes={classes}
								styles={selectStyles}
								textFieldProps={{
									label: 'Specialty',
									InputLabelProps: {
										shrink: true,
									},
								}}
								options={suggestions}
								components={components}
								value={this.state.multi}
								onChange={this.handleChange('multi')}
								placeholder="Select multiple specialties"
								isMulti
						/>
						<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={this.handleSearch}>Search</Button>
						<Typography className={classes.title}>Search result</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<CustomTableCell> Logo </CustomTableCell>
									<CustomTableCell align="center">Name</CustomTableCell>
									<CustomTableCell align="center">Email</CustomTableCell>
									<CustomTableCell align="center">Rating</CustomTableCell>
									<CustomTableCell align="center">Other</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									contractors.content.map(
											row => (
													<TableRow className={classes.row} key={row.id} hover>
														<CustomTableCell component="th" scope="row"
														                 onClick={async () => {
															                 await this.props.selectContractor(row.id);
															                 this.props.history.push("/b_list/contractor_detail");
														                 }}
														>
														</CustomTableCell>
														<CustomTableCell align="center"
														                 onClick={async () => {
															                 await this.props.selectContractor(row.id);
															                 this.props.history.push("/b_list/contractor_detail");
														                 }}>{row.address ? row.address.name : "N/A"}</CustomTableCell>
														<CustomTableCell align="center"
														                 onClick={async () => {
															                 await this.props.selectContractor(row.id);
															                 this.props.history.push("/b_list/contractor_detail");
														                 }}>{row.email ? row.email : "N/A"}</CustomTableCell>
														<CustomTableCell align="center"
														                 onClick={async () => {
															                 await this.props.selectContractor(row.id);
															                 this.props.history.push("/b_list/contractor_detail");
														                 }}
														></CustomTableCell>
														<CustomTableCell align="center"
														                 onClick={async () => {
															                 await this.props.selectContractor(row.id);
															                 this.props.history.push("/b_list/contractor_detail");
														                 }}
														></CustomTableCell>
														{/* <CustomTableCell align="center">
															{this.isInvited(row.id) ?														
															<IconButton className={classes.button} aria-label="Delete" color="primary">
																<AccessAlarmIcon />	
															</IconButton>
															:
															<Button className={classes.button} aria-label="Delete" color="primary" onClick={
																async () => {
																	await this.props.inviteContractor(project.id, row.id, (result) => {																
																		if (result)
																		{
																			this.props.getContrators0(this.state.currentPage1, this.state.rowsPerPage1);
																			this.props.getProjectBiddersData(project.id, this.state.currentPage, this.state.rowsPerPage);
																		}
																			
																	});															
																}
															}>
																Invite
															</Button>	
															}			
												</CustomTableCell> */}
													</TableRow>
											)
									)
								}
							</TableBody>
						</Table>
						<TablePagination
								style={{overflow: "auto"}}
								rowsPerPageOptions={[5, 10, 20]}
								component="div"
								count={contractors.content.length}
								rowsPerPage={this.state.rowsPerPage}
								page={this.state.currentPage}
								backIconButtonProps={{
									'aria-label': 'Previous Page',
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page',
								}}
								onChangePage={this.handleChangePage}
								onChangeRowsPerPage={this.handleChangeRowsPerPage}
						/>
					</Card>
				</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getContrators0: (page, size) => dispatch(getContrators0(page, size)),
		selectContractor: (id) => dispatch(selectContractor(id)),
		getSpecialties: () => dispatch(getSpecialties()),
		searchFilter: (name, city, specialties, cb) => dispatch(searchFilter(name, city, specialties, cb)),
	};
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		contractors: state.cont_data.contractors,
		specialties: state.cont_data.specialties,
		searchResult: state.global_data.searchResult,
	};
};

const BidderListingView = connect(mapStateToProps, mapDispatchToProps)(ConnectedBidderListingView);

BidderListingView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(BidderListingView);
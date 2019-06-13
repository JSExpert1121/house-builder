import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {
	CircularProgress,
	Paper,
	Table, TableHead, TableCell, TableRow, TableBody, TableSortLabel,
	IconButton, TablePagination, TextField,
	Button,
	Snackbar,
	Typography,	
	Card
} from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import classNames from 'classnames';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles';

import TSnackbarContent from '../SnackBarContent';

import { getProjectBiddersData, searchFilter, inviteContractor } from '../../actions';
import { selectContractor, getSpecialties, getContrators0 } from '../../actions/cont-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 136px)",
		margin: theme.spacing(1),
		overflow: "scroll"
	},
	tableWrap: {
		overflow: "auto",		
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
		fontSize: 14,
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
		margin: '10px',
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
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	button: {
		margin: theme.spacing(1),
	},
	card: {
		width: '100%',
		marginBottom: '20px',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'lightgrey'
	},
	title: {
		padding: '20px',
		fontSize: '21px',
		color: 'grey'
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
  
  function inputComponent({ inputRef, ...props }) {
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

class ConnectedProjectBidders extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			rowsPerPage1: 20,
			currentPage1: 0,
			isSaving: false,
			openCategoryForm: false,
			name: "",
			filterName: "",
			filterCity: "",
			description: "",
			snackBar: false,
			SnackBarContent: '',
			order: 'desc',
			projectBidders: null,
			multi: null,
			contractors: null,
		}
	}

	async componentDidMount() {
		const { project, match } = this.props;			
		await this.props.getProjectBiddersData(project.id, 0, 20);
		await this.props.getSpecialties();
		await this.props.getContrators0(0, 20);
	}

	componentWillReceiveProps({ projectBidders, contractors, searchResult }) {		
		this.setState({ projectBidders: projectBidders,
						contractors: contractors });
		if(searchResult)
			this.setState({contractors: {...contractors, content: searchResult} })
	}

	handleChangePage = (event, page) => {
		const { project } = this.props;	
		this.setState({ currentPage: page });
		this.props.getProjectBiddersData(project.id, page, this.state.rowsPerPage);
	};

	handleChangePage1 = (event, page) => {
		this.setState({ currentPage1: page });
		this.props.getContrators0(page, this.state.rowsPerPage1);
	};

	handleChangeRowsPerPage = event => {
		const { projectBidders } = this.state;
		const { project } = this.props;	
		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= projectBidders.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getProjectBiddersData(project.id, currentPage, rowsPerPage);
	};

	handleChangeRowsPerPage1 = event => {
		const { contractors } = this.state;
		const rowsPerPage1 = event.target.value;
		const currentPage1 = rowsPerPage1 >= contractors.totalElements ? 0 : this.state.currentPage1;

		this.setState({
			rowsPerPage1: rowsPerPage1,
			currentPage1: currentPage1
		});

		this.props.getContrators0(currentPage1, rowsPerPage1);
	};

	onNameChange = e => {
		this.setState({filterName: e.target.value});
	};

	onCityChange = e => {
		this.setState({filterCity: e.target.value});
	};

	handleChangeMulti = (value) => {
		setMulti(value);
	};

	handleChange = name => value => {
		this.setState({
		  [name]: value,
		});
	};

	isInvited = id => {
		const value = this.props.projectBidders.map(
			row => {				
				if(row.id === id)						
						return true;					
			}
		)		
		if(value.includes(true)) 
			return true;
		else
			return false;
	}
	  
	render() {
		const { classes, project, theme, specialties, match } = this.props;	
		const { contractors, projectBidders } = this.state;
		const suggestions = specialties ? specialties.content.map(specialty => ({
			value: specialty.id,
			label: specialty.name,
		  })): [];
		const selectStyles = {
		input: base => ({
			...base,
			color: theme.palette.text.primary,								
		}),
		};

		if (projectBidders === null || contractors === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}		
		return (
			<div className={classes.root}>
				<Card className={classes.card}>
				<Typography className={classes.title}>Invited Bidders</Typography>
				<div className={classes.tableWrap}>
					<Table >
						<TableHead>
							<TableRow>	
								<CustomTableCell align="center">Logo</CustomTableCell>							
								<CustomTableCell align="center">Bidder Name</CustomTableCell>
								<CustomTableCell> Bidder Email </CustomTableCell>								
								<CustomTableCell align="center">Rating</CustomTableCell>
								<CustomTableCell align="center">Other</CustomTableCell>		
							</TableRow>
						</TableHead>
						<TableBody >
							{
								projectBidders.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell 
											onClick={async () => {
												await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
											}}></CustomTableCell>											
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
												}}>{row.address ? row.address.name : "N/A"}</CustomTableCell>
											<CustomTableCell component="th" scope="row"
												onClick={async () => {
													await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
												}}>
												{row.email ? row.email : "N/A"}
											</CustomTableCell>
											<CustomTableCell 
											onClick={async () => {
												await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
														this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
														this.props.history.push("/s_cont/contractor_detail");
											}}></CustomTableCell>
											<CustomTableCell 
											onClick={async () => {
												await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
											}}></CustomTableCell>
										</TableRow>
									)
								)
							}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					style={{ overflow: "auto" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={projectBidders.length}
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
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					open={this.state.snackBar}
					onClose={() => this.setState({
						snackBar: false
					})}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={
						<span id="message-id"> {
							this.state.snackBarContent
						}</span>
					}
				/>
				</Card>
				<Card className={classes.card}>
				<Typography className={classes.title}> Search Field </Typography>
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
					onClick={() => this.props.searchFilter(this.state.filterName, this.state.filterCity, this.state.multi?this.state.multi.map(specialty => (specialty.value)):[], (result) => {
						if (result)
							this.props.updateContractor(selectedContractor.id);
					}
				)}>Search</Button>
				<Typography className={classes.title}>Search result</Typography>
				<div className={classes.tableWrap}>
					<Table >
						<TableHead>
							<TableRow>
								<CustomTableCell> Logo </CustomTableCell>
								<CustomTableCell align="center">Name</CustomTableCell>
								<CustomTableCell align="center">Specialty</CustomTableCell>
								<CustomTableCell align="center">Rating</CustomTableCell>								
								<CustomTableCell align="center">Action</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody >
							{
								contractors.content.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell component="th" scope="row"
											onClick={async () => {
												await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
											}}
												>
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
												}}>{row.address ? row.address.name : "N/A"}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
												}}></CustomTableCell>
											<CustomTableCell align="center"
											onClick={async () => {
												await this.props.selectContractor(row.id);
												if (match.url.includes("g_cont"))
													this.props.history.push("/g_cont/contractor_detail");
												if (match.url.includes("s_cont"))
													this.props.history.push("/s_cont/contractor_detail");
											}}
												></CustomTableCell>		
											<CustomTableCell align="center">																							
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
											</CustomTableCell>
										</TableRow>
									)
								)
							}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					style={{ overflow: "auto" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={contractors.numberOfElements}
					rowsPerPage={this.state.rowsPerPage1}
					page={this.state.currentPage1}
					backIconButtonProps={{
						'aria-label': 'Previous Page',
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page',
					}}
					onChangePage={this.handleChangePage1}
					onChangeRowsPerPage={this.handleChangeRowsPerPage1}
				/>
				</Card>
			</div >
		);
	}
}

const mapStateToProps = state => {
	return {
		projectBidders: state.global_data.projectBidders,
		project: state.global_data.project,
		searchResult: state.global_data.searchResult,
		specialties: state.cont_data.specialties,	
		contractors: state.cont_data.contractors,	
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProjectBiddersData: (id, page, size) => dispatch(getProjectBiddersData(id, page, size)),	
		selectContractor: (id) => dispatch(selectContractor(id)),
		getSpecialties: () => dispatch(getSpecialties()),
		searchFilter: (name, city, specialties, cb) => dispatch(searchFilter(name, city, specialties, cb)),	
		getContrators0: (page, size) => dispatch(getContrators0(page, size)),
		inviteContractor: (projId, subConId, cb) => dispatch(inviteContractor(projId, subConId, cb)),	
		
	};
};

const ProjectBidders = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectBidders);

ProjectBidders.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProjectBidders);
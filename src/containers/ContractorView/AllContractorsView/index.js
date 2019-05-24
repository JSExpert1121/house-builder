import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Paper,
	Table, TableHead, TableCell, TableRow, TableBody, TableSortLabel,
	IconButton, TablePagination, TextField,
	Button,
	Snackbar
} from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Redux
import { connect } from 'react-redux';

// actions
import { getContrators0, selectContractor, deleteContractor, createContractor } from '../../../actions/cont-actions';
import TSnackbarContent from '../../../components/SnackBarContent';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
	},
	tableWrap: {
		overflow: "scroll",
		maxHeight: "calc(100vh - 64px - 72px - 57px - 20px)",
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
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

class ConnAllContractorView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isSaving: false,
			openCategoryForm: false,
			name: "",
			description: "",
			snackBar: false,
			SnackBarContent: '',
			order: 'desc',
			contractors: null,
		}
	}

	componentDidMount() {
		this.props.getContrators0(0, 20);		
	}
	componentWillReceiveProps({contractors}) {
		this.setState({contractors: contractors});
	}

	handleChangePage = (event, page) => {
		this.setState({ currentPage: page });
		this.props.getContrators0(page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { contractors } = this.state;
		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= contractors.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getContrators0(currentPage, rowsPerPage);
	};
	createSortHandler = () => {
		let order = 'desc';

		if (this.state.order === 'desc') {
		  order = 'asc';
		}
		this.state.contractors.content.sort((a,b) => (a.status > b.status) ? 1 : -1);
		this.setState({ order, });
	  };	

	render() {
		const { classes } = this.props;
		const { contractors } = this.state;		
		if (contractors === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}	
		return (
			<Paper className={classes.root}>
				<div className={classes.tableWrap}>
					<Table >
						<TableHead>
							<TableRow>
								<CustomTableCell> Contractor Email </CustomTableCell>
								<CustomTableCell align="center">Contractor Name</CustomTableCell>
								<CustomTableCell align="center">Contractor Street</CustomTableCell>
								<CustomTableCell align="center">Contractor City</CustomTableCell>
								<CustomTableCell align="center">Contractor Phone</CustomTableCell>
								<CustomTableCell align="center">
									<TableSortLabel
									  active={true}
									  direction={this.state.order}
									  onClick={() => this.createSortHandler()}
									  >
										Contractor Status
									</TableSortLabel>
								</CustomTableCell>
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
													this.props.history.push("/m_cont/contractor_detail");
												}}>
												{row.email?row.email: "N/A" }
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													this.props.history.push("/m_cont/contractor_detail");
												}}>{row.address? row.address.name: "N/A"}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													this.props.history.push("/m_cont/contractor_detail");
												}}>{row.address? row.address.street: "N/A"}</CustomTableCell>
											<CustomTableCell align="center"
											onClick={async () => {
												await this.props.selectContractor(row.id);
												this.props.history.push("/m_cont/contractor_detail");
												}}>{row.address? row.address.city: "N/A"}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													this.props.history.push("/m_cont/contractor_detail");
												}}>{row.address? row.address.phone: "N/A"}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectContractor(row.id);
													this.props.history.push("/m_cont/contractor_detail");
												}}>{row.status?row.status: "N/A" }</CustomTableCell>
											<CustomTableCell align="center">
												<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
													async () => {
														await this.props.deleteContractor(row.id, (result) => {
															this.setState({
																snackBar: true,
																snackBarContent: result ? 'delete contractor success' : 'please delete categories'
															});
															if(result)
																this.props.getContrators0(this.state.currentPage, this.state.rowsPerPage)
														});

														if (this.state.rowsPerPage * (this.state.currentPage) < contractors.totalElements - 1) {
															await this.props.getContrators0(this.state.currentPage, this.state.rowsPerPage);
														}
														else {
															const currentPage = this.state.currentPage - 1;

															this.setState({
																currentPage: currentPage
															});

															await this.props.getContrators0(currentPage, this.state.rowsPerPage);
														}
													}
												}>
													<DeleteIcon />
												</IconButton>
											</CustomTableCell>
										</TableRow>
									)
								)
							}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					style={{ overflow: "scroll" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={contractors.totalElements}
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

				<Dialog
					open={this.state.openCategoryForm}
					onClose={() => this.setState({ openCategoryForm: false })}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">create template</DialogTitle>
					<DialogContent>
						<DialogContentText>
							please input the correct template information
						</DialogContentText>
						<TextField
							autoFocus
							margin="normal"
							label="name"
							type="email"
							fullWidth
							value={this.state.name}
							onChange={(val) => this.setState({ name: val.target.value })}
							InputProps={{ classes: { input: classes.editField } }}
						/>
						<TextField
							label="detail"
							margin="dense"
							multiline
							rows="10"
							fullWidth
							value={this.state.description}
							onChange={(val) => this.setState({ description: val.target.value })}
						/>
					</DialogContent>
					<DialogActions>
						<Button disabled={this.state.isSaving} onClick={() => this.setState({ openCategoryForm: false })} color="primary">
							Cancel
						</Button>
						<Button disabled={this.state.isSaving} onClick={async () => {
							this.setState({ isSaving: true });
							const { userProfile } = this.props;
							const data = {
								"name": this.state.name,
								"description": this.state.description,
								"updatedBy": userProfile.email
							};

							await this.props.createContractor(data, (res) => {
								this.setState({
									snackBar: true,
									snackBarContent: res ? 'create template success' : 'create template failed'
								})
							});
							await this.props.getContrators0(0, this.state.rowsPerPage);

							this.setState({ openCategoryForm: false, isSaving: false, name: "", description: "" });
						}} color="primary">
							Add {
								this.state.isSaving && <CircularProgress
									disableShrink
									size={24}
									thickness={4} />
							}
						</Button>
					</DialogActions>
				</Dialog>
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
			</Paper >
		);
	}
}

const mapStateToProps = state => {
	return {
		contractors: state.cont_data.contractors,
		userProfile: state.global_data.userProfile
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getContrators0: (page, size) => dispatch(getContrators0(page, size)),
		selectContractor: (id) => dispatch(selectContractor(id)),
		deleteContractor: (id, cb) => dispatch(deleteContractor(id, cb)),
		createContractor: (data, cb) => dispatch(createContractor(data, cb))
	};
}

const AllContractorView = connect(mapStateToProps, mapDispatchToProps)(ConnAllContractorView);

AllContractorView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AllContractorView));
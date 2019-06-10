import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Paper,
	Table, TableHead, TableCell, TableRow, TableBody,
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
import { getTemplatesO, selectTemplate, deleteTemplate, createTemplate } from '../../../actions/tem-actions';
import TSnackbarContent from '../../../components/SnackBarContent';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 56px - 20px)",
		margin: theme.spacing(1),
	},
	tableWrap: {
		overflow: "scroll",
		maxHeight: "calc(100vh - 64px - 56px - 57px - 20px)",
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

class ConnAllTemplateView extends Component {
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
			SnackBarContent: ''
		}
	}

	componentDidMount() {
		this.props.getTemplatesO(0, 20);
	}

	handleChangePage = (event, page) => {
		this.setState({ currentPage: page });

		this.props.getTemplatesO(page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { templates } = this.props;
		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= templates.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getTemplatesO(currentPage, rowsPerPage);
	};

	render() {
		const { classes, templates } = this.props;

		if (templates === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<div className={classes.tableWrap}>
					<Table >
						<TableHead>
							<TableRow>
								<CustomTableCell> Template Name </CustomTableCell>
								<CustomTableCell align="center">Template Description</CustomTableCell>
								<CustomTableCell align="center" >
									<IconButton style={{ color: "#FFFFFF" }} onClick={
										() => this.setState({ openCategoryForm: true })
									}>
										<NoteAddIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody >
							{
								templates.content.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell component="th" scope="row"
												onClick={async () => {
													await this.props.selectTemplate(row.id);
													this.props.history.push("/m_temp/template_detail");
												}}>
												{row.name}
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectTemplate(row.id);
													this.props.history.push("/m_temp/template_detail");
												}}>{row.description}</CustomTableCell>

											<CustomTableCell align="center">
												<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
													async () => {
														await this.props.deleteTemplate(row.id, (result) => {
															this.setState({
																snackBar: true,
																snackBarContent: result ? 'delete template success' : 'please delete categories'
															});

														});

														if (this.state.rowsPerPage * (this.state.currentPage) < templates.totalElements - 1) {
															await this.props.getTemplatesO(this.state.currentPage, this.state.rowsPerPage);
														}
														else {
															const currentPage = this.state.currentPage - 1;

															this.setState({
																currentPage: currentPage
															});

															await this.props.getTemplatesO(currentPage, this.state.rowsPerPage);
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
					count={templates.totalElements}
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

							await this.props.createTemplate(data, (res) => {
								this.setState({
									snackBar: true,
									snackBarContent: res ? 'create template success' : 'create template failed'
								})
							});
							await this.props.getTemplatesO(0, this.state.rowsPerPage);

							this.setState({ openCategoryForm: false, isSaving: false, name: "", description: "" });
						}} color="primary">
							Add {
								this.state.isSaving && <CircularProgress

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
		templates: state.tem_data.templates,
		userProfile: state.global_data.userProfile
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getTemplatesO: (page, size) => dispatch(getTemplatesO(page, size)),
		selectTemplate: (id) => dispatch(selectTemplate(id)),
		deleteTemplate: (id, cb) => dispatch(deleteTemplate(id, cb)),
		createTemplate: (data, cb) => dispatch(createTemplate(data, cb))
	};
}

const AllTemplateView = connect(mapStateToProps, mapDispatchToProps)(ConnAllTemplateView);

AllTemplateView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AllTemplateView));
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Paper,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton, TablePagination, TextField,
	Button,
	Snackbar,
	Select,
	MenuItem
} from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { getTemplates, addTemplate, deleteTemplate, updateProject } from '../../../actions/gen-actions';

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
	},
	template: {
		margin: "10px",
	},
	fab: {
		width: "40px",
		height: "40px",
		marginLeft: "20px",
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

class ConnectedProjectTemplateView extends React.Component {
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
			template: '',			
		}
	}


	componentDidMount() {
		this.props.getTemplates(0, 20);
	}
	handleChangePage = (event, page) => {
		this.setState({ currentPage: page });

		this.props.getTemplates(page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { selectedProject } = this.props;
		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= selectedProject.projectTemplates.length ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getTemplates(currentPage, rowsPerPage);
	};
	createSortHandler = () => {
		let order = 'desc';

		if (this.state.order === 'desc') {
			order = 'asc';
		}
	
		this.setState({ order, });
		};	
	
	handleChange = (event) => {		
		this.setState({
			template: event.target.value,
		});
		}

	render() {
		const { classes, templates, selectedProject } = this.props;		
		const { template } = this.state;		
		if (selectedProject === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}
		return (
			<div className={classes.root}>
				<Paper className={classes.root}>
				<div className={classes.template}>
					<Select
						value={template}
						onChange={this.handleChange}
						name="templates"
						>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{
							templates? templates.content.map(
							row => (
								<MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>					
							)
							):
							null
						}
					</Select>	 
					<Fab color="primary" aria-label="Add" className={classes.fab} onClick={() => this.props.addTemplate(selectedProject.id, template, (result) => {	
								this.setState({template: ''})
								if(result)
									this.props.updateProject(selectedProject.id);						
							})}>
							<AddIcon />
					</Fab>			
					{
						templates? templates.content.map(
							row => (
								row.id == template ?
							<ul key={row.id}>
								<li>
									Name: {row.name}
								</li>
								<li>
									Description: {row.description}
								</li>
							</ul>
							:
							null
							)
						):
						null
					}															
				</div>
				<div className={classes.tableWrap}>
					<Table >
						<TableHead>
							<TableRow>
								<CustomTableCell> Template Name </CustomTableCell>
								<CustomTableCell align="center">Template Desc</CustomTableCell>
								<CustomTableCell align="center">Template Value</CustomTableCell>								
							</TableRow>
						</TableHead>
						<TableBody >
							{
								selectedProject.projectTemplates.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell component="th" scope="row"
												onClick={async () => {
													await this.props.selectProject(row.id);
													this.props.history.push("/m_cont/project_detail");
												}}>
												{row.template.name?row.template.name: "N/A" }
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectProject(row.id);
													this.props.history.push("/m_cont/project_detail");
												}}>
												{row.template.description? row.template.description: "N/A"}												
												</CustomTableCell>
											<CustomTableCell align="center"
												onClick={async () => {
													await this.props.selectProject(row.id);
													this.props.history.push("/m_cont/project_detail");
												}}>
												{row.template.value? row.template.value: "N/A"}												
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
					count={selectedProject.projectTemplates.length}
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

							await this.props.createProject(data, (res) => {
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
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		templates: state.gen_data.templates,
		selectedProject: state.gen_data.selectedProject
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getTemplates: (page, size) => dispatch(getTemplates(page, size)),	
		addTemplate: (project, template, cb) => dispatch(addTemplate(project, template, cb)),		
		deleteTemplate: (project, template, cb) => dispatch(deleteTemplate(project, template, cb)),	
		updateProject: (id) => dispatch(updateProject(id)),	
	}
}
const ProjectTemplateView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectTemplateView);

ProjectTemplateView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectTemplateView);
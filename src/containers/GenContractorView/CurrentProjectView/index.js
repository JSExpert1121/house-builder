import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
import { getProjectsByGenId } from '../../../actions/gen-actions';
import { deleteProject, setCurrentProject } from '../../../actions';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
	CircularProgress,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton, TablePagination,
	Button,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 136px)",
		margin: theme.spacing(1),
		overflow: "auto",
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

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isSaving: false,
			snackBar: false,
			snackBarContent: '',
			alertConfirm: false,
			proId: 0
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, 0, 0);
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });

		this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { projects, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, currentPage, rowsPerPage);
	};

	handleDeleteProject = async (id) => {
		this.setState({
			isSaving: true,
			alertConfirm: false
		})

		await this.props.deleteProject(this.state.proId, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res ? 'delete project success' : "delete project failed"
			});

			if (res) {
				const { userProfile, projects } = this.props;

				if (this.state.rowsPerPage * (this.state.currentPage) < projects.totalElements - 1) {
					this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id,
						this.state.currentPage, this.state.rowsPerPage);
				}
				else {
					const currentPage = this.state.currentPage - 1;

					this.setState({
						currentPage: currentPage
					});

					this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id,
						currentPage, this.state.rowsPerPage);
				}
			}
		})
	}

	handleSelectProject = async (id) => {
		const { match } = this.props;
		this.props.setCurrentProject(id);
		this.props.history.push("/g_cont/project_detail/" + id);
	}

	render() {
		const { classes, projects } = this.props;

		if (projects === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<div className={classes.tableWrap} >
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell> Project Title </CustomTableCell>
								<CustomTableCell align="center">Budget</CustomTableCell>
								<CustomTableCell align="center">Discription</CustomTableCell>
								<CustomTableCell align="center">Action</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								projects.content.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover>
											<CustomTableCell component="th" scope="row"
												onClick={() => this.handleSelectProject(row.id)}>
												{row.title}
											</CustomTableCell>
											<CustomTableCell align="center"
												onClick={() => this.handleSelectProject(row.id)}>{row.budget}</CustomTableCell>
											<CustomTableCell align="center"
												onClick={() => this.handleSelectProject(row.id)}>{row.description}</CustomTableCell>
											<CustomTableCell align="center">
												<IconButton aria-label="Delete" color="primary"
													onClick={() => {
														this.setState({
															alertConfirm: true,
															proId: row.id
														})
													}}>
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
					style={{ overflow: "auto" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={projects.totalElements}
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
				<Dialog
					open={this.state.alertConfirm}
					onClose={() => this.setState({ alertConfirm: false })}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{"Delete Project?"}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Do you want to delete this project?
          				</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.setState({ alertConfirm: false })} color="primary">
							No
          				</Button>
						<Button onClick={() => this.handleDeleteProject()} color="primary" autoFocus>
							Yes
          				</Button>
					</DialogActions>
				</Dialog>
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getProjectsByGenId: (id, page, rowSize) => dispatch(getProjectsByGenId(id, page, rowSize)),
		deleteProject: (id, cb) => dispatch(deleteProject(id, cb)),
		setCurrentProject: (id) => dispatch(setCurrentProject(id)),
	};
};

const mapStateToProps = state => {
	return {
		projects: state.gen_data.projects,
		userProfile: state.global_data.userProfile
	};
};

const CurrentProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedCurProView);

CurrentProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CurrentProjectView));
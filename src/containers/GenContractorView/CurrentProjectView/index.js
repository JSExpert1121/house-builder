import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
import { getProjectDetailById, getAllProjects, getProjectsByGenId } from '../../../actions/gen-actions';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
	CircularProgress,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton, TablePagination, TextField,
	Button
} from '@material-ui/core';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
		overflow: "auto",
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
			currentPage: 0
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

	handleAddProject = () => {
	}

	render() {
		const { classes, projects } = this.props;

		if (projects === null) {
			return <CircularProgress className={classes.waitingSpin} />;
		}

		return (
			<Paper className={classes.root}>
				<div className = {classes.tableWrap} >
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell> Project Title </CustomTableCell>
								<CustomTableCell align="center">Budget</CustomTableCell>
								<CustomTableCell align="center">Discription</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								projects.content.map(
									row => (
										<TableRow className={classes.row} key={row.id} hover
											onClick={async () => {
												await this.props.getProjectDetailById(row.id);
												this.props.history.push("/g_cont/project_detail");
											}}>
											<CustomTableCell component="th" scope="row">
												{row.title}
											</CustomTableCell>
											<CustomTableCell align="center">{row.budget}</CustomTableCell>
											<CustomTableCell align="center">{row.description}</CustomTableCell>
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
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getProjectDetailById: proEl => dispatch(getProjectDetailById(proEl)),
		getProjectsByGenId: (id, page, rowSize) => dispatch(getProjectsByGenId(id, page, rowSize))
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
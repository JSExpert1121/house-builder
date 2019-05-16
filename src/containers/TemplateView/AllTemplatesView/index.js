import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	CircularProgress,
	Paper,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton, TablePagination
} from '@material-ui/core';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';

// Redux
import { connect } from 'react-redux';

// actions
import { getTemplatesO, selectTemplate, deleteTemplate } from '../../../actions/tem-actions';

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
	card: {
		minWidth: "200px"
	},
	cardProjectTitle: {
		color: theme.palette.primary.dark
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
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

class ConnAllTemplateView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
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
		const currentPage = rowsPerPage >= templates.page.totalElements ? 0 : this.state.currentPage;

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
										() => this.props.history.push("/m_temp/create_template")
									}>
										<NoteAddIcon />
									</IconButton>
								</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody >
							{
								templates._embedded.templates.map(
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
														await this.props.deleteTemplate(row.id);

														if (this.state.rowsPerPage * (this.state.currentPage) < templates.page.totalElements - 1) {
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
					count={templates.page.totalElements}
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

const mapStateToProps = state => {
	return {
		templates: state.tem_data.templates
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getTemplatesO: (page, size) => dispatch(getTemplatesO(page, size)),
		selectTemplate: (id) => dispatch(selectTemplate(id)),
		deleteTemplate: (id) => dispatch(deleteTemplate(id))
	};
}

const AllTemplateView = connect(mapStateToProps, mapDispatchToProps)(ConnAllTemplateView);

AllTemplateView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AllTemplateView));
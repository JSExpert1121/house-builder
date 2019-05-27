import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
	CircularProgress,
	Table, TableHead, TableCell, TableRow, TableBody,
	IconButton, TablePagination,
	Button,
	Snackbar
} from '@material-ui/core';

import { setSelectedProposal, getProposals, deleteProposal } from '../../../actions/gen-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
	},
	tableWrap: {
		overflow: "scroll",
		maxHeight: "calc(100vh - 64px - 72px - 57px - 56px - 20px)",
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	btnSubmitProposal: {
		marginBottom: 5,
		backgroundColor: theme.palette.primary.light,
		color: "#FFF",
		borderRadius: 0
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

class ConnectedProjectProposals extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isSaving: false,
			snackBar: false,
			snackBarContent: ""
		}
	}

	componentDidMount() {
		const { selectedProject } = this.props;
		this.props.getProposals(selectedProject.id, 0, 0);
	}

	handleChangePage = (event, page) => {
		const { selectedProject } = this.props;
		this.setState({ currentPage: page });

		this.props.getProposals(selectedProject.id, page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { proposals, selectedProject } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getProposals(selectedProject.id, currentPage, rowsPerPage);
	};

	handleDeleteProposal = async (id) => {
		this.setState({
			isSaving: true
		})

		await this.props.deleteProposal(id, (res) => {
			this.setState({
				isSaving: false,
				snackBar: true,
				snackBarContent: res ? 'delete proposal success' : "delete proposal failed"
			});

			if (res) {
				const { selectedProject, proposals } = this.props;

				if (this.state.rowsPerPage * (this.state.currentPage) < proposals.totalElements - 1) {
					this.props.getProposals(selectedProject.id, this.state.currentPage, this.state.rowsPerPage);
				}
				else {
					const currentPage = this.state.currentPage - 1;

					this.setState({
						currentPage: currentPage
					});

					this.props.getProposals(selectedProject.id, currentPage, this.state.rowsPerPage);
				}
			}
		})
	}

	handleSelectProposal = async (id) => {
		await this.props.setSelectedProposal(id);
		this.props.history.push("/a_pros/proposal_detail/v");
	}

	render() {
		const { classes, proposals } = this.props;

		if (proposals === null)
			return <div className={classes.root}> <CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root}>
				<div className={classes.tableWrap}>
					<Button className={classes.btnSubmitProposal} onClick={() =>
						this.props.history.push("/a_pros/proposal_detail/c")
					}>Submit Proposal</Button>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Bidder Name</CustomTableCell>
								<CustomTableCell align="center">Price($)</CustomTableCell>
								<CustomTableCell align="center">Duration</CustomTableCell>
								<CustomTableCell align="center">Status</CustomTableCell>
								<CustomTableCell align="center">Description</CustomTableCell>
								{/*<CustomTableCell align="center">Actions</CustomTableCell>*/}
							</TableRow>
						</TableHead>
						<TableBody>
							{proposals.content.map(row => (
								<TableRow className={classes.row} key={row.id} hover>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.subContractor.email}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.budget}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.duration}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.status}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)} align="center">{row.description.length > 40 ? row.description.slice(0, 40) + "..." : row.description}</CustomTableCell>
									{/*<CustomTableCell align="center">
										<IconButton className={classes.button} aria-label="Delete" color="primary"
											onClick={() => this.handleDeleteProposal(row.id)}>
											<DeleteIcon />
										</IconButton>
							</CustomTableCell>*/}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					style={{ overflow: "scroll" }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={proposals.totalElements}
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
			</div >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setSelectedProposal: id => dispatch(setSelectedProposal(id)),
		getProposals: (id, page, row) => dispatch(getProposals(id, page, row)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb))
	};
}

const mapStateToProps = state => {
	return {
		proposals: state.gen_data.proposals,
		selectedProject: state.gen_data.selectedProject,
	};
};

const ProjectProposals = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectProposals);

ProjectProposals.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProjectProposals));
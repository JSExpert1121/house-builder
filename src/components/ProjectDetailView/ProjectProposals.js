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

import { getProposalData, getProposalsByProjectId, deleteProposal, setRedirectTo } from '../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 48px - 72px - 20px)",
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
		const { project } = this.props;
		this.props.getProposalsByProjectId(project.id, 0, 0);
	}

	handleChangePage = (event, page) => {
		const { project } = this.props;
		this.setState({ currentPage: page });

		this.props.getProposalsByProjectId(project.id, page, this.state.rowsPerPage);
	};

	handleChangeRowsPerPage = event => {
		const { proposals, project } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getProposalsByProjectId(project.id, currentPage, rowsPerPage);
	};

	render() {
		const { classes, proposals, redirectTo } = this.props;

		if (proposals === null)
			return <div className={classes.root}> <CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root}>
				<div className={classes.tableWrap}>
					{
						redirectTo === '/a_pros' &&
						<Button className={classes.btnSubmitProposal} onClick={
							() => this.props.history.push("/a_pros/proposal_detail/-1")
						}> Submit Proposal </Button>
					}
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Bidder Name</CustomTableCell>
								<CustomTableCell align="center">Price($)</CustomTableCell>
								<CustomTableCell align="center">Duration</CustomTableCell>
								<CustomTableCell align="center">Status</CustomTableCell>
								<CustomTableCell align="center">Description</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{proposals.content.map(row => (
								<TableRow className={classes.row} key={row.id} hover onClick={async () => {
									this.props.history.push(redirectTo + "/proposal_detail/" + row.id);
								}} >
									<CustomTableCell component="th" scope="row" align="center">{row.subContractor.email}</CustomTableCell>
									<CustomTableCell align="center">{row.budget}</CustomTableCell>
									<CustomTableCell align="center">{row.duration}</CustomTableCell>
									<CustomTableCell align="center">{row.status}</CustomTableCell>
									<CustomTableCell align="center">{row.description.length > 40 ? row.description.slice(0, 40) + "..." : row.description}</CustomTableCell>
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
		getProposalData: id => dispatch(getProposalData(id)),
		getProposalsByProjectId: (id, page, row) => dispatch(getProposalsByProjectId(id, page, row)),
		setRedirectTo: (str) => dispatch(setRedirectTo(str))
	};
}

const mapStateToProps = state => {
	return {
		proposals: state.global_data.proposals,
		project: state.global_data.project,
		redirectTo: state.global_data.redirectTo
	};
};

const ProjectProposals = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectProposals);

ProjectProposals.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProjectProposals));
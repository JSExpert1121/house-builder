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
	Snackbar
} from '@material-ui/core';

import { getProposals } from '../../../actions/sub-actions';
import { deleteProposal, setRedirectTo } from '../../../actions';

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
		top: "calc(50% - 10px)",
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

class ConnectedSubmittedProView extends React.Component {
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
		const { userProfile } = this.props;
		this.props.getProposals(userProfile.user_metadata.contractor_id, 0, 0, 'INVITED');
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });

		this.props.getProposals(userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, 'INVITED');
	};

	handleChangeRowsPerPage = event => {
		const { proposals, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage = rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage
		});

		this.props.getProposals(userProfile.user_metadata.contractor_id, currentPage, rowsPerPage, 'INVITED');
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
				const { userProfile, proposals } = this.props;

				if (this.state.rowsPerPage * (this.state.currentPage) < proposals.totalElements - 1) {
					this.props.getProposals(userProfile.user_metadata.contractor_id, this.state.currentPage, this.state.rowsPerPage, 'INVITED');
				}
				else {
					const currentPage = this.state.currentPage - 1;

					this.setState({
						currentPage: currentPage
					});

					this.props.getProposals(userProfile.user_metadata.contractor_id, currentPage, this.state.rowsPerPage, 'INVITED');
				}
			}
		})
	}

	handleSelectProposal = (id) => {
		const { location } = this.props;

		this.props.setRedirectTo("/s_cont");
		this.props.history.push(`/s_cont/proposal_detail/${id}`);
	}

	render() {
		const { classes, proposals } = this.props;

		if (proposals === null)
			return <div className={classes.root}> <CircularProgress className={classes.waitingSpin} /> </div>;

		return (
			<div className={classes.root}>
				<div className={classes.tableWrap}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<CustomTableCell align="center">Proposal To</CustomTableCell>
								<CustomTableCell align="center">Price($)</CustomTableCell>
								<CustomTableCell align="center">Duration</CustomTableCell>
								<CustomTableCell align="center">Status</CustomTableCell>
								<CustomTableCell align="center">Description</CustomTableCell>
								<CustomTableCell align="center">Actions</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{proposals.content.map(row => (
								<TableRow className={classes.row} key={row.id} hover>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.project.title}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.budget}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.duration}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)}
										component="th" scope="row" align="center">{row.status}</CustomTableCell>
									<CustomTableCell onClick={() => this.handleSelectProposal(row.id)} align="center">{row.description.length > 40 ? row.description.slice(0, 40) + "..." : row.description}</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton className={classes.button} aria-label="Delete" color="primary"
											onClick={() => this.handleDeleteProposal(row.id)}>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
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
		getProposals: (id, page, row, filterStr) => dispatch(getProposals(id, page, row, filterStr)),
		deleteProposal: (id, cb) => dispatch(deleteProposal(id, cb)),
		setRedirectTo: (str) => dispatch(setRedirectTo(str))
	};
}

const mapStateToProps = state => {
	return {
		proposals: state.sub_data.proposals,
		userProfile: state.global_data.userProfile
	};
};

const SubmittedProView = connect(mapStateToProps, mapDispatchToProps)(ConnectedSubmittedProView);

SubmittedProView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SubmittedProView));
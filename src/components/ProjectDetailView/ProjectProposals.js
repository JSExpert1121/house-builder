import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';

import DeleteIcon from '@material-ui/icons/Delete';
import CompareIcon from '@material-ui/icons/Compare';
import { ConfirmDialog } from '../shared/ConfirmDialog';

import { getProposalData, getProposalsByProjectId, deleteProposal } from '../../actions';

const MAX_COMPARE = 3;
const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(1),
		height: "calc(100vh - 64px - 48px - 72px - 20px)",
	},
	tableWrap: {
		overflow: "scroll",
		maxHeight: "calc(100vh - 64px - 72px - 57px - 56px - 20px - 54px)",
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
	},
	button: {
		padding: '6px'
	},
	submitBtn: {
		border: "1px solid #4a148c",
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		margin: theme.spacing(1),
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
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
			compState: 0,
			isSaving: false,
			snackBar: false,
			snackBarContent: "",
			compares: [],
			showConfirm: false,
			message: "You can't select more than 3 proposals"
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

	handleCompare = () => {
		const { compState, compares } = this.state;
		if (compState == 0) {
			this.setState({ compState: 1 });
		} else {
			if (compares.length < 2 || compares.length > 3) {
				this.setState({ showConfirm: true, message: "You have to select 2 ~ 3 proposals." });
				return;
			}
			this.setState({ compState: 0 });
			console.log('ProjectProposals.handleCompare');
		}
	}

	handleRowSelected = (id) => {
		const { match, history } = this.props;
		if (this.state.compState === 0) {
			history.push(match.url.substring(0, 7) + "/proposal_detail/" + id);
		} else {
			this.handleChecked(id);
		}
	}

	handleChecked = (id) => {
		const compares = [...this.state.compares];
		console.log(id);
		const pos = compares.indexOf(id);
		if (pos >= 0) {
			compares.splice(pos, 1);
		} else {
			if (compares.length === MAX_COMPARE) {
				this.setState({ showConfirm: true, message: "You can't select more than 3 proposals" });
				return;
			}
			compares.push(id);
		}

		this.setState({ compares });
		console.log(compares);
	}

	handleConfirm = () => {
		this.setState({ showConfirm: false });
	}

	render() {
		const { classes, proposals, match } = this.props;
		const { compares } = this.state;

		if (proposals === null)
			return <div className={classes.root}> <CircularProgress className={classes.waitingSpin} /> </div>;

		const btnText = (this.state.compState === 0) ? 'Compare' : 'Done';
		return (
			<div className={classes.root}>
				{
					match.url.includes('/g_cont') && (
						<Box style={{ textAlign: 'right', paddingRight: '16px' }}>
							<Button disabled={this.state.isSaving} className={classes.submitBtn} onClick={this.handleCompare}>
								{btnText}
							</Button>
						</Box>
					)
				}
				<div className={classes.tableWrap}>
					{
						match.url.includes('/a_pros') &&
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
								{
									(this.state.compState === 1) && match.url.includes('/g_cont') && (
										<CustomTableCell align="center">
											<IconButton className={classes.button} onClick={this.handleCompare} style={{ color: "#FFFFFF" }} size='small'>
												<CompareIcon />
											</IconButton>
										</CustomTableCell>
									)
								}
							</TableRow>
						</TableHead>
						<TableBody>
							{proposals.content.map(row => (
								<TableRow className={classes.row} key={row.id} hover onClick={() => this.handleRowSelected(row.id)} >
									<CustomTableCell component="th" scope="row" align="center">{row.subContractor.email}</CustomTableCell>
									<CustomTableCell align="center">{row.budget}</CustomTableCell>
									<CustomTableCell align="center">{row.duration}</CustomTableCell>
									<CustomTableCell align="center">{row.status}</CustomTableCell>
									<CustomTableCell align="center">{row.description.length > 40 ? row.description.slice(0, 40) + "..." : row.description}</CustomTableCell>
									{
										(this.state.compState === 1) && match.url.includes('/g_cont') && (
											<CustomTableCell align="center">
												<Checkbox
													// onChange={(e) => this.handleChecked(e, row.id)}
													checked={compares.includes(row.id)}
													inputProps={{ 'aria-label': 'Select proposals' }}
												/>
											</CustomTableCell>
										)
									}
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
				<ConfirmDialog open={this.state.showConfirm} message={this.state.message} onYes={this.handleConfirm} />
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
	};
}

const mapStateToProps = state => {
	return {
		proposals: state.global_data.proposals,
		project: state.global_data.project,
	};
};

const ProjectProposals = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectProposals);

ProjectProposals.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ProjectProposals));
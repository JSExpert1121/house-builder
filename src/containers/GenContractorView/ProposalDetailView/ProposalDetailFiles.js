import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import List from '@material-ui/core/List';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
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

class ConnectedProposalDetailFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProposal } = this.props;

		return (
			<div className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Name</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							selectedProposal.proposalFiles.map((row) => (
								<TableRow key={row.id} hover>
									<CustomTableCell align="center">
										<a download={row.name} href={process.env.PROJECT_API + "/proposals/" + selectedProposal.id + "/files/" + row.name}>{row.name} </a>
									</CustomTableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailFiles = connect(mapStateToProps)(ConnectedProposalDetailFiles);

ProposalDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailFiles);
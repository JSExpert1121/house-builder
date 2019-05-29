import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from "../shared/CustomTableCell";
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedProposalDetailMessages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">From</CustomTableCell>
							<CustomTableCell align="center">To</CustomTableCell>
							<CustomTableCell align="center">Date</CustomTableCell>
							<CustomTableCell align="center">Content</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow hover>
							<CustomTableCell align="center">Ivan</CustomTableCell>
							<CustomTableCell align="center">Ivan</CustomTableCell>
							<CustomTableCell align="center">2019.1.1</CustomTableCell>
							<CustomTableCell align="center">Hello, Ivan. Happy New Year!</CustomTableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

const mapStateToProps = state => {
	return {
	};
};

const ProposalDetailMessages = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailMessages);

ProposalDetailMessages.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailMessages);
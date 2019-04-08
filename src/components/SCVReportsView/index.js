import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
	root: {
		flexGrow: 1,
		margin: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 20px)",
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

class ConnectedSCVReportsView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	componentDidMount() {
	}

	render() {
		const { classes } = this.props;

		return (
			< Card className={classes.root} >
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
	}
}

const SCVReportsView = connect(mapStateToProps, mapDispatchToProps)(ConnectedSCVReportsView);

SCVReportsView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SCVReportsView);
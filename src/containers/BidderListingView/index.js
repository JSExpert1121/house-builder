import React from 'react'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Button } from '@material-ui/core';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		margin: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 40px)",
		overflow: "auto",
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 1),
		marginLeft: 0,
		margin: "10px 10px 10px 10px",
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 200,
			},
		},
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

class ConnectedBidderListingView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;

		return (
			<Card className={classes.root}>
				<div className={classes.search}>
					<Button className={classes.searchIcon}>
						<SearchIcon />
					</Button>
					<InputBase
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
					/>
				</div>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Logo</CustomTableCell>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">Speciality</CustomTableCell>
							<CustomTableCell align="center">Rating</CustomTableCell>
							<CustomTableCell align="center">Other</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow className={classes.row} hover>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
							<CustomTableCell align="center">A</CustomTableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
	};
}

const mapStateToProps = state => {
	return {
	};
};

const BidderListingView = connect(mapStateToProps, mapDispatchToProps)(ConnectedBidderListingView);

BidderListingView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BidderListingView);
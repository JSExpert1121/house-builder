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
import { fade } from '@material-ui/core/styles/colorManipulator';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import auth0Client from '../../auth0/auth';
import { CircularProgress } from '@material-ui/core';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		margin: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 20px)",
		overflow: "auto",
	},
	search: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		width: 400,
	},

	input: {
		marginLeft: 8,
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4,
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
		this.state = {
			profile: null
		}
	}

	async componentWillMount() {
		const userProfile = auth0Client.userProfile;
		if (!userProfile) {
			await auth0Client.getProfile((profile) => {
				this.setState({
					profile: profile
				});
			});
		} else {
			this.setState({
				profile: userProfile
			});
		}
	}

	render() {
		const { classes } = this.props;
		const profile = this.state.profile;

		if (profile === null)
			return (<div> <CircularProgress /></div>);

		if (!profile.user_metadata.roles.includes("Gen") && !profile.user_metadata.roles.includes("GenSub") && !profile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
			<Card className={classes.root}>
				<div className={classes.search} elevation={1}>
					<IconButton className={classes.iconButton} aria-label="Menu">
						<MenuIcon />
					</IconButton>
					<InputBase className={classes.input} placeholder="Search Fields" />
					<Divider className={classes.divider} />
					<IconButton className={classes.iconButton} aria-label="Search">
						<SearchIcon />
					</IconButton>
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
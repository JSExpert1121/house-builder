import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import { blue } from '@material-ui/core/colors';
import { Divider } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 48px - 72px - 20px)",
		overflow: "auto",
	},
	card: {
		minWidth: "200px",
		padding: "10px 10px 10px 10px"
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
	actions: {
		display: 'flex',
	},
	avatar: {
		backgroundColor: blue[500],
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	rowactionarea: {
		width: "100%"
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
	}
}))(TableCell);

class ConnectedProjectMessages extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedMessage: null
		}
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
			</div>
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

const ProjectMessages = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectMessages);

ProjectMessages.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectMessages);
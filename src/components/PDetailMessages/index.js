import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import uuidv1 from "uuid";

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

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 48px - 40px)",
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

class ConnectedPDetailOverview extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedMessage: null
		}
	}

	getMessageGridView = () => {
		const { classes, selectedProject } = this.props;
		console.log(selectedProject.messages);

		return (
			<Card className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center"> From </CustomTableCell>
							<CustomTableCell align="center">Subject</CustomTableCell>
							<CustomTableCell align="center">Date</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{selectedProject.messages.map(row => (
							<TableRow className={classes.row} key={row.id} hover
								onClick={() => {
									this.setState({
										selectedMessage: row
									});
								}}>
								<CustomTableCell component="th" scope="row" align="center">{row.from}</CustomTableCell>
								<CustomTableCell align="center">{row.subject}</CustomTableCell>
								<CustomTableCell align="center">{
									row.date.getYear() + 1900 + "." + (row.date.getMonth() + 1) + "." + row.date.getDay() + " " +
									row.date.getHours() + ":" + row.date.getMinutes() + ":" + row.date.getSeconds()}</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card >
		);
	}

	getMessageDetailView = () => {
		const { selectedMessage } = this.state;
		const { classes } = this.props;

		return (
			<Card className={classes.card}>
				<CardHeader
					avatar={
						<Avatar aria-label="Recipe" className={classes.avatar}>
							{selectedMessage.from[0]}
						</Avatar>
					}
					action={
						<IconButton onClick={() => {
							this.setState({
								selectedMessage: null
							})
						}}>
							<ArrowBackIosIcon />
						</IconButton>
					}
					title={selectedMessage.from}
					subheader={
						selectedMessage.date.getYear() + 1900 + "." + (selectedMessage.date.getMonth() + 1) + "." + selectedMessage.date.getDay() + " " +
						selectedMessage.date.getHours() + ":" + selectedMessage.date.getMinutes() + ":" + selectedMessage.date.getSeconds()}
				/>
				<Divider />
				<CardMedia
					className={classes.media}
					image="/static/images/cards/paella.jpg"
					title="Paella dish"
				/>
				<CardContent>
					<Typography component="p">
						{selectedMessage.detail}
					</Typography>
				</CardContent>
				<Divider />
				<CardActions className={classes.actions} disableActionSpacing >
					<IconButton aria-label="Add to favorites">
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Card>
		);
	}

	render() {
		const { classes } = this.props;
		const { selectedMessage } = this.state;

		const showEl = (selectedMessage === null) ? this.getMessageGridView() : this.getMessageDetailView();

		return (
			<div >
				{showEl}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.genContViewData.selectedProject
	};
};

const PDetailOverview = connect(mapStateToProps)(ConnectedPDetailOverview);

PDetailOverview.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PDetailOverview);
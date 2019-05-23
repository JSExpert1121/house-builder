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

import { getProjectMessage } from '../../../actions/gen-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 40px)",
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

	componentDidMount() {
		this.props.getProjectMessage(this.props.selectedProject.id);
	}

	getMessageGridView = () => {
		const { classes, messages } = this.props;

		return (
			<Card className={classes.root}>
				{
					messages.length != 0 ?
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<CustomTableCell align="center"> From </CustomTableCell>
									<CustomTableCell align="center">Subject</CustomTableCell>
									<CustomTableCell align="center">Date</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{messages.map(row => (
									<TableRow className={classes.row} key={row.id} hover
										onClick={() => {
											this.setState({
												selectedMessage: row
											});
										}}>
										<CustomTableCell component="th" scope="row" align="center">{row.from}</CustomTableCell>
										<CustomTableCell align="center">{row.subject}</CustomTableCell>
										<CustomTableCell align="center">{row.date}</CustomTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						: <CircularProgress className={classes.waitingSpin} />
				}
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
					/*subheader={
						selectedMessage.date.getYear() + 1900 + "." + (selectedMessage.date.getMonth() + 1) + "." + selectedMessage.date.getDay() + " " +
						selectedMessage.date.getHours() + ":" + selectedMessage.date.getMinutes() + ":" + selectedMessage.date.getSeconds()}*/
					subheader={selectedMessage.date}
				/>
				<Divider />
				<CardMedia
					className={classes.media}
					title="Paella dish"
				/>
				<CardContent>
					<Typography component="p">
						{selectedMessage.body}
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
		messages: state.gen_data.messages,
		selectedProject: state.gen_data.selectedProject
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProjectMessage: (id) => dispatch(getProjectMessage(id))
	}
}

const ProjectMessages = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectMessages);

ProjectMessages.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectMessages);
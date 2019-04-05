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

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 48px - 40px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	card: {
		minWidth: "200px"
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
});

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
			<Grid container spacing={24}>
				{
					selectedProject.messages.map(el => (
						<Grid item xs={12} md={6} lg={3} key={uuidv1()}>
							<CardActionArea onClick={() => {
								this.setState({
									selectedMessage: el
								});
							}} >
								<Card className={classes.card}>
									<CardContent>
										<Typography className={classes.title} color="textSecondary" gutterBottom>
											Message
       									</Typography>
										<Typography variant="h5" component="h2" className={classes.cardProjectTitle}>
											{el.from}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{el.subject}
										</Typography>
										<Typography component="p">
											Received message at {
												el.date.getYear() + 1990 + "." + (el.date.getMonth() + 1) + "." + el.date.getDay() + " " +
												el.date.getHours() + ":" + el.date.getMinutes() + ":" + el.date.getSeconds()}
										</Typography>
									</CardContent>
								</Card>
							</CardActionArea>
						</Grid>
					))
				}
			</Grid>
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
						selectedMessage.date.getYear() + 1990 + "." + (selectedMessage.date.getMonth() + 1) + "." + selectedMessage.date.getDay() + " " +
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
			<div className={classes.root}>
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
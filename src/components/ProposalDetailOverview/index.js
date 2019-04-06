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

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 90px - 20px)",
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

class ConnectedProposalDetailOverview extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProposal } = this.props;

		return (
			<div className={classes.root}>
				<Card className={classes.card}>
					<CardHeader
						avatar={
							<Avatar aria-label="Recipe" className={classes.avatar}>
								{selectedProposal.name[0]}
							</Avatar>
						}
						title={selectedProposal.name}
						subheader={"$" + selectedProposal.price + " in " + selectedProposal.duration + "days"}
					/>
					<Divider />
					<CardMedia
						className={classes.media}
						image="/static/images/cards/paella.jpg"
						title="Paella dish"
					/>
					<CardContent>
						<Typography component="p">
							{selectedProposal.proposal}
						</Typography>
					</CardContent>
					<Divider />
				</Card>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.genContViewData.selectedProposal
	};
};

const ProposalDetailOverview = connect(mapStateToProps)(ConnectedProposalDetailOverview);

ProposalDetailOverview.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailOverview);
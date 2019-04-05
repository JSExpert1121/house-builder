import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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
	}
});

class ConnectedPDetailBidders extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProject } = this.props;

		return (
			<div className={classes.root}>
				<Grid container spacing={24}>
					{
						selectedProject.bidders.map(el => (
							<Grid item xs={12} md={6} lg={3} key={el.id}>
								<Card className={classes.card}>
									<CardContent>
										<Typography className={classes.title} color="textSecondary" gutterBottom>
											Bidder
												</Typography>
										<Typography variant="h5" component="h2" className={classes.cardProjectTitle}>
											{el.name}
										</Typography>
										<Typography component="p">
											${el.price} {"in "}
											{el.duration}days
												</Typography>
									</CardContent>
								</Card>
							</Grid>
						))
					}
				</Grid>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.genContViewData.selectedProject
	};
};

const PDetailBidders = connect(mapStateToProps)(ConnectedPDetailBidders);

PDetailBidders.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PDetailBidders);
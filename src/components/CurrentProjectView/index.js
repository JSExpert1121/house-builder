import React from 'react';
import { connect } from 'react-redux';
import { addProject, setSelectedProject, setCurTabPos } from '../../actions';

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
		height: "calc(100vh - 56px - 90px - 20px)",
		margin: "10px 10px 10px 10px",
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
});

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	handleAddProject = () => {

	}

	handleProjectDetail = (el) => {
	}

	render() {
		const { classes, projects } = this.props;

		return (
			<div className={classes.root}>
				<Grid container spacing={24}>
					{
						projects.map(el => (
							<Grid item xs={12} md={6} lg={3} key={el.id}>
								<CardActionArea onClick={this.handleProjectDetail = () => {
									this.props.setSelectedProject(el);
									this.props.setCurTabPos(1);
								}} >
									<Card className={classes.card}>
										<CardContent>
											<Typography className={classes.title} color="textSecondary" gutterBottom>
												Project
       										</Typography>
											<Typography variant="h5" component="h2" className={classes.cardProjectTitle}>
												{el.name}
											</Typography>
											<Typography className={classes.pos} color="textSecondary">
												{el.status}
											</Typography>
											<Typography component="p">
												{el.PH1}
												<br />
												{el.PH2}
											</Typography>
										</CardContent>
									</Card>
								</CardActionArea>
							</Grid>
						))
					}
				</Grid>
			</div>
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		setSelectedProject: proEl => dispatch(setSelectedProject(proEl)),
		setCurTabPos: tabPos => dispatch(setCurTabPos(tabPos)),
		addProject: proEl => dispatch(addProject(proEl)),
	};
};

const mapStateToProps = state => {
	return {
		projects: state.genContViewData.projects,
	};
};

const CurrentProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedCurProView);

export default withStyles(styles)(CurrentProjectView);
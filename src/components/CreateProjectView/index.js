import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';

import DashboardIcon from '@material-ui/icons/Dashboard';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import DescriptionIcon from '@material-ui/icons/Description';
import MessageIcon from '@material-ui/icons/Message';


import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

import { setCurTabPos, addProject } from '../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px"
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark,
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
	contentView: {
		height: "calc(100vh - 56px - 90px - 48px - 40px)",
		padding: "10px 10px 10px 10px",
		overflow: "auto",
		overflowX: "hidden"
	},
	buttonAdditional: {
		position: "absolute",
		float: "right",
		right: "20px",
		bottom: "20px",
		margin: "5px 5px 5px 5px"
	}
});

class ConnectedCreateProjectView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curDetailTab: 0
		}
	}

	handleTabChange = (event, value) => {
		this.setState({
			curDetailTab: value
		});
	}

	handleGetOverview = () => {
		const { classes, createProjectTemp } = this.props;
		return (<div> Overview</div>);
	}

	handleGetBidComponentView = () => {
		const { classes, createProjectTemp } = this.props;
		return (<div> Bid Component</div>);
	}

	handleGetBiddersView = () => {
		const { classes, createProjectTemp } = this.props;

		return (
			<Grid container spacing={24}>
				{
					createProjectTemp.bidders.map(el => (
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
		);
	}

	handleGetFilesView = () => {
		const { classes, createProjectTemp } = this.props;
		return (
			< List component="nav" >
				{
					createProjectTemp.files.map(el => (
						<ListItem button key={el.id}>
							<ListItemIcon>
								<DescriptionIcon />
							</ListItemIcon>
							<ListItemText primary={el.name} />
						</ListItem>
					))
				}
			</List>
		);
	}

	render() {
		const { classes, createProjectTemp } = this.props;
		const curDetailTab = this.state.curDetailTab;

		return (
			<NoSsr>
				<div className={classes.root}>
					<Paper square >
						<Tabs
							value={curDetailTab}
							onChange={this.handleTabChange}
							variant="scrollable"
							indicatorColor="primary"
							textColor="primary"
							scrollButtons="on"
							className={classes.toolbarstyle}
						>
							<Tab icon={<DashboardIcon />} />
							<Tab icon={<LoyaltyIcon />} />
							<Tab icon={<DescriptionIcon />} />
							<Tab icon={<MessageIcon />} />
						</Tabs>

						<Button color="inherit" onClick={() => {
							this.props.addProject(this.props.createProjectTemp);
							this.props.setCurTabPos(0);
						}} className={classes.buttonAdditional}>Submit</Button>

						<div className={classes.contentView}>
							{curDetailTab === 0 && this.handleGetOverview()}
							{curDetailTab === 1 && this.handleGetBidComponentView()}
							{curDetailTab === 2 && this.handleGetBiddersView()}
							{curDetailTab === 3 && this.handleGetFilesView()}
						</div>
					</Paper>
				</div></NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		createProjectTemp: state.genContViewData.createProjectTemp
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addProject: pro => dispatch(addProject(pro)),
		setCurTabPos: tabPos => dispatch(setCurTabPos(tabPos)),
	};
};

const CreateProjectView = connect(mapStateToProps, mapDispatchToProps)(ConnectedCreateProjectView);

CreateProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateProjectView);
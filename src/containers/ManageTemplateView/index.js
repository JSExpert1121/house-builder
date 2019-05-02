import React from 'react'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import auth0Client from '../../auth0/auth';
import { CircularProgress } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import { setTempViewTab } from '../../actions';
import TemplateView from '../../components/TemplateView';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},
	buttonAdditional: {
		position: "absolute",
		float: "right",
		right: "0"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedManageTemplateView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
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
	handleTabChange = (event, value) => {
		this.props.setTabPos(value);
	}
	render() {
		const { classes } = this.props;
		const profile = this.state.profile;
		const curTabPos = this.props.curTabPos;

		if (profile === null)
			return (<div> <CircularProgress className={classes.waitingSpin} /></div>);

		if (profile.app_metadata.role !== "SuperAdmin" && profile.app_metadata.role !== "Admin")
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							onChange={this.handleTabChange}
							variant="scrollable"
							scrollButtons="on">

							<Tab label="Templates" icon={<AppsIcon />} />
							<Tab label="Template Detail" icon={<BallotIcon />} />
							<Tab label="Criteria" icon={<DoneAllIcon />} />
							<Tab label="Criteria Detail" icon={<DoneIcon />} />
						</Tabs>
					</AppBar>

					{curTabPos === 0 && <TemplateView />}
					{curTabPos === 1 && <div />}
					{curTabPos === 2 && <div />}
					{curTabPos === 3 && <div />}
				</div>
			</NoSsr>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setTabPos: tabPos => dispatch(setTempViewTab(tabPos)),
	};
}

const mapStateToProps = state => {
	return {
		curTabPos: state.tempViewData.curTabPos
	};
};

const ManageTemplateView = connect(mapStateToProps, mapDispatchToProps)(ConnectedManageTemplateView);

ManageTemplateView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageTemplateView);
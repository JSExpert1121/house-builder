import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NoSsr from '@material-ui/core/NoSsr';
//import DoneAllIcon from '@material-ui/icons/DoneAll';
//import DoneIcon from '@material-ui/icons/Done';
//import ControlCameraIcon from '@material-ui/icons/ControlCamera';

import SecuredRoute from '../../../routers/SecuredRoute';
import { Redirect, Link, Switch, withRouter } from 'react-router-dom';
import SubmittedProView from './SubmittedProView';
import WonProView from './WonProView';
import InvitedProView from './InvitedProView';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px"
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	}
});

class ConnectedSCVPipelineView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, match, location } = this.props;
		const tabNo = {
			'/s_cont/pipeline': 0,
			'/s_cont/pipeline/submitted': 0,
			'/s_cont/pipeline/awarded': 1,
			'/s_cont/pipeline/invited': 2
		};

		let curTabPos = tabNo[location.pathname];

		return (

			<NoSsr>
				<div className={classes.root}>
					<Paper square >
						<Tabs
							value={curTabPos}
							variant="scrollable"
							indicatorColor="primary"
							textColor="primary"
							scrollButtons="on"
							className={classes.toolbarstyle}
						>
							<Tab component={Link} to={`${match.url}/submitted`} label="Submitted" />
							<Tab component={Link} to={`${match.url}/awarded`} label="Won" />
							<Tab component={Link} to={`${match.url}/invited`} label="Invited" />
						</Tabs>

						<Switch>
							<SecuredRoute path={`${match.url}/submitted`} component={SubmittedProView} />
							<SecuredRoute path={`${match.url}/awarded`} component = {WonProView} />
							<SecuredRoute path={`${match.url}/invited`} component = {InvitedProView} />
							<Redirect path={`${match.url}`} to={`${match.url}/submitted`} />
						</Switch>
					</Paper>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const SCVPipelineView = connect(mapStateToProps)(ConnectedSCVPipelineView);

SCVPipelineView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(SCVPipelineView));
import React from 'react'
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import auth0Client from '../../Auth';
import { CircularProgress } from '@material-ui/core';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		margin: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 20px)",
		overflow: "auto",
	},
});

class ConnectedManageTemplateView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null
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

	render() {
		const { classes } = this.props;
		const profile = this.state.profile;

		if (profile === null)
			return (<div> <CircularProgress /></div>);

		if (profile.app_metadata.role !== "SuperAdmin" && profile.app_metadata.role !== "Admin")
			return (<div> Access Forbidden </div>);

		return (
			<Card className={classes.root}>
				Manage Template View
			</Card >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
	};
}

const mapStateToProps = state => {
	return {
	};
};

const ManageTemplateView = connect(mapStateToProps, mapDispatchToProps)(ConnectedManageTemplateView);

ManageTemplateView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageTemplateView);
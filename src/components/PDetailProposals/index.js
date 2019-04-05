import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 48px - 40px)"
	},
});

class ConnectedPDetailProposals extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				Proposals
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.genContViewData.selectedProject
	};
};

const PDetailProposals = connect(mapStateToProps)(ConnectedPDetailProposals);

PDetailProposals.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PDetailProposals);
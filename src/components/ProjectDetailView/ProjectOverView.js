import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(1),
		height: "calc(100vh - 64px - 48px - 56px - 20px)",
	},
});

class ConnectedProjectOverView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, project } = this.props;

		return (
			<div className={classes.root}>
				<ul>
					<li>{project.title}</li>
					<li>{project.budget}</li>
					<li>{project.description}</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		project: state.global_data.project
	};
};

const ProjectOverView = connect(mapStateToProps)(ConnectedProjectOverView);

ProjectOverView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectOverView);
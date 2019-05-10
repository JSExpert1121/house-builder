import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
	},
});

class ConnectedProjectOverView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProject } = this.props;

		return (
			<div className={classes.root}>
				<ul>
					<li>Project {selectedProject.id}</li>
					<li>{selectedProject.status}</li>
					<li>{selectedProject.description}</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.gen_data.selectedProject
	};
};

const ProjectOverView = connect(mapStateToProps)(ConnectedProjectOverView);

ProjectOverView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectOverView);
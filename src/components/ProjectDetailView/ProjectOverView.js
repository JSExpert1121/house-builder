import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import ProjectView from '../ProposalDetailView/ProjectView';
import GenContractor from '../Contractor/GenContractor';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: theme.spacing(1, 1),
		height: "calc(100vh - 64px - 48px - 36px - 16px)",
		overflow: 'auto'
	},
	title: {
		fontSize: '20px',
		fontWeight: '600',
		color: '#333'
	},
	status: {
		fontSize: "16px",
		textAlign: "left",
		fontWeight: "600",
		color: theme.palette.primary.light,
		textDecoration: "none"
	}
});

class ConnectedProjectOverView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, project } = this.props;
		if (!project) {
			return <Box>No project is selected</Box>
		}

		return (
			<Box className={classes.root}>
				<Grid container>
					<Grid item xs={12} md={8} style={{ paddingLeft: '8px' }}>
						<ProjectView project={project} showFiles={false} />
					</Grid>
					<Grid item xs={12} md={4} style={{ paddingLeft: '8px' }}>
						<GenContractor contractor={project.genContractor} />
					</Grid>
				</Grid>
			</Box>
		);
	}
}

const mapStateToProps = state => {
	return {
		project: state.global_data.project
	};
};

const ProjectOverView = connect(mapStateToProps)(ConnectedProjectOverView);

ConnectedProjectOverView.propTypes = {
	classes: PropTypes.object.isRequired,
	project: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		budget: PropTypes.number.isRequired,
		updatedAt: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		genContractor: PropTypes.shape({
			id: PropTypes.string.isRequired,
			updatedAt: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			status: PropTypes.string.isRequired,
			address: PropTypes.shape({
				name: PropTypes.string,
				street: PropTypes.string,
				city: PropTypes.string
			}),
		}).isRequired,
	})
};

export default withStyles(styles)(ProjectOverView);
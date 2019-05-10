import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getProjectFiles } from '../../../actions/gen-actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
});

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
		color: theme.palette.primary.light
	},
}))(TableCell);

class ConnectedProjectFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	componentDidMount() {
		this.props.getProjectFiles(this.props.selectedProject.id);
	}

	render() {
		const { classes, projectFiles } = this.props;

		return (
			< Card className={classes.root} >
				{
					projectFiles.length != 0 ?
						(
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell align="center">Name</CustomTableCell>
										<CustomTableCell align="center">Date</CustomTableCell>
										<CustomTableCell align="center">Location</CustomTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{projectFiles.map(row => (
										<TableRow className={classes.row} key={row.id} hover
											onClick={() => { }}>
											<CustomTableCell component="th" scope="row" align="center">{row.name}</CustomTableCell>
											<CustomTableCell align="center">{row.date}</CustomTableCell>
											<CustomTableCell align="center">{row.location}</CustomTableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : ""

				}
			</Card>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProject: state.gen_data.selectedProject,
		projectFiles: state.gen_data.projectFiles,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getProjectFiles: (id) => dispatch(getProjectFiles(id)),
	}
}

const ProjectFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedProjectFiles);

ProjectFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectFiles);
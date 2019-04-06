import React from 'react';
import { connect } from 'react-redux';
import { addProject, setSelectedProject, setCurTabPos } from '../../actions';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 56px - 90px - 20px)",
		margin: "10px 10px 10px 10px",
		overflow: "auto",
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
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	rowactionarea: {
		width: "100%"
	}
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

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	handleAddProject = () => {

	}

	render() {
		const { classes, projects } = this.props;

		return (
			<Card className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell> Project Title </CustomTableCell>
							<CustomTableCell align="center">Status</CustomTableCell>
							<CustomTableCell align="center">PlaceHolder1</CustomTableCell>
							<CustomTableCell align="center">PlaceHolder2</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{projects.map(row => (
							<TableRow className={classes.row} key={row.id} hover
								onClick={() => {
									this.props.setSelectedProject(row);
									this.props.setCurTabPos(1);
								}}>
								<CustomTableCell component="th" scope="row">
									{row.name}
								</CustomTableCell>
								<CustomTableCell align="center">{row.status}</CustomTableCell>
								<CustomTableCell align="center">{row.PH1}</CustomTableCell>
								<CustomTableCell align="center">{row.PH2}</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card >
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

CurrentProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CurrentProjectView);
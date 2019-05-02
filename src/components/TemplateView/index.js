import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getAllTemplates } from '../../actions';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
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
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
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

class connectedTemplateView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this.props.getAllTemplates();
	}

	handleAddProject = () => {
	}

	render() {
		const { classes, templates } = this.props;

		return (
			<Paper className={classes.root}>
				{
					templates.length === 0 ?
						<CircularProgress className={classes.waitingSpin} /> :
						<div> Data Loaded </div>
				}
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getAllTemplates: () => dispatch(getAllTemplates()),
	};
};

const mapStateToProps = state => {
	return {
		templates: state.tempViewData.templates,
	};
};

const Templateview = connect(mapStateToProps, mapDispatchToProps)(connectedTemplateView);

Templateview.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Templateview);
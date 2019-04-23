import React from 'react';
import { connect } from 'react-redux';

import { setSelectedProposal, setCurTabPos, getProjectBidders } from '../../actions';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
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
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(50% - 10px)",
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

class ConnectedPDetailProposals extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	componentDidMount() {
		this.props.getProjectBidders(this.props.selectedProject.id);
	}

	render() {
		const { classes, bidders } = this.props;

		return (
			<Card className={classes.root}>
				{
					bidders.length != 0 ?
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<CustomTableCell align="center">Bidder Name</CustomTableCell>
									<CustomTableCell align="center">Price($)</CustomTableCell>
									<CustomTableCell align="center">Duration(D)</CustomTableCell>
									{ /* <CustomTableCell align="center">Proposal</CustomTableCell>*/}
								</TableRow>
							</TableHead>
							<TableBody>
								{bidders.map(row => (
									<TableRow className={classes.row} key={row.id} hover
										onClick={() => {
											this.props.setSelectedProposal(row);
											this.props.setCurTabPos(2);
										}}>
										<CustomTableCell component="th" scope="row" align="center">{row.name}</CustomTableCell>
										<CustomTableCell align="center">{row.price}</CustomTableCell>
										<CustomTableCell align="center">{row.duration}</CustomTableCell>
										{ /* <CustomTableCell align="center">{row.proposal.length > 40 ? row.proposal.slice(0, 40) + "..." : row.proposal}</CustomTableCell> */}
									</TableRow>
								))}
							</TableBody>
						</Table>
						: <CircularProgress className={classes.waitingSpin} />
				}

			</Card >
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setSelectedProposal: propose => dispatch(setSelectedProposal(propose)),
		setCurTabPos: tabPos => dispatch(setCurTabPos(tabPos)),
		getProjectBidders: id => dispatch(getProjectBidders(id))
	};
}

const mapStateToProps = state => {
	return {
		bidders: state.genContViewData.bidders,
		selectedProject: state.genContViewData.selectedProject,
	};
};

const PDetailProposals = connect(mapStateToProps, mapDispatchToProps)(ConnectedPDetailProposals);

PDetailProposals.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PDetailProposals);
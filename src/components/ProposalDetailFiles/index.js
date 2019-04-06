import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import Divider from '@material-ui/core/Divider';
import uuidv1 from 'uuid';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 90px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
});

class ConnectedProposalDetailFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProposal } = this.props;

		return (
			<div className={classes.root}>
				< List component="nav" >
					{
						selectedProposal.subfiles.map(el => (
							<ListItem button key={uuidv1()}>
								<ListItemIcon>
									<DescriptionIcon />
								</ListItemIcon>
								<ListItemText primary={el} />
							</ListItem>
						))
					}
				</List>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.genContViewData.selectedProposal
	};
};

const ProposalDetailFiles = connect(mapStateToProps)(ConnectedProposalDetailFiles);

ProposalDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProposalDetailFiles);
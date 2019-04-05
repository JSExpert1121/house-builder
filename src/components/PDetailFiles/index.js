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

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 56px - 90px - 48px - 40px)",
		overflow: "auto",
		overflowX: "hidden"
	},
});

class ConnectedPDetailFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	render() {
		const { classes, selectedProject } = this.props;

		return (
			<div className={classes.root}>
				< List component="nav" >
					{
						selectedProject.files.map(el => (
							<ListItem button key={el.id}>
								<ListItemIcon>
									<DescriptionIcon />
								</ListItemIcon>
								<ListItemText primary={el.name} />
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
		selectedProject: state.genContViewData.selectedProject
	};
};

const PDetailFiles = connect(mapStateToProps)(ConnectedPDetailFiles);

PDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PDetailFiles);
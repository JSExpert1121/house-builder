import React from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';
import Card from '@material-ui/core/Card';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ServiceIcon from '@material-ui/icons/GroupWork';
import HelpIcon from '@material-ui/icons/Help';
import { Link } from 'react-router-dom';

const styles = {
	list: {
		width: '15%',
		float: 'left', 
		borderRadius: "0", 
		height: 'calc(100vh - 64px - 20px)'
	},
}

class MenuList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { classes } = this.props;
		return (
			<Card className={classes.list}>
				<List>
		
					<ListItem button component={Link} to='/'>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" />
					</ListItem>
		
					<ListItem button component={Link} to='/gen_cont_view'>
						<ListItemIcon>
							<MessageIcon />
						</ListItemIcon>
						<ListItemText primary="GeneralContractorView" />
					</ListItem>
		
					<ListItem button component={Link} to='/sub_cont_view'>
						<ListItemIcon>
							<ServiceIcon />
						</ListItemIcon>
						<ListItemText primary="SubContractorView" />
					</ListItem>
		
					<ListItem button component={Link} to='/bid_list_view'>
						<ListItemIcon>
							<HelpIcon />
						</ListItemIcon>
						<ListItemText primary="BidListingView" />
					</ListItem>
		
				</List>
				<Divider />
		
			</Card>
		);
	}
};

MenuList.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuList);
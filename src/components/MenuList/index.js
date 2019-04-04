import React from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';

import ServiceIcon from '@material-ui/icons/GroupWork';
import HelpIcon from '@material-ui/icons/Help';
import { Link } from 'react-router-dom';

const classes = {
	list: {
		width: '50%',
	},
	fullList: {
		width: '50%',
	}
}

export const sideList = (
	<div className={classes.list}>
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

	</div>
);
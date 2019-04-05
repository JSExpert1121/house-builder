import React from 'react'
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';
import Card from '@material-ui/core/Card';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import ServiceIcon from '@material-ui/icons/GroupWork';
import HelpIcon from '@material-ui/icons/Help';

const styles = theme => ({
	list: {
		width: "60px",
		float: 'left',
		borderRadius: "0",
		height: 'calc(100vh - 56px - 20px)',
		[theme.breakpoints.up('md')]: {
			width: '15%',
		}
	},
	listItemText: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	}
});

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
						<ListItemText primary="Home" className={classes.listItemText} />
					</ListItem>

					<ListItem button component={Link} to='/gen_cont_view'>
						<ListItemIcon>
							<MessageIcon />
						</ListItemIcon>
						<ListItemText primary="GeneralContractor" className={classes.listItemText} />
					</ListItem>

					<ListItem button component={Link} to='/sub_cont_view'>
						<ListItemIcon>
							<ServiceIcon />
						</ListItemIcon>
						<ListItemText primary="SubContractor" className={classes.listItemText} />
					</ListItem>

					<ListItem button component={Link} to='/bid_list_view'>
						<ListItemIcon>
							<HelpIcon />
						</ListItemIcon>
						<ListItemText primary="BidderListing" className={classes.listItemText} />
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
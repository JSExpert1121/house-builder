import React from 'react'
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';
import PagesIcon from '@material-ui/icons/Pages';
import Card from '@material-ui/core/Card';
import WidgetsIcon from '@material-ui/icons/widgets';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import ServiceIcon from '@material-ui/icons/GroupWork';
import HelpIcon from '@material-ui/icons/Help';

import auth0Client from '../../auth0/auth';

const styles = theme => ({
	list: {
		width: "60px",
		float: 'left',
		borderRadius: "0",
		height: 'calc(100vh - 64px)',
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
					{
						auth0Client.isAuthenticated() ?
							<div><ListItem button component={Link} to='/gen_cont_view'>
								<ListItemIcon>
									<MessageIcon />
								</ListItemIcon>
								<ListItemText primary="General Contractor" className={classes.listItemText} />
							</ListItem>

								<ListItem button component={Link} to='/sub_cont_view'>
									<ListItemIcon>
										<ServiceIcon />
									</ListItemIcon>
									<ListItemText primary="Sub Contractor" className={classes.listItemText} />
								</ListItem>

								<ListItem button component={Link} to='/bid_list_view'>
									<ListItemIcon>
										<HelpIcon />
									</ListItemIcon>
									<ListItemText primary="Bidder Listing" className={classes.listItemText} />
								</ListItem>
								<ListItem button component={Link} to='/all_projects'>
									<ListItemIcon>
										<WidgetsIcon />
									</ListItemIcon>
									<ListItemText primary="Projects" className={classes.listItemText} />
								</ListItem>

								<ListItem button component={Link} to='/man_temp_view'>
									<ListItemIcon>
										<PagesIcon />
									</ListItemIcon>
									<ListItemText primary="Manage Templates" className={classes.listItemText} />
								</ListItem>
							</div> : <div></div>
					}
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
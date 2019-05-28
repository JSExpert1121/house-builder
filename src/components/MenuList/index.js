import React from 'react'
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

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
import SettingsIcon from '@material-ui/icons/Settings';

import auth0Client from '../../auth0/auth';
import { setRedirectTo } from '../../actions';

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
	},
	selectedStyle: {
		borderLeft: "5px solid " + theme.palette.primary.light,
		color: theme.palette.primary.light
	}
});

class ConnectedMenuList extends React.Component {
	constructor(props) {
		super(props);

	}
	render() {
		const { classes, userProfile, location, redirectTo } = this.props;
		const pathname = location.pathname;

		if (!auth0Client.isAuthenticated())
			return (
				<Card className={classes.list}>
					<List>
						<ListItem button component={Link} to='/' className={pathname === '/' ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary="Home" className={classes.listItemText} />
						</ListItem>
					</List>
				</Card>
			);

		const roles = userProfile.user_metadata.roles;

		return (
			<Card className={classes.list}>
				<List>
					<ListItem button component={Link} to='/' className={pathname === '/' ? classes.selectedStyle : ""}
						onClick = {() => this.props.setRedirectTo(null)}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Home" className={classes.listItemText} />
					</ListItem>

					{
						(roles.includes("Gen") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/g_cont'
						onClick = {() => this.props.setRedirectTo(null)}
							className={redirectTo === '/g_cont' || pathname.includes('/g_cont') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<MessageIcon />
							</ListItemIcon>
							<ListItemText primary="General Contractor" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Sub") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/s_cont'
						onClick = {() => this.props.setRedirectTo(null)}
							className={redirectTo === '/s_cont' || pathname.includes('/s_cont') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<ServiceIcon />
							</ListItemIcon>
							<ListItemText primary="Sub Contractor" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Gen") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/b_list' 
						onClick = {() => this.props.setRedirectTo(null)}
						className={pathname.includes('/b_list') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<HelpIcon />
							</ListItemIcon>
							<ListItemText primary="Bidder Listing" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Sub") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/a_pros'
						onClick = {() => this.props.setRedirectTo(null)}
							className={redirectTo === '/a_pros' || pathname.includes('/a_pros') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<WidgetsIcon />
							</ListItemIcon>
							<ListItemText primary="Projects" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/m_temp' 
						onClick = {() => this.props.setRedirectTo(null)}
						className={pathname.includes('/m_temp') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<PagesIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Templates" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/m_cont' 
						onClick = {() => this.props.setRedirectTo(null)}
						className={pathname.includes('/m_cont') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Contractor" className={classes.listItemText} />
						</ListItem>
					}
					{
						(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
						<ListItem button component={Link} to='/m_spec' 
						onClick = {() => this.props.setRedirectTo(null)}
						className={pathname.includes('/m_spec') ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<PagesIcon />
							</ListItemIcon>
							<ListItemText primary="Manage Specialty" className={classes.listItemText} />
						</ListItem>
					}
				</List>

				<Divider />

			</Card>
		);
	}
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
		redirectTo: state.global_data.redirectTo,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setRedirectTo: (str) => dispatch(setRedirectTo(str))
	};
};

const MenuList = connect(mapStateToProps, mapDispatchToProps)(ConnectedMenuList);

MenuList.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(MenuList));
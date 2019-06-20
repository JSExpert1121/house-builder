import React        from 'react'
import { Link }     from 'react-router-dom';
import { connect }  from 'react-redux';
import { Location } from "history";

import List         from '@material-ui/core/List';
import Divider      from '@material-ui/core/Divider';
import ListItem     from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon     from '@material-ui/icons/Home';
import MessageIcon  from '@material-ui/icons/Message';
import PagesIcon    from '@material-ui/icons/Pages';
import Card         from '@material-ui/core/Card';
import WidgetsIcon  from '@material-ui/icons/Widgets';

import { Theme, withStyles } from '@material-ui/core/styles';

import ServiceIcon  from '@material-ui/icons/GroupWork';
import HelpIcon     from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';

import auth0Client       from '../../auth0/auth';
import { FloatProperty } from "csstype";
import { UserProfile }   from "../../types/global";

const styles = (theme: Theme) => ({
	list: {
		width: "60px",
		float: "left" as FloatProperty,
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

interface ConnectedMenuListProps {
	classes: any,
	userProfile: UserProfile,
	location: Location
}

class ConnectedMenuList extends React.Component<ConnectedMenuListProps> {
	render() {
		const {classes, userProfile, location} = this.props;
		const pathname = location.pathname;

		if (!auth0Client.isAuthenticated())
			return (
					<Card className={classes.list}>
						<List>
							<ListItem button component={Link} to='/' className={pathname === '/' ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<HomeIcon/>
								</ListItemIcon>
								<ListItemText primary="Home" className={classes.listItemText}/>
							</ListItem>
						</List>
					</Card>
			);

		const roles = userProfile.user_metadata.roles;

		return (
				<Card className={classes.list}>
					<List>
						<ListItem button component={Link} to='/' className={pathname === '/' ? classes.selectedStyle : ""}>
							<ListItemIcon>
								<HomeIcon/>
							</ListItemIcon>
							<ListItemText primary="Home" className={classes.listItemText}/>
						</ListItem>

						{
							(roles.includes("Gen") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/g_cont'
							          className={pathname.includes('/g_cont') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<MessageIcon/>
								</ListItemIcon>
								<ListItemText primary="General Contractor" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Sub") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/s_cont'
							          className={pathname.includes('/s_cont') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<ServiceIcon/>
								</ListItemIcon>
								<ListItemText primary="Sub Contractor" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Gen") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/b_list'
							          className={pathname.includes('/b_list') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<HelpIcon/>
								</ListItemIcon>
								<ListItemText primary="Bidder Listing" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Sub") || roles.includes("GenSub") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/a_pros'
							          className={pathname.includes('/a_pros') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<WidgetsIcon/>
								</ListItemIcon>
								<ListItemText primary="Projects" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/m_temp'
							          className={pathname.includes('/m_temp') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<PagesIcon/>
								</ListItemIcon>
								<ListItemText primary="Manage Templates" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/m_cont'
							          className={pathname.includes('/m_cont') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<SettingsIcon/>
								</ListItemIcon>
								<ListItemText primary="Manage Contractor" className={classes.listItemText}/>
							</ListItem>
						}
						{
							(roles.includes("Admin") || roles.includes("SuperAdmin")) &&
							<ListItem button component={Link} to='/m_spec'
							          className={pathname.includes('/m_spec') ? classes.selectedStyle : ""}>
								<ListItemIcon>
									<PagesIcon/>
								</ListItemIcon>
								<ListItemText primary="Manage Specialty" className={classes.listItemText}/>
							</ListItem>
						}
					</List>

					<Divider/>

				</Card>
		);
	}
};

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
	};
};

const MenuList = connect(mapStateToProps)(ConnectedMenuList);
export default withStyles(styles)(MenuList);
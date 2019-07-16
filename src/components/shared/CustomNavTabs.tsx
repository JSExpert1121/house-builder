import * as React from 'react';
import { Link } from 'react-router-dom';


import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const useStyles = makeStyles((theme) => ({
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark,
	},
	curTabPos: {},
	rootIcon: {
		marginBottom: '0 !important',
	}
}));

type NavTab = {
	href: string;
	label: string;
	icon: React.ComponentType<SvgIconProps>;
}

interface ICustomNavTabsProps {
	value: number;
	tabs: Array<NavTab>;
}

const CustomNavTabs: React.SFC<ICustomNavTabsProps> = (props) => {
	const classes = useStyles({});
	const { value, tabs } = props;
	return (
		<AppBar position="static" className={classes.toolbarstyle}>
			<Tabs
				value={value}
				variant="scrollable"
				scrollButtons="on"
				indicatorColor="primary"
				textColor="primary"
			>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						component={Link}
						to={tab.href}
						label={tab.label}
						icon={tab.icon && <tab.icon className={classes.rootIcon} />}
					/>
				))}
			</Tabs>
		</AppBar>
	);
};

export default CustomNavTabs;

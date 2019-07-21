import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BallotIcon from '@material-ui/icons/Ballot';
import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from '../../routers/SecuredRoute';

import ProfileEditView from './ProfileEditView';
import ProfileFileView from './ProfileFileView';

const styles = createStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
	},
}));

const PROFILE_OVERVIEW = '/profile';
const PROFILE_CONTRACT = '/profile/files';

interface ProfileViewProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
}

class ProfileView extends React.Component<ProfileViewProps> {
	render() {
		const { classes, location } = this.props;
		let tab = 0;
		if (location.pathname.includes(PROFILE_CONTRACT)) tab = 1;
		return (
			<Box className={classes.root}>
				<CustomTabs
					init={tab}
					tabs={[
						{
							href: PROFILE_OVERVIEW,
							label: 'Profile Detail',
							icon: AccountCircleIcon,
						},
						{
							href: PROFILE_CONTRACT,
							label: 'Files',
							icon: BallotIcon,
						},
					]}
				/>
				<Switch>
					<SecuredRoute path={PROFILE_CONTRACT} component={ProfileFileView} />
					<SecuredRoute
						exact
						path={PROFILE_OVERVIEW}
						component={ProfileEditView}
					/>
				</Switch>
			</Box>
		);
	}
}

export default withStyles(styles)(ProfileView);

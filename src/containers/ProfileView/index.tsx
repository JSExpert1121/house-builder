import React from 'react';
import { connect } from 'react-redux';
import { Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BallotIcon from '@material-ui/icons/Ballot';
import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from 'routers/SecuredRoute';

import { setUserProfile } from 'store/actions/global-actions';
import * as ContActions from 'store/actions/cont-actions';
import { UserProfile, Specialties } from 'types/global';
import { Projects } from 'types/project';

import ProfileView from './ProfileView';
import ProfileFileView from './ProfileFileView';
import ProfileReview from './ProfileReview';
import ProfileSpecialty from './ProfileSpecialty';

const styles = createStyles((theme: Theme) => ({
	root: {
		flex: 1,
		flexDirection: 'column',
		display: 'flex',
		position: 'relative',
		overflow: 'auto'
	},
	contents: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1
	},
	center: {
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
		position: 'absolute'
	}
}));

const PROFILE_OVERVIEW = '/profile';
const PROFILE_CONTRACT = '/profile/files';
const PROFILE_SPECIALTY = '/profile/specialty';
const PROFILE_ASKREVIEW = '/profile/review';

interface ProfilePageProps extends RouteComponentProps, StyledComponentProps {
	userProfile: UserProfile;
	classes: ClassNameMap<string>;
	contractor: any;
	specialties: Specialties;
	pastProjects: Projects;
	selectContractor: (id: string) => Promise<any>;
	getSpecialties: (page: number, size: number) => Promise<void>;
	getPastProjects: (id: string) => Promise<void>;
}

class ProfilePage extends React.Component<ProfilePageProps> {

	async componentDidMount() {
		const { userProfile, selectContractor, contractor, getSpecialties, getPastProjects } = this.props;
		const contId = userProfile.user_metadata.contractor_id;
		if (!!contractor) return;
		try {
			await getSpecialties(0, 20);
			await selectContractor(contId);
			await getPastProjects(contId);
		} catch (error) {
			console.log('ProfileOverview.CDM: ', error);
		}
	}


	render() {
		const { classes, location, contractor, specialties, pastProjects } = this.props;
		if (!contractor || !specialties || !pastProjects) {
			return (
				<Box className={classes.root}>
					<CircularProgress className={classes.center} />
				</Box>
			)
		}

		let tab = 0;
		if (location.pathname.includes(PROFILE_CONTRACT)) tab = 1;
		else if (location.pathname.includes(PROFILE_SPECIALTY)) tab = 2;
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
						{
							href: PROFILE_SPECIALTY,
							label: 'Specialty',
							icon: BallotIcon,
						},
					]}
				/>
				<Switch>
					<SecuredRoute path={PROFILE_CONTRACT} component={ProfileFileView} />
					<SecuredRoute path={PROFILE_ASKREVIEW} component={ProfileReview} />
					<SecuredRoute path={PROFILE_SPECIALTY} component={ProfileSpecialty} />
					<SecuredRoute exact path={PROFILE_OVERVIEW} component={ProfileView} />
				</Switch>
			</Box>
		);
	}
}

const mapDispatchToProps = {
	setUserProfile,
	selectContractor: ContActions.selectContractor,
	getSpecialties: ContActions.getSpecialties,
	getPastProjects: ContActions.getPastProjects
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	contractor: state.cont_data.selectedContractor,
	specialties: state.cont_data.specialties,
	pastProjects: state.cont_data.pastProjects,
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProfilePage));

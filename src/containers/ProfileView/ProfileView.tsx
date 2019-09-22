import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import ProfileOverview from './ProfileOverview';
import ProfileEditView from './ProfileEditView';

import { UserProfile, Specialties } from 'types/global';
import { setUserProfile } from 'store/actions/global-actions';
import * as ContActions from 'store/actions/cont-actions';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import auth0Client from 'services/auth0/auth';
import ContApi from 'services/contractor';
import ProjApi from 'services/project';
import { Profile } from './types';
import { Projects } from 'types/project';

import ProfileLicensesView from './ProfileLicenses';
import ProfileProjectsView from './ProfileProjects';
import ProfilePhotosView from './ProfilePhotos';
import ProfileSocialView from './ProfileSocial';


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        height: 'calc(100vh - 119px)',
        overflowY: 'auto',
        padding: theme.spacing(1, 0),
    },
    contents: {
        width: '400px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        borderRadius: 0,
        [theme.breakpoints.up('xs')]: {
            width: '640px',
        },
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
})

interface IProfileViewProps extends RouteComponentProps, withSnackbarProps, StyledComponentProps {
    userProfile: UserProfile;
    contractor: any;
    specialties: Specialties;
    pastProjects: Projects;
    photos: any[];
    links: any[];
    selectContractor: (id: string) => any;
    getPastProjects: (id: string) => Promise<void>;
    setUserProfile: (profile: UserProfile) => void;
    setSelectedContractor: (data: any) => void;
    getPhotos: (id: string) => Promise<void>;
    getLinks: (id: string) => Promise<void>;
}

interface IProfileViewState {
    profile?: Profile;
    editing: boolean;
    isBusy: boolean;
}

class ProfileView extends React.Component<IProfileViewProps, IProfileViewState> {

    constructor(props: Readonly<IProfileViewProps>) {
        super(props);

        const contId = props.userProfile.user_metadata.contractor_id;
        this.state = {
            profile: {
                firstname: props.userProfile.user_metadata.firstname,
                lastname: props.userProfile.user_metadata.lastname,
                picture: ContApi.getAvatar(contId),
                email: props.userProfile.email,
                status: props.contractor.status,
                address: props.contractor.address || {
                    name: '',
                    city: '',
                    street: '',
                    phone: '',
                    company: '',
                    website: '',
                    founded: '',
                    employees: ''
                }
            },
            editing: false,
            isBusy: false
        }
    }

    handleSave = async () => {
        const { userProfile, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            const email = userProfile.email;
            await ContApi.update(id, email, email, this.state.profile.address);

            const new_prof = {
                user_metadata: {
                    firstname: this.state.profile.firstname,
                    lastname: this.state.profile.lastname
                },
            };

            const newProfile = await auth0Client.updateProfile(new_prof);
            this.props.setUserProfile(newProfile);
            showMessage(true, 'Profile saved');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.handleSave: ', error);
            showMessage(false, 'Profile save failed');
            this.setState({ isBusy: false });
        }
    }

    handleChange = (field: string) => (value: any) => {
        this.setState({
            profile: {
                ...this.state.profile,
                [field]: value
            }
        });
    }

    uploadPicture = async (file: File) => {

        const { userProfile, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadAvatar(id, file);
            const path = ContApi.getAvatar(id);
            this.setState({ isBusy: false });
            return path;
        } catch (error) {
            console.log('ProfileView.uploadPicture: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Upload avatar failed');
            return '';
        }
    }

    askReview = () => {
        this.props.history.push('/profile/review');
    }

    uploadLicense = async (city: string, type: string, number: string, file: File) => {
        const { userProfile, selectContractor, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadLicense(id, file, city, type, number);
            await selectContractor(id);
            showMessage(true, 'License uploaded');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileLicensesView.handleSubmit: ', error);
            showMessage(false, 'License upload failed');
            this.setState({ isBusy: false });
        }
    }

    uploadProject = async (title: string, price: number, location: string, service: string, duration: number, unit: string, year: number, desc: string, files: File[]) => {
        let period = 0;
        if (unit.startsWith('day')) period = duration;
        else if (unit.startsWith('week')) period = duration * 7;
        else period = duration * 30;

        const { userProfile, showMessage, getPastProjects } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            const proj = await ContApi.uploadPastProject(id, title, desc, price, year, period, service)
            await ProjApi.addFiles(proj.id, files);
            // await selectContractor(id);
            await getPastProjects(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Project uploaded');
        } catch (error) {
            console.log('ProfileView.uploadProject: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Project upload failed');
        }
    }

    uploadPhoto = async (file: File) => {
        const { userProfile, showMessage, getPhotos } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.uploadPhoto(id, file);
            await getPhotos(id);
            showMessage(true, 'Photo uploaded');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.uploadPhoto: ', error);
            showMessage(false, 'Photo upload failed');
            this.setState({ isBusy: false });
        }
    }

    uploadVideo = async (link: string) => {
        console.log('ProfileView.uploadVideo: ');
        const { userProfile, showMessage, getLinks } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.addLink(id, link);
            await getLinks(id);
            showMessage(true, 'Link added');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.uploadVideo: ', error);
            showMessage(false, 'Add Link failed');
            this.setState({ isBusy: false });
        }
    }

    updateTitle = async (id: string, title: string) => {
        console.log('ProfileView.updateTitle: ', title);
    }

    deletePV = async (name: string) => {
        const { userProfile, selectContractor, showMessage } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            await ContApi.deleteFile(id, name);
            await selectContractor(id);
            showMessage(true, 'Photo deleted');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.deletePV: ', error);
            showMessage(false, 'Photo delete failed');
            this.setState({ isBusy: false });
        }
    }

    saveSocial = async (facebook: string, instagram: string, twitter: string) => {
        const { userProfile, showMessage, getLinks } = this.props;
        this.setState({ isBusy: true });
        try {
            const id = userProfile.user_metadata.contractor_id;
            !!facebook && facebook.startsWith('https://www.facebook.com') && await ContApi.addLink(id, facebook);
            !!instagram && instagram.startsWith('https://www.instagram.com') && await ContApi.addLink(id, instagram);
            !!twitter && twitter.startsWith('https://twitter.com') && await ContApi.addLink(id, twitter);
            await getLinks(id);
            showMessage(true, 'Link added');
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('ProfileView.saveSocial: ', error);
            showMessage(false, 'Add Link failed');
            this.setState({ isBusy: false });
        }
    }

    render() {
        const { profile, editing, isBusy } = this.state;
        const { classes, userProfile, specialties, pastProjects, photos, links } = this.props;
        if (!profile) {
            return (
                <Box className={classes.root}>
                    <CircularProgress className={classes.center} />
                </Box>
            )
        }

        return (
            <Box className={classes.root}>
                <Box className={classes.contents}>
                    {editing && (
                        <ProfileEditView
                            gotoOverview={() => this.setState({ editing: false })}
                            profile={profile}
                            handleSave={this.handleSave}
                            handleChange={this.handleChange}
                            uploadPicture={this.uploadPicture}
                        />
                    )}
                    {!editing && (
                        <ProfileOverview
                            profile={profile}
                            askReview={this.askReview}
                            gotoEditView={() => this.setState({ editing: true })}
                        />
                    )}
                    <ProfileLicensesView userProfile={userProfile} handleSubmit={this.uploadLicense} />
                    <ProfileProjectsView
                        handleSubmit={this.uploadProject}
                        specialties={specialties}
                        pastProjects={pastProjects}
                        contId={userProfile.user_metadata.contractor_id}
                    />
                    <ProfilePhotosView
                        contId={userProfile.user_metadata.contractor_id}
                        photos={photos}
                        videos={links}
                        uploadPhoto={this.uploadPhoto}
                        uploadVideo={this.uploadVideo}
                        updateTitle={this.updateTitle}
                        delete={this.deletePV}
                    />
                    <ProfileSocialView
                        handleSubmit={this.saveSocial}
                        links={links}
                    />
                </Box>
                {isBusy && <CircularProgress className={classes.center} />}
            </Box >
        );
    }
};

const mapDispatchToProps = {
    setUserProfile,
    selectContractor: ContActions.selectContractor,
    getPastProjects: ContActions.getPastProjects,
    getPhotos: ContActions.getProfilePhotos,
    getLinks: ContActions.getProfileLinks,
    setSelectedContractor: ContActions.setSelectedContractor,
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    specialties: state.cont_data.specialties,
    pastProjects: state.cont_data.pastProjects,
    contractor: state.cont_data.selectedContractor,
    photos: state.cont_data.photos,
    links: state.cont_data.links
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(ProfileView)));

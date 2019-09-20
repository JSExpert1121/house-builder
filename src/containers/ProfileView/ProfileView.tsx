import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import ProfileOverview from './ProfileOverview';
import ProfileEditView from './ProfileEditView';

import { UserProfile } from 'types/global';
import { setUserProfile } from 'store/actions/global-actions';
import * as ContActions from 'store/actions/cont-actions';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import auth0Client from 'services/auth0/auth';
import ContApi from 'services/contractor';
import { Profile } from './types';


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        height: 'calc(100vh - 119px)',
        overflow: 'auto',
        display: 'flex',
        padding: theme.spacing(1, 0),
        flex: 1
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
    setUserProfile: (profile: UserProfile) => void;
    setSelectedContractor: (data: any) => void;
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
            console.log(path);
            this.setState({
                profile: {
                    ...this.state.profile,
                    picture: path
                },
                isBusy: false
            });
        } catch (error) {
            console.log('ProfileView.uploadPicture: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Upload avatar failed');
        }

        return '';
    }

    askReview = () => {
        this.props.history.push('/profile/review');
    }

    render() {
        const { profile, editing, isBusy } = this.state;
        const { classes } = this.props;
        if (!profile) {
            return (
                <Box className={classes.root}>
                    <CircularProgress className={classes.center} />
                </Box>
            )
        }

        return (
            <Box className={classes.root}>
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
                {isBusy && <CircularProgress className={classes.center} />}
            </Box >
        );
    }
};

const mapDispatchToProps = {
    setUserProfile,
    setSelectedContractor: ContActions.setSelectedContractor
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    contractor: state.cont_data.selectedContractor
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(ProfileView)));

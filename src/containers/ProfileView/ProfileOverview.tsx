import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import NameIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import WebIcon from '@material-ui/icons/Web';
import AddressIcon from '@material-ui/icons/MyLocation';
import EventIcon from '@material-ui/icons/Event';
import GroupIcon from '@material-ui/icons/Group';

import InfoView from 'components/InfoView';
import { Profile } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: '0',
    },
    marginRight: {
        marginRight: theme.spacing(1)
    },
    row: {
        display: 'flex',
        padding: theme.spacing(1.5, 0),
        fontSize: '0.875rem'
    },
    avatar: {
        width: 60,
        height: 60,
        [theme.breakpoints.up('sm')]: {
            width: 80,
            height: 80,
        }
    },
    company: {
        marginLeft: theme.spacing(2),
        paddingTop: theme.spacing(0.5),
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    companyName: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    rating: {
        marginTop: theme.spacing(0.5),
        display: 'flex'
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer'
    },
    status: {
        position: 'absolute',
        left: '20px',
        top: '10px',
        color: 'blue',
        fontSize: '12px',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
}));

interface ProfileOverviewProps {
    profile: Profile;
    gotoEditView: () => void;
    gotoReview: () => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = props => {

    const handleEdit = () => {
        props.gotoEditView();
    }

    const classes = useStyles({});
    const { profile } = props;

    return (
        <Card className={classes.container}>
            <Box className={classes.row}>
                <Avatar
                    alt="Avatar"
                    src={profile.picture}
                    className={classes.avatar}
                />
                <Box className={classes.company}>
                    <Typography className={classes.companyName}>
                        {profile.address.company}
                    </Typography>
                    <Box className={classes.rating}>
                        <Rating precision={0.1} value={3.6} readOnly size='small' style={{ marginRight: 16 }} />
                        <Link onClick={props.gotoReview} className={classes.link}>
                            Ask Review
    					</Link>
                    </Box>
                </Box>
                <Box>
                    <Link onClick={handleEdit} className={classes.link}>
                        Edit
					</Link>
                </Box>
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Name'}
                    content={`${profile.firstname} ${profile.lastname}`}
                    icon={<NameIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Email'}
                    content={`${profile.email}`}
                    icon={<EmailIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Phone'}
                    content={`${profile.address.phone}`}
                    icon={<PhoneIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Website'}
                    content={profile.address.website}
                    icon={<WebIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Address'}
                    content={`${profile.address.street} ${profile.address.city}`}
                    icon={<AddressIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Year founded'}
                    content={profile.address.founded && profile.address.founded}
                    icon={<EventIcon />}
                />
            </Box>
            <Box className={classes.row}>
                <InfoView
                    label={'Number of employees'}
                    content={profile.address.employees && profile.address.employees}
                    icon={<GroupIcon />}
                />
            </Box>
        </Card>
    );
}

export default ProfileOverview;

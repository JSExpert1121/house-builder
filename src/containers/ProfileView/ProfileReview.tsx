import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';

import RateIcon from '@material-ui/icons/RateReview';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/AddCircleOutline';

import { setUserProfile } from 'store/actions/global-actions';
import ContApi from 'services/contractor';
import { UserProfile } from 'types/global';


const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflow: 'auto',
        flex: 1
    },
    container: {
        width: 640,
        height: 'auto',
        padding: theme.spacing(2)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    flex: {
        display: 'flex'
    },
    button: {
        width: 160,
        border: '1px solid #4a148c',
        color: 'white',
        margin: 'auto',
        textDecoration: 'underline',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
    add: {
        color: theme.palette.primary.dark
    },
    bold: {
        fontWeight: 600
    },
    avatar: {
        margin: 'auto',
        width: 48,
        height: 48,
    },
}));

interface IProfileReviewProps extends RouteComponentProps {
    userProfile: UserProfile;
    contractor: any;
    setUserProfile: (profile: UserProfile) => void;
}

const ProfileReview: React.FunctionComponent<IProfileReviewProps> = (props) => {

    const classes = useStyles({});
    const rating = 3.8;
    const rateCount = 12;
    const labels = [5, 4, 3, 2, 1];
    const rates = [4.8, 3.2, 4.6, 5, 4.3];
    const { contractor } = props;

    const [dialog, setDialog] = React.useState(false);
    const [mails, setMails] = React.useState<string[]>(['']);
    const [mailRate, setMailRate] = React.useState(5.0);
    const [msg, setMsg] = React.useState(`Thanks for being a valued customer. I just signed up on find more excellent customers like you, and reviews are a big part of my profile. Can you take a moment to write a couple of sentences about working with me? I'd love if my future customers could hear about your experience firsthand. \r\nThanks, ${contractor.address.company}`)

    const onSendRequest = () => {

        console.log('SendRequest: ');
    }

    const getLink = () => {
        console.log('Get shareable link: ');
    }

    const deleteMail = (index: number) => {
        setMails([
            ...mails.slice(0, index),
            ...mails.slice(index + 1)
        ]);
    }

    const changeMail = (index: number, value: string) => {
        mails[index] = value;
        setMails([...mails]);
    }

    const addMail = () => {
        setMails([
            ...mails,
            ''
        ])
    }

    const avatar = ContApi.getAvatar(props.userProfile.user_metadata.contractor_id);
    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <List>
                    <ListItem>
                        <Typography className={classes.title}>
                            Reviews
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Box className={classes.flex}>
                            <Box style={{ display: 'flex', flexDirection: 'column', marginRight: 32 }}>
                                <Typography style={{ fontSize: '1.125rem', fontWeight: 600, padding: '8px 4px' }}>
                                    {rating.toFixed(1)}
                                </Typography>
                                <Rating precision={0.1} value={rating} readOnly style={{ padding: '0 0 8px' }} />
                                <Typography>
                                    {`${rateCount} reviews`}
                                </Typography>
                            </Box>
                            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                {!!labels && labels.map((label, index) => (
                                    <Box style={{ display: 'flex' }} key={index}>
                                        <Typography component='span' style={{ marginRight: 8 }}>
                                            {label}
                                        </Typography>
                                        <Rating precision={0.1} value={rates[index]} readOnly size='small' />
                                        <Typography component='span' style={{ marginLeft: 8 }}>
                                            {`${(rates[index] * 20).toFixed(0)} %`}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Box className={classes.flex}>
                            <RateIcon style={{ padding: '16px 0', fontSize: 64 }} />
                            <Box id='review-description' style={{ flex: 1, padding: 8 }}>
                                <Typography style={{ fontWeight: 600 }}>
                                    {"Get reviews from past customers, even if they're not on Thumbtack."}
                                </Typography>
                                <Typography style={{ fontSize: '0.875rem' }}>
                                    {"Tell us which customers to ask for a review, and we'll send the request for you."}
                                </Typography>
                            </Box>
                            <Box id='review-button'>
                                <Button
                                    className={classes.button}
                                    style={{ marginTop: 8 }}
                                    onClick={() => setDialog(true)}
                                >
                                    Ask for Reviews
                                </Button>
                            </Box>
                        </Box>
                    </ListItem>
                </List>
            </Paper>
            <Dialog open={dialog} onClose={() => setDialog(false)}>
                <DialogTitle id="review-dialog-title">
                    <Typography className={classes.title}>
                        {'Get reviews from past customers'}
                    </Typography>
                    <Typography>
                        {'Ask past customers for reviews, or add online reviews you already have.'}
                        <br />
                        {'You can show up to 10 reviews from previous customers.'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <Typography className={classes.bold}>
                            Send past customers an email
                        </Typography>
                        {
                            <TextField
                                label="Email 1"
                                margin="dense"
                                fullWidth
                                value={mails[0]}
                                onChange={e => changeMail(0, e.target.value)}
                                required
                            />
                        }
                        {
                            mails.length > 0 && mails.slice(1).map((mail, idx) => (
                                <Box style={{ display: 'flex' }} key={idx}>
                                    <TextField
                                        label={`Email ${idx + 2}`}
                                        margin="dense"
                                        fullWidth
                                        value={mails[idx + 1]}
                                        onChange={e => changeMail(idx + 1, e.target.value)}
                                        required
                                    />
                                    <IconButton onClick={() => deleteMail(idx + 1)} style={{ height: 37, margin: 10 }}>
                                        <DeleteIcon fontSize='small' color='error' />
                                    </IconButton>
                                </Box>
                            ))
                        }
                        <Button onClick={addMail} className={classes.add}>
                            <AddIcon />&nbsp;&nbsp;
                            <span>Add customer</span>
                        </Button>
                    </Box>
                    <Box id='email-preview' style={{ padding: '16px 0' }}>
                        <Typography className={classes.bold}>
                            Email preview
                        </Typography>
                        <Box style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Avatar
                                alt="Avatar"
                                src={avatar}
                                className={classes.avatar}
                                style={{ margin: '8px 0' }}
                            />
                            <Typography className={classes.bold} style={{ fontSize: '0.875rem' }}>
                                {contractor.address.company}
                            </Typography>
                            <Rating
                                precision={0.1}
                                value={mailRate}
                                size='medium'
                                onChange={(e, val) => setMailRate(val)}
                                style={{ margin: 8 }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                style={{ textAlign: 'left' }}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions style={{ display: 'flex', padding: 24 }}>
                    <Box style={{ flex: 1 }}>
                        <Button onClick={onSendRequest} autoFocus className={classes.button}>
                            Send Request
                        </Button>
                    </Box>
                    <Button onClick={getLink} color="primary">
                        Get shareable link
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const mapDispatchToProps = {
    setUserProfile,
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    contractor: state.cont_data.selectedContractor
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileReview);

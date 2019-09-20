import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import { SocialIcon } from 'react-social-icons';


const styles = (theme: Theme) => createStyles({
    container: {
        width: '100%',
        borderRadius: '0',
        padding: theme.spacing(2)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    button: {
        margin: '4px'
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer'
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

export interface IProfileSocialProps extends StyledComponentProps {
    handleSubmit: (facebook: string, instagram: string, twitter: string) => Promise<void>;
}

interface IProfileSocialState {
    dialog: boolean;
    facebook: string;
    instagram: string;
    twitter: string;
}

class ProfileSocial extends React.Component<IProfileSocialProps, IProfileSocialState> {

    constructor(props: Readonly<IProfileSocialProps>) {
        super(props);

        this.state = {
            dialog: false,
            facebook: '',
            instagram: '',
            twitter: '',
        }
    }

    showDialog = () => {
        this.setState({ dialog: true });
    }

    closeDialog = () => {
        this.setState({ dialog: false });
    }

    handleSubmit = () => {
        const { facebook, instagram, twitter } = this.state;
        this.props.handleSubmit(facebook, instagram, twitter);
        this.setState({ dialog: false });
    }

    public render() {
        const { classes } = this.props;
        const { dialog, facebook, instagram, twitter } = this.state;
        return (
            <>
                <Card className={classes.container}>
                    <List>
                        <ListItem>
                            <Typography className={classes.title} style={{ flex: 1 }}>
                                Social Media
                                </Typography>
                        </ListItem>
                        <ListItem>
                            <Box
                                style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                                onClick={this.showDialog}
                            >
                                <Button variant='outlined' color='primary'>
                                    <SocialIcon style={{ width: 20, height: 20 }} network='facebook' />
                                    &nbsp;&nbsp;&nbsp;Add Facebook
                                </Button>
                                <Button variant='outlined' color='primary'>
                                    <SocialIcon style={{ width: 20, height: 20 }} network='instagram' />
                                    &nbsp;&nbsp;&nbsp;Add Instagram
                                </Button>
                                <Button variant='outlined' color='primary'>
                                    <SocialIcon style={{ width: 20, height: 20 }} network='twitter' />
                                    &nbsp;&nbsp;&nbsp;Add Twitter
                                </Button>
                            </Box>
                        </ListItem>
                    </List>
                </Card>
                <Dialog open={dialog} onClose={this.closeDialog}>
                    <DialogTitle id="review-dialog-title">
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography className={classes.title} style={{ flex: 1 }}>
                                {'Social Media'}
                            </Typography>
                            <Link onClick={this.handleSubmit} className={classes.link}>
                                Save
						    </Link>
                            <Link
                                onClick={this.closeDialog}
                                className={classes.link}
                                style={{ paddingLeft: 12, color: 'red' }}
                            >
                                Cancel
						    </Link>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <List style={{ minWidth: 512 }}>
                            <ListItem style={{ display: 'block', padding: '8px 0' }}>
                                <InputLabel>
                                    <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='facebook' />
                                    &nbsp;&nbsp;&nbsp;Facebook
                                </InputLabel>
                                <Input
                                    placeholder={`Enter Facebook URL`}
                                    margin="dense"
                                    fullWidth
                                    value={facebook}
                                    style={{ marginBottom: 16 }}
                                    onChange={e => this.setState({ facebook: e.target.value })}
                                />
                            </ListItem>
                            <ListItem style={{ display: 'block', padding: '8px 0' }}>
                                <InputLabel>
                                    <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='instagram' />
                                    &nbsp;&nbsp;&nbsp;Instagram
                                </InputLabel>
                                <Input
                                    placeholder={`Enter Instagram URL`}
                                    margin="dense"
                                    fullWidth
                                    value={instagram}
                                    style={{ marginBottom: 16 }}
                                    onChange={e => this.setState({ instagram: e.target.value })}
                                />
                            </ListItem>
                            <ListItem style={{ display: 'block', padding: '8px 0' }}>
                                <InputLabel>
                                    <SocialIcon style={{ width: 20, height: 20, marginBottom: 4, fontSize: '0.875rem' }} network='twitter' />
                                    &nbsp;&nbsp;&nbsp;Twitter
                                </InputLabel>
                                <Input
                                    placeholder={`Enter Twitter URL`}
                                    margin="dense"
                                    fullWidth
                                    value={twitter}
                                    style={{ marginBottom: 16 }}
                                    onChange={e => this.setState({ twitter: e.target.value })}
                                />
                            </ListItem>
                        </List>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileSocial);
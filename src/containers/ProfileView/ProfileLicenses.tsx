import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

import UploadButton from 'components/CustomUpload/UploadButton';
import { UserProfile } from 'types/global';


const styles = (theme: Theme) => createStyles({
    contents: {
        width: '100%',
        overflow: 'auto',
        margin: theme.spacing(1, 0)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    borderedBox: {
        border: '1px dashed rgba(0, 0, 0, 0.5)',
        padding: theme.spacing(1),
        display: 'flex'
    },
    button: {
        margin: '4px'
    },
    submit: {
        width: 120,
        border: '1px solid #4a148c',
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
    bold: {
        fontWeight: 600
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

export interface IProfileLicenseProps extends StyledComponentProps {
    userProfile: UserProfile;
    handleSubmit: (city: string, type: string, number: string, file: File) => Promise<void>;
}

interface IProfileLicenseState {
    dialog: boolean;
    city: string;
    type: string;
    number: string;
    file?: File;
}

class ProfileLicense extends React.Component<IProfileLicenseProps, IProfileLicenseState> {

    constructor(props: Readonly<IProfileLicenseProps>) {
        super(props);

        this.state = {
            dialog: false,
            city: '',
            type: '',
            number: '',
            file: undefined
        }
    }

    handleAdd = () => {
        this.setState({ dialog: true });
    }

    handleCancel = () => {
        this.setState({ dialog: false });
    }

    handleSubmit = () => {
        const { city, type, number, file } = this.state;
        this.props.handleSubmit(city, type, number, file);
        this.setState({ dialog: false });
    }

    handleUpload = (file: File) => {
        this.setState({ file });
    }

    public render() {
        const { classes } = this.props;
        const { dialog, city, type, number, file } = this.state;
        return (
            <>
                <Card className={classes.contents}>
                    <List>
                        <ListItem>
                            <Typography className={classes.title}>
                                Credentials
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Box style={{ width: '100%' }}>
                                <Box style={{ display: 'flex' }}>
                                    <CheckIcon style={{ marginRight: 16, fontSize: 24, padding: 4 }} />
                                    <Typography className={classes.bold} style={{ marginBottom: 4 }}>
                                        Professional Licenses
                                    </Typography>
                                </Box>
                                <Box className={classes.borderedBox}>
                                    <Typography style={{ fontSize: '0.875rem', flex: 1, marginRight: 16 }}>
                                        Customers prefer to hire professionals who are licensed in their profession.
                                    </Typography>
                                    <Button
                                        onClick={this.handleAdd}
                                        variant='outlined'
                                        className={classes.button}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>
                        </ListItem>
                    </List>
                </Card>
                <Dialog open={dialog} onClose={this.handleCancel}>
                    <DialogTitle id="review-dialog-title">
                        <Typography className={classes.title}>
                            {'Add a professional license'}
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            {'Please provide your license information below for your profile.\r\n'}
                            {'If we are able to locate the license under your name and business, we will display the license information on your profile. If you need help uploading your license, please contact us at '}
                            <Link target='_blank' href='https://google.com'>here</Link>
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box>
                            <TextField
                                label={`City`}
                                margin="dense"
                                fullWidth
                                value={city}
                                onChange={e => this.setState({ city: e.target.value })}
                                required
                            />
                            <TextField
                                label={`License type`}
                                margin="dense"
                                fullWidth
                                value={type}
                                onChange={e => this.setState({ type: e.target.value })}
                                required
                            />
                            <TextField
                                label={`License number`}
                                margin="dense"
                                fullWidth
                                value={number}
                                onChange={e => this.setState({ number: e.target.value })}
                                required
                            />
                            <Box style={{ flex: 1, marginTop: 8 }}>
                                <UploadButton
                                    multiple={false}
                                    filter={'image/*'}
                                    handleChange={this.handleUpload}
                                    variant={'outlined'}
                                    style={{ marginRight: 16 }}
                                >
                                    Upload Picture
							    </UploadButton>
                                {!!file && <Chip label={file.name} variant='outlined' />}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', padding: 24 }}>
                        <Button onClick={this.handleSubmit} autoFocus className={classes.submit} variant={'outlined'}>
                            Submit
                        </Button>
                        <Button onClick={this.handleCancel} variant={'outlined'}>
                            Cancel
                        </Button>
                    </DialogActions>
                    <DialogContent style={{ padding: '8px 24px 24px' }}>
                        <Typography style={{ fontSize: '0.875rem', fontWeight: 600, paddingTop: 8 }}>
                            Why show your license?
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            For certain services, customers prefer to hire professionals who are licensed in their profession. In other cases, licenses are required for the job.
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem', fontWeight: 600, paddingTop: 8 }}>
                            What kind of license can I upload to display on my profile?
                        </Typography>
                        <Typography style={{ fontSize: '0.875rem' }}>
                            Occupational or professional licenses, as indicated by the options in the above dropdown menu. We do not display business licenses or registrations because those do not showcase occupational credentials.
                        </Typography>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileLicense);
import React from 'react';
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles, Theme, createStyles, StyledComponentProps } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import MultiSelect, { SelectObject } from 'components/Select/MultiSelect';
import CustomTableCell from 'components/shared/CustomTableCell';

import * as ContActions from 'store/actions/cont-actions';
import ContApi from 'services/contractor';
import { UserProfile, Specialties } from 'types/global';
import { compose } from 'redux';
import Button from 'components/CustomButtons/Button';


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
        height: 'calc(100vh - 119px)',
        padding: theme.spacing(1, 0),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        overflow: 'auto',
    },
    contents: {
        width: 640,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: theme.spacing(1)
    },
    subContents: {
        width: '100%',
        overflow: 'auto',
        margin: theme.spacing(1, 0)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    select: {
        width: '100%'
    },
    chip: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    },
});

interface ProfileFileViewProps extends StyledComponentProps, withSnackbarProps {
    user: UserProfile;
    contractor: any;
    specialties: Specialties;
    selectContractor: (id: string) => Promise<any>;
    addSpecialty: (id: string, specId: string) => Promise<void>;
    deleteSpecialty: (id: string, specId: string) => Promise<void>;
}

interface ProfileFileViewState {
    isBusy: boolean;
    showConfirmDlg: boolean;
    confirmMessage: string;
    onYes: () => Promise<void>;
    idToDel: string;
    specs: string[];
    suggestions: SelectObject[];
}

class ProfileFileView extends React.Component<ProfileFileViewProps, ProfileFileViewState> {
    constructor(props: Readonly<ProfileFileViewProps>) {
        super(props);

        this.state = {
            showConfirmDlg: false,
            confirmMessage: '',
            onYes: this.deleteSpecialty,
            isBusy: false,
            idToDel: '',
            specs: props.contractor.contractorSpecialties.map(item => (item.specialty.name)),
            suggestions: props.specialties.content.map(spec => ({ id: spec.id, name: spec.name }))
        };
    }

    closeConfirmDialog = () => {
        this.setState({ showConfirmDlg: false });
    };

    handleDelete = id => {
        this.setState({
            showConfirmDlg: true,
            idToDel: id,
            onYes: this.deleteSpecialty,
            confirmMessage: 'Do you really want to delete specialty?'
        });
    };

    deleteSpecialty = async () => {
        const { user, showMessage, selectContractor } = this.props;
        const id = user.user_metadata.contractor_id;

        this.setState({ isBusy: true, showConfirmDlg: false });
        try {
            console.log(this.state.idToDel);
            await ContApi.deleteSpecialty(id, this.state.idToDel);
            const data = await selectContractor(id);
            this.setState({ isBusy: false, specs: data.contractorSpecialties.map(item => (item.specialty.name)) });
            showMessage(true, 'Specialty deleted');
        } catch (error) {
            console.log('ProfileSpecialty.deleteSpecialty: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Specialty delete failed');
        }
    }

    selectChange = (val: Array<string>) => {
        this.setState({ specs: val });
    }

    deleteSelect = (name: string) => {
        const { specs } = this.state;

        let idx: number = specs.indexOf(name);
        if (idx >= 0) {
            specs.splice(idx, 1);
            this.setState({ specs: [...specs] });
        }
    }

    saveSpecialty = async () => {
        const { user, showMessage, contractor, specialties, selectContractor } = this.props;
        const exists = contractor.contractorSpecialties;
        const id = user.user_metadata.contractor_id;

        const { specs } = this.state;
        this.setState({ isBusy: true, showConfirmDlg: false });
        try {
            const toDel = exists.filter(item => specs.indexOf(item.specialty.name) < 0);
            const toAdd = specialties.content.filter(item => specs.indexOf(item.name) >= 0 && exists.every(exist => item.id !== exist.specialty.id));
            const task = [];
            for (let i = 0; i < toDel.length; i++) {
                task.push(ContApi.deleteSpecialty(id, toDel[i].specialty.id));
            }
            for (let i = 0; i < toAdd.length; i++) {
                task.push(ContApi.addSpecialty(id, toAdd[i].id));
            }

            for (let i = 0; i < task.length; i++) {
                await task[i];
            }

            await selectContractor(id);
            this.setState({ isBusy: false });
            showMessage(true, 'Specialties saved');
        } catch (error) {
            console.log('ProfileSpecialty.handleSave: ', error);
            this.setState({ isBusy: false });
            showMessage(false, 'Specialties save failed');
        }
    }

    trySave = () => {
        this.setState({
            showConfirmDlg: true,
            onYes: this.saveSpecialty,
            confirmMessage: 'Do you really want to change your specialty?'
        });
    }

    render() {
        const { classes, contractor } = this.props;
        const { isBusy, suggestions, specs, confirmMessage, showConfirmDlg } = this.state;

        return (
            <Box className={classes.root}>
                {isBusy && <CircularProgress className={classes.center} />}
                <Paper className={classes.contents}>
                    <Table className={classes.relative}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell align="center">Name</CustomTableCell>
                                <CustomTableCell align="center">Value</CustomTableCell>
                                <CustomTableCell align="center">Description</CustomTableCell>
                                <CustomTableCell align="center">
                                    Action
                                </CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contractor.contractorSpecialties.map(row => (
                                <TableRow className={classes.row} key={row.id} hover>
                                    <CustomTableCell component="th" scope="row" align="center">
                                        {row.specialty.name}
                                    </CustomTableCell>
                                    <CustomTableCell>{row.specialty.value}</CustomTableCell>
                                    <CustomTableCell>{row.specialty.description}</CustomTableCell>
                                    <CustomTableCell align="center">
                                        <IconButton
                                            className={classes.button}
                                            aria-label="Delete"
                                            color="primary"
                                            onClick={() => this.handleDelete(row.specialty.id)}
                                        >
                                            <DeleteIcon fontSize='small' />
                                        </IconButton>
                                    </CustomTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Card className={classes.subContents}>
                        <List>
                            <ListItem>
                                <Typography className={classes.title}>
                                    Select your specialties
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Box style={{ display: 'flex', width: '100%' }}>
                                    <Box style={{ flex: 1, marginRight: 16 }}>
                                        <MultiSelect
                                            className={classes.select}
                                            placeholder="Select multiple specialties"
                                            suggestions={suggestions}
                                            values={specs}
                                            selectChange={this.selectChange}
                                        />
                                    </Box>
                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            onClick={this.trySave}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box style={{ display: 'flex' }}>
                                    {specs.map((spec, index) => (
                                        <Chip
                                            key={index}
                                            label={spec}
                                            className={classes.chip}
                                            onDelete={() => this.deleteSelect(spec)}
                                        />
                                    ))}
                                </Box>
                            </ListItem>
                        </List>
                    </Card>
                </Paper>
                <Dialog
                    open={showConfirmDlg}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                    <DialogContent className={classes.relative}>
                        <DialogContentText id="alert-dialog-description">
                            {confirmMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} autoFocus>
                            Cancel
            			</Button>
                        <Button onClick={this.state.onYes} color="primary">
                            Yes
            			</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    user: state.global_data.userProfile,
    contractor: state.cont_data.selectedContractor,
    specialties: state.cont_data.specialties
});

const mapDispatchToProps = {
    selectContractor: ContActions.selectContractor,
    addSpecialty: ContActions.addSpecialty,
    deleteSpecialty: ContActions.deleteSpecialty
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(ProfileFileView));

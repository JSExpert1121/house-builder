import * as React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Theme } from '@material-ui/core/styles';

import OptionItem from './OptionItem';
import OptionItemEdit from './OptionItemEdit';

import {
    MockTemplateInfo,
    RoomOption,
    RoomOptions,
    ProjectLevel,
    ProjectLevelCategory
} from 'types/project';
import { Validator } from 'types/global';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '100%',
        paddingTop: theme.spacing(1)
    },
    titlebar: {
        padding: theme.spacing(0),
        fontSize: '1.5em',
    },
    levelbar: {
        padding: theme.spacing(1, 0)
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1rem',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2)
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    fab: {
        width: '40px',
        height: '40px',
        marginLeft: '40px',
    },
}));

interface IProjectOptionEditProps {
    template: MockTemplateInfo;
    options: RoomOptions[];
    level: ProjectLevel;
    roomId: string;
    addOption: (tid: string, lid: string, rid: string, option: RoomOption) => void;
    deleteOption: (tid: string, lid: string, rid: string, oid: string) => void;
    updateOption: (tid: string, lid: string, rid: string, option: RoomOption) => void;
}

const ProjectOptionEdit: React.SFC<IProjectOptionEditProps> = (props) => {
    const classes = useStyles({});
    const {
        template,
        options,
        level,
        roomId,
        addOption,
        deleteOption,
        updateOption
    } = props;

    const [modal, setModal] = React.useState(false);
    const [name, setName] = React.useState({
        value: '',
        errMsg: undefined
    } as Validator);
    const [type, setType] = React.useState({
        value: '',
        errMsg: undefined
    } as Validator);
    const [desc, setDesc] = React.useState('');
    const [edit, setEdit] = React.useState('');

    const handleAdd = () => {

        if (type.value.length === 0) {
            setType({
                value: type.value,
                errMsg: 'Type is required'
            });

            return;
        }

        if (name.value.length === 0) {
            setName({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }

        const option = {
            id: '',
            type: type.value,
            name: name.value,
            description: desc,
            images: []
        };

        setModal(false);
        addOption(template.id, level.id, roomId, option);
        setType({
            value: '',
            errMsg: undefined
        });
        setName({
            value: '',
            errMsg: undefined
        });
        setDesc('');
    }

    const handleDone = (option: RoomOption) => {
        updateOption(template.id, level.id, roomId, option);
        setEdit('');
    }

    if (!level) {
        return <Box className={classes.root}>No level and room selected</Box>
    }

    let roomOptions: RoomOption[] = [];
    for (let option of options) {
        if (option.level_id === level.id && option.room_id === roomId) {
            roomOptions = option.options;
            break;
        }
    }

    let curRoom: ProjectLevelCategory = undefined;
    for (let room of level.rooms) {
        if (room.id === roomId) {
            curRoom = room;
            break;
        }
    }

    return (
        <Box className={classes.root}>
            {template && (
                <React.Fragment>
                    <List aria-label='project-options' style={{ padding: '16px 0' }}>
                        <ListItem className={classes.titlebar}>
                            <Typography className={classes.title}>
                                {template.name}&nbsp;&nbsp;&nbsp;
                            <span className={classes.subtitle}>{template.description}</span>
                            </Typography>
                        </ListItem>
                        <ListItem alignItems='flex-start' className={classes.levelbar}>
                            <Box style={{ width: '100%' }}>
                                <Typography className={classes.title}>
                                    {curRoom.name}
                                    &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                                    <span className={classes.subtitle}>{curRoom.type}</span>
                                    &nbsp;&nbsp;&nbsp;
                                    <span className={classes.subtitle}>
                                        {`( ${level.name} : ${level.description} )`}
                                    </span>
                                </Typography>
                                <Box style={{ display: 'flex' }}>
                                    <Grid container direction='row-reverse'>
                                        <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
                                            <Typography className={classes.subtitle}>Description:</Typography>
                                            {curRoom.description && <Typography variant='body2'>{curRoom.description}</Typography>}
                                        </Grid>
                                        <Grid item xs={12} md={4} style={{ padding: '8px 16px', display: 'flex' }}>
                                            <Box>
                                                <Typography style={{ display: 'flex' }}>
                                                    {'Width:'}<span className={classes.value}>{curRoom.w}</span>
                                                </Typography>
                                                <Typography style={{ display: 'flex' }}>
                                                    {'Height:'}<span className={classes.value}>{curRoom.h}</span>
                                                </Typography>
                                                <Typography style={{ display: 'flex' }}>
                                                    {'Length:'}<span className={classes.value}>{curRoom.l}</span>
                                                </Typography>
                                            </Box>
                                            <Box style={{ flexGrow: 1 }}>
                                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                                                <Typography style={{ flexGrow: 1 }}>m</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Typography className={classes.title}>
                                Add Options
                            </Typography>
                            <Fab
                                color="primary"
                                aria-label="Add"
                                className={classes.fab}
                                onClick={() => setModal(true)}
                            >
                                <AddIcon />
                            </Fab>
                        </ListItem>
                        {roomOptions.map(opt => {
                            if (opt.id !== edit) {
                                return (
                                    <React.Fragment key={opt.id}>
                                        <Divider />
                                        <OptionItem
                                            item={opt}
                                            edit={true}
                                            handleEdit={id => setEdit(id)}
                                            handleDelete={id => deleteOption(template.id, level.id, roomId, id)}
                                        />
                                    </React.Fragment>
                                )
                            } else {
                                return (
                                    <React.Fragment key={opt.id}>
                                        <Divider />
                                        <OptionItemEdit
                                            item={opt}
                                            handleSave={handleDone}
                                            handleCancel={() => setEdit('')}
                                        />
                                    </React.Fragment>
                                )
                            }
                        })}
                    </List>
                    <Dialog
                        open={modal}
                        onClose={() => setModal(false)}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Add a Level</DialogTitle>
                        <DialogContent>
                            <Box>
                                <TextField
                                    required
                                    label="Type"
                                    margin="dense"
                                    error={!!type.errMsg}
                                    helperText={type.errMsg}
                                    value={type.value}
                                    fullWidth={true}
                                    onChange={event => setType({ value: event.target.value, errMsg: undefined })}
                                />
                                <TextField
                                    required
                                    label="Name"
                                    margin="dense"
                                    error={!!name.errMsg}
                                    helperText={name.errMsg}
                                    value={name.value}
                                    fullWidth={true}
                                    onChange={event => setName({ value: event.target.value, errMsg: undefined })}
                                />
                                <TextField
                                    label="Description"
                                    margin="dense"
                                    value={desc}
                                    fullWidth={true}
                                    multiline={true}
                                    rowsMax={12}
                                    onChange={e => setDesc(e.target.value)}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAdd}
                                color="primary"
                                defaultChecked
                            >
                                Add
                                </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            )}
        </Box>
    );
};

export default ProjectOptionEdit;
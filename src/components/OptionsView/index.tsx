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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import OptionItem from './OptionItem';
import OptionItemEdit from './OptionItemEdit';

import {
    RoomOption,
    RoomOptions,
    ProjectLevel,
    ProjectLevelCategory
} from 'types/project';
import { Validator, TemplateDetailInfo, CategoryInfo } from 'types/global';


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
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(5),
    },
    catBox: {
        margin: theme.spacing(0, 3)
    },
    optBox: {
        marginTop: theme.spacing(2)
    }
}));

interface IProjectOptionEditProps {
    template: TemplateDetailInfo;
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
    // const [type, setType] = React.useState({
    //     value: '',
    //     errMsg: undefined
    // } as Validator);
    const [desc, setDesc] = React.useState('');
    const [edit, setEdit] = React.useState('');
    const [catId, setCatId] = React.useState('other');
    const [optId, setOptId] = React.useState('other');

    const handleDone = (option: RoomOption) => {
        updateOption(template.id, level.id, roomId, option);
        setEdit('');
    }

    const catChange = e => {
        setCatId(e.target.value);
    }

    const optTypeChange = e => {
        setOptId(e.target.value);
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

    let curCategory: CategoryInfo = undefined;
    if (template.categoryList) {
        for (let cat of template.categoryList) {
            if (cat.id === catId) {
                curCategory = cat;
                break;
            }
        }
    }

    const tryAdd = () => {
        if (!curCategory) {
            setCatId('other');
        }

        setModal(true);
    }

    const handleAdd = () => {

        // if (optId.length === 0) {
        //     setType({
        //         value: '',
        //         errMsg: 'Type is required'
        //     });

        //     return;
        // }

        if (name.value.length === 0) {
            setName({
                value: '',
                errMsg: 'Name is required'
            });

            return;
        }

        let type = 'other';
        if (optId !== 'other') {
            type = curCategory.optionList.filter(opt => opt.id === optId)[0].name;
        }
        const option = {
            id: '',
            type: type,
            name: name.value,
            description: desc,
            images: []
        };

        setModal(false);
        addOption(template.id, level.id, roomId, option);
        // setType({
        //     value: '',
        //     errMsg: undefined
        // });
        setName({
            value: '',
            errMsg: undefined
        });
        setDesc('');
    }

    return (
        <Box className={classes.root}>
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
                        Select Category
                    </Typography>
                    <Select
                        style={{ minWidth: 180 }}
                        value={catId}
                        onChange={catChange}
                        name="level-categories"
                        className={classes.catBox}
                    >
                        {template.categoryList && template.categoryList.map((cat, index) => (
                            <MenuItem value={cat.id} key={index}>
                                {cat.name}
                            </MenuItem>
                        ))}
                        <MenuItem value={'other'} key={1000}>Other</MenuItem>
                    </Select>
                    {curCategory && (
                        <Typography className={classes.subtitle}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{curCategory.description}
                        </Typography>
                    )}
                </ListItem>
                <ListItem>
                    <Typography className={classes.title}>
                        Add Options
                    </Typography>
                    <Fab
                        color="primary"
                        aria-label="Add"
                        className={classes.fab}
                        onClick={tryAdd}
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
                <DialogTitle id="form-dialog-title">Add an Option</DialogTitle>
                <DialogContent>
                    <Box>
                        {curCategory && (
                            <Typography className={classes.subtitle}>
                                {`Category Info: ${curCategory.name} ( ${curCategory.description} )`}
                            </Typography>
                        )}
                        <Select
                            style={{ minWidth: 180 }}
                            value={optId}
                            placeholder='Option Type'
                            onChange={optTypeChange}
                            name="level-categories"
                            className={classes.optBox}
                        >
                            {curCategory && curCategory.optionList && curCategory.optionList.map((opt, index) => (
                                <MenuItem value={opt.id} key={index}>
                                    {opt.name}
                                </MenuItem>
                            ))}
                            <MenuItem value={'other'} key={1000}>Other</MenuItem>
                        </Select>
                        {/* <TextField
                            required
                            label="Type"
                            margin="dense"
                            error={!!type.errMsg}
                            helperText={type.errMsg}
                            value={type.value}
                            fullWidth={true}
                            onChange={event => setType({ value: event.target.value, errMsg: undefined })}
                        /> */}
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
        </Box>
    );
};

export default ProjectOptionEdit;
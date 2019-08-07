import React from 'react';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';

import LevelCat from 'components/LevelView/LevelCat';
import LevelCatEdit from 'components/LevelView/LevelCatEdit';
import { ProjectLevel, ProjectLevelCategory } from 'types/project';
import { title } from 'assets/jss/material-dashboard-pro-react';


const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)',
    },
    waitingSpin: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    titlebar: {
        padding: theme.spacing(0),
        fontSize: '1.5em',
    },
    title: {
        display: 'block',
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        display: 'block',
        fontWeight: 400,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        color: '#333'
    },
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2)
    },
    left: {
        float: 'left'
    },
    right: {
        float: 'right'
    },
    fullWidth: {
        width: '100%'
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)'
    },
    fab: {
        width: '40px',
        height: '40px',
        marginLeft: '40px',
    },
}));

interface ILevelViewProps {
    editable: boolean;
    level: ProjectLevel;
    deleteLevel: (lvlId: number) => void;
    addCategory: (lvlId: number, cat: ProjectLevelCategory) => void;
    updateCategory: (lvlId: number, cat: ProjectLevelCategory) => void;
    deleteCategory: (lvlId: number, catId: number) => void;
}

const LevelView: React.SFC<ILevelViewProps & withSnackbarProps> = (props) => {

    const {
        level,
        deleteLevel,
        addCategory,
        updateCategory,
        deleteCategory,
        showMessage,
    } = props;
    const classes = useStyles({});

    const [edit, setEdit] = React.useState(-1);
    const [category, setCategory] = React.useState('Bath Room');
    const [modal, setModal] = React.useState(false);
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [length, setLength] = React.useState(0);

    const categoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleAddCategory = () => {
        setModal(true);
    }

    const handleEdit = (id) => {
        setEdit(id);
    }

    const handleDelete = id => {
        deleteCategory(level.id, id);
        setEdit(-1);
    }

    const saveCategory = (item: ProjectLevelCategory) => {
        if (item.title.length === 0 ||
            item.contents['width'] === 0 ||
            item.contents['height'] === 0 ||
            item.contents['length'] === 0) {
            showMessage(false, 'Fill in all the required fields');
            return;
        }
        updateCategory(level.id, item);
        setEdit(-1);
    }

    const cancelEdit = () => {
        setEdit(-1);
    }

    const handleAdd = () => {
        if (title.length === 0 || width === 0 || height === 0 || length === 0) {
            showMessage(false, 'Fill in all the required fields');
            return;
        }
        const cat: ProjectLevelCategory = {
            id: 0,
            title: name,
            description: desc,
            category,
            contents: {
                width, height, length
            }
        };

        addCategory(level.id, cat);
        setModal(false);
    }

    const cats = [
        'Bath Room',
        'Bed Room',
        'Living Room',
        'Hallway'
    ];

    return (
        <Box className={classes.root}>
            <List aria-label='project-level' style={{ padding: '16px 0' }}>
                <ListItem button className={classes.titlebar}>
                    <Box>
                        <Typography className={classes.title}>
                            {level.name}
                        </Typography>
                        <Typography>
                            {level.description}
                        </Typography>
                    </Box>
                    {props.editable && (
                        <Box className={classes.action}>
                            <IconButton aria-label="Delete" onClick={(e) => {
                                e.stopPropagation();
                                deleteLevel(level.id);
                            }} >
                                <DeleteIcon fontSize='large' />
                            </IconButton>
                        </Box>
                    )}
                </ListItem>
                <ListItem style={{ padding: '8px 16px' }}>
                    {props.editable && (
                        <>
                            <Typography className={classes.title} style={{ fontSize: '1.5em' }}>
                                Rooms
                            </Typography>
                            <Fab
                                color="primary"
                                aria-label="Add"
                                className={classes.fab}
                                onClick={handleAddCategory}
                            >
                                <AddIcon />
                            </Fab>
                        </>
                    )}
                </ListItem>
                {level.categories && level.categories.map(cat => {
                    if (cat.id !== edit) {
                        return (
                            <React.Fragment key={cat.id}>
                                <Divider />
                                <LevelCat
                                    edit={props.editable}
                                    item={cat}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                />
                            </React.Fragment>
                        )
                    } else {
                        return (
                            <React.Fragment key={cat.id}>
                                <Divider />
                                <LevelCatEdit
                                    item={cat}
                                    handleSave={saveCategory}
                                    handleCancel={cancelEdit}
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
                    <Select
                        style={{ minWidth: 180 }}
                        value={category}
                        onChange={categoryChange}
                        name="level-categories"
                    >
                        {cats.map((cat, index) => (
                            <MenuItem value={cat} key={index}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box>
                        <TextField
                            required
                            label="Name"
                            margin="dense"
                            value={name}
                            fullWidth={true}
                            onChange={e => setName(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Grid container direction='row-reverse'>
                            <Grid item xs={12} md={8} style={{ padding: '8px 0px 8px 24px' }}>
                                <TextField
                                    label="Description"
                                    margin="dense"
                                    value={desc}
                                    fullWidth={true}
                                    multiline={true}
                                    rowsMax={12}
                                    onChange={e => setDesc(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} style={{ padding: '8px 0px' }}>
                                <TextField
                                    label="Width"
                                    margin="dense"
                                    required
                                    value={width}
                                    type='number'
                                    fullWidth={true}
                                    onChange={e => setWidth(parseFloat(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    label="Height"
                                    margin="dense"
                                    required
                                    value={height}
                                    type='number'
                                    fullWidth={true}
                                    onChange={e => setHeight(parseFloat(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    label="Length"
                                    margin="dense"
                                    required
                                    value={length}
                                    type='number'
                                    fullWidth={true}
                                    onChange={e => setLength(parseFloat(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
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

export default withSnackbar<ILevelViewProps>(LevelView);

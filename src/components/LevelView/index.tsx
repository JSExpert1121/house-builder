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
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import LevelCat from 'components/LevelView/LevelCat';
import LevelCatEdit from 'components/LevelView/LevelCatEdit';
import { ProjectLevel, ProjectLevelCategory } from 'types/project';


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
        marginLeft: '20px',
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

const LevelView: React.SFC<ILevelViewProps> = (props) => {

    const { level, deleteLevel, addCategory, updateCategory, deleteCategory } = props;
    const classes = useStyles({});

    const [category, setCategory] = React.useState('Bath Room');
    const [edit, setEdit] = React.useState(-1);

    const categoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleAddCategory = () => {
        const cat: ProjectLevelCategory = {
            id: 0,
            title: category,
            contents: {
                width: 0,
                height: 0,
                length: 0
            }
        };

        addCategory(level.id, cat);
    }

    const handleEdit = (id) => {
        setEdit(id);
    }

    const handleDelete = id => {
        deleteCategory(level.id, id);
        setEdit(-1);
    }

    const saveCategory = (item: ProjectLevelCategory) => {
        updateCategory(level.id, item);
        setEdit(-1);
    }

    const cancelEdit = () => {
        setEdit(-1);
    }


    const cats = [
        'Bath Room',
        'Bed Room',
        'Living Room',
        'Hallway'
    ];
    // for (let cat of level.categories) {
    //     cats.splice(cats.indexOf(cat.title), 1);
    // }

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
                <ListItem style={{ padding: '8px 0' }}>
                    <Select
                        style={{ minWidth: 180 }}
                        value={category}
                        onChange={categoryChange}
                        name="level-categories"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {cats.map((cat, index) => (
                            <MenuItem value={cat} key={index}>
                                {cat}
                            </MenuItem>
                        ))}
                        }
                    </Select>
                    <Fab
                        color="primary"
                        aria-label="Add"
                        className={classes.fab}
                        onClick={handleAddCategory}
                    >
                        <AddIcon />
                    </Fab>

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
        </Box>
    );
};

export default LevelView;

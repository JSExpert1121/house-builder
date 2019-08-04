import * as React from 'react';

import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { Theme, Typography } from '@material-ui/core';

import TabPanel from 'components/TabPanel';
import LevelView from 'components/LevelView';

import { ProjectLevel, ProjectLevelCategory } from 'types/project';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        paddingTop: theme.spacing(1)
    },
    mainBoard: {
        width: '100%',
        height: '100%',
        borderBottom: '5px solid ' + theme.palette.primary.light,
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 200
    },
    contents: {
        padding: 0,
        width: '100%'
    },
    buttonContainer: {
        textAlign: 'center',
        width: '100%',
        padding: theme.spacing(1)
    }
}));

export interface IAddProjectLevelsProps {
    levels: ProjectLevel[];
    addLevel: (name: string, desc: string) => void;
    deleteLevel: (lvlId: number) => void;
    addCategory: (lvlId: number, cat: ProjectLevelCategory) => void;
    updateCategory: (lvlId: number, cat: ProjectLevelCategory) => void;
    deleteCategory: (lvlId: number, catId: number) => void;
}

const AddProjectLevels: React.SFC<IAddProjectLevelsProps> = props => {

    const {
        levels,
        addLevel,
        deleteLevel,
        updateCategory,
        addCategory,
        deleteCategory,
    } = props;
    const classes = useStyles({});

    const [value, setValue] = React.useState(0);
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');
    const [showModal, setModal] = React.useState(false);

    const handleChange = (e, val) => setValue(val);
    const handleAdd = () => {
        addLevel(name, desc);
        setModal(false);
        setName('');
        setDesc('');
    }

    const closeDialog = () => setModal(false);
    const showDialog = () => setModal(true);

    const deleteLvl = (id) => {
        deleteLevel(id);
        if (value > 0) setValue(value - 1);
    }

    return (
        <Box className={classes.root}>
            {!levels && (
                <Box className={classes.buttonContainer}>
                    <Button onClick={showDialog} color="primary">
                        <AddIcon />&nbsp;&nbsp;Add Level
                    </Button>
                </Box>
            )}
            {levels && (
                <React.Fragment>
                    <Box className={classes.tabs}>
                        <Tabs
                            orientation="vertical"
                            // variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="project-level-tab"
                        >
                            {
                                levels.map((level, index) => (
                                    <Tab key={index} label={(
                                        <Typography style={{ fontSize: '1.2em', padding: 8, fontWeight: 600 }}>
                                            {level.name}
                                        </Typography>
                                    )} />
                                ))
                            }
                        </Tabs>
                        <Box className={classes.buttonContainer}>
                            <Button onClick={showDialog} color="primary">
                                <AddIcon />{' '}Add Level
                            </Button>
                        </Box>
                    </Box>
                    <Box className={classes.contents}>
                        {levels.map((level, index) => (
                            <TabPanel hidden={value !== index} key={level.id}>
                                <LevelView
                                    edit={true}
                                    level={level}
                                    deleteLevel={deleteLvl}
                                    addCategory={addCategory}
                                    updateCategory={updateCategory}
                                    deleteCategory={deleteCategory}
                                />
                            </TabPanel>

                        ))}
                    </Box>
                </React.Fragment>
            )}

            <Dialog
                open={showModal}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add a Level</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please input the level information
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Name"
                        value={name}
                        onChange={val => setName(val.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Description"
                        value={desc}
                        onChange={val => setDesc(val.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>
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
}

export default AddProjectLevels;
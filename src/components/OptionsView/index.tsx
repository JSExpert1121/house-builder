import * as React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { ProjectLevel, ProjectLevelCategory, RoomOption } from 'types/project';
import { Validator, CmnObject, NodeInfo } from 'types/global';
import { IconButton } from '@material-ui/core';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import ProjApi from 'services/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '100%',
        position: 'relative',
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
    bold: {
        fontWeight: 600
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1rem',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    fab: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(5),
        marginRight: theme.spacing(5),
    },
    catBox: {
        margin: theme.spacing(0, 3)
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(2),
        width: '120px',
        // fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: '#FFF'
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    }
}));

interface IProjectOptionEditProps {
    root: NodeInfo;
    level: ProjectLevel;
    room: ProjectLevelCategory;
    roomUpdated: () => Promise<void>;
}

const ProjectOptionEdit: React.SFC<IProjectOptionEditProps & withSnackbarProps> = (props) => {
    const classes = useStyles({});
    const { root, level, room, roomUpdated } = props;

    const [key, setKey] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });
    const [value, setValue] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });

    const [template, setTemplate] = React.useState(root.id);
    const [curRoom, setCurRoom] = React.useState(room.id);

    const [modal, setModal] = React.useState(false);
    const [edit, setEdit] = React.useState('');
    const [component, setComponent] = React.useState<NodeInfo | undefined>(undefined);
    const [node, setNode] = React.useState<NodeInfo | undefined>(root);
    const [path, setPath] = React.useState<NodeInfo[]>([root]);
    const [selection, setSelection] = React.useState<NodeInfo | undefined>(undefined);

    const [option, setOption] = React.useState<CmnObject>({});
    const [busy, setBusy] = React.useState(false);

    const reload = () => {
        setComponent(undefined);
        setSelection(undefined);
        setNode(root);
        setEdit('');
        setPath([root]);
        setTemplate(root.id);
        setCurRoom(room.id);
    }

    const nodeChange = e => {
        const count = node.children.length;
        setEdit('');
        for (let i = 0; i < count; i++) {
            if (node.children[i].id === e.target.value) {
                let newPath = path;
                if (selection) {
                    setSelection(undefined);
                    newPath.pop();
                }

                setPath([...newPath, node.children[i]]);
                if (!node.children[i].children || node.children[i].children.length === 0) {
                    setSelection(node.children[i]);
                    // console.log(room.selectionList, component, node.children[i]);
                    const cat = component ? component : node.children[i];
                    if (cat && room.selectionList) {
                        const filtered = room.selectionList.filter(item => (item.category.id === cat.id && item.selection.id === node.children[i].id));
                        if (filtered.length === 1) {
                            setOption(filtered[0].option);
                            setEdit(filtered[0].id);
                        } else if (filtered.length > 1) {
                            console.log('OptionView: some error');
                        }
                    }
                } else {
                    setNode(node.children[i]);
                    setOption({});
                }
                if (node.id === root.id) {
                    setComponent(node.children[i]);
                }
            }
        }
    }

    const keyChange = e => {
        if (Object.keys(option).includes(e.target.value)) {
            setKey({
                value: e.target.value,
                errMsg: 'Same key exists'
            });
        } else if (e.target.value.length === 0) {
            setKey({
                value: '',
                errMsg: 'Key is required'
            });
        }
        else {
            setKey({
                value: e.target.value,
                errMsg: undefined
            });
        }
    }

    const buildPath = (option: RoomOption) => {
        if (!option.breadcrumb || option.breadcrumb.length === 0) {
            return [];
        } else {
            return [...option.breadcrumb];
        }
    }

    const buildCrumb = (ids: string[]) => {
        let crumb = [];
        let curNode = component;
        for (let i = 0; i < ids.length; i++) {
            const matches = curNode.children.filter(item => item.id === ids[i]);
            if (matches.length === 1) {
                crumb.push(matches[0].name);
                curNode = matches[0];
            } else {
                crumb = [];
                break;
            }
        }

        console.log(crumb);
        return crumb;
    }

    const clickCrumb = id => {
        const idx = path.indexOf(id);
        if (idx < 0) return;
        if (idx === (path.length - 1)) return;

        const newPath = path.slice(0, idx + 1);
        setSelection(undefined);
        setPath(newPath);
        setNode(newPath[newPath.length - 1]);
        if (newPath.length === 1) {
            setComponent(undefined);
        }
    }

    const handleSelect = async () => {
        // call api
        if (Object.keys(option).length === 0) {
            props.showMessage(false, 'Option is empty');
            return;
        }

        setBusy(true);
        try {
            if (edit.length > 0) {
                await ProjApi.updateSelection(edit, option)
            } else {
                // delete existing selections
                const existing = room.selectionList.filter(sel => sel.category.id === component.id);
                if (existing.length > 0) {
                    for (let item of existing) {
                        await ProjApi.deleteSelection(item.id);
                    }
                }

                // create a new selection
                let crumb = [];
                if (path.length > 2) crumb = path.slice(2, path.length).map(item => item.id);
                await ProjApi.createSelection(room.id, component.id, selection.id, option, crumb);
            }

            // update room information
            await roomUpdated();
            setBusy(false);
            setModal(false);
            setOption({});
            props.showMessage(true, 'Save option success');
        } catch (error) {
            console.log('ProjectOptionView.handleSelect: ', error);
            setBusy(false);
            props.showMessage(false, 'Save option failed');
        }
    }

    const handleCancel = () => {
        setOption({});
        setModal(false);
    }

    if (!level || !room) {
        return <Box className={classes.root}>No level or room selected</Box>
    }

    const deleteItem = (key: string) => {
        let newOpt = option;
        delete newOpt[key];
        setOption({ ...newOpt });
    }

    const addItem = () => {
        if (key.errMsg || value.errMsg) return;
        if (key.value.length === 0) {
            setKey({ value: '', errMsg: 'Key is required' });
            return;
        }

        if (value.value.length === 0) {
            setValue({ value: '', errMsg: 'Value is required' });
            return;
        }

        // save options
        const newOpt = { ...option, [key.value]: value.value };
        setOption(newOpt);
        setKey({ value: '', errMsg: undefined });
        setValue({ value: '', errMsg: undefined });
    }

    if (template !== root.id) {
        reload();
    } else if (room.id !== curRoom) {
        reload();
    }

    return (
        <Box className={classes.root}>
            <List aria-label='project-options' style={{ padding: '16px 0' }}>
                <ListItem className={classes.titlebar}>
                    <Typography className={classes.title}>
                        {root.name}&nbsp;&nbsp;&nbsp;
                        <span className={classes.subtitle}>{root.description}</span>
                    </Typography>
                </ListItem>
                <ListItem alignItems='flex-start' className={classes.levelbar}>
                    <Box style={{ width: '100%' }}>
                        <Typography className={classes.title}>
                            {room.name}
                            &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
                            <span className={classes.subtitle}>{room.type}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span className={classes.subtitle}>
                                {`( ${level.name} : ${level.description} )`}
                            </span>
                        </Typography>
                        <Box style={{ display: 'flex' }}>
                            <Grid container direction='row-reverse'>
                                <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
                                    <Typography className={classes.subtitle}>Description:</Typography>
                                    {room.description && <Typography variant='body2'>{room.description}</Typography>}
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: '8px 16px', display: 'flex' }}>
                                    <Box>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Width:'}<span className={classes.value}>{room.w}</span>
                                        </Typography>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Height:'}<span className={classes.value}>{room.h}</span>
                                        </Typography>
                                        <Typography style={{ display: 'flex' }}>
                                            {'Length:'}<span className={classes.value}>{room.l}</span>
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
                {component && (
                    <React.Fragment>
                        <ListItem>
                            <Typography className={classes.title}>
                                {`Component: ${component.name} ( ${component.description} )`}
                            </Typography>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                )}
                <ListItem>
                    <Breadcrumbs>
                        {path.map(item => (
                            <Link key={item.id} onClick={() => clickCrumb(item)} style={{ cursor: 'pointer' }}>
                                {item.name}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </ListItem>
                <ListItem>
                    <Typography className={classes.bold}>
                        Select Category
                    </Typography>
                    <Select
                        style={{ minWidth: 180 }}
                        value={selection ? selection.id : ''}
                        onChange={nodeChange}
                        name="sub-nodes"
                        className={classes.catBox}
                    >
                        {node && node.children && node.children.map(item => (
                            <MenuItem value={item.id} key={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {selection && (
                        <Typography className={classes.subtitle}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{selection.description}
                        </Typography>
                    )}
                </ListItem>
                {component && selection && (
                    <ListItem>
                        <Typography className={classes.bold}>
                            {(edit.length > 0) ? 'Edit Options' : 'Add Options'}
                        </Typography>
                        <Fab
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={() => setModal(true)}
                        >
                            {(edit.length > 0) ? <EditIcon /> : <AddIcon />}
                        </Fab>
                        {modal && (
                            <>
                                <Button onClick={handleSelect} className={classes.doneBtn}>Select</Button>
                                <Button onClick={handleCancel} className={classes.doneBtn}>Cancel</Button>
                            </>
                        )}
                    </ListItem>
                )}
                {component && room.selectionList &&
                    room.selectionList.filter(selection => component.id === selection.category.id).map(opt => (
                        <React.Fragment key={opt.id}>
                            <Divider />
                            <ListItem>
                                <Box style={{ width: '100%' }}>
                                    <Typography className={classes.subtitle}>
                                        {`Current Options ( ${buildCrumb(buildPath(opt)).join(' / ')} )`}
                                    </Typography>
                                    {Object.keys(opt.option).map(key => (
                                        <Typography key={key} style={{ paddingLeft: 32 }}>{`${key} : ${opt.option[key]}`}</Typography>
                                    ))}
                                </Box>
                            </ListItem>
                        </React.Fragment>
                    ))}
            </List>
            <Box hidden={!modal} style={{ maxWidth: 640 }}>
                <Grid container>
                    {Object.keys(option).map(itemKey => (
                        <React.Fragment key={itemKey}>
                            <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Key"
                                    margin="dense"
                                    fullWidth={true}
                                    value={itemKey}
                                    disabled={true}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Value"
                                    margin="dense"
                                    fullWidth={true}
                                    value={option[itemKey]}
                                    disabled={true}
                                    required
                                />
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton onClick={() => deleteItem(itemKey)} style={{ height: 36 }}>
                                    <DeleteIcon fontSize='small' color='error' />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    ))}
                    <Grid item xs={5} style={{ padding: '4px 8px' }}>
                        <TextField
                            label="Key"
                            margin="dense"
                            fullWidth={true}
                            error={!!key.errMsg}
                            helperText={key.errMsg}
                            value={key.value}
                            onChange={keyChange}
                        />
                    </Grid>
                    <Grid item xs={6} style={{ padding: '4px 8px' }}>
                        <TextField
                            label="Value"
                            margin="dense"
                            fullWidth={true}
                            error={!!value.errMsg}
                            helperText={value.errMsg}
                            value={value.value}
                            onChange={event => setValue({
                                value: event.target.value,
                                errMsg: event.target.value.length > 0 ? undefined : 'Key is required'
                            })}
                        />
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton onClick={addItem} style={{ height: 36 }}>
                            <AddIcon fontSize='small' color='action' />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            {/* <Dialog
                open={modal}
                onClose={() => setModal(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{currentOption ? 'Edit Options' : 'Add Options'}</DialogTitle>
                <DialogContent>
                    <Box>
                        <Grid container>
                            {Object.keys(option).map(itemKey => (
                                <React.Fragment>
                                    <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                        <TextField
                                            label="Key"
                                            margin="dense"
                                            fullWidth={true}
                                            value={itemKey}
                                            disabled={true}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                        <TextField
                                            label="Value"
                                            margin="dense"
                                            fullWidth={true}
                                            value={option[itemKey]}
                                            disabled={true}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton onClick={() => deleteItem(itemKey)} style={{ height: 36 }}>
                                            <DeleteIcon fontSize='small' color='error' />
                                        </IconButton>
                                    </Grid>
                                </React.Fragment>
                            ))}
                            <Grid item xs={5} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Key"
                                    margin="dense"
                                    fullWidth={true}
                                    error={!!key.errMsg}
                                    helperText={key.errMsg}
                                    value={key.value}
                                    onChange={keyChange}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ padding: '4px 8px' }}>
                                <TextField
                                    label="Value"
                                    margin="dense"
                                    fullWidth={true}
                                    error={!!value.errMsg}
                                    helperText={value.errMsg}
                                    value={value.value}
                                    onChange={event => setValue({
                                        value: event.target.value,
                                        errMsg: event.target.value.length > 0 ? undefined : 'Key is required'
                                    })}
                                />
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton onClick={addItem} style={{ height: 36 }}>
                                    <AddIcon fontSize='small' color='action' />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions style={{ paddingBottom: 16 }}>
                    <Button onClick={handleCancel} className={classes.doneBtn}>
                        Cancel
                    </Button>
                    <Button onClick={handleOK} color="primary" defaultChecked className={classes.doneBtn}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog> */}
            {busy && <CircularProgress className={classes.busy} />}
        </Box>
    );
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default withSnackbar<IProjectOptionEditProps>(connect(mapStateToProps, mapDispatchToProps)(ProjectOptionEdit));
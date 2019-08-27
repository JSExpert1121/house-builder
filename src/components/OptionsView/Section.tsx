import * as React from 'react';

import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { ProjectLevelCategory, RoomOption } from 'types/project';
import { Validator, CmnObject, NodeInfo } from 'types/global';

import ProjApi from 'services/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
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

interface ISectionProps {
    component: NodeInfo;
    room: ProjectLevelCategory;
    roomUpdated: () => Promise<void>;
    showMessage: (suc: boolean, msg: string) => void;
}

const Section: React.FunctionComponent<ISectionProps> = (props) => {

    const { component, room, roomUpdated, showMessage } = props;
    const initSelection = (!component.children || component.children.length === 0) ? component : undefined;
    const classes = useStyles({});

    const [key, setKey] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });
    const [value, setValue] = React.useState<Validator>({
        value: '',
        errMsg: undefined
    });

    const [category, setCategory] = React.useState(component.id);
    const [curRoom, setCurRoom] = React.useState(room.id);

    const [node, setNode] = React.useState<NodeInfo | undefined>(component);
    const [path, setPath] = React.useState<NodeInfo[]>([component]);
    const [selection, setSelection] = React.useState<NodeInfo | undefined>(initSelection);
    const [modal, setModal] = React.useState(false);
    // const [edit, setEdit] = React.useState('');

    const [option, setOption] = React.useState<CmnObject>({});
    const [busy, setBusy] = React.useState(false);

    const reload = () => {
        setSelection(initSelection);
        setNode(component);
        setPath([component]);
        setCategory(component.id);
        setCurRoom(room.id);
        setModal(false);
        setBusy(false);
    }

    if (category !== component.id) {
        reload();
    } else if (room.id !== curRoom) {
        reload();
    }

    const nodeChange = e => {
        const count = node.children.length;
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

                } else {
                    setNode(node.children[i]);
                    setOption({});
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
                if (path.length > 1) crumb = path.slice(1, path.length).map(item => item.id);
                await ProjApi.createSelection(room.id, component.id, selection.id, option, crumb);
            }

            // update room information
            await roomUpdated();
            setBusy(false);
            setModal(false);
            setOption({});
            showMessage(true, 'Save option success');
        } catch (error) {
            console.log('ProjectOptionView.handleSelect: ', error);
            setBusy(false);
            showMessage(false, 'Save option failed');
        }
    }

    const handleCancel = () => {
        setOption({});
        setModal(false);
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

    let edit = '';
    let opts = undefined;
    if (room.selectionList && selection) {
        const filtered = room.selectionList.filter(item => (item.category.id === component.id && item.selection.id === selection.id));
        if (filtered.length === 1) {
            opts = filtered[0].option;
            edit = filtered[0].id;
        } else if (filtered.length > 1) {
            console.log('OptionView: some error');
        }
    }

    const showForm = () => {
        if (opts) setOption(opts);
        setModal(true);
    }

    return (
        <Box className={classes.root}>
            <List>
                <ListItem>
                    <Typography className={classes.title}>
                        {`Component: ${component.name} ( ${component.description} )`}
                    </Typography>
                </ListItem>
                <Divider />
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
                        {initSelection && (
                            <MenuItem value={initSelection.id}>
                                {initSelection.name}
                            </MenuItem>
                        )}
                    </Select>
                    {selection && (
                        <Typography className={classes.subtitle}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{selection.description}
                        </Typography>
                    )}
                </ListItem>
                {selection && (
                    <ListItem>
                        <Typography className={classes.bold}>
                            {(edit.length > 0) ? 'Edit Options' : 'Add Options'}
                        </Typography>
                        <Fab
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={showForm}
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
                {room.selectionList && room.selectionList.filter(selection => component.id === selection.category.id).map(opt => (
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
                {modal && (
                    <React.Fragment>
                        <Divider />
                        <ListItem>
                            <Grid container style={{ maxWidth: 640 }}>
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
                        </ListItem>
                    </React.Fragment>
                )}
            </List>
            {busy && <CircularProgress className={classes.busy} />}
        </Box>
    );
};

export default Section;

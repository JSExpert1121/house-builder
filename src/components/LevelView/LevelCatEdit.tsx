import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "components/CustomButtons/Button.jsx";

import { ProjectLevelCategory } from 'types/project';


const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid #EEE',
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    container: {
        width: '100%'
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    textFieldHalf: {
        width: '120px',
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            width: '150px',
        },
        [theme.breakpoints.up('md')]: {
            width: '200px',
        }
    },
    doneContainer: {
        display: 'block',
        textAlign: 'right',
        paddingRight: theme.spacing(1)
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(2),
        width: '160px',
        fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    }
}));

export interface ILevelCatEditProps {
    handleSave: (item: ProjectLevelCategory) => void;
    handleCancel: () => void;
    item: ProjectLevelCategory;
}

const LevelCatEdit: React.SFC<ILevelCatEditProps> = props => {

    const { item, handleSave, handleCancel } = props;
    const [width, setWidth] = React.useState(item.contents['width'] as number);
    const [height, setHeight] = React.useState(item.contents['height'] as number);
    const [length, setLength] = React.useState(item.contents['length'] as number);
    const [desc, setDesc] = React.useState(item.description);
    const [name, setName] = React.useState(item.title);

    const classes = useStyles({});

    const saveCategory = () => {
        const data: ProjectLevelCategory = {
            id: item.id,
            title: name,
            category: item.category,
            description: desc,
            contents: {
                width,
                height,
                length
            }
        };

        handleSave(data);
    }


    return (
        <ListItem
            className={classes.root}
            alignItems='flex-start'
        >
            <Box className={classes.container}>
                <Box style={{ padding: '0 16px' }}>
                    <TextField
                        label="Name"
                        margin="dense"
                        required
                        value={name}
                        fullWidth={true}
                        onChange={e => setName(e.target.value)}
                    />
                </Box>
                <Box style={{ display: 'flex' }}>
                    <Grid container direction='row-reverse'>
                        <Grid item xs={12} md={8} style={{ padding: '8px 16px' }}>
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
                        <Grid item xs={12} md={4} style={{ padding: '8px 16px' }}>
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

                <Box className={classes.doneContainer}>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={saveCategory}
                    >
                        Done
                        </Button>
                    <Button
                        color="primary"
                        className={classes.doneBtn}
                        onClick={handleCancel}
                    >
                        Cancel
                        </Button>
                </Box>
            </Box>
        </ListItem>
    );
}

export default LevelCatEdit;
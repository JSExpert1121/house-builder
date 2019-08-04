import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
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

    const classes = useStyles({});

    const saveCategory = () => {
        const data: ProjectLevelCategory = {
            id: item.id,
            title: item.title,
            description: item.description,
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
                <Box>
                    <Typography className={classes.title}>
                        {item.title}
                    </Typography>
                </Box>
                <Box>
                    {
                        item.description && (
                            <Typography
                                variant='body2'
                                className={classes.subtitle}
                            >
                                {item.description}
                            </Typography>
                        )
                    }
                </Box>
                <Box>
                    <Grid container>
                        <Grid item xs={12} md={4} style={{ padding: 8 }}>
                            <TextField
                                label="Width"
                                margin="normal"
                                value={width}
                                type='number'
                                fullWidth={true}
                                onChange={e => setWidth(parseFloat(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: 8 }}>
                            <TextField
                                label="Height"
                                margin="normal"
                                value={height}
                                type='number'
                                fullWidth={true}
                                onChange={e => setHeight(parseFloat(e.target.value))}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: 8 }}>
                            <TextField
                                label="Length"
                                margin="normal"
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
import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { ProjectLevelCategory } from 'types/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
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
    action: {
        display: 'flex',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2)
    },
    item: {
        padding: theme.spacing(1)
    }
}));

interface ILevelCatItemProps {
    handleDelete: (id: number) => void;
    handleEdit: (id: number) => void;
    item: ProjectLevelCategory;
}

const LevelCatItem: React.SFC<ILevelCatItemProps> = (props) => {

    const { item, handleDelete, handleEdit } = props;
    const classes = useStyles({});

    const [enter, setEnter] = React.useState(false);

    return (
        <ListItem
            className={classes.root}
            onMouseEnter={e => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
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
                            <Typography>
                                Width: {`${item.contents['width']}m`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: 8 }}>
                            <Typography>
                                Height: {`${item.contents['height']}m`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: 8 }}>
                            <Typography>
                                Length: {`${item.contents['length']}m`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

            </Box>
            {enter && (
                <Box className={classes.action}>
                    <IconButton className={classes.item} aria-label="Edit" onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id);
                    }} >
                        <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton className={classes.item} aria-label="Delete" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                    }} >
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                </Box>
            )}
        </ListItem>
    );
};

export default LevelCatItem;

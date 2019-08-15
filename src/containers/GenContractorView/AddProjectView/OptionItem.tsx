import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { RoomOption } from 'types/project';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
    },
    container: {
        width: '100%'
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
        top: theme.spacing(2),
    },
    item: {
        padding: theme.spacing(1)
    }
}));

interface IOptionItemProps {
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    item: RoomOption;
    edit: boolean;
}

const OptionItem: React.SFC<IOptionItemProps> = (props) => {

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
                <Grid container>
                    <Grid item xs={12} sm={6} style={{ padding: '8px 16px' }}>
                        <Typography className={classes.subtitle}>
                            {`Type: ${item.type}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ padding: '8px 16px' }}>
                        <Typography className={classes.subtitle}>
                            {`Name: ${item.name}`}
                        </Typography>
                    </Grid>
                    {item.description && item.description.length > 0 && (
                        <Grid item xs={12} style={{ padding: '8px 16px' }}>
                            <Typography className={classes.subtitle}>
                                {`Description: ${item.description}`}
                            </Typography>
                        </Grid>
                    )}

                </Grid>
            </Box>
            {enter && props.edit && (
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

export default OptionItem;

import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { HistoryInfo } from 'types/global';


const useStyles = makeStyles((theme: Theme) => ({
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1.1em',
        paddingRight: theme.spacing(1.5),
        display: 'inline',
        color: '#222'
    },
    action: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

interface IHistoryItemProps {
    handleDetail: (info: HistoryInfo) => void;
    handleDelete: (id: string) => void;
    handleEdit: (id: string) => void;
    item: HistoryInfo;
}

const HistoryItem: React.SFC<IHistoryItemProps> = (props) => {

    const { item, handleDelete, handleDetail, handleEdit } = props;
    const classes = useStyles({});

    const [enter, setEnter] = React.useState(false);

    return (
        <ListItem
            onMouseEnter={e => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
            alignItems='flex-start'
            button
            onClick={() => handleDetail(item)}
        >
            <ListItemText
                primary={
                    <Typography className={classes.title}>
                        {item.title}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component='span'
                            variant='body2'
                            className={classes.subtitle}
                        >
                            {item.from} - {item.to}
                        </Typography>
                        {item.description}
                    </React.Fragment>
                }
            />
            {enter && (
                <ListItemSecondaryAction className={classes.action} onMouseEnter={e => setEnter(true)}>
                    <React.Fragment>
                        <IconButton edge="end" aria-label="Edit" onClick={() => handleEdit(item.id)} >
                            <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton edge="end" aria-label="Delete" onClick={() => handleDelete(item.id)} >
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                    </React.Fragment>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

export default HistoryItem;

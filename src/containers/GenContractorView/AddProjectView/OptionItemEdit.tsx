import * as React from 'react';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from "components/CustomButtons/Button.jsx";

import { RoomOption } from 'types/project';
import { Validator } from 'types/global';


const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid #EEE',
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    container: {
        width: '100%'
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

export interface IOptionItemEditProps {
    handleSave: (item: RoomOption) => void;
    handleCancel: () => void;
    item: RoomOption;
}

const OptionItemEdit: React.SFC<IOptionItemEditProps> = props => {

    const { item, handleSave, handleCancel } = props;
    const [name, setName] = React.useState({
        value: item.name,
        errMsg: undefined
    } as Validator);
    const [type, setType] = React.useState({
        value: item.type,
        errMsg: undefined
    } as Validator);
    const [desc, setDesc] = React.useState(item.description);

    const classes = useStyles({});

    const saveCategory = () => {

        if (type.value.length === 0) {
            setType({
                value: type.value,
                errMsg: 'Type is required'
            });

            return;
        }

        if (name.value.length === 0) {
            setName({
                value: name.value,
                errMsg: 'Name is required'
            });

            return;
        }

        const option = {
            id: item.id,
            type: type.value,
            name: name.value,
            description: desc,
            images: []
        };

        handleSave(option);
    }


    return (
        <ListItem
            className={classes.root}
            alignItems='flex-start'
        >
            <Box className={classes.container}>
                <Grid container>
                    <Grid item xs={12} sm={6} style={{ padding: '8px 8px' }}>
                        <TextField
                            label="Type"
                            required
                            margin="dense"
                            fullWidth={true}
                            rowsMax={12}
                            error={!!type.errMsg}
                            helperText={type.errMsg}
                            value={type.value}
                            onChange={event => setType({ value: event.target.value, errMsg: undefined })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ padding: '8px 8px' }}>
                        <TextField
                            label="Name"
                            required
                            margin="dense"
                            fullWidth={true}
                            rowsMax={12}
                            error={!!name.errMsg}
                            helperText={name.errMsg}
                            value={name.value}
                            onChange={event => setName({ value: event.target.value, errMsg: undefined })}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ padding: '8px 8px' }}>
                        <TextField
                            label="Desc"
                            margin="dense"
                            fullWidth={true}
                            multiline={true}
                            rowsMax={12}
                            value={desc}
                            onChange={event => setDesc(event.target.value)}
                        />
                    </Grid>
                </Grid>
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

export default OptionItemEdit;
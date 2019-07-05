import * as React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


export interface IProjectEditViewProps {
    classes: ClassNameMap<string>;
    title: string;
    price: number;
    dueDate: Date;
    description: string;
    handleTitleChange: (value: string) => void;
    handlePriceChange: (value: number) => void;
    handleDateChange: (date: Date) => void;
    handleDescChange: (value: string) => void;
}

const style = theme => createStyles({
    root: {
        width: '100%'
    },
    textFieldHalf: {
        width: 'calc(50% - 8px)',
        paddingRight: theme.spacing(1)
    }
});

const ProjectEditView: React.SFC<IProjectEditViewProps> = (props) => {

    const {
        classes,
        title,
        price,
        dueDate,
        description,
        handleTitleChange,
        handlePriceChange,
        handleDateChange,
        handleDescChange
    } = props;
    return (
        <div className={classes.root}>
            <TextField
                label="Title"
                margin="normal"
                fullWidth={true}
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
            />
            <Grid container justify="space-around">
                <TextField
                    label="Price"
                    margin="normal"
                    className={classes.textFieldHalf}
                    type='number'
                    value={price}
                    onChange={e => handlePriceChange(parseInt(e.target.value))}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        className={classes.textFieldHalf}
                        margin="normal"
                        id="mui-pickers-date"
                        label="Due Date"
                        value={dueDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'due date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </Grid>
            <SimpleMDE
                value={description}
                onChange={handleDescChange}
                options={{
                    placeholder: 'Description here',
                    lineWrapping: false
                }}
            />
        </div>
    );
}

export default withStyles(style)(ProjectEditView);
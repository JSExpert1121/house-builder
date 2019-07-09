import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import MultiSelect, { CustomTextField, SelectObject } from 'components/Select/MultiSelect';

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    select: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    button: {
        margin: theme.spacing(1),
    },
}));



interface ISpecialtySearchBarProps {
    search: (name: string, city: string, specs: Array<string>) => void;
    suggestions: Array<SelectObject>;
}

const SpecialtySearchBar: React.SFC<ISpecialtySearchBarProps> = (props) => {

    const classes = useStyles({});
    const { suggestions, search } = props;
    const [specs, setSpecs] = React.useState([]);
    const [name, setName] = React.useState('');
    const [city, setCity] = React.useState('');

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const onCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    }

    const selectChange = (val: Array<string>) => {
        setSpecs(val);
    }

    const deleteSelect = (name: string) => {
        let idx: number = specs.indexOf(name);
        if (idx >= 0) {
            setSpecs([...specs.slice(0, idx), ...specs.slice(idx + 1)]);
        }
    }

    const handleSearch = () => {
        search(name, city, specs);
    }

    return (
        <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
            <CustomTextField
                id="name"
                label="Name"
                className={classes.textField}
                value={name}
                onChange={onNameChange}
                margin="normal"
            />
            <CustomTextField
                id="city"
                label="City"
                className={classes.textField}
                value={city}
                onChange={onCityChange}
                margin="normal"
            />
            <MultiSelect
                className={classes.select}
                placeholder="Select multiple specialties"
                suggestions={suggestions}
                values={specs}
                selectChange={selectChange}
                handleDelete={deleteSelect}
            />
            <Box style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row' }}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSearch}
                >
                    Search
              </Button>
            </Box>
        </Box>
    )
}

export default SpecialtySearchBar;
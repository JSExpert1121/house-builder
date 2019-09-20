import React from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import LocationIcon from '@material-ui/icons/MyLocation';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';

import UploadButton from 'components/CustomUpload/UploadButton';
import { Grid } from '@material-ui/core';
import { Specialties } from 'types/global';
import { Projects } from 'types/project';


const styles = (theme: Theme) => createStyles({
    contents: {
        width: '100%',
        padding: theme.spacing(2),
        borderRadius: '0',
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    borderedBox: {
        border: '1px dashed rgba(0, 0, 0, 0.5)',
        padding: theme.spacing(1),
        display: 'flex'
    },
    addBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        cursor: 'pointer',
        border: 'dashed 1px rgba(0, 0, 0, 0.5)'
    },
    addBtn: {
        color: theme.palette.primary.dark
    },
    imageBox: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        minHeight: 48
    },
    imageItem: {
        width: 128,
        height: 128,
        border: 'solid 1px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        marginBottom: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: '4px'
    },
    submit: {
        width: 120,
        border: '1px solid #4a148c',
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    },
    bold: {
        fontWeight: 600
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    }
});

type ProjectItemProps = {
    title: string;
    images: string[];
    price: number;
}

export interface IProfileProjectsProps extends StyledComponentProps {
    specialties: Specialties;
    pastProjects: Projects;
    contId: string;
    handleSubmit: (title: string, price: number, location: string, service: string, duration: number, unit: string, year: number, desc: string, files: File[]) => Promise<void>;
}

interface IProfileProjectsState {
    dialog: boolean;
    title: string;
    price: number;
    files: File[];
    urls: string[];
    location: string;
    service: string;
    duration: number;
    unit: string;
    year: number;
    desc: string;
    hover: number;
}

const units = ['day(s)', 'week(s)', 'month(s)'];
const range = (start: number, end: number) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

class ProfileProjects extends React.Component<IProfileProjectsProps, IProfileProjectsState> {

    constructor(props: Readonly<IProfileProjectsProps>) {
        super(props);

        const serv = props.specialties && props.specialties.content && props.specialties.content[0] && props.specialties.content[0].name;
        this.state = {
            dialog: false,
            title: '',
            price: 0,
            files: [],
            urls: [],
            location: '',
            service: serv || '',
            duration: 5,
            unit: 'day(s)',
            year: new Date().getFullYear(),
            desc: '',
            hover: -1
        }
    }

    handleAdd = () => {
        this.setState({ dialog: true });
    }

    handleCancel = () => {
        this.setState({ dialog: false });
    }

    handleSubmit = () => {
        const { title, price, location, service, duration, unit, year, desc, files } = this.state;
        this.props.handleSubmit(title, price, location, service, duration, unit, year, desc, files);
        this.setState({ dialog: false });
    }

    handleUpload = (file: File): Promise<void> => new Promise(resolve => {
        console.log(file);
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.setState({ files: [...this.state.files, file] });
            this.setState({ urls: [...this.state.urls, reader.result as string] });
            resolve();
        });
        reader.readAsDataURL(file);
    })

    handleDelete = (index: number) => {
        const { files, urls } = this.state;
        files.splice(index, 1);
        urls.splice(index, 1);
        console.log(index);
        this.setState({
            files: [...files],
            urls: [...urls],
        });
    }

    public render() {
        const { classes, specialties, pastProjects, contId } = this.props;
        const { dialog, title, price, files, service, location, duration, year, unit, desc, urls, hover } = this.state;
        const thisYear = new Date().getFullYear();
        let imageCount = parseInt(((files.length + 3) / 4).toFixed(1)) * 4;
        if (imageCount < 4) imageCount = 4;
        else imageCount = imageCount - files.length;

        return (
            <>
                <Card className={classes.contents}>
                    <List>
                        <ListItem>
                            <Typography className={classes.title}>
                                Past Projects
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
                                {pastProjects.content.map((item, index) => (
                                    <Card
                                        key={index}
                                        style={{ width: 256, height: 256, boxShadow: 'none', display: 'flex' }}
                                    >
                                        <CardContent style={{ padding: 0, fontSize: '0.875rem', display: 'flex', flex: 1, flexDirection: 'column', marginBottom: 16 }}>
                                            <Box className={classes.addBox} style={{ border: 'none' }}>
                                                <img

                                                    alt={item.title}
                                                    style={{ width: 256, height: 188 }}
                                                    src={process.env.REACT_APP_PROJECT_API + '/contractors/' + contId + '/files/' + item.projectFiles[0].name} />
                                            </Box>
                                            <Typography style={{ fontWeight: 500, fontSize: '1em', marginTop: 8 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography style={{ fontSize: '1em' }}>
                                                {`Approx. $${item.budget}`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card style={{ width: 256, height: 256, boxShadow: 'none', display: 'flex' }}>
                                    <CardContent style={{ padding: 0, fontSize: '0.875rem', display: 'flex', flex: 1, flexDirection: 'column', marginBottom: 16 }}>
                                        <Box className={classes.addBox} onClick={this.handleAdd}>
                                            <AddIcon className={classes.addBtn} />
                                        </Box>
                                        <Typography style={{ fontWeight: 500, fontSize: '1em', marginTop: 8 }}>
                                            {'Project title'}
                                        </Typography>
                                        <Typography style={{ fontSize: '1em' }}>
                                            {'Approximate price'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </ListItem>
                    </List>
                </Card>
                <Dialog open={dialog} onClose={this.handleCancel}>
                    <DialogTitle id="project-dialog-title">
                        <Typography className={classes.title}>
                            {'Past Project'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container style={{ width: '100%' }}>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <FormControl fullWidth style={{ marginTop: 5 }}>
                                    <InputLabel htmlFor='service-select'>Service</InputLabel>
                                    <Select
                                        id='service-select'
                                        fullWidth
                                        value={service}
                                        onChange={e => this.setState({ service: e.target.value as string })}
                                        name="services"
                                    >
                                        {specialties && specialties.content && specialties.content.map(serv => (
                                            <MenuItem value={serv.id} key={serv.id}>
                                                {serv.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} style={{ paddingLeft: 8 }}>
                                <TextField
                                    label={`Location(optional)`}
                                    margin="dense"
                                    fullWidth
                                    value={location}
                                    onChange={e => this.setState({ location: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationIcon style={{ marginBottom: 5 }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{ fontSize: '0.75rem' }}>Photos</Typography>
                                <Box className={classes.imageBox}>
                                    {urls.map((url, index) => (
                                        <Box
                                            key={index} className={classes.imageItem}
                                            style={{ position: 'relative' }}
                                            onMouseEnter={() => this.setState({ hover: index })}
                                            onMouseLeave={() => this.setState({ hover: -1 })}
                                        >
                                            <img src={url} alt='project-snapshot' style={{ width: 128, height: 128 }} />
                                            {hover === index && (
                                                <IconButton
                                                    style={{ position: 'absolute', right: 0, top: 0 }}
                                                    color="primary"
                                                    onClick={() => this.handleDelete(hover)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}
                                    {range(0, imageCount).map(idx => (
                                        <Box className={classes.imageItem} key={idx + files.length}>
                                            <ImageIcon />
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{ fontSize: '0.875rem', marginBottom: 4 }}>
                                    Consider showing before and after photos, the work in progress, and you or your team at work(20 photos max).
                                </Typography>
                                <UploadButton
                                    multiple={false}
                                    btnId={'project-upload-image'}
                                    filter={'image/*'}
                                    handleChange={this.handleUpload}
                                    variant={'outlined'}
                                    className={classes.submit}
                                    style={{ padding: '4px 8px' }}
                                >
                                    Add Photo
							    </UploadButton>
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    label={`Project title`}
                                    margin="dense"
                                    fullWidth
                                    value={title}
                                    onChange={e => this.setState({ title: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6} style={{ paddingLeft: 8 }}>
                                <TextField
                                    label={'Approximate totla price'}
                                    margin="dense"
                                    fullWidth
                                    value={price}
                                    onChange={e => this.setState({ price: parseInt(e.target.value) })}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" style={{ marginBottom: 5 }}>
                                                $
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ paddingRight: 8 }}>
                                <TextField
                                    label={`Duration (optional)`}
                                    margin="dense"
                                    fullWidth
                                    value={duration}
                                    onChange={e => this.setState({ duration: parseInt(e.target.value) })}
                                    InputProps={{
                                        endAdornment: (
                                            <Select style={{ width: 160 }} value={unit} onChange={e => this.setState({ unit: e.target.value as string })}>
                                                {units.map(unt => (
                                                    <MenuItem value={unt} key={unt}>
                                                        {unt}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ paddingLeft: 8 }}>
                                <FormControl fullWidth style={{ marginTop: 5 }}>
                                    <InputLabel htmlFor='past-project-year-select'>Year</InputLabel>
                                    <Select
                                        id='past-project-year-select'
                                        fullWidth
                                        value={year}
                                        onChange={e => this.setState({ year: e.target.value as number })}
                                        name="services"
                                    >
                                        {range(1970, thisYear + 1).map(y => (
                                            <MenuItem value={y} key={y}>
                                                {y}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={`Description (optional)`}
                                    margin="dense"
                                    fullWidth
                                    multiline
                                    value={desc}
                                    onChange={e => this.setState({ desc: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)' }}>
                                    You can describe the goal, process, materials, equipment, or final result(255 characters max).
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', padding: 24 }}>
                        <Button onClick={this.handleSubmit} autoFocus className={classes.submit} variant={'outlined'}>
                            Save
                        </Button>
                        <Button onClick={this.handleCancel} variant={'outlined'}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileProjects);
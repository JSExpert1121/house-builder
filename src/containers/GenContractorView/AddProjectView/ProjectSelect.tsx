import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';

import MuiTreeView from 'material-ui-treeview';

import ProjectOptionView from './OptionsView';
import { ProjectLevel, MockTemplateInfo, TemplateOption, RoomOption, RoomOptions } from 'types/project';

const styles = createStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        minHeight: '100%',
    },
    sidebar: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 200,
        padding: theme.spacing(1)
    },
    select: {
        paddingLeft: theme.spacing(2),
    },
    contents: {
        padding: theme.spacing(0, 2),
        flex: 1,
        minHeight: 'calc(100vh - 64px - 56px - 48px - 16px)',
    },
    buttonContainer: {
        textAlign: 'center',
        width: '100%',
        padding: theme.spacing(1)
    }
}));

export interface IProjectSelectProps extends RouteComponentProps, StyledComponentProps {
    levels: ProjectLevel[];
    options: TemplateOption[];
    templates: MockTemplateInfo[];
    addOption: (id: string, levelId: string, roomId: string, option: RoomOption) => void;
    updateOption: (id: string, levelId: string, roomId: string, option: RoomOption) => void;
    deleteOption: (id: string, levelId: string, roomId: string, optId: string) => void;
}

interface IProjectSelectState {
    template: string;
    level: string;
    room: string;
    showDialog: boolean;
}

class ProjectSelect extends React.Component<IProjectSelectProps, IProjectSelectState> {
    constructor(props: Readonly<IProjectSelectProps>) {
        super(props);

        this.state = {
            template: (props.templates && props.templates.length > 0) ? props.templates[0].id : '',
            level: '',
            room: '',
            showDialog: false,
        }
    }

    templateChange = (event) => {
        this.setState({ template: event.target.value });
    }

    roomSelected = (leaf) => {
        if (!leaf.parent) return;

        this.setState({
            level: leaf.parent.id,
            room: leaf.id
        });
    }

    roomSelected_ = (event: React.MouseEvent<HTMLElement>, lid: string, rid: string) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({
            level: lid,
            room: rid
        })
    }


    public render() {
        const { classes, levels, templates, options, addOption, updateOption, deleteOption } = this.props;
        if (!levels || !templates) {
            return <Box className={classes.root}>No levels or templates exist</Box>
        }

        const tree = levels.map(level => ({
            id: level.id,
            value: level.name,
            nodes: level.rooms.map(room => ({
                id: room.id,
                value: room.name,
            }))
        }));

        const { template, level, room } = this.state;
        let curTemplate: MockTemplateInfo = undefined;
        for (let templ of templates) {
            if (templ.id === template) {
                curTemplate = templ;
                break;
            }
        }

        if (!curTemplate) {
            return <Box className={classes.root}>No template selected</Box>
        }

        let curOptions: RoomOptions[] = [];
        for (let opt of options) {
            if (opt.templ_id === template) {
                curOptions = opt.options;
                break;
            }
        }

        let curLevel: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === level) {
                curLevel = lvl;
                break;
            }
        }

        return (
            <Box className={classes.root}>
                <Box className={classes.sidebar}>
                    <Typography component='h3' variant='h6' style={{ paddingTop: 8, fontSize: '1.2em' }}>Templates</Typography>
                    <Select
                        value={template}
                        onChange={this.templateChange}
                        name='template'
                        fullWidth
                        className={classes.select}
                    >
                        {templates.map((templ, index) => (
                            <MenuItem key={templ.id} value={templ.id}>{templ.name}</MenuItem>
                        ))}
                    </Select>
                    <Typography component='h3' variant='h6' style={{ paddingTop: 16, paddingBottom: 8, fontSize: '1.2em' }}>Levels</Typography>
                    {/* <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {levels.map((level, idx) => (
                            <TreeItem key={level.id} nodeId={`node-${level.id}`} label={level.name}>
                                {level.rooms && level.rooms.length > 0 && level.rooms.map(room => (
                                    <TreeItem
                                        key={room.id}
                                        nodeId={`${level.id}-${room.id}`}
                                        label={room.name}
                                        onClick={e => this.roomSelected(e, level.id, room.id)}
                                    />
                                ))}
                            </TreeItem>
                        ))}
                    </TreeView> */}
                    <MuiTreeView tree={tree} onLeafClick={this.roomSelected} />
                </Box>
                <Box className={classes.contents}>
                    <ProjectOptionView
                        template={curTemplate}
                        options={curOptions}
                        level={curLevel}
                        roomId={room}
                        addOption={addOption}
                        deleteOption={deleteOption}
                        updateOption={updateOption}
                    />
                </Box>
            </Box>
        );
    }
}

export default withStyles(styles)(ProjectSelect);
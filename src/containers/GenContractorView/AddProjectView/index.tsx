import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { compose } from "redux";

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import CustomTabs from "components/shared/CustomTabs";
import ProjectLevels from 'components/ProjectDetailView/ProjectLevels';
import SecuredRoute from 'routers/SecuredRoute';
import AddProjectOverview, { ProjectBriefInfo } from './Overview';
import ProjectSelect from './ProjectSelect';
import {
    addFilesToProject,
    addProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels
} from 'store/actions/gen-actions';
import { getTemplates } from 'store/actions/tem-actions';

import { UserProfile, TemplateDetailInfo } from 'types/global';
import {
    ProjectLevel,
    ProjectPostInfo,
    ProjectLevelCategory,
    TemplateOption,
    RoomOption,
} from 'types/project';

// mocking data/api
import { initLevels } from './mock';

const styles = theme => createStyles({
    root: {
        position: 'relative',
        minHeight: '100%',
    },
    contents: {
        width: '100%',
        flex: 1,
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
    fileUpload: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1)
    },
    fileItem: {
        margin: '6px',
        padding: theme.spacing(1),
        border: '1px solid #CCC',
    },
    textFieldHalf: {
        width: 'calc(50% - 8px)',
        paddingRight: theme.spacing(1)
    },
});

interface IAddProjectViewProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile;
    addFilesToProject: (projId: string, files: Array<File>) => void;
    addProject: (contId: string, data: ProjectPostInfo) => Promise<string>;
    createLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    updateLevel: (id: string, desc: string) => Promise<any>;
    deleteLevel: (id: string) => Promise<void>;
    createRoom: (id: string, room: {
        number: number,
        name: string,
        type: string,
        description: string,
        w: number,
        h: number,
        l: number
    }) => Promise<any>;
    updateRoom: (id: string, desc: string) => Promise<any>;
    deleteRoom: (id: string) => Promise<void>;
    getLevels: (id: string) => Promise<void>;
    getTemplates: (currentPage: number, rowsPerPage: number) => Promise<void>;
    templates: TemplateDetailInfo[];
}

interface IAddProjectViewState extends ISnackbarProps, ProjectBriefInfo {
    isBusy: boolean;
    projectId: string;
    levels: ProjectLevel[];
    options: TemplateOption[];
}

class AddProjectView extends React.Component<IAddProjectViewProps, IAddProjectViewState> {
    constructor(props: IAddProjectViewProps) {
        super(props);

        this.state = {
            title: '',
            price: 0,
            description: '',
            dueDate: new Date(),
            isBusy: false,
            files: [],
            showMessage: false,
            message: '',
            variant: 'error',
            handleClose: this.closeMessage,
            projectId: '',
            levels: initLevels,
            options: [],
        }
    }

    componentDidMount() {
        this.props.getTemplates(0, 100);
    }


    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleAddProject = async () => {
        const { userProfile, createLevel, createRoom } = this.props;
        const { files, title, description, price, dueDate, levels } = this.state;
        if (title.length === 0 || description.length === 0 || price === 0) {
            this.setState({
                showMessage: true,
                message: 'You must fill in all the items',
            });
            return;
        }

        const projectData = {
            title,
            description,
            budget: price,
            updatedBy: userProfile.email,
            due: dueDate
        };

        this.setState({ isBusy: true });

        let projectId: string = undefined;
        try {
            projectId = await this.props.addProject(userProfile.user_metadata.contractor_id, projectData);
            await this.props.addFilesToProject(projectId, files);

            for (let level of levels) {
                const data = await createLevel(projectId, {
                    number: level.number,
                    name: level.name,
                    description: level.description
                });
                console.log(data);

                for (let room of level.rooms) {
                    const { id, ...rest } = room;
                    await createRoom(data.id, rest);
                }
            }

            this.setState({ isBusy: false, projectId });
            // this.props.history.push('/gen-contractor');
        } catch (error) {
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add project failed.',
                projectId: ''
            });
        }
    };

    handleFileChange = e => {
        this.setState({ files: [...this.state.files, ...e.target.files] });
    };

    handleRemove = file => {
        const { files } = this.state;

        for (let i = 0; i < files.length; i++) {
            if (files[i].name === file.name && files[i].size === file.size) {
                files.splice(i, 1);
                break;
            }
        }

        this.setState({ files: [...files] });
    };

    handleDateChange = (date) => {
        this.setState({ dueDate: date });
    };

    handleDescChange = value => {
        this.setState({ description: value });
    };

    handleTitleChange = value => {
        this.setState({ title: value });
    }

    handlePriceChange = value => {
        this.setState({ price: value });
    }

    addLevel = (number, name, desc) => {
        const { levels } = this.state;

        this.setState({
            levels: [...levels, {
                id: number.toString(),
                number,
                name,
                description: desc,
                rooms: []
            }]
        });
    }

    updateLevel = (id: string, desc: string) => {
        const { levels } = this.state;

        let level: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === id) {
                level = lvl;
                break;
            }
        }

        if (!level) return;
        level.description = desc;
        this.setState({ levels: [...levels] });
    }

    deleteLevel = (id: string) => {
        const { levels } = this.state;

        let level: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === id) {
                level = lvl;
                break;
            }
        }

        if (!level) return;
        const idx = levels.indexOf(level);
        levels.splice(idx, 1);

        const options = this.deleteOptionsForLevel(id);
        this.setState({
            levels: [...levels],
            options: [...options]
        });
    }

    addCategory = (id: string, cat: ProjectLevelCategory) => {
        const { levels } = this.state;

        let level: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === id) {
                level = lvl;
                break;
            }
        }

        if (!level) return;
        cat.id = cat.number.toString();
        level.rooms.push(cat);
        this.setState({ levels: [...levels] });
    }

    updateCategory = (id: string, cat: ProjectLevelCategory) => {
        const { levels } = this.state;

        let level: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === id) {
                level = lvl;
                break;
            }
        }

        if (!level) return;
        const count = level.rooms.length;
        for (let i = 0; i < count; i++) {
            if (level.rooms[i].id === cat.id) {
                level.rooms[i] = cat;
                this.setState({ levels: [...levels] });
                return;
            }
        }
    }

    deleteCategory = async (id: string, catId: string) => {
        const { levels } = this.state;

        let level: ProjectLevel = undefined;
        for (let lvl of levels) {
            if (lvl.id === id) {
                level = lvl;
                break;
            }
        }

        if (!level) return;
        const count = level.rooms.length;
        for (let i = 0; i < count; i++) {
            if (level.rooms[i].id === catId) {
                level.rooms.splice(i, 1);
                const options = this.deleteOptionsForCategory(catId);
                this.setState({
                    levels: [...levels],
                    options: [...options]
                });
                return;
            }
        }
    }

    deleteOptionsForLevel = (lvlId: string) => {
        const { options } = this.state;

        const templCount = options ? options.length : 0;
        for (let i = 0; i < templCount; i++) {
            const templOption = options[i];
            const templOptions = templOption.options;
            let optCount = templOptions ? templOptions.length : 0;
            for (let j = 0; j < optCount; j++) {
                if (templOptions[j].level_id === lvlId) {
                    templOptions.splice(j, 1);
                    j--;
                    optCount--;
                    continue;
                }
            }
        }

        return options;
    }

    deleteOptionsForCategory = (catId: string) => {
        const { options } = this.state;

        const templCount = options ? options.length : 0;
        for (let i = 0; i < templCount; i++) {
            const templOption = options[i];
            const templOptions = templOption.options;
            let optCount = templOptions ? templOptions.length : 0;
            for (let j = 0; j < optCount; j++) {
                if (templOptions[j].room_id === catId) {
                    templOptions.splice(j, 1);
                    j--;
                    optCount--;
                    continue;
                }
            }
        }

        return options;
    }

    addOption = (id: string, levelId: string, roomId: string, option: RoomOption) => {
        const { options } = this.state;
        const count = options.length;
        for (let i = 0; i < count; i++) {
            if (options[i].templ_id === id) {
                const opt = options[i];
                const roomOptions = opt.options;
                const count = roomOptions.length;
                let done = false;
                for (let j = 0; j < count; j++) {
                    const roomOpt = roomOptions[j];
                    if (roomOpt.level_id === levelId && roomOpt.room_id === roomId) {
                        option.id = `${id}-${levelId}-${roomId}-${roomOpt.options.length}`;
                        roomOpt.options.push(option);
                        done = true;
                        break;
                    }
                }

                // if not exist, create a new
                if (!done) {
                    option.id = `${id}-${levelId}-${roomId}-0`;
                    roomOptions.push({
                        level_id: levelId,
                        room_id: roomId,
                        options: [option]
                    });
                }

                this.setState({ options: [...options] });
                return;
            }
        }

        // if not exist
        option.id = `${id}-${levelId}-${roomId}-0`;
        options.push({
            templ_id: id,
            options: [{
                level_id: levelId,
                room_id: roomId,
                options: [option]
            }]
        });
        this.setState({ options: [...options] });
    }

    updateOption = (id: string, levelId: string, roomId: string, option: RoomOption) => {
        const { options } = this.state;
        const count = options.length;
        for (let i = 0; i < count; i++) {
            if (options[i].templ_id === id) {
                const opt = options[i];
                const roomOptions = opt.options;
                const count = roomOptions.length;
                for (let j = 0; j < count; j++) {
                    const roomOpt = roomOptions[j];
                    if (roomOpt.level_id === levelId && roomOpt.room_id === roomId) {
                        const optCount = roomOpt.options.length;
                        for (let k = 0; k < optCount; k++) {
                            if (roomOpt.options[k].id === option.id) {
                                roomOpt.options[k] = option;
                                this.setState({ options: [...options] });
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    deleteOption = (id: string, levelId: string, roomId: string, optId: string) => {
        const { options } = this.state;
        const count = options.length;
        for (let i = 0; i < count; i++) {
            if (options[i].templ_id === id) {
                const opt = options[i];
                const roomOptions = opt.options;
                const count = roomOptions.length;
                for (let j = 0; j < count; j++) {
                    const roomOpt = roomOptions[j];
                    if (roomOpt.level_id === levelId && roomOpt.room_id === roomId) {
                        const optCount = roomOpt.options.length;
                        for (let k = 0; k < optCount; k++) {
                            if (roomOpt.options[k].id === optId) {
                                roomOpt.options.splice(k, 1);
                                this.setState({ options: [...options] });
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    public render() {
        const { classes, match, location, templates } = this.props;
        const { title, price, description, dueDate, files, isBusy, levels, options } = this.state;
        const tabs = [
            { href: `${match.url}/submitted`, label: 'Overview' },
            { href: `${match.url}/add-levels`, label: 'Levels' },
            { href: `${match.url}/select`, label: 'Select' }
        ];

        let tab = tabs.map(tab => tab.href).indexOf(location.pathname);
        if (tab < 0) tab = 0;

        return (
            <Box className={classes.root}>
                <CustomTabs init={tab} tabs={tabs} />
                <Box className={classes.contents}>
                    <Switch>
                        <SecuredRoute
                            path={tabs[0].href}
                            render={props => (
                                <AddProjectOverview {...props}
                                    title={title}
                                    price={price}
                                    description={description}
                                    dueDate={dueDate}
                                    files={files}
                                    isBusy={isBusy}
                                    handleFileChange={this.handleFileChange}
                                    handleRemove={this.handleRemove}
                                    handleDateChange={this.handleDateChange}
                                    handleDescChange={this.handleDescChange}
                                    handleTitleChange={this.handleTitleChange}
                                    handlePriceChange={this.handlePriceChange}
                                    handleAdd={this.handleAddProject}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabs[1].href}
                            render={props => (
                                <ProjectLevels {...props}
                                    levels={levels}
                                    addLevel={this.addLevel}
                                    deleteLevel={this.deleteLevel}
                                    addCategory={this.addCategory}
                                    updateCategory={this.updateCategory}
                                    deleteCategory={this.deleteCategory}
                                />
                            )}
                        />
                        <SecuredRoute
                            path={tabs[2].href}
                            render={props => (
                                <ProjectSelect
                                    {...props}
                                    levels={levels}
                                    options={options}
                                    templates={templates}
                                    addOption={this.addOption}
                                    updateOption={this.updateOption}
                                    deleteOption={this.deleteOption}
                                />
                            )}
                        />
                        <Redirect path={`${match.url}`} to={tabs[0].href} />
                    </Switch>
                </Box>
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    templates: state.tem_data.templates ? state.tem_data.templates.content || [] : [],
});

const mapDispatchToProps = {
    addProject,
    addFilesToProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels,
    getTemplates,
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles),
)(AddProjectView);
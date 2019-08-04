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
import AddProjectOverview, { ProjectBriefInfo } from './Overview';
import AddProjectLevels from './Levels';
import SecuredRoute from 'routers/SecuredRoute';
import { addFilesToProject, addProject } from 'actions/global-actions';

import { UserProfile } from 'types/global';
import { ProjectLevel, ProjectPostInfo, ProjectLevelCategory } from 'types/project';

const styles = theme => createStyles({
    root: {
        position: 'relative'
    },
    mainBoard: {
        width: '100%',
        height: '100%',
        borderBottom: '5px solid ' + theme.palette.primary.light,
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
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
}

interface IAddProjectViewState extends ISnackbarProps, ProjectBriefInfo {
    isBusy: boolean;
    levels: ProjectLevel[];
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
            levels: undefined,
            showMessage: false,
            message: '',
            variant: 'error',
            handleClose: this.closeMessage
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleAddProject = async () => {
        const { userProfile } = this.props;
        const { files, title, description, price, dueDate } = this.state;
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
            this.setState({ isBusy: false });
            this.props.history.push('/gen-contractor');
        } catch (error) {
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add project failed.',
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

    addLevel = (name, desc) => {
        const levels = this.state.levels || [];
        levels.push({
            id: levels.length,
            name: name,
            description: desc,
            categories: []
        });

        this.setState({ levels: [...levels] });
    }

    deleteLevel = (id: number) => {
        const { levels } = this.state;
        if (!levels) return;

        levels.splice(id, 1);
        const len = levels.length;
        for (let i = id; i < len; i++) {
            levels[i].id--;
        }

        if (levels.length === 0) {
            this.setState({ levels: undefined });
        } else {
            this.setState({ levels: [...levels] });
        }
    }

    addCategory = (id: number, cat: ProjectLevelCategory) => {
        const { levels } = this.state;
        if (!levels) return;

        const level = levels[id];
        if (!level) return;

        cat.id = level.categories.length;
        level.categories.push(cat);
        console.log(levels);
        this.setState({ levels: [...levels] });
    }

    updateCategory = (lvlId: number, cat: ProjectLevelCategory) => {
        const { levels } = this.state;
        if (!levels) return;

        const level = levels[lvlId];
        if (!level) return;

        level.categories[cat.id] = cat;
        this.setState({ levels: [...levels] });
    }

    deleteCategory = (lvlId: number, catId: number) => {
        const { levels } = this.state;
        if (!levels) return;

        const level = levels[lvlId];
        if (!level) return;

        const cats = level.categories;
        cats.splice(catId, 1);
        const len = cats.length;
        for (let i = catId; i < len; i++) {
            cats[i].id--;
        }
        this.setState({ levels: [...levels] });
    }

    public render() {
        const { classes, match, location } = this.props;
        const { title, price, description, dueDate, files, isBusy, levels } = this.state;
        const tabs = [
            { href: `${match.url}/submitted`, label: 'Overview' },
            { href: `${match.url}/add-levels`, label: 'Levels' },
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
                                <AddProjectLevels {...props}
                                    levels={levels}
                                    addLevel={this.addLevel}
                                    deleteLevel={this.deleteLevel}
                                    addCategory={this.addCategory}
                                    updateCategory={this.updateCategory}
                                    deleteCategory={this.deleteCategory}
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

const mapDispatchToProps = {
    addProject,
    addFilesToProject,
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles),
)(AddProjectView);
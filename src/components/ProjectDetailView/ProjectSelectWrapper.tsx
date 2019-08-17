import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import ProjectSelect from './ProjectSelect';

import { clearLevels } from 'store/actions/gen-actions';
import { getTemplates } from 'store/actions/tem-actions';

import {
    ProjectLevel,
    TemplateOption,
    RoomOption,
    ProjectInfo
} from 'types/project';
import { UserProfile, TemplateDetailInfo } from 'types/global';

interface IProjectSelectWrapperProps extends RouteComponentProps {
    userProfile: UserProfile;
    levels: ProjectLevel[];
    templates: TemplateDetailInfo[];
    project: ProjectInfo;
    getTemplates: (currentPage: number, rowsPerPage: number) => Promise<void>;
    clearLevels: () => void;
}

interface IProjectSelectWrapperState {
    options: TemplateOption[];
}

class ProjectSelectWrapper extends React.Component<IProjectSelectWrapperProps, IProjectSelectWrapperState> {
    constructor(props: Readonly<IProjectSelectWrapperProps>) {
        super(props);

        this.state = {
            options: []
        }
    }

    componentDidMount() {
        this.props.getTemplates(0, 100);
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
        const { levels, templates, userProfile, ...rest } = this.props;
        const { options } = this.state;

        if (!templates || templates.length === 0) {
            return <Box>No templates</Box>
        }

        return (
            <Box>
                <ProjectSelect
                    {...rest}
                    levels={levels}
                    options={options}
                    templates={templates}
                    addOption={this.addOption}
                    updateOption={this.updateOption}
                    deleteOption={this.deleteOption}
                />
            </Box>
        );
    }
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    levels: state.gen_data.levels,
    project: state.global_data.project,
    templates: state.tem_data.templates ? state.tem_data.templates.content || [] : [],
});

const mapDispatchToProps = dispatch => ({
    getTemplates: (page, size) => dispatch(getTemplates(page, size)),
    clearLevels: () => dispatch(clearLevels())
});
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelectWrapper);
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import removeMd from 'remove-markdown';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar from 'components/shared/CustomSnackbar';
import ConfirmDialog from 'components/shared/ConfirmDialog';

import { getProjectsByGenId } from 'actions/gen-actions';
import { setCurrentProject, archiveProject } from 'actions/global-actions';
import { UserProfile, Projects } from 'types/global';

import style from './CurrentProject.style';


interface CurrentProjectProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile | null;
    projects: Projects | null;
    getProjectsByGenId: (id: string, page: number, size: number) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (id: string) => void;
}

interface CurrentProjectState {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    showMessage: boolean;
    message: string;
    variant: string;
    showConfirm: boolean;
    proId: string;
}

class CurrentProject extends React.Component<CurrentProjectProps, CurrentProjectState> {
    constructor(props) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
            isBusy: false,
            showMessage: false,
            message: '',
            variant: 'success',
            showConfirm: false,
            proId: '',
        };
    }

    async componentDidMount() {
        const { userProfile } = this.props;
        this.setState({ isBusy: true });
        try {
            await this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, 0, 0);
        } catch (error) {
            console.log(error);
        }
        this.setState({ isBusy: false });
    }

    handleChangePage = async (event, page) => {
        const { userProfile } = this.props;
        this.setState({ currentPage: page, isBusy: true });
        try {
            await this.props.getProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                page,
                this.state.rowsPerPage
            );
        } catch (error) {
            console.log('CurrentProjectView.handleChangePage', error);
        }
        this.setState({ isBusy: false });
    };

    handleChangeRowsPerPage = async event => {
        const { projects, userProfile } = this.props;

        const rowsPerPage = event.target.value;
        const currentPage =
            rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

        this.setState({ rowsPerPage, currentPage });
        try {
            await this.props.getProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                currentPage,
                rowsPerPage
            );
        } catch (error) {
            console.log('CurrentProjectView.handleChangeRowsPerPage', error);
        }
        this.setState({ isBusy: false });
    };

    handleDeleteProject = async (id: string) => {
        const { userProfile, projects } = this.props;

        this.setState({ isBusy: true, showConfirm: false });
        try {
            await this.props.deleteProject(this.state.proId);

            let curPage = this.state.currentPage;
            if (this.state.rowsPerPage * this.state.currentPage > (projects.totalElements - 1))
                curPage--;
            await this.props.getProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                curPage,
                this.state.rowsPerPage
            );
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'delete project success',
                variant: 'success',
                currentPage: curPage,
            });
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'error',
                message: 'delete project failed',
            });
        }
    };

    handleSelectProject = async (id: string) => {
        await this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    render() {
        const { classes, projects } = this.props;

        if (!projects) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Paper className={classes.root} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell> Project Title </CustomTableCell>
                            <CustomTableCell align="center">Budget</CustomTableCell>
                            <CustomTableCell align="center">Due Date</CustomTableCell>
                            <CustomTableCell align="center">Discription</CustomTableCell>
                            <CustomTableCell align="center">Action</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.content.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell
                                    component="th"
                                    scope="row"
                                    onClick={() => this.handleSelectProject(row.id)}
                                >
                                    <Typography className="nowrap">{row.title}</Typography>
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(row.id)}
                                >
                                    {row.budget}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(row.id)}
                                >
                                    {row.due && row.due.slice(0, 10)}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(row.id)}
                                >
                                    <Typography className="nowrap">
                                        {removeMd(row.description)}
                                    </Typography>
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <IconButton
                                        aria-label="Delete"
                                        color="primary"
                                        onClick={() =>
                                            this.setState({ showConfirm: true, proId: row.id })
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={projects.totalElements}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.currentPage}
                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={() => this.setState({ showMessage: false })}
                />
                <ConfirmDialog
                    open={this.state.showConfirm}
                    onYes={this.handleDeleteProject}
                    onCancel={() => this.setState({ showConfirm: false })}
                    message="Do you want to delete this project?"
                />
                {this.state.isBusy && <CircularProgress className="busy" />}
            </Paper>
        );
    }
}

const mapDispatchToProps = {
    getProjectsByGenId,
    deleteProject: archiveProject,
    setCurrentProject,
};

const mapStateToProps = state => ({
    projects: state.gen_data.projects,
    userProfile: state.global_data.userProfile,
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(style)
)(CurrentProject);

import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
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
import CustomTableCell from '../../../components/shared/CustomTableCell';
import CustomSnackbar from '../../../components/shared/CustomSnackbar';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';

import { getArchivedProjectsByGenId } from '../../../actions/gen-actions';
import { deleteProject, setCurrentProject } from '../../../actions/global-actions';
import { UserProfile, Projects } from '../../../types/global';



const style = (theme: Theme) => createStyles({
    root: {
        marginTop: theme.spacing(1),
        position: 'relative'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    desc: {
        color: '#444',
        marginTop: '0',
        '& > p': {
            margin: theme.spacing(0, 0),
        },
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
});

interface ArchivedProjectProps extends RouteComponentProps {
    userProfile: UserProfile | null;
    getArchivedProjectsByGenId: Function;
    projects: Projects | null;
    deleteProject: (id: string) => Promise<void>;
    setCurrentProject: (id: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

interface ArchivedProjectState {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    showMessage: boolean;
    message: string;
    variant: string;
    showConfirm: boolean;
    proId: string;
}

class ArchivedProject extends React.Component<ArchivedProjectProps, ArchivedProjectState> {
    constructor(props: Readonly<ArchivedProjectProps>) {
        super(props);

        this.state = {
            rowsPerPage: 20,
            currentPage: 0,
            isBusy: true,
            showMessage: false,
            message: '',
            variant: 'success',
            showConfirm: false,
            proId: '',
        };
    }

    async componentWillMount() {
        const { userProfile } = this.props;
        try {
            await this.props.getArchivedProjectsByGenId(userProfile.user_metadata.contractor_id, 0, 0);
        } catch (error) {
            console.log(error);
        }

        this.setState({ isBusy: false });
    }
    componentDidMount() {
    }

    handleChangePage = async (event, page) => {
        const { userProfile } = this.props;
        this.setState({ currentPage: page, isBusy: true });
        try {
            await this.props.getArchivedProjectsByGenId(
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
            await this.props.getArchivedProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                currentPage,
                rowsPerPage
            );
        } catch (error) {
            console.log('CurrentProjectView.handleChangeRowsPerPage', error);
        }
        this.setState({ isBusy: false });
    };

    handleDeleteProject = async () => {
        const { userProfile, projects } = this.props;
        let msg = 'delete project success';

        this.setState({ isBusy: true, showConfirm: false });
        try {
            await this.props.deleteProject(this.state.proId);

            let curPage = this.state.currentPage;
            if (this.state.rowsPerPage * this.state.currentPage > (projects.totalElements - 1))
                curPage--;
            await this.props.getArchivedProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                curPage,
                this.state.rowsPerPage
            );
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'success',
                message: msg,
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

    handleSelectProject = id => {
        this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    render() {
        const { classes, projects } = this.props;

        if (projects === null) {
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
                                    {row.due && row.due.slice(0,10)}
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
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
            </Paper>
        );
    }
}

const mapDispatchToProps = {
    getArchivedProjectsByGenId,
    deleteProject,
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
)(ArchivedProject);

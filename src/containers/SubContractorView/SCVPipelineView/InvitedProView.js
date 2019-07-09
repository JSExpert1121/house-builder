import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from "components/CustomButtons/Button.jsx";
import { compose } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import CustomTableCell from "components/shared/CustomTableCell";
import { deleteProject, setCurrentProject } from '../../../actions/global-actions';
import { getInvitedProjectsByGenId } from '../../../actions/sub-actions';
import removeMd from 'remove-markdown';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1),
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
});

class InvitedProView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      isSaving: false,
      snackBar: false,
      snackBarContent: '',
      alertConfirm: false,
      proId: 0,
    };
  }

  componentDidMount() {
    const { userProfile } = this.props;
    this.props.getInvitedProjectsByGenId(
      userProfile.user_metadata.contractor_id,
      0,
      0
    );
  }

  handleChangePage = (event, page) => {
    const { userProfile } = this.props;
    this.setState({ currentPage: page });

    this.props.getInvitedProjectsByGenId(
      userProfile.user_metadata.contractor_id,
      page,
      this.state.rowsPerPage
    );
  };

  handleChangeRowsPerPage = event => {
    const { projects, userProfile } = this.props;

    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getInvitedProjectsByGenId(
      userProfile.user_metadata.contractor_id,
      currentPage,
      rowsPerPage
    );
  };

  handleDeleteProject = async id => {
    this.setState({
      isSaving: true,
      alertConfirm: false,
    });

    await this.props.deleteProject(this.state.proId, res => {
      this.setState({
        isSaving: false,
        snackBar: true,
        snackBarContent: res
          ? 'delete project success'
          : 'delete project failed',
      });

      if (res) {
        const { userProfile, projects } = this.props;

        if (
          this.state.rowsPerPage * this.state.currentPage <
          projects.totalElements - 1
        ) {
          this.props.getInvitedProjectsByGenId(
            userProfile.user_metadata.contractor_id,
            this.state.currentPage,
            this.state.rowsPerPage
          );
        } else {
          const currentPage = this.state.currentPage - 1;

          this.setState({
            currentPage: currentPage,
          });

          this.props.getInvitedProjectsByGenId(
            userProfile.user_metadata.contractor_id,
            currentPage,
            this.state.rowsPerPage
          );
        }
      }
    });
  };

  handleSelectProject = async id => {
    this.props.setCurrentProject(id);
    this.props.history.push('/s_cont/project_detail/' + id);
  };

  render() {
    const { classes, projects } = this.props;

    if (projects === null) {
      return <CircularProgress className={classes.waitingSpin} />;
    }
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell> Project Title </CustomTableCell>
              <CustomTableCell align="center">Budget</CustomTableCell>
              <CustomTableCell align="center">Due Date</CustomTableCell>
              <CustomTableCell align="center">Description</CustomTableCell>
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
                  {row.title}
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
                  {removeMd(row.description)}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    aria-label="Delete"
                    color="primary"
                    onClick={() => {
                      this.setState({
                        alertConfirm: true,
                        proId: row.id,
                      });
                    }}
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
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackBar}
          onClose={() =>
            this.setState({
              snackBar: false,
            })
          }
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id"> {this.state.snackBarContent}</span>}
        />
        <Dialog
          open={this.state.alertConfirm}
          onClose={() => this.setState({ alertConfirm: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Delete Project?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete this project?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ alertConfirm: false })}
            >
              No
            </Button>
            <Button
              onClick={() => this.handleDeleteProject()}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

const mapDispatchToProps = {
  getInvitedProjectsByGenId,
  deleteProject,
  setCurrentProject
};

const mapStateToProps = state => ({
  projects: state.sub_data.projects,
  userProfile: state.global_data.userProfile,
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InvitedProView)

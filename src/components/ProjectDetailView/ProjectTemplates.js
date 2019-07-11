import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import NoteAddIcon from '@material-ui/icons/NoteAdd';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import removeMd from 'remove-markdown';

import { addTemplate, deleteTemplate, getTemplates, } from '../../actions/gen-actions';
import { getProjectData } from '../../actions/global-actions';
import { createTemplate } from '../../actions/tem-actions';
import Button from '../CustomButtons/Button';
import CustomTableCell from '../shared/CustomTableCell';

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  select: {
    width: '180px',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  successAlert: {
    marginBottom: theme.spacing(1),
  },
  editField: {
    lineHeight: '1.5rem',
  },
  template: {
    margin: theme.spacing(1),
  },
  fab: {
    width: '40px',
    height: '40px',
    marginLeft: '20px',
  },
});

class ProjectTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      isSaving: false,
      openCategoryForm: false,
      name: '',
      description: '',
      snackBar: false,
      SnackBarContent: '',
      template: '',
    };
  }

  componentDidMount() {
    this.fetchTemplates();
  }

  fetchTemplates = () => {
    this.props.getTemplates(0, 20)
  }
  handleChangePage = (event, page) => {
    this.setState({ currentPage: page });

    this.props.getTemplates(page, this.state.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    const { project } = this.props;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= project.projectTemplates.length
        ? 0
        : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getTemplates(currentPage, rowsPerPage);
  };

  addTemplateToProject = async () => {
    const { project } = this.props;
    const { template } = this.state;

    const result = await this.props.addTemplate(project.id, template);
    console.log('ProjectTemplates.addTemplateToProject: ', result);
    if (result) {
      this.setState({ template: '' });
      this.props.getProjectData(project.id);
    }
  };

  createTemplate = async () => {
    this.setState({ isSaving: true });
    const { userProfile } = this.props;
    const data = {
      name: this.state.name,
      description: this.state.description,
      updatedBy: userProfile.email,
    };

    this.props.createTemplate(data).then(res => {
      this.fetchTemplates();
      this.setState({
        snackBar: true,
        openCategoryForm: false,
        snackBarContent: res.data
          ? 'create template success'
          : 'create template failed',
      });
    });
  };

  handleChange = event => {
    this.setState({
      template: event.target.value,
    });
  };

  render() {
    const { classes, templates, project, match } = this.props;
    const { template } = this.state;
    const editable = match.url.includes('/gen-contractor');

    if (!project) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    return (
      <Box className={classes.root}>
        {editable && (
          <Box className={classes.template}>
            <Select
              className={classes.select}
              value={template}
              onChange={this.handleChange}
              name="templates"
            >
              <MenuItem disabled value="">
                <em>Select a template</em>
              </MenuItem>
              {templates &&
                templates.content.map(row => (
                  <MenuItem value={row.id} key={row.id}>
                    {row.name}
                  </MenuItem>
                ))}
            </Select>
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={this.addTemplateToProject}
            >
              <AddIcon />
            </Fab>
            {templates
              ? templates.content.map(row =>
                row.id === template ? (
                  <ul key={row.id}>
                    <li>Name: {row.name}</li>
                    <li>Description: {row.description}</li>
                  </ul>
                ) : null
              )
              : null}
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell> Template Name </CustomTableCell>
              <CustomTableCell align="center">Template Desc</CustomTableCell>
              <CustomTableCell align="center">Template Value</CustomTableCell>
              {editable && (
                <CustomTableCell align="center">
                  <IconButton
                    style={{ color: '#fff' }}
                    onClick={() => this.setState({ openCategoryForm: true })}
                  >
                    <NoteAddIcon />
                  </IconButton>
                </CustomTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {project.projectTemplates.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell component="th" scope="row">
                  {row.template.name ? row.template.name : 'N/A'}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <Typography className="nowrap">
                    {row.template.description
                      ? removeMd(row.template.description)
                      : 'N/A'}
                  </Typography>
                </CustomTableCell>
                <CustomTableCell align="center">
                  {row.template.value ? row.template.value : 'N/A'}
                </CustomTableCell>
                {editable && (
                  <CustomTableCell align="center">
                    <IconButton
                      className={classes.button}
                      aria-label="Delete"
                      color="primary"
                      onClick={async () => {
                        try {
                          await this.props.deleteTemplate(
                            project.id,
                            row.template.id
                          );
                          await this.props.getProjectData(project.id);

                          let curPage = this.state.currentPage;
                          if (
                            this.state.rowsPerPage * this.state.currentPage <
                            project.projectTemplates.length - 1
                          ) {
                          } else {
                            curPage--;
                          }
                          await this.props.getTemplates(
                            curPage,
                            this.state.rowsPerPage
                          );
                          this.setState({
                            snackBar: true,
                            snackBarContent: 'delete template success',
                            currentPage: curPage,
                          });
                        } catch (error) {
                          console.log(error);
                          this.setState({
                            snackBar: true,
                            snackBarContent: 'delete template failed',
                          });
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CustomTableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          style={{ overflow: 'auto' }}
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={project.projectTemplates.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.currentPage}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        <Dialog
          open={this.state.openCategoryForm}
          onClose={() => this.setState({ openCategoryForm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create template</DialogTitle>
          <DialogContent>
            <DialogContentText>
              please input the correct template information
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              label="name"
              type="email"
              fullWidth
              value={this.state.name}
              onChange={val => this.setState({ name: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              label="detail"
              margin="dense"
              multiline
              rows="10"
              fullWidth
              value={this.state.description}
              onChange={val => this.setState({ description: val.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ openCategoryForm: false })}
            >
              Cancel
            </Button>
            <Button
              disabled={this.state.isSaving}
              onClick={this.createTemplate}
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
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
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  templates: state.gen_data.templates,
  project: state.global_data.project,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  getTemplates,
  addTemplate,
  createTemplate,
  deleteTemplate,
  getProjectData,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectTemplate);

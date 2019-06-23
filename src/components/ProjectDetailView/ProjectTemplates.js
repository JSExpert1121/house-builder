import React          from 'react';
import { connect }    from 'react-redux';
import PropTypes      from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress  from '@material-ui/core/CircularProgress';
import Table             from '@material-ui/core/Table';
import TableHead         from '@material-ui/core/TableHead';
import TableCell         from '@material-ui/core/TableCell';
import TableRow          from '@material-ui/core/TableRow';
import TableBody         from '@material-ui/core/TableBody';
import IconButton        from '@material-ui/core/IconButton';
import TablePagination   from '@material-ui/core/TablePagination';
import TextField         from '@material-ui/core/TextField';
import Typography        from '@material-ui/core/Typography';
import Button            from '@material-ui/core/Button';
import Snackbar          from '@material-ui/core/Snackbar';
import Select            from '@material-ui/core/Select';
import MenuItem          from '@material-ui/core/MenuItem';
import Dialog            from '@material-ui/core/Dialog';
import DialogActions     from '@material-ui/core/DialogActions';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle       from '@material-ui/core/DialogTitle';
import Fab               from '@material-ui/core/Fab';
import Box               from '@material-ui/core/Box';

import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon  from '@material-ui/icons/Delete';
import AddIcon     from '@material-ui/icons/Add';

import removeMd from 'remove-markdown';

import { addTemplate, deleteTemplate, getTemplates } from '../../actions/gen-actions';
import { getProjectData }                            from '../../actions/global-actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 64px - 100px - 16px)',
    margin: theme.spacing(1),
  },
  tableWrap: {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 64px - 100px - 48px - 40px)',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    padding: '6px',
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

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    color: theme.palette.primary.light,
  },
}))(TableCell);

class ConnectedProjectTemplateView extends React.Component {
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
    this.props.getTemplates(0, 20);
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

  createSortHandler = () => {
    let order = 'desc';

    if (this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order });
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

    if (project === null) {
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
              onClick={() =>
                this.props.addTemplate(project.id, template, result => {
                  this.setState({ template: '' });
                  if (result) this.props.getProjectData(project.id);
                })
              }
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
        <Box className={classes.tableWrap}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <CustomTableCell> Template Name </CustomTableCell>
                <CustomTableCell align="center">Template Desc</CustomTableCell>
                <CustomTableCell align="center">Template Value</CustomTableCell>
                {editable && (
                  <CustomTableCell align="center">
                    <IconButton
                      className={classes.button}
                      style={{ color: '#FFFFFF' }}
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
        </Box>
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
          <DialogTitle id="form-dialog-title">create template</DialogTitle>
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
              disabled={this.state.isSaving}
              onClick={() => this.setState({ openCategoryForm: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={this.state.isSaving}
              onClick={async () => {
                this.setState({ isSaving: true });
                const { userProfile } = this.props;
                const data = {
                  name: this.state.name,
                  description: this.state.description,
                  updatedBy: userProfile.email,
                };

                await this.props.createProject(data, res => {
                  this.setState({
                    snackBar: true,
                    snackBarContent: res
                      ? 'create template success'
                      : 'create template failed',
                  });
                });
                await this.props.getContrators0(0, this.state.rowsPerPage);

                this.setState({
                  openCategoryForm: false,
                  isSaving: false,
                  name: '',
                  description: '',
                });
              }}
              color="primary"
            >
              Add{' '}
              {this.state.isSaving && (
                <CircularProgress size={24} thickness={4} />
              )}
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

const mapStateToProps = state => {
  return {
    templates: state.gen_data.templates,
    project: state.global_data.project,
    userProfile: state.global_data.userProfile,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTemplates: (page, size) => dispatch(getTemplates(page, size)),
    addTemplate: (project, template) =>
      dispatch(addTemplate(project, template)),
    deleteTemplate: (project, template) =>
      dispatch(deleteTemplate(project, template)),
    getProjectData: id => dispatch(getProjectData(id)),
  };
};
const ProjectTemplateView = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedProjectTemplateView);

ProjectTemplateView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectTemplateView);

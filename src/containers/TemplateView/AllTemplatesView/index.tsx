import Button                                                            from '@material-ui/core/Button';
import CircularProgress                                                  from '@material-ui/core/CircularProgress';
import Dialog                                                            from '@material-ui/core/Dialog';
import DialogActions                                                     from '@material-ui/core/DialogActions';
import DialogContent                                                     from '@material-ui/core/DialogContent';
import DialogContentText                                                 from '@material-ui/core/DialogContentText';
import DialogTitle                                                       from '@material-ui/core/DialogTitle';
import IconButton                                                        from '@material-ui/core/IconButton';
import Paper                                                             from '@material-ui/core/Paper';
import Snackbar                                                          from '@material-ui/core/Snackbar';
import { createStyles, withStyles }                                      from '@material-ui/core/styles';
import Table                                                             from '@material-ui/core/Table';
import TableBody                                                         from '@material-ui/core/TableBody';
import TableHead                                                         from '@material-ui/core/TableHead';
import TablePagination      from '@material-ui/core/TablePagination';
import TableRow             from '@material-ui/core/TableRow';
import TextField            from '@material-ui/core/TextField';
import DeleteIcon           from '@material-ui/icons/Delete';
import NoteAddIcon          from '@material-ui/icons/NoteAdd';
import 'easymde/dist/easymde.min.css';
import CustomTableCell      from "components/shared/CustomTableCell";
import { History }          from 'history';
import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { withRouter }       from 'react-router-dom';
import SimpleMDE            from 'react-simplemde-editor';
import { compose }          from "redux";
import removeMd                                                          from 'remove-markdown';
import { createTemplate, deleteTemplate, getTemplatesO, selectTemplate } from '../../../actions/tem-actions';
import { MaterialThemeHOC, UserProfile }                                 from '../../../types/global';

const styles = theme => createStyles({
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
  successAlert: {
    marginBottom: '10px',
  },
  editField: {
    lineHeight: '1.5rem',
  },
});

interface ConnAllTemplateViewProps extends MaterialThemeHOC {
  getTemplatesO: (currentPage: number, rowsPerPage: number) => any;
  templates: any;
  history: History;
  selectTemplate: (id: number) => any;
  deleteTemplate: (id: number, cb: any) => any;
  createTemplate: (data: any, cb: any) => any;
  userProfile: UserProfile;
}

interface ConnAllTemplateViewState {
  rowsPerPage: number;
  currentPage: number;
  isSaving: boolean;
  openCategoryForm: boolean;
  name: any;
  description: any;
  snackBar: boolean;
  SnackBarContent: any;
}

class AllTemplateView extends Component<
  ConnAllTemplateViewProps,
  ConnAllTemplateViewState
> {
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
    };
  }

  componentDidMount() {
    this.props.getTemplatesO(0, 20);
  }

  handleChangePage = (event, page) => {
    this.setState({ currentPage: page });

    this.props.getTemplatesO(page, this.state.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    const { templates } = this.props;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= templates.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getTemplatesO(currentPage, rowsPerPage);
  };

  render() {
    const { classes, templates } = this.props;

    if (templates === null) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell> Template Name </CustomTableCell>
              <CustomTableCell align="center">
                Template Description
              </CustomTableCell>
              <CustomTableCell align="center">
                <IconButton
                  style={{ color: '#FFFFFF' }}
                  onClick={() => this.setState({ openCategoryForm: true })}
                >
                  <NoteAddIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.content.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell
                  component="th"
                  scope="row"
                  onClick={async () => {
                    await this.props.selectTemplate(row.id);
                    this.props.history.push('/m_temp/template_detail');
                  }}
                >
                  {row.name}
                </CustomTableCell>
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectTemplate(row.id);
                    this.props.history.push('/m_temp/template_detail');
                  }}
                >
                  {removeMd(row.description)}
                </CustomTableCell>

                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    color="primary"
                    onClick={async () => {
                      await this.props.deleteTemplate(row.id, result => {
                        this.setState({
                          snackBar: true,
                          SnackBarContent: result
                            ? 'delete template success'
                            : 'please delete categories',
                        });
                      });

                      if (
                        this.state.rowsPerPage * this.state.currentPage <
                        templates.totalElements - 1
                      ) {
                        await this.props.getTemplatesO(
                          this.state.currentPage,
                          this.state.rowsPerPage
                        );
                      } else {
                        const currentPage = this.state.currentPage - 1;

                        this.setState({
                          currentPage: currentPage,
                        });

                        await this.props.getTemplatesO(
                          currentPage,
                          this.state.rowsPerPage
                        );
                      }
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
          count={templates.totalElements}
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
            // @ts-ignore
            <SimpleMDE
              styles={{
                height: '209px',
                overflow: 'auto',
                marginBottom: '8px',
              }}
              value={this.state.description}
              onChange={val => this.setState({ description: val })}
              options={{
                placeholder: 'Description here',
              }}
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

                await this.props.createTemplate(data, res => {
                  this.setState({
                    snackBar: true,
                    SnackBarContent: res
                      ? 'create template success'
                      : 'create template failed',
                  });
                });
                await this.props.getTemplatesO(0, this.state.rowsPerPage);

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
          message={<span id="message-id"> {this.state.SnackBarContent}</span>}
        />
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  templates: state.tem_data.templates,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  getTemplatesO,
  selectTemplate,
  deleteTemplate,
  createTemplate,
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AllTemplateView)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { createStyles, withStyles } from '@material-ui/core/styles';

import { History } from 'history';
import 'easymde/dist/easymde.min.css';
import SimpleMDE from 'react-simplemde-editor';
import SplitPane from 'react-split-pane';
import Button from "components/CustomButtons/Button.jsx";
import CustomTableCell from "components/shared/CustomTableCell";
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import {
  addCategory,
  deleteCategory,
  deleteTemplate,
  editTemplate,
  selectCategory,
  selectTemplate,
} from 'actions/tem-actions';
import {
  MaterialThemeHOC,
  UserProfile
} from 'types/global';

const styles = theme => createStyles({
  descTag: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    margin: theme.spacing(1),
    borderBottom: '5px solid ' + theme.palette.primary.light,
    height: 'calc((100vh - 64px - 48px - 16px) / 2)',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 64px - 48px - 16px)',
    },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  },
  marginRight: {
    marginRight: "5px"
  },
  cateList: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    margin: theme.spacing(1),
    borderBottom: '5px solid ' + theme.palette.primary.light,
    height: 'calc((100vh - 64px - 48px - 16px) / 2)',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 64px - 48px - 16px)',
    },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50vw - 10px)',
    top: 'calc(50vh - 10px)',
  },
  successAlert: {
    margin: theme.spacing(1),
  },
  editField: {
    lineHeight: '1.5rem',
  },
});

interface ConnTempDetailViewProps extends MaterialThemeHOC {
  selectCategory: typeof selectCategory;
  addCategory: typeof addCategory;
  selectTemplate: typeof selectTemplate;
  deleteCategory: typeof deleteCategory;
  editTemplate: typeof editTemplate;
  deleteTemplate: typeof deleteTemplate;
  template: any;
  history: History;
  userProfile: UserProfile;
}

interface ConnTempDetailViewState extends ISnackbarProps {
  name: any;
  description: any;
  cname: any;
  ctype: any;
  cvalue: any;
  cdescription: any;
  openCategoryForm: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isAdding: boolean;
}

class TemplateDetailView extends Component<
  ConnTempDetailViewProps,
  ConnTempDetailViewState
  > {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      cname: '',
      ctype: '',
      cvalue: '',
      cdescription: '',
      openCategoryForm: false,
      isSaving: false,
      isDeleting: false,
      isAdding: false,
      showMessage: false,
      message: '',
      variant: 'success',
      handleClose: this.closeMessage
    };
  }

  closeMessage = () => {
    this.setState({ showMessage: false });
  }

  async componentDidMount() {
    const { template } = this.props;
    if (!template) return;

    if (template['isLoading'] !== true)
      await this.props.selectTemplate(template.id);

    this.setState({
      name: template.name,
      description: template.description,
    });
  }

  render() {
    const { classes, template } = this.props;

    if (!template) return <Box></Box>;
    if (template['isLoading'] === true)
      return <CircularProgress className={classes.waitingSpin} />;

    return (
      <Box>
        <SplitPane
          split="vertical"
          minSize={50}
          defaultSize={400}
          style={{ position: 'relative' }}
        >
          <Paper className={classes.descTag}>
            <TextField
              label="template title"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.name}
              onChange={val => this.setState({ name: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <SimpleMDE
              value={this.state.description}
              onChange={val => this.setState({ description: val })}
              options={{
                placeholder: 'Description here',
              }}
            />
            <Box>
              <Button
                disabled={this.state.isSaving}
                className={classes.marginRight}
                onClick={() => this.props.history.push('/m_temp')}
                color="warning"
              >
                Cancel
              </Button>
              <Button
                className={classes.marginRight}
                disabled={this.state.isSaving}
                onClick={async () => {
                  this.setState({ isSaving: true });
                  const { userProfile } = this.props;
                  const data = {
                    name: this.state.name,
                    description: this.state.description,
                    updatedBy: userProfile.email,
                  };

                  try {
                    await this.props.editTemplate(template.id, data);
                    await this.props.selectTemplate(template.id);

                    this.setState({
                      showMessage: true,
                      message: 'edit template success',
                      variant: 'success'
                    });
                  } catch (error) {
                    console.log(error);
                    this.setState({
                      showMessage: true,
                      message: 'edit template success',
                      variant: 'error'
                    });
                  }

                  this.setState({ isSaving: false });
                }}
                color="success"
              >
                Save
                {this.state.isSaving && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
              <Button
                disabled={this.state.isDeleting}
                onClick={async () => {
                  this.setState({ isDeleting: true });
                  try {
                    await this.props.deleteTemplate(template.id);
                    this.setState({
                      showMessage: true,
                      message: 'Template deleted',
                      variant: 'success',
                      isDeleting: false
                    });
                  } catch (error) {
                    this.setState({
                      showMessage: true,
                      message: 'please delete categories and options first',
                      variant: 'error',
                      isDeleting: false
                    });
                  }
                }}
                color="danger"
              >
                Delete
                {this.state.isDeleting && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
            </Box>
          </Paper>
          <Paper className={classes.cateList}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell> Category Name </CustomTableCell>
                  <CustomTableCell align="center">Type</CustomTableCell>
                  <CustomTableCell align="center">Value</CustomTableCell>
                  <CustomTableCell align="center">
                    <IconButton
                      style={{ color: '#fff' }}
                      onClick={() => this.setState({ openCategoryForm: true })}
                    >
                      <NoteAddIcon />
                    </IconButton>
                  </CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {template.categoryList.map(row => (
                  <TableRow className={classes.row} key={row.id} hover>
                    <CustomTableCell
                      component="th"
                      scope="row"
                      onClick={async () => {
                        await this.props.selectCategory(row.id);
                        this.props.history.push('/m_temp/category_detail');
                      }}
                    >
                      {row.name}
                    </CustomTableCell>
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectCategory(row.id);
                        this.props.history.push('/m_temp/category_detail');
                      }}
                    >
                      {row.type}
                    </CustomTableCell>
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectCategory(row.id);
                        this.props.history.push('/m_temp/category_detail');
                      }}
                    >
                      {row.value}
                    </CustomTableCell>

                    <CustomTableCell align="center">
                      <IconButton
                        className={classes.button}
                        aria-label="Delete"
                        color="primary"
                        onClick={async () => {
                          try {
                            await this.props.deleteCategory(row.id);
                            await this.props.selectTemplate(template.id);
                            this.setState({
                              showMessage: true,
                              message: 'Delete Category success',
                              variant: 'success'
                            });
                          } catch (error) {
                            this.setState({
                              showMessage: true,
                              message: 'Please delete options',
                              variant: 'error'
                            });
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
          </Paper>
        </SplitPane>
        <Dialog
          open={this.state.openCategoryForm}
          onClose={() => this.setState({ openCategoryForm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              please input the correct category information
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="name"
              type="email"
              fullWidth
              value={this.state.cname}
              onChange={val => this.setState({ cname: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              margin="dense"
              label="type"
              type="text"
              fullWidth
              value={this.state.ctype}
              onChange={val => this.setState({ ctype: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              margin="dense"
              label="value"
              type="text"
              fullWidth
              value={this.state.cvalue}
              onChange={val => this.setState({ cvalue: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <SimpleMDE
              value={this.state.cdescription}
              onChange={val => this.setState({ cdescription: val })}
              options={{
                placeholder: 'Description here',
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={this.state.isAdding}
              onClick={() => this.setState({ openCategoryForm: false })}
            >
              Cancel
            </Button>
            <Button
              disabled={this.state.isAdding}
              onClick={async () => {
                this.setState({ isAdding: true });
                const { userProfile } = this.props;
                const data = {
                  name: this.state.cname,
                  type: this.state.ctype,
                  value: this.state.cvalue,
                  description: this.state.cdescription,
                  updatedBy: userProfile.email,
                };

                try {
                  await this.props.addCategory(template.id, data);
                  await this.props.selectTemplate(template.id);
                  this.setState({
                    showMessage: true,
                    message: 'Add Category success',
                    variant: 'success',
                    openCategoryForm: false,
                    isAdding: false,
                    cname: '',
                    ctype: '',
                    cvalue: '',
                    cdescription: ''
                  });
                } catch (error) {
                  this.setState({
                    showMessage: true,
                    message: 'Add Category failed',
                    variant: 'error',
                    openCategoryForm: false,
                    isAdding: false
                  });
                }
              }}
              color="primary"
            >
              Add
              {this.state.isAdding && (
                <CircularProgress size={24} thickness={4} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
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
  template: state.tem_data.selectedTemplate,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  selectTemplate,
  selectCategory,
  deleteCategory,
  addCategory,
  editTemplate,
  deleteTemplate,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(TemplateDetailView)

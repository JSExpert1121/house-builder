import React, { Component }         from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
}                                   from '@material-ui/core';
import Dialog                       from '@material-ui/core/Dialog';
import DialogActions                from '@material-ui/core/DialogActions';
import DialogContent                from '@material-ui/core/DialogContent';
import DialogContentText            from '@material-ui/core/DialogContentText';
import DialogTitle          from '@material-ui/core/DialogTitle';

import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon  from '@material-ui/icons/Delete';
import SimpleMDE   from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import { connect } from 'react-redux';
import {
  addCategory,
  deleteCategory,
  deleteTemplate,
  editTemplate,
  selectCategory,
  selectTemplate,
}                  from '../../../actions/tem-actions';

import SplitPane                         from 'react-split-pane';
import { MaterialThemeHOC, UserProfile } from '../../../types/global';
import { History }                       from 'history';
import { compose } from 'redux';

const styles = theme => createStyles({
  descTag: {
    padding: theme.spacing(1),
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
  halfWidth: {
    width: 'calc(33% - 20px)',
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

interface ConnTempDetailViewState {
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
  snackBar: boolean;
  snackBarContent: any;
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
      snackBar: false,
      snackBarContent: '',
    };
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

    if (template === null) return <div></div>;
    if (template['isLoading'] === true)
      return <CircularProgress className={classes.waitingSpin} />;

    return (
      <div>
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
            <div>
              <Button
                disabled={this.state.isSaving}
                className={classes.halfWidth}
                onClick={() => this.props.history.push('/m_temp')}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                className={classes.halfWidth}
                disabled={this.state.isSaving}
                onClick={async () => {
                  this.setState({ isSaving: true });
                  const { userProfile } = this.props;
                  const data = {
                    name: this.state.name,
                    description: this.state.description,
                    updatedBy: userProfile.email,
                  };

                  await this.props.editTemplate(template.id, data, res => {
                    this.setState({
                      snackBar: true,
                      snackBarContent: res
                        ? 'edit template success'
                        : 'edit template failed',
                    });
                  });
                  await this.props.selectTemplate(template.id);

                  this.setState({ isSaving: false });
                }}
                color="primary"
              >
                Save{' '}
                {this.state.isSaving && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
              <Button
                disabled={this.state.isDeleting}
                className={classes.halfWidth}
                onClick={async () => {
                  this.setState({ isDeleting: true });
                  await this.props.deleteTemplate(template.id, result => {
                    if (result) {
                      this.props.history.push('/m_temp');
                      return;
                    }

                    this.setState({
                      snackBar: true,
                      snackBarContent:
                        'please delete categories and options first',
                    });
                  });
                  this.setState({ isDeleting: false });
                }}
                color="primary"
              >
                Delete
                {this.state.isDeleting && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
            </div>
          </Paper>
          <Paper className={classes.cateList}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <CustomTableCell> Category Name </CustomTableCell>
                  <CustomTableCell align="center">Type</CustomTableCell>
                  <CustomTableCell align="center">Value</CustomTableCell>
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
                          await this.props.deleteCategory(row.id, res => {
                            this.setState({
                              snackBar: true,
                              snackBarContent: res
                                ? 'delete category success'
                                : 'please delete options',
                            });

                            if (res === true)
                              this.props.selectTemplate(template.id);
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
          </Paper>
        </SplitPane>
        <Dialog
          open={this.state.openCategoryForm}
          onClose={() => this.setState({ openCategoryForm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">create category</DialogTitle>
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
            // @ts-ignore
            <SimpleMDE
              style={{
                height: '209px',
                overflow: 'auto',
                marginBottom: '8px',
                textAlign: 'left',
              }}
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
              color="primary"
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

                await this.props.addCategory(template.id, data, res => {
                  this.setState({
                    snackBar: true,
                    snackBarContent: res
                      ? 'add category success'
                      : 'add category failed',
                  });
                });
                await this.props.selectTemplate(template.id);

                this.setState({
                  openCategoryForm: false,
                  isAdding: false,
                  cname: '',
                  ctype: '',
                  cvalue: '',
                  cdescription: '',
                });
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
      </div>
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

import Button               from '@material-ui/core/Button';
import CircularProgress     from '@material-ui/core/CircularProgress';
import Dialog               from '@material-ui/core/Dialog';
import DialogActions        from '@material-ui/core/DialogActions';
import DialogContent        from '@material-ui/core/DialogContent';
import DialogContentText    from '@material-ui/core/DialogContentText';
import DialogTitle          from '@material-ui/core/DialogTitle';
import IconButton           from '@material-ui/core/IconButton';
import Link                 from '@material-ui/core/Link';
import Paper                from '@material-ui/core/Paper';
import Snackbar             from '@material-ui/core/Snackbar';
import {
  createStyles,
  Theme,
  withStyles
}                           from '@material-ui/core/styles';
import Table                from '@material-ui/core/Table';
import TableBody            from '@material-ui/core/TableBody';
import TableHead            from '@material-ui/core/TableHead';
import TableRow             from '@material-ui/core/TableRow';
import TextField            from '@material-ui/core/TextField';
import DeleteIcon           from '@material-ui/icons/Delete';
import NoteAddIcon          from '@material-ui/icons/NoteAdd';
import {
  addOption,
  deleteCategory,
  deleteOption,
  editCategory,
  selectCategory,
  selectOption,
  selectTemplate,
}                           from 'actions/tem-actions';
import CustomTableCell      from "components/shared/CustomTableCell";
import 'easymde/dist/easymde.min.css';
import { History }          from 'history';
import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { withRouter }       from 'react-router-dom';
import SimpleMDE            from 'react-simplemde-editor';
import SplitPane            from 'react-split-pane';
import { compose }          from "redux";

import { MaterialThemeHOC, UserProfile, } from 'types/global';

const styles = (theme: Theme) => createStyles({
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
  marginRight: {
    width: 'calc(33% - 20px)',
  },
  optList: {
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
  editField: {
    lineHeight: '1.5rem',
  },
});

interface ConnCategoryDetailViewProps extends MaterialThemeHOC {
  category: any;
  selectTemplate: (id: number) => any;
  history: History;
  editCategory: (id: number, data: any, cb: any) => any;
  addOption: (id: number, data: any, cb: any) => any;
  userProfile: UserProfile;
  selectCategory: (id: number) => any;
  deleteCategory: (id: number, cb: any) => any;
  selectOption: (id: number) => any;
  deleteOption: (id: number, cb: any) => any;
}

interface ConnCategoryDetailViewState {
  name: any;
  type: any;
  value: any;
  description: any;
  oname: any;
  ovalue: any;
  oid: any;
  odescription: any;
  openCategoryForm: boolean;
  isSaving: boolean;
  template: any;
  isDeleting: boolean;
  isAdding: boolean;
  snackBar: boolean;
  snackBarContent: any;
}

class CategoryDetailView extends Component<
  ConnCategoryDetailViewProps,
  ConnCategoryDetailViewState
> {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      type: '',
      value: '',
      description: '',
      oname: '',
      ovalue: '',
      oid: '',
      odescription: '',
      openCategoryForm: false,
      isSaving: false,
      template: null,
      isDeleting: false,
      isAdding: false,
      snackBar: false,
      snackBarContent: '',
    };
  }

  async componentDidMount() {
    const { category } = this.props;
    if (!category) return;

    this.setState({
      name: category.name,
      type: category.type,
      value: category.value,
      description: category.description,
    });
  }

  render() {
    const { classes, category } = this.props;

    if (category === null) return <div> </div>;

    if (category['isLoading'] === true)
      return <CircularProgress className={classes.waitingSpin} />;

    return (
      <div>
        <SplitPane
          minSize={50}
          defaultSize={400}
          style={{ position: 'relative' }}
        >
          <Paper className={classes.descTag}>
            <div>
              <Link
                style={{ float: 'left' }}
                onClick={async () => {
                  await this.props.selectTemplate(category.tem_name.id);
                  this.props.history.push('/m_temp/template_detail');
                }}
              >
                {category.tem_name.name}
              </Link>
            </div>
            <TextField
              label="category name"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.name}
              onChange={val => this.setState({ name: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              label="category type"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.type}
              onChange={val => this.setState({ type: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              label="category value"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.value}
              onChange={val => this.setState({ value: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            // @ts-ignore:
            <SimpleMDE
              style={{
                height: '209px',
                overflow: 'auto',
                marginBottom: '8px',
                textAlign: 'left',
              }}
              value={this.state.description}
              onChange={val => this.setState({ description: val })}
              options={{
                placeholder: 'Description here',
              }}
            />
            <div>
              <Button
                className={classes.marginRight}
                disabled={this.state.isSaving}
                onClick={() =>
                  this.props.history.push('/m_temp/template_detail')
                }
                color="primary"
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
                    type: this.state.type,
                    value: this.state.value,
                    description: this.state.description,
                    updatedBy: userProfile.email,
                  };

                  await this.props.editCategory(category.id, data, res => {
                    this.setState({
                      snackBar: true,
                      snackBarContent: res
                        ? 'edit category success'
                        : 'edit category failed',
                    });
                  });

                  await this.props.selectCategory(category.id);

                  this.setState({ openCategoryForm: false, isSaving: false });
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
                className={classes.marginRight}
                onClick={async () => {
                  this.setState({ isDeleting: true });
                  await this.props.deleteCategory(category.id, result => {
                    if (result) {
                      this.props.history.push('/m_temp/template_detail');
                      return;
                    }

                    this.setState({
                      snackBar: true,
                      snackBarContent: 'failed, please delete options',
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

          <Paper className={classes.optList}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell> Option Name </CustomTableCell>
                  <CustomTableCell align="center">Value</CustomTableCell>
                  <CustomTableCell align="center">
                    <IconButton
                      style={{ color: '#FFFFFF' }}
                      onClick={() =>
                        this.setState({
                          oname: '',
                          ovalue: '',
                          odescription: '',
                          oid: '',
                          openCategoryForm: true,
                        })
                      }
                    >
                      <NoteAddIcon />
                    </IconButton>
                  </CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category.optionList.map(row => (
                  <TableRow className={classes.row} key={row.id} hover>
                    <CustomTableCell
                      component="th"
                      scope="row"
                      onClick={async () => {
                        await this.props.selectOption(row.id);
                        this.props.history.push('/m_temp/option_detail');
                      }}
                    >
                      {row.name}
                    </CustomTableCell>
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectOption(row.id);
                        this.props.history.push('/m_temp/option_detail');
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
                          await this.props.deleteOption(row.id, res => {
                            this.setState({
                              snackBar: true,
                              snackBarContent: res
                                ? 'delete option success'
                                : 'delete option failed',
                            });
                          });
                          await this.props.selectCategory(category.id);
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
          <DialogTitle id="form-dialog-title"> create option</DialogTitle>
          <DialogContent>
            <DialogContentText>
              please input the correct option information
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="name"
              type="email"
              fullWidth
              value={this.state.oname}
              onChange={val => this.setState({ oname: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              margin="dense"
              label="value"
              type="text"
              fullWidth
              value={this.state.ovalue}
              onChange={val => this.setState({ ovalue: val.target.value })}
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
              value={this.state.odescription}
              onChange={val => this.setState({ odescription: val })}
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
              disabled={this.state.isAdding}
              onClick={async () => {
                this.setState({ isAdding: true });
                const { userProfile } = this.props;
                const data = {
                  name: this.state.oname,
                  value: this.state.ovalue,
                  description: this.state.odescription,
                  updatedBy: userProfile.email,
                };

                await this.props.addOption(category.id, data, res => {
                  this.setState({
                    snackBar: true,
                    snackBarContent: res
                      ? 'add option success'
                      : 'add option failed',
                  });
                });
                await this.props.selectCategory(category.id);

                this.setState({ openCategoryForm: false, isAdding: false });
              }}
              color="primary"
            >
              Add{' '}
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
  category: state.tem_data.selectedCategory,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  selectTemplate,
  deleteOption,
  selectCategory,
  addOption,
  editCategory,
  selectOption,
  deleteCategory,
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CategoryDetailView)

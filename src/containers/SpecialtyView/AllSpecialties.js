import CircularProgress                                   from '@material-ui/core/CircularProgress';
import Dialog                                             from '@material-ui/core/Dialog';
import DialogActions                                      from '@material-ui/core/DialogActions';
import DialogContent                                      from '@material-ui/core/DialogContent';
import DialogContentText                                  from '@material-ui/core/DialogContentText';
import DialogTitle                                        from '@material-ui/core/DialogTitle';
import Paper                                              from '@material-ui/core/Paper';
import Snackbar                                           from '@material-ui/core/Snackbar';
import {withStyles}                                       from '@material-ui/core/styles';
import TablePagination                                    from '@material-ui/core/TablePagination';
import TextField                                          from '@material-ui/core/TextField';
import React, {Component}                                 from 'react';
import {connect}                                          from 'react-redux';
import {compose}                                          from 'redux';
import {createSpec, deleteSpec, loadSpecs, specSelected,} from '../../actions/spec-actions';
import Button                                             from '../../components/CustomButtons/Button';
import SpecTableView                                      from './SpecTableView';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  tableWrap: {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 64px - 48px - 48px - 16px)',
  },
  relative: {
    position: 'relative',
    left: '0px',
    top: '0px',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 16px)',
    top: 'calc(50% - 16px)',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class AllSpecialties extends Component {
  state = {
    loading: true,
    success: true,
    errorMsg: '',
    showNewDlg: false,
    showConfirmDlg: false,
    saving: false,
    newSpec: {
      name: '',
      value: '',
      description: '',
    },
  };

  async componentDidMount() {
    if (this.props.dirty) {
      try {
        this.setState({ loading: true });
        await this.props.loadPage(this.props.pageNo, this.props.pageSize);
        this.setState({ loading: false, success: true });
      } catch (error) {
        console.log('error', error);
        this.setState({
          loading: false,
          success: false,
          errorMsg: 'specialties loading failed',
        });
      }
    } else {
      this.setState({ loading: false, success: true });
    }
  }

  showAddDialog = () => {
    this.setState({
      showNewDlg: true,
      saving: false,
      newSpec: { name: '', value: '', description: '' },
    });
  };

  showConfirmDialog = () => {
    this.setState({ showConfirmDlg: true, saving: false });
  };

  closeConfirmDialog = () => {
    this.setState({ showConfirmDlg: false });
  };

  handleAdd = async spec => {
    const data = { ...spec, updatedBy: this.props.userProfile.email };

    this.setState({ saving: true });

    try {
      await this.props.createSpec(data);
      await this.props.loadPage(this.props.pageNo, this.props.pageSize);
      this.setState({ saving: false, showNewDlg: false, success: true });
    } catch (error) {
      this.setState({
        saving: false,
        showNewDlg: false,
        success: false,
        errorMsg: 'specialty adding failed',
      });
    }
  };

  handleDelete = async specid => {
    this.specid = specid;
    this.showConfirmDialog();
  };

  handleDelSpec = async () => {
    if (!this.specid) return;

    this.setState({ saving: true });
    try {
      await this.props.deleteSpec(this.specid);
      await this.props.loadPage(this.props.pageNo, this.props.pageSize);
      this.setState({ showConfirmDlg: false, success: true, saving: false });
    } catch (error) {
      this.setState({
        showConfirmDlg: false,
        success: false,
        saving: false,
        errorMsg: 'specialty deleting failed',
      });
    }
  };

  handleSelect = async specid => {
    this.props.selectSpec(specid);
    this.props.history.push('/m_spec/specialty_detail');
  };

  handleChangePage = async (event, page) => {
    if (page >= this.props.totalPages) page = this.props.totalPages - 1;
    try {
      this.setState({ loading: true });
      await this.props.loadPage(page, this.props.pageSize);
      this.setState({ loading: false, success: true });
    } catch (error) {
      this.setState({
        loading: false,
        success: false,
        errorMsg: 'Page changing failed',
      });
    }
  };

  handleChangeRowsPerPage = async event => {
    const curIndex = this.props.pageNo * this.props.pageSize;
    const pageSize = event.target.value;
    const pageNo = Math.floor(curIndex / pageSize);

    try {
      this.setState({ loading: true });
      await this.props.loadPage(pageNo, pageSize);
      this.setState({ loading: false, success: true });
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
        success: false,
        errorMsg: 'PageSize changing failed',
      });
    }
  };

  hideSnack = () => {
    this.setState({ success: true });
  };

  render() {
    const { classes, specialties, totalItems, pageSize, pageNo } = this.props;
    if (this.state.loading) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    return (
      <Paper className={classes.root}>
        <SpecTableView
          specialties={specialties}
          handleDelete={this.handleDelete}
          handleAdd={this.showAddDialog}
          handleSelect={this.handleSelect}
        />
        <TablePagination
          style={{ overflow: 'auto' }}
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={totalItems}
          rowsPerPage={pageSize}
          page={pageNo}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={!this.state.success}
          onClose={this.hideSnack}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          autoHideDuration={4000}
          message={<span id="message-id">{this.state.errorMsg}</span>}
        />
        <Dialog
          open={this.state.showNewDlg}
          onClose={() => this.setState({ showNewDlg: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Specialty</DialogTitle>
          <DialogContent className={classes.relative}>
            {this.state.saving && (
              <CircularProgress
                size={32}
                thickness={4}
                className={classes.busy}
              />
            )}
            <DialogContentText>
              please input the correct specialty information
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              label="name"
              fullWidth
              value={this.state.newSpec.name}
              onChange={val =>
                this.setState({
                  newSpec: { ...this.state.newSpec, name: val.target.value },
                })
              }
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              margin="normal"
              label="value"
              fullWidth
              value={this.state.newSpec.value}
              onChange={val =>
                this.setState({
                  newSpec: { ...this.state.newSpec, value: val.target.value },
                })
              }
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              label="description"
              margin="dense"
              multiline
              rows="6"
              fullWidth
              value={this.state.newSpec.description}
              onChange={val =>
                this.setState({
                  newSpec: {
                    ...this.state.newSpec,
                    description: val.target.value,
                  },
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={this.state.saving}
              onClick={() => this.setState({ showNewDlg: false })}
            >
              Cancel
            </Button>
            <Button
              disabled={this.state.saving}
              onClick={() => this.handleAdd(this.state.newSpec)}
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.showConfirmDlg}
          onClose={this.closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
          <DialogContent className={classes.relative}>
            {this.state.saving && (
              <CircularProgress
                size={32}
                thickness={4}
                className={classes.busy}
              />
            )}
            <DialogContentText id="alert-dialog-description">
              Do you really want to delete this specialty?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirmDialog} autoFocus>
              Cancel
            </Button>
            <Button onClick={this.handleDelSpec} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  specialties: state.spec_data.specialties,
  totalPages: state.spec_data.totalPages,
  totalItems: state.spec_data.totalItems,
  pageNo: state.spec_data.currentPage,
  pageSize: state.spec_data.pageSize,
  dirty: state.spec_data.dirty,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  loadPage:loadSpecs,
  deleteSpec,
  createSpec,
  selectSpec:specSelected,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AllSpecialties);

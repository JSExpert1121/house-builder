import React     from 'react';
import {connect} from 'react-redux';

import PropTypes    from 'prop-types';
import {withStyles} from '@material-ui/styles';
import Table        from '@material-ui/core/Table';
import TableBody    from '@material-ui/core/TableBody';
import TableHead    from '@material-ui/core/TableHead';
import TableRow     from '@material-ui/core/TableRow';
import IconButton   from '@material-ui/core/IconButton';

import DeleteIcon  from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import CustomTableCell     from '../shared/CustomTableCell';
import CustomizedSnackbars from '../shared/CustomSnackbar';

import {DropzoneDialog}                                              from 'material-ui-dropzone';
import {addFilesToProposal, deleteProposalFile, getProposalDetails,} from '../../actions/index';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(1),
    height: 'calc(100vh - 64px - 48px - 36px - 16px)',
    overflow: 'auto',
    overflowX: 'hidden',
  },
  button: {
    padding: '6px',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class ConnectedProposalDetailFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openUploadForm: false,
      showMessage: false,
      message: '',
      variant: 'success',
    };
  }

  handleUploadFiles = async files => {
    const { proposal } = this.props;

    let variant = 'success';
    let message = 'File Upload Success';

    try {
      await this.props.addFilesToProposal(proposal.proposal.id, files);
      await this.props.getProposalDetails(proposal.proposal.id);
    } catch (error) {
      console.log(error);
      message = 'File Upload failed';
      variant = 'error';
    }

    this.setState({
      showMessage: true,
      openUploadForm: false,
      message,
      variant,
    });
  };

  handleDeletefile = async name => {
    const { proposal } = this.props;
    let variant = 'success';
    let message = 'File Delete Success';

    try {
      await this.props.deleteProposalFile(proposal.proposal.id, name);
      await this.props.getProposalDetails(proposal.proposal.id);
    } catch (error) {
      console.log(error);
      message = 'File Delete failed';
      variant = 'error';
    }

    this.setState({
      showMessage: true,
      openUploadForm: false,
      message,
      variant,
    });
  };

  openUpload = () => {
    const { proposal } = this.props;
    if (!proposal.proposal.id) {
      this.setState({
        showMessage: true,
        openUploadForm: false,
        message: 'You must submit a proposal first',
        variant: 'info',
      });
      return;
    }

    this.setState({ openUploadForm: true, showMessage: false });
  };

  render() {
    const { classes, proposal } = this.props;
    if (!proposal) {
      return <div>No Proposal selected</div>;
    }

    return (
      <div className={classes.root}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Name</CustomTableCell>
              {this.props.edit && (
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    style={{ color: '#FFFFFF' }}
                    aria-label="Add"
                    onClick={this.openUpload}
                  >
                    <NoteAddIcon />
                  </IconButton>
                </CustomTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {proposal.proposal.proposalFiles &&
              proposal.proposal.proposalFiles.map(row => (
                <TableRow key={row.id} hover>
                  <CustomTableCell align="center">
                    <a
                      download={row.name}
                      href={
                        process.env.PROJECT_API +
                        '/proposals/' +
                        proposal.proposal.id +
                        '/files/' +
                        row.name
                      }
                    >
                      {row.name}
                    </a>
                  </CustomTableCell>
                  {this.props.edit && (
                    <CustomTableCell align="center">
                      <IconButton
                        className={classes.button}
                        aria-label="Delete"
                        color="primary"
                        onClick={() => this.handleDeletefile(row.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CustomTableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <DropzoneDialog
          open={this.state.openUploadForm}
          onSave={this.handleUploadFiles}
          maxFileSize={52428800}
          showFileNamesInPreview={true}
          acceptedFiles={[
            'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
          ]}
          filesLimit={100}
          dropzoneText="select files to upload(< 50mb)"
          onClose={() => this.setState({ openUploadForm: false })}
        />

        <CustomizedSnackbars
          variant={this.state.variant}
          message={this.state.message}
          open={this.state.showMessage}
          handleClose={() => this.setState({ showMessage: false })}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addFilesToProposal: (id, files, cb) =>
      dispatch(addFilesToProposal(id, files, cb)),
    deleteProposalFile: (id, name, cb) =>
      dispatch(deleteProposalFile(id, name, cb)),
    getProposalDetails: id => dispatch(getProposalDetails(id)),
  };
};

const mapStateToProps = state => {
  return {
    proposal: state.global_data.proposalDetail,
  };
};

ConnectedProposalDetailFiles.propTypes = {
  classes: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
};

const ProposalDetailFiles = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedProposalDetailFiles);

export default withStyles(styles)(ProposalDetailFiles);

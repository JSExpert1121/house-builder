import {CircularProgress, IconButton, Snackbar} from '@material-ui/core';
import {withStyles}                             from '@material-ui/core/styles';
import Table                                    from '@material-ui/core/Table';
import TableBody                                from '@material-ui/core/TableBody';
import TableHead                                from '@material-ui/core/TableHead';
import TableRow                                 from '@material-ui/core/TableRow';
import DeleteIcon                               from '@material-ui/icons/Delete';
import NoteAddIcon                              from '@material-ui/icons/NoteAdd';
import CustomTableCell                          from 'components/shared/CustomTableCell';
import {DropzoneDialog}                         from 'material-ui-dropzone';
import React                                    from 'react';
import {connect}                                from 'react-redux';
import {compose}                                from 'redux';

import {addFiles, deleteFile, getContractorDetailById, updateContractor,} from '../../../actions/cont-actions';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1),
  },
  titleBtn: {
    color: '#FFFFFF',
    padding: '6px',
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

class ContractorFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openUploadForm: false,
      snackBar: false,
      isProcessing: false,
      snackBarContent: '',
    };
  }

  componentDidMount() {}

  handleUploadFiles = async files => {
    const { selectedContractor } = this.props;
    this.setState({ isProcessing: true });

    await this.props.addFiles(selectedContractor.id, files, res => {
      this.setState({
        snackBar: true,
        snackBarContent: res ? 'File Upload Success' : 'File Upload Failed',
      });
      if (res) this.props.updateContractor(selectedContractor.id);
    });
    await this.props.getContractorDetailById(selectedContractor.id);

    this.setState({
      openUploadForm: false,
      isProcessing: false,
    });
  };

  handleDeleteFile = async name => {
    const { selectedContractor } = this.props;

    this.setState({
      isProcessing: true,
    });

    await this.props.deleteFile(selectedContractor.id, name, res => {
      this.setState({
        snackBar: true,
        snackBarContent: res ? 'delete file success' : 'delete file failed',
      });
      if (res) this.props.updateContractor(selectedContractor.id);
    });

    await this.props.getContractorDetailById(selectedContractor.id);

    this.setState({
      isProcessing: false,
    });
  };

  render() {
    const { classes, selectedContractor } = this.props;
    const contractorFiles = selectedContractor.contractorFiles;

    if (this.state.isProcessing)
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.waitingSpin} />
        </div>
      );

    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Name</CustomTableCell>
              <CustomTableCell align="center">
                <IconButton
                  className={classes.titleBtn}
                  onClick={() => this.setState({ openUploadForm: true })}
                >
                  <NoteAddIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractorFiles.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell component="th" scope="row" align="center">
                  <a
                    download={row.name}
                    href={
                      process.env.REACT_APP_PROJECT_API +
                      '/contractors/' +
                      selectedContractor.id +
                      '/files/' +
                      row.name
                    }
                  >
                    {row.name}
                  </a>
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    color="primary"
                    onClick={() => this.handleDeleteFile(row.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CustomTableCell>
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
          dropzoneText="select files to upload (< 50mb)"
          onClose={() => this.setState({ openUploadForm: false })}
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedContractor: state.cont_data.selectedContractor,
});

const mapDispatchToProps = {
  addFiles,
  getContractorDetailById,
  deleteFile,
  updateContractor,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContractorFiles);

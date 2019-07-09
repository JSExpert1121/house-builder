import { CircularProgress, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from 'components/CustomButtons/Button.jsx';
import { DropzoneDialog } from 'material-ui-dropzone';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { approveContractor, rejectContractor, updateContractor, } from '../../../actions/cont-actions';
import CustomTableCell from '../../../components/shared/CustomTableCell';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
    position: 'relative'
  },
  waitingSpin: {
    position: 'absolute',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  textField: {
    boxShadow: '0 0 5px #999999',
    width: '100%',
  },
  buttons: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  }
});

class ContractorInfoView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openUploadForm: false,
      snackBar: false,
      isProcessing: false,
      snackBarContent: '',
      reason: props.selectedContractor ? props.selectedContractor.statusReason || '' : ''
    };
  }

  reasonChange = e => {
    this.setState({ reason: e.target.value });
  }

  approve = async () => {
    const { selectedContractor, approveContractor, updateContractor } = this.props;

    this.setState({ isProcessing: true });
    try {
      await approveContractor(
        selectedContractor.id,
        {
          status: 'REJECTED',
          statusReason: this.state.reason
        }
      );

      await updateContractor(selectedContractor.id);
    } catch (error) {
      console.log('Approve: ', error);
    }

    this.setState({ isProcessing: false });
  }

  reject = async () => {
    const { selectedContractor, rejectContractor, updateContractor } = this.props;

    this.setState({ isProcessing: true });
    try {
      await rejectContractor(
        selectedContractor.id,
        {
          status: 'REJECTED',
          statusReason: this.state.reason
        }
      );

      await updateContractor(selectedContractor.id);
    } catch (error) {
      console.log('Approve: ', error);
    }

    this.setState({ isProcessing: false });
  }

  render() {
    const { classes, selectedContractor } = this.props;

    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Email</CustomTableCell>
              <CustomTableCell align="center">Name</CustomTableCell>
              <CustomTableCell align="center">City</CustomTableCell>
              <CustomTableCell align="center">Street</CustomTableCell>
              <CustomTableCell align="center">Status</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row} hover>
              <CustomTableCell component="th" scope="row" align="center">
                {selectedContractor ? selectedContractor.email : 'N/A'}
              </CustomTableCell>
              <CustomTableCell align="center">
                {selectedContractor.address
                  ? selectedContractor.address.name
                  : 'N/A'}
              </CustomTableCell>
              <CustomTableCell align="center">
                {selectedContractor.address
                  ? selectedContractor.address.city
                  : 'N/A'}
              </CustomTableCell>
              <CustomTableCell align="center">
                {selectedContractor.address
                  ? selectedContractor.address.street
                  : 'N/A'}
              </CustomTableCell>
              <CustomTableCell align="center">
                {selectedContractor.status ? selectedContractor.status : 'N/A'}
              </CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br />
        Approve/Reject Reason
        <br />
        <br />
        <TextField
          placeholder=""
          multiline={true}
          rows={4}
          value={this.state.reason}
          onChange={this.reasonChange}
          className={classes.textField}
        />
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
        <div className={classes.buttons}>
          <Button variant="contained" onClick={this.reject}>
            Reject
          </Button>
          <Button color="primary" onClick={this.approve}>
            Approve
          </Button>
        </div>
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
        {this.state.isProcessing && <CircularProgress className={classes.waitingSpin} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedContractor: state.cont_data.selectedContractor,
});

const mapDispatchToProps = {
  approveContractor,
  rejectContractor,
  updateContractor,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContractorInfoView);

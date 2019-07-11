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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Button from 'components/CustomButtons/Button.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addSpecialty, deleteSpecialty, getSpecialties, updateContractor, } from '../../../actions/cont-actions';
import CustomTableCell
  from '../../../components/shared/CustomTableCell';
const styles = theme => ({
  root: {
    padding: theme.spacing(1),
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
  editField: {
    lineHeight: '1.5rem',
  },
  specialty: {
    margin: theme.spacing(1),
  },
  titleBtn: {
    color: '#FFFFFF',
    padding: '6px',
  },
  button: {
    padding: '6px',
  },
  fab: {
    width: '40px',
    height: '40px',
    marginLeft: '20px',
  },
});

class ContractorInfoView extends React.Component {
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
      specialty: '',
    };
  }

  componentDidMount() {
    this.props.getSpecialties(0, 20);
  }
  handleChangePage = (event, page) => {
    this.setState({ currentPage: page });

    this.props.getSpecialties(page, this.state.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    const { selectedContractor } = this.props;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= selectedContractor.contractorSpecialties.length
        ? 0
        : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getSpecialties(currentPage, rowsPerPage);
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
      specialty: event.target.value,
    });
  };

  render() {
    const { classes, specialties, selectedContractor } = this.props;
    const { specialty } = this.state;
    if (!selectedContractor) {
      return <CircularProgress className={classes.waitingSpin} />;
    }
    return (
      <div className={classes.root}>
        <div className={classes.specialty}>
          <Select
            className={classes.select}
            value={specialty}
            onChange={this.handleChange}
            name="specialties"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {specialties
              ? specialties.content.map(row => (
                <MenuItem value={row.id} key={row.id}>
                  {row.name}
                </MenuItem>
              ))
              : null}
          </Select>
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.fab}
            onClick={() =>
              this.props.addSpecialty(
                selectedContractor.id,
                specialty,
                result => {
                  this.setState({ specialty: '' });
                  if (result)
                    this.props.updateContractor(selectedContractor.id);
                }
              )
            }
          >
            <AddIcon />
          </Fab>
          {specialties
            ? specialties.content.map(row =>
              row.id === specialty ? (
                <ul key={row.id}>
                  <li>Name: {row.name}</li>
                  <li>Description: {row.description}</li>
                </ul>
              ) : null
            )
            : null}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell> Specialty Name </CustomTableCell>
              <CustomTableCell align="center">Specialty Desc</CustomTableCell>
              <CustomTableCell align="center">Specialty Value</CustomTableCell>
              <CustomTableCell align="center">
                <IconButton
                  className={classes.titleBtn}
                  onClick={() => this.setState({ openCategoryForm: true })}
                >
                  <NoteAddIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedContractor.contractorSpecialties.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell
                  component="th"
                  scope="row"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/m_cont/contractor_detail');
                  }}
                >
                  {row.specialty.name ? row.specialty.name : 'N/A'}
                </CustomTableCell>
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/m_cont/contractor_detail');
                  }}
                >
                  {row.specialty.description
                    ? row.specialty.description
                    : 'N/A'}
                </CustomTableCell>
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/m_cont/contractor_detail');
                  }}
                >
                  {row.specialty.value ? row.specialty.value : 'N/A'}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    color="primary"
                    onClick={async () => {
                      await this.props.deleteSpecialty(
                        selectedContractor.id,
                        row.specialty.id,
                        result => {
                          this.setState({
                            snackBar: true,
                            snackBarContent: result
                              ? 'delete specialty success'
                              : 'please specialty categories',
                          });
                          this.props.updateContractor(selectedContractor.id);
                        }
                      );

                      if (
                        this.state.rowsPerPage * this.state.currentPage <
                        selectedContractor.contractorSpecialties.length - 1
                      ) {
                        await this.props.getSpecialties(
                          this.state.currentPage,
                          this.state.rowsPerPage
                        );
                      } else {
                        const currentPage = this.state.currentPage - 1;

                        this.setState({
                          currentPage: currentPage,
                        });

                        await this.props.getSpecialties(
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
          count={selectedContractor.contractorSpecialties.length}
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

                await this.props.createContractor(data, res => {
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
              Add
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  specialties: state.cont_data.specialties,
  selectedContractor: state.cont_data.selectedContractor,
});

const mapDispatchToProps = {
  getSpecialties,
  addSpecialty,
  deleteSpecialty,
  updateContractor,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ContractorInfoView);

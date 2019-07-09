import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from "@material-ui/core/FormControl";
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CustomSelect from "containers/BidderListingView/SearchBidderListView/CustomSearch";
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CustomTableCell from "components/shared/CustomTableCell";
import { getContractors, getSpecialties, selectContractor } from 'actions/cont-actions';
import { searchFilter } from 'actions/global-actions';
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput";

import style from './SearchBidderList.style';

class SearchBidderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      isSaving: false,
      openCategoryForm: false,
      name: '',
      filterName: '',
      filterCity: '',
      description: '',
      snackBar: false,
      SnackBarContent: '',
      order: 'desc',
      rowsPerPage1: null,
      currentPage1: null,
    };
    this.selectRef = React.createRef();
  }

  async componentDidMount() {
    await this.props.getContractors(0, 20);
    this.props.getSpecialties();
  }

  handleChangePage = (event, page) => {
    this.setState({ currentPage1: page });
    this.props.getContractors(page, this.state.rowsPerPage1);
  };

  handleChangeRowsPerPage = event => {
    const { contractors } = this.props;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= contractors.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getContractors(currentPage, rowsPerPage);
  };

  onNameChange = e => {
    this.setState({ filterName: e.target.value });
  };

  onCityChange = e => {
    this.setState({ filterCity: e.target.value });
  };

  getSpecialies = () => {
    const specialties = this.selectRef.current.state.value;
    return specialties && specialties.map(item => item.value);
  }

  handleSearch = () => {
    const { filterName, filterCity } = this.state;
    const specialties = this.getSpecialies();

    if (specialties) {
      this.props.searchFilter(filterName, filterCity, specialties);
    } else {
      this.props.getContractors(0, 20);
    }
  };

  render() {
    const { classes, specialties, userProfile, contractors } = this.props;
    const suggestions = specialties
      ? specialties.content.map(specialty => ({
        value: specialty.id,
        label: specialty.name,
      }))
      : [];

    if (contractors === null) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    if (
      !userProfile.user_metadata.roles.includes('Gen') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <div className={classes.root}>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <CustomInput
              labelText="Name"
              id="name"
              inputProps={{
                type: 'text',
                value: this.state.filterName,
                onChange: e => this.onNameChange(e),
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInput
              id="city"
              labelText="City"
              inputProps={{
                value: this.state.filterCity,
                onChange: e => this.onCityChange(e),
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <CustomSelect dataSource={suggestions} ref={this.selectRef} />
            </FormControl>
          </Grid>
          <Grid item xs={3} className={classes.btnSearchWrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell> Logo </CustomTableCell>
              <CustomTableCell align="center">Name</CustomTableCell>
              <CustomTableCell align="center">Email</CustomTableCell>
              <CustomTableCell align="center">Rating</CustomTableCell>
              <CustomTableCell align="center">Other</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractors.content && contractors.content.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell
                  component="th"
                  scope="row"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/b_list/contractor_detail');
                  }}
                />
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/b_list/contractor_detail');
                  }}
                >
                  {row.address ? row.address.name : 'N/A'}
                </CustomTableCell>
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/b_list/contractor_detail');
                  }}
                >
                  {row.email ? row.email : 'N/A'}
                </CustomTableCell>
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/b_list/contractor_detail');
                  }}
                />
                <CustomTableCell
                  align="center"
                  onClick={async () => {
                    await this.props.selectContractor(row.id);
                    this.props.history.push('/b_list/contractor_detail');
                  }}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {contractors.content && (
          <TablePagination
            style={{ overflow: 'auto' }}
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={contractors.content.length}
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
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  getContractors,
  selectContractor,
  getSpecialties,
  searchFilter,
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
  contractors: state.cont_data.contractors,
  specialties: state.cont_data.specialties,
});

export default compose(
  withStyles(style),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(SearchBidderList);

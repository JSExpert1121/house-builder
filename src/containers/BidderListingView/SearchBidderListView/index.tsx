import CircularProgress                                     from '@material-ui/core/CircularProgress';
import FormControl                                          from "@material-ui/core/FormControl";
import Grid                                                 from '@material-ui/core/Grid';
import InputLabel                                           from "@material-ui/core/InputLabel";
import MenuItem                                             from '@material-ui/core/MenuItem';
import Select                                               from "@material-ui/core/Select";
import { withStyles }                                       from '@material-ui/core/styles';
import Table                                                from '@material-ui/core/Table';
import TableBody                                            from '@material-ui/core/TableBody';
import TableHead                                            from '@material-ui/core/TableHead';
import TablePagination                                      from '@material-ui/core/TablePagination';
import TableRow                                             from '@material-ui/core/TableRow';
import { History }                                          from 'history';
import React                                                from 'react';
import { connect }                                          from 'react-redux';
import { match }                                            from 'react-router';
import { compose }                                          from 'redux';
import CustomTableCell                                      from "components/shared/CustomTableCell";
import { getContrators0, getSpecialties, selectContractor } from 'actions/cont-actions';
import { searchFilter }                                     from 'actions/global-actions';
import Button from "components/CustomButtons/Button.jsx";
import CustomInput                                          from "../../../components/CustomInput/CustomInput";
import { MaterialThemeHOC, UserProfile }                    from 'types/global';

import style from './SearchBidderList.style';

interface BidderListingProps extends MaterialThemeHOC {
  match: match;
  getSpecialties: any;
  getContrators0: any;
  contractors: any;
  searchResult: any;
  searchFilter: any;
  specialties: any;
  userProfile: UserProfile;
  selectContractor: any;
  history: History;
}

interface BidderListingState {
  rowsPerPage: any;
  currentPage: any;
  isSaving: any;
  openCategoryForm: any;
  name: any;
  filterName: any;
  filterCity: any;
  description: any;
  snackBar: any;
  SnackBarContent: any;
  order: any;
  multi: any;
  contractors: any;
  rowsPerPage1: any;
  currentPage1: any;
}

class BidderListingView extends React.Component<
  BidderListingProps,
  BidderListingState
> {
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
      multi: null,
      contractors: null,
      rowsPerPage1: null,
      currentPage1: null,
    };
  }

  async componentDidMount() {
    await this.props.getSpecialties();
    await this.props.getContrators0(0, 20);
  }

  componentWillReceiveProps({ contractors, searchResult }) {
    this.setState({ contractors: contractors });
    if (searchResult)
      this.setState({ contractors: { ...contractors, content: searchResult } });
  }

  handleChangePage = (event, page) => {
    this.setState({ currentPage1: page });
    this.props.getContrators0(page, this.state.rowsPerPage1);
  };

  handleChangeRowsPerPage = event => {
    const { contractors } = this.state;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= contractors.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getContrators0(currentPage, rowsPerPage);
  };

  onNameChange = e => {
    this.setState({ filterName: e.target.value });
  };

  onCityChange = e => {
    this.setState({ filterCity: e.target.value });
  };
  handleSearch = () => {
    const multi = this.state.multi
      ? this.state.multi.map(specialty => specialty.value)
      : [];

    this.props.searchFilter(
      this.state.filterName,
      this.state.filterCity,
      multi,
      result => {
        if (result) {
        }
      }
    );
  };

  handleChange = (name: any) => (value: any) => {
    this.setState({
      multi: value,
    })
  }

  render() {
    const { classes, specialties, userProfile } = this.props;
    const { contractors } = this.state;
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
                type: "text",
                value: this.state.filterName,
                onChange: e => this.onNameChange(e)
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomInput
              id="city"
              labelText="City"
              inputProps={{
                value: this.state.filterCity,
                onChange: e => this.onCityChange(e)
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              fullWidth
              className={classes.selectFormControl}
            >
              <InputLabel
                htmlFor="simple-select"
                className={classes.selectLabel}
              >
                Select multiple specialties
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={this.state.multi}
                onChange={this.handleChange('multi')}
                inputProps={{
                  name: "simpleSelect",
                  id: "simple-select"
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  Select multiple specialties
                </MenuItem>
                {suggestions.map(({value, label }, key) => (
                  <MenuItem
                    key={key}
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value={value}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Select>
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
            {contractors.content.map(row => (
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
      </div>
    );
  }
}

const mapDispatchToProps = {
  getContrators0,
  selectContractor,
  getSpecialties,
  searchFilter,
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
  contractors: state.cont_data.contractors,
  specialties: state.cont_data.specialties,
  searchResult: state.global_data.searchResult,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(style, { withTheme: true })
)(BidderListingView);

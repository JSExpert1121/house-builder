import Card                                                from '@material-ui/core/Card';
import Chip                                                from '@material-ui/core/Chip';
import CircularProgress                                    from '@material-ui/core/CircularProgress';
import IconButton                                          from '@material-ui/core/IconButton';
import MenuItem                                            from '@material-ui/core/MenuItem';
import Paper                                               from '@material-ui/core/Paper';
import Snackbar                                            from '@material-ui/core/Snackbar';
import {emphasize, withStyles}                             from '@material-ui/core/styles';
import Table                                               from '@material-ui/core/Table';
import TableBody                                           from '@material-ui/core/TableBody';
import TableHead                                           from '@material-ui/core/TableHead';
import TablePagination                                     from '@material-ui/core/TablePagination';
import TableRow                                            from '@material-ui/core/TableRow';
import TextField                                           from '@material-ui/core/TextField';
import Typography                                          from '@material-ui/core/Typography';
import AccessAlarmIcon                                     from '@material-ui/icons/AccessAlarm';
import CancelIcon                                          from '@material-ui/icons/Cancel';
import classNames                                          from 'classnames';
import React                                               from 'react';
import {connect}                                           from 'react-redux';
import Select                                              from 'react-select';
import {compose}                                           from 'redux';
import {getContrators0, getSpecialties, selectContractor,} from '../../actions/cont-actions';

import {getProjectBiddersData, inviteContractor, searchFilter,} from '../../actions/global-actions';
import Button                                                   from "../CustomButtons/Button";
import CustomTableCell                                          from "../shared/CustomTableCell";

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
  },
  tableWrap: {
    overflow: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  successAlert: {
    marginBottom: '10px',
  },
  editField: {
    lineHeight: '1.5rem',
  },
  title: {
    padding: '20px',
    fontSize: '21px',
    color: 'grey',
  },
  pos: {
    marginBottom: 12,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    margin: theme.spacing(1),
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(2, 1),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
  card: {
    width: '100%',
    marginBottom: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'lightgrey',
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class ProjectBidders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      rowsPerPage1: 20,
      currentPage1: 0,
      isSaving: false,
      openCategoryForm: false,
      name: '',
      filterName: '',
      filterCity: '',
      description: '',
      snackBar: false,
      SnackBarContent: '',
      order: 'desc',
      projectBidders: null,
      multi: null,
      contractors: null,
    };
  }

  async componentDidMount() {
    const { project } = this.props;
    await this.props.getProjectBiddersData(project.id, 0, 20);
    await this.props.getSpecialties();
    await this.props.getContrators0(0, 20);
  }

  componentWillReceiveProps({ projectBidders, contractors, searchResult }) {
    this.setState({
      projectBidders: projectBidders,
      contractors: contractors,
    });
    if (searchResult)
      this.setState({ contractors: { ...contractors, content: searchResult } });
  }

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
          // this.props.updateContractor(selectedContractor.id);
        }
      }
    );
  };

  handleChangePage = (event, page) => {
    const { project } = this.props;
    this.setState({ currentPage: page });
    this.props.getProjectBiddersData(project.id, page, this.state.rowsPerPage);
  };

  handleChangePage1 = (event, page) => {
    this.setState({ currentPage1: page });
    this.props.getContrators0(page, this.state.rowsPerPage1);
  };

  handleChangeRowsPerPage = event => {
    const { projectBidders } = this.state;
    const { project } = this.props;
    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= projectBidders.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getProjectBiddersData(project.id, currentPage, rowsPerPage);
  };

  handleChangeRowsPerPage1 = event => {
    const { contractors } = this.state;
    const rowsPerPage1 = event.target.value;
    const currentPage1 =
      rowsPerPage1 >= contractors.totalElements ? 0 : this.state.currentPage1;

    this.setState({
      rowsPerPage1: rowsPerPage1,
      currentPage1: currentPage1,
    });

    this.props.getContrators0(currentPage1, rowsPerPage1);
  };

  onNameChange = e => {
    this.setState({ filterName: e.target.value });
  };

  onCityChange = e => {
    this.setState({ filterCity: e.target.value });
  };

  handleChangeMulti = value => {
    // setMulti(value);
  };

  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
  };

  isInvited = id => {
    const value = this.props.projectBidders.map(row => {
      return row.id === id;
    });

    return value.includes(true);
  };

  render() {
    const { classes, project, theme, specialties, match } = this.props;
    const { contractors, projectBidders } = this.state;
    const suggestions = specialties
      ? specialties.content.map(specialty => ({
          value: specialty.id,
          label: specialty.name,
        }))
      : [];
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
      }),
    };

    if (projectBidders === null || contractors === null) {
      return <CircularProgress className={classes.waitingSpin} />;
    }
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <Typography className={classes.title}>Invited Bidders</Typography>
          <div className={classes.tableWrap}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell align="center">Logo</CustomTableCell>
                  <CustomTableCell align="center">Bidder Name</CustomTableCell>
                  <CustomTableCell> Bidder Email </CustomTableCell>
                  <CustomTableCell align="center">Rating</CustomTableCell>
                  <CustomTableCell align="center">Other</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectBidders.map(row => (
                  <TableRow className={classes.row} key={row.id} hover>
                    <CustomTableCell
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    >
                      {row.address ? row.address.name : 'N/A'}
                    </CustomTableCell>
                    <CustomTableCell
                      component="th"
                      scope="row"
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    >
                      {row.email ? row.email : 'N/A'}
                    </CustomTableCell>
                    <CustomTableCell
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                    <CustomTableCell
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            style={{ overflow: 'auto' }}
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={projectBidders.length}
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
        </Card>
        <Card className={classes.card}>
          <Typography className={classes.title}> Search Field </Typography>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={this.state.filterName}
            onChange={e => this.onNameChange(e)}
            margin="normal"
          />
          <TextField
            id="city"
            label="City"
            className={classes.textField}
            value={this.state.filterCity}
            onChange={e => this.onCityChange(e)}
            margin="normal"
          />
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Specialty',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={suggestions}
            components={components}
            value={this.state.multi}
            onChange={this.handleChange('multi')}
            placeholder="Select multiple specialties"
            isMulti
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleSearch}
          >
            Search
          </Button>
          <Typography className={classes.title}>Search result</Typography>
          <div className={classes.tableWrap}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell> Logo </CustomTableCell>
                  <CustomTableCell align="center">Name</CustomTableCell>
                  <CustomTableCell align="center">Specialty</CustomTableCell>
                  <CustomTableCell align="center">Rating</CustomTableCell>
                  <CustomTableCell align="center">Action</CustomTableCell>
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
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    >
                      {row.address ? row.address.name : 'N/A'}
                    </CustomTableCell>
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                    <CustomTableCell
                      align="center"
                      onClick={async () => {
                        await this.props.selectContractor(row.id);
                        if (match.url.includes('gen-contractor'))
                          this.props.history.push(
                            '/gen-contractor/contractor_detail'
                          );
                        if (match.url.includes('s_cont'))
                          this.props.history.push('/s_cont/contractor_detail');
                      }}
                    />
                    <CustomTableCell align="center">
                      {this.isInvited(row.id) ? (
                        <IconButton
                          className={classes.button}
                          aria-label="Delete"
                          color="rose"
                        >
                          <AccessAlarmIcon />
                        </IconButton>
                      ) : (
                        <Button
                          className={classes.button}
                          aria-label="Delete"
                          color="rose"
                          onClick={async () => {
                            await this.props.inviteContractor(
                              project.id,
                              row.id,
                              result => {
                                if (result) {
                                  this.props.getContrators0(
                                    this.state.currentPage1,
                                    this.state.rowsPerPage1
                                  );
                                  this.props.getProjectBiddersData(
                                    project.id,
                                    this.state.currentPage,
                                    this.state.rowsPerPage
                                  );
                                }
                              }
                            );
                          }}
                        >
                          Invite
                        </Button>
                      )}
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            style={{ overflow: 'auto' }}
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={contractors.numberOfElements}
            rowsPerPage={this.state.rowsPerPage1}
            page={this.state.currentPage1}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage1}
            onChangeRowsPerPage={this.handleChangeRowsPerPage1}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projectBidders: state.global_data.projectBidders,
  project: state.global_data.project,
  searchResult: state.global_data.searchResult,
  specialties: state.cont_data.specialties,
  contractors: state.cont_data.contractors,
});

const mapDispatchToProps = {
  getProjectBiddersData,
  selectContractor,
  getSpecialties,
  searchFilter,
  getContrators0,
  inviteContractor,
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectBidders);

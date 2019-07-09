import Checkbox         from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton       from '@material-ui/core/IconButton';
import Snackbar         from '@material-ui/core/Snackbar';
import {withStyles}     from '@material-ui/core/styles';
import Table            from '@material-ui/core/Table';
import TableBody        from '@material-ui/core/TableBody';
import TableHead        from '@material-ui/core/TableHead';
import TablePagination  from '@material-ui/core/TablePagination';
import TableRow         from '@material-ui/core/TableRow';
import CompareIcon      from '@material-ui/icons/Compare';
import Button           from "components/CustomButtons/Button.jsx";
import React            from 'react';
import {connect}        from 'react-redux';
import {compose}        from 'redux';

import removeMd        from 'remove-markdown';
import {
  getProposalData,
  getProposalsByProjectId,
  setDetailProposal,
  setProposalsCompare
}                      from '../../actions/global-actions';
import ConfirmDialog   from '../shared/ConfirmDialog';
import CustomTableCell from "../shared/CustomTableCell";

const MAX_COMPARE = 3;
const styles = theme => ({
  root: {
    padding: theme.spacing(1),
  },
  tableWrap: {
    overflowX: 'hidden',
    maxHeight: 'calc(100vh - 64px - 100px - 48px - 16px)',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  button: {
    padding: '6px',
  },
  submitBtn: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: '#FFFFFF',
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&:disabled': {
      backgroundColor: '#FFFFFF',
    },
  },
});

class ProjectProposals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      isSaving: false,
      snackBar: false,
      snackBarContent: '',
      compares: [],
      showConfirm: false,
      message: "You can't select more than 3 proposals",
    };
  }

  componentDidMount() {
    const { project } = this.props;
    this.props.getProposalsByProjectId(project.id, 0, 0);
  }

  handleChangePage = (event, page) => {
    const { project } = this.props;
    this.setState({ currentPage: page });

    this.props.getProposalsByProjectId(
      project.id,
      page,
      this.state.rowsPerPage
    );
  };

  handleChangeRowsPerPage = event => {
    const { proposals, project } = this.props;

    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: currentPage,
    });

    this.props.getProposalsByProjectId(project.id, currentPage, rowsPerPage);
  };

  handleCompare = () => {
    const { compares } = this.state;
    const { match, history } = this.props;

    if (compares.length < 2 || compares.length > 3) {
      this.setState({
        showConfirm: true,
        message: 'You have to select 2 ~ 3 proposals.',
      });
      return;
    }

    this.props.setProposals4Compare(compares);
    history.push(match.url.slice(0, match.url.lastIndexOf('/')) + '/compare');
  };

  handleRowSelected = id => {
    const { match, history } = this.props;
    console.log('ProjectProposal: ', match.url);
    if (match.url.includes('/gen-contractor')) {
      history.push('/gen-contractor/proposal_detail/' + id);
    } else if (match.url.includes('/projects')) {
      history.push('/projects/proposal_detail/' + id);
    }
  };

  handleChecked = id => {
    const compares = [...this.state.compares];
    console.log(id);
    const pos = compares.indexOf(id);
    if (pos >= 0) {
      compares.splice(pos, 1);
    } else {
      if (compares.length === MAX_COMPARE) {
        this.setState({
          showConfirm: true,
          message: "You can't select more than 3 proposals",
        });
        return;
      }
      compares.push(id);
    }

    this.setState({ compares });
    console.log(compares);
  };

  handleConfirm = () => {
    this.setState({ showConfirm: false });
  };

  render() {
    const { classes, proposals, match } = this.props;
    const { compares } = this.state;

    if (proposals === null)
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.waitingSpin} />
        </div>
      );

    return (
      <div className={classes.root}>
        <div className={classes.tableWrap}>
          {match.url.includes('/projects') && (
            <Button
              color="primary"
              onClick={() => {
                this.props.clearProposalDetail(null);
                this.props.history.push('/projects/proposal_detail/-1');
              }}
            >
              Submit Proposal
            </Button>
          )}
          <Table>
            <TableHead>
              <TableRow>
                {match.url.includes('/gen-contractor') && (
                  <CustomTableCell align="center">
                    <IconButton
                      className={classes.button}
                      onClick={this.handleCompare}
                      style={{ color: '#FFFFFF' }}
                      size="small"
                    >
                      <CompareIcon />
                    </IconButton>
                  </CustomTableCell>
                )}
                <CustomTableCell align="center">Bidder Name</CustomTableCell>
                <CustomTableCell align="center">Price($)</CustomTableCell>
                <CustomTableCell align="center">Duration</CustomTableCell>
                <CustomTableCell align="center">Status</CustomTableCell>
                <CustomTableCell align="center">Description</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.content.map(row => (
                <TableRow className={classes.row} key={row.id} hover>
                  {match.url.includes('/gen-contractor') && (
                    <CustomTableCell align="center">
                      <Checkbox
                        onChange={() => this.handleChecked(row.id)}
                        checked={compares.includes(row.id)}
                        inputProps={{ 'aria-label': 'Select proposals' }}
                      />
                    </CustomTableCell>
                  )}
                  <CustomTableCell
                    onClick={() => this.handleRowSelected(row.id)}
                    component="th"
                    align="center"
                  >
                    {row.subContractor.email}
                  </CustomTableCell>
                  <CustomTableCell
                    onClick={() => this.handleRowSelected(row.id)}
                    align="center"
                  >
                    {row.budget}
                  </CustomTableCell>
                  <CustomTableCell
                    onClick={() => this.handleRowSelected(row.id)}
                    align="center"
                  >
                    {row.duration}
                  </CustomTableCell>
                  <CustomTableCell
                    onClick={() => this.handleRowSelected(row.id)}
                    align="center"
                  >
                    {row.status}
                  </CustomTableCell>
                  <CustomTableCell
                    onClick={() => this.handleRowSelected(row.id)}
                    align="center"
                  >
                    {removeMd(row.description)}
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
          count={proposals.totalElements}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.currentPage}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <ConfirmDialog
          open={this.state.showConfirm}
          message={this.state.message}
          onYes={this.handleConfirm}
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

const mapDispatchToProps = {
  getProposalData,
  getProposalsByProjectId,
  setProposals4Compare: setProposalsCompare,
  clearProposalDetail: setDetailProposal,
}

const mapStateToProps = state => ({
  proposals: state.global_data.proposals,
  project: state.global_data.project,
})

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProjectProposals);

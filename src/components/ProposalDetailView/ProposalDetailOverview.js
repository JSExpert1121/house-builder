import Box                                 from '@material-ui/core/Box';
import InputAdornment                      from '@material-ui/core/InputAdornment';
import List                                from '@material-ui/core/List';
import ListItem                            from '@material-ui/core/ListItem';
import ListItemIcon                        from '@material-ui/core/ListItemIcon';
import ListItemText                        from '@material-ui/core/ListItemText';
import Paper                               from '@material-ui/core/Paper';
import { withStyles }                      from '@material-ui/core/styles';
import Table                               from '@material-ui/core/Table';
import TableBody                           from '@material-ui/core/TableBody';
import TableHead                           from '@material-ui/core/TableHead';
import TableRow                            from '@material-ui/core/TableRow';
import TextField                           from '@material-ui/core/TextField';
import Typography                          from '@material-ui/core/Typography';
import FiberIcon                           from '@material-ui/icons/FiberManualRecord';
import clsx                                from 'clsx';
import Button                              from 'components/CustomButtons/Button.jsx';
import 'easymde/dist/easymde.min.css';
import React, { Component }                from 'react';
import { connect }                         from 'react-redux';
import SimpleMDE                           from 'react-simplemde-editor';
import { compose }                         from 'redux';
import { awardProject }                    from '../../actions/gen-actions';
import { deleteProposal, getProposalData } from '../../actions/global-actions';
import ConfirmDialog                       from '../../components/shared/ConfirmDialog';
import CustomTableCell                     from '../../components/shared/CustomTableCell';
import SubContractorView                   from '../Contractor/SubContractor';

import ProjectView  from './ProjectView';
import ProposalView from './ProposalView';

const styles = theme => ({
  '@global': {
    '.MuiListItemIcon-root': {
      minWidth: '32px',
    },
    '.MuiListItem-root': {
      paddingTop: '4px',
      paddingBottom: '4px',
    },
  },
  root: {
    position: 'relative',
    height: 'calc(100vh - 64px - 48px - 36px - 16px)',
    overflow: 'auto',
    flexGrow: 1,
    padding: theme.spacing(2),
    width: '100%',
  },
  editField: {
    lineHeight: '1.5rem',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 20px)',
    top: 'calc(50% - 20px)',
  },
  width_300: {
    width: 300,
    marginRight: 10,
  }
});

class ProposalDetailOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      budget: props.brief.budget,
      duration: props.brief.duration,
      description: props.brief.description,

      isSaving: false,
      showConfirm: false,
      message: 'Would you like to submit your proposal?',
      handleOK: null,
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  componentWillUnmount() {
    this.props.handleOverviewChange({
      budget: this.state.budget,
      duration: this.state.duration,
      description: this.state.description,
    });
  }

  submit = () => {
    this.setState({
      showConfirm: true,
      message: 'Would you like to submit your proposal?',
      handleOK: this.handleSubmit,
    });
  };

  handleSubmit = async () => {
    this.setState({ showConfirm: false, isSaving: true });
    await this.props.handleSubmit({
      budget: this.state.budget,
      duration: this.state.duration,
      description: this.state.description,
    });
    this.setState({ isSaving: false });
  };

  delete = () => {
    this.setState({
      showConfirm: true,
      message: 'Would you like to delete your proposal?',
      handleOK: this.handleDelete,
    });
  };

  handleDelete = async () => {
    this.setState({ showConfirm: false, isSaving: true });
    await this.props.handleDelete(this.props.proposal.id);
    this.setState({ isSaving: false });
  };

  award = () => {
    this.setState({
      showConfirm: true,
      message: 'Would you like to award this proposal?',
      handleOK: this.handleAward,
    });
  };

  handleAward = async () => {
    this.setState({ showConfirm: false, isSaving: true });
    await this.props.handleAward(this.props.proposal.id);
    this.setState({ isSaving: false });
  };

  closeConfirm = () => {
    this.setState({ showConfirm: false });
  };

  render() {
    const { classes, match, proposal, edit } = this.props;

    // let edit = match.params.id === '-1';
    const project =
      edit && !match.url.includes('/s_cont')
        ? this.props.project
        : proposal.proposal.project;

    if (!project) return <div className={classes.root} />;
    if (!edit && !proposal) return <div className={classes.root} />;

    let c_project = edit ? project : proposal.proposal.project;
    const btnTitle =
      match.url.includes('/s_cont') ||
      (match.params.id === '-1' && this.props.proposal)
        ? 'Update Proposal'
        : 'Submit Proposal';
    const isGen = match.url.includes('/gen-contractor');
    const style_prop_title = {
      fontWeight: '600',
      fontSize: '20px',
      marginTop: '0',
    };
    // if (isGen) style_prop_title.marginTop = '0';

    return (
      <Paper className={classes.root}>
        {!isGen && <ProjectView project={c_project} />}

        {!edit || isGen ? (
          <ProposalView proposal={proposal.proposal} />
        ) : (
          <>
            <Typography variant="subtitle1" noWrap style={style_prop_title}>
              Proposal
            </Typography>
            <Box id="brief-desc" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <TextField
                disabled={!edit}
                label="Budget *"
                id="budget"
                type="number"
                className={clsx(classes.margin, classes.textField)}
                value={this.state.budget}
                onChange={this.handleChange('budget')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">USD</InputAdornment>
                  ),
                }}
              />
              <TextField
                disabled={!edit}
                label="Duration *"
                type="number"
                className={clsx(classes.margin, classes.textField)}
                value={this.state.duration}
                onChange={this.handleChange('duration')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">days</InputAdornment>
                  ),
                }}
              />
              <SimpleMDE
                style={{
                  height: '209px',
                  overflow: 'auto',
                  margin: '8px 0',
                  textAlign: 'left',
                  width: '100%',
                }}
                value={this.state.description}
                onChange={val => this.setState({ description: val })}
                options={{
                  placeholder: 'Description here',
                }}
              />

              {/* <FormControl fullWidth className={classes.margin}>
								<InputLabel htmlFor="description">Description *</InputLabel>
								<Input disabled={!edit}
									id="description"
									value={this.state.description}
									onChange={this.handleChange('description')}
									multiline={true}
								/>
							</FormControl> */}
            </Box>
          </>
        )}

        {isGen && (
          <SubContractorView subContractor={proposal.proposal.subContractor} />
        )}
        <Typography
          variant="subtitle1"
          noWrap
          style={{ fontWeight: '600', fontSize: '20px', marginTop: '16px' }}
        >
          Templates
        </Typography>
        {!isGen ? (
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell>Name</CustomTableCell>
                <CustomTableCell align="center">Discription</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {project &&
                project.projectTemplates.map((templ, index) => (
                  <TableRow
                    className={classes.row}
                    key={index}
                    hover
                    onClick={() => this.props.templateSelected(index)}
                  >
                    <CustomTableCell component="th" scope="row">
                      {templ.template.name}
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {templ.template.description}
                    </CustomTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <List>
            {project &&
              project.projectTemplates.map((templ, index) => (
                <ListItem
                  key={index}
                  onClick={() => this.props.templateSelected(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <ListItemIcon>
                    <FiberIcon style={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary={templ.template.name} />
                </ListItem>
              ))}
          </List>
        )}

        <Box style={{ textAlign: 'right', paddingTop: '16px' }}>
          {match.url.includes('/s_cont') && (
            <Button
              disabled={this.state.isSaving}
              onClick={this.delete}
              color="warning"
            >
              Delete Proposal
            </Button>
          )}
          {match.url.includes('/gen-contractor') && (
            <Button
              disabled={this.state.isSaving || proposal.status === 'AWARDED'}
              onClick={this.award}
              color="success"
            >
              Award Project
            </Button>
          )}
          {edit && (
            <Button
              disabled={this.state.isSaving}
              onClick={this.submit}
              color="primary"
            >
              {btnTitle}
            </Button>
          )}
        </Box>
        <ConfirmDialog
          open={this.state.showConfirm}
          message={this.state.message}
          onYes={this.state.handleOK}
          onCancel={this.closeConfirm}
        />
      </Paper>
    );
  }
}

const mapDispatchToProps = {
  getProposalData,
  deleteProposal,
  awardProject,
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
  proposal: state.global_data.proposalDetail,
  project: state.global_data.project,
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProposalDetailOverview);

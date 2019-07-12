import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Button from 'components/CustomButtons/Button.jsx';
import ConfirmDialog from 'components/shared/ConfirmDialog';
import ContractorView from 'components/Contractor';
// import GenContractorView from 'components/Contractor/GenContractor';
import ProposalView from './ProposalView';
import ProposalEditView from './ProposalEditView';
import { awardProject } from 'actions/gen-actions';
import { deleteProposal, getProposalData } from 'actions/global-actions';
import 'easymde/dist/easymde.min.css';


const styles = theme => ({
  root: {
    position: 'relative',
    overflow: 'auto',
    flexGrow: 1,
    padding: theme.spacing(1),
    width: '100%',
  },
  container: {
    margin: theme.spacing(1),
    padding: 0,
    textAlign: 'right'
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
      budget: props.brief.budget || 0,
      duration: props.brief.duration || 0,
      description: props.brief.description || '',

      isSaving: false,
      showConfirm: false,
      message: 'Would you like to submit your proposal?',
      handleOK: null,
    };
  }

  componentWillUnmount() {
    this.props.handleOverviewChange({
      budget: this.state.budget,
      duration: this.state.duration,
      description: this.state.description,
    });
  }

  handleChange = name => val => {
    this.setState({ [name]: val });
  };

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
      budget: this.state.budget.toString(),
      duration: this.state.duration.toString(),
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

  gotoContractor = (id) => {
    const { match } = this.props;
    if (match.url.includes('gen-contractor')) {
      this.props.history.push(`/gen-contractor/contractor_detail/${id}`);
    }
    if (match.url.includes('s_cont')) {
      this.props.history.push(`/s_cont/contractor_detail/${id}`);
    }
  }

  render() {
    const { classes, match, proposal, edit } = this.props;

    // let edit = match.params.id === '-1';
    if (!edit && !proposal) return <div className={classes.root} />;

    let project = this.props.project;
    if (proposal && proposal.proposal && proposal.proposal.project) {
      project = proposal.proposal.project;
    }

    if (!project) return <div className={classes.root} />;

    // let c_project = edit ? project : proposal.proposal.project;
    const btnTitle =
      match.url.includes('/s_cont') ||
        (match.params.id === '-1' && this.props.proposal)
        ? 'Update Proposal'
        : 'Submit Proposal';
    // const isGen = match.url.includes('/gen-contractor');

    const templates = project ? project.projectTemplates || [] : [];
    const Buttons = (
      <Box className={classes.container}>
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
    )

    return (
      <Paper className={classes.root}>
        {/* {(!isGen || edit) && <ProjectView project={c_project} />} */}
        {!edit && (
          <Grid container>
            <Grid item xs={12} md={9}>
              <ProposalView
                proposal={proposal.proposal}
                selectTemplate={this.props.templateSelected}
              />
              {Buttons}
            </Grid>
            <Grid item xs={12} md={3}>
              <ContractorView
                contractor={proposal.proposal.subContractor}
                onClick={() => this.gotoContractor(proposal.proposal.subContractor.id)}
              />
            </Grid>
          </Grid>
        )}

        {edit && (
          <>
            <ProposalEditView
              budget={this.state.budget}
              duration={this.state.duration}
              description={this.state.description}
              templates={templates}
              selectTemplate={this.props.templateSelected}
              budgetChange={this.handleChange('budget')}
              durationChange={this.handleChange('duration')}
              descriptionChange={this.handleChange('description')} />
            {Buttons}
          </>
        )}

        <ConfirmDialog
          open={this.state.showConfirm}
          message={this.state.message}
          onYes={this.state.handleOK}
          onCancel={this.closeConfirm}
        />
      </Paper >
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
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProposalDetailOverview);

import React       from 'react';
import { connect } from 'react-redux';

import PropTypes      from 'prop-types';
import Paper          from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs           from '@material-ui/core/Tabs';
import Tab            from '@material-ui/core/Tab';
import NoSsr          from '@material-ui/core/NoSsr';

import ContractorInfo        from './ContractorInfo';
import ContractorSpecialties from './ContractorSpecialties';
import ContractorFiles       from './ContractorFiles';
import { IconButton }        from '@material-ui/core';
import ArrowBackIcon         from '@material-ui/icons/ArrowBack';
// import ContractorMessages from './ContractorMessages';
// import ContractorProposals from './ContractorProposals';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 136px)',
    margin: theme.spacing(1),
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
    flexGrow: 1,
  },
  backBtn: {
    color: theme.palette.primary.dark,
  },
});

class ConnectedContractorDetailView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curDetailTab: 0,
    };
  }

  handleTabChange = (event, value) => {
    this.setState({
      curDetailTab: value,
    });
  };

  handleBack = () => {
    this.props.history.push('/b_list');
  };

  render() {
    const { classes, selectedContractor } = this.props;
    const curDetailTab = this.state.curDetailTab;

    if (selectedContractor === null) return <div> no project is selected </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <Paper square>
            <div style={{ display: 'flex' }}>
              <IconButton className={classes.backBtn} onClick={this.handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Tabs
                value={curDetailTab}
                onChange={this.handleTabChange}
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
                scrollButtons="off"
                className={classes.toolbarstyle}
              >
                <Tab label="Info" />
                <Tab label="Files" />
                <Tab label="Specialties" />
              </Tabs>
            </div>
            {curDetailTab === 0 && <ContractorInfo />}
            {curDetailTab === 1 && <ContractorFiles />}
            {curDetailTab === 2 && <ContractorSpecialties />}
          </Paper>
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedContractor: state.cont_data.selectedContractor,
  };
};

const ContractorDetailView = connect(mapStateToProps)(
  ConnectedContractorDetailView
);

ContractorDetailView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContractorDetailView);

import React       from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
    flexGrow: 1,
  }
});

class ContractorDetailView extends React.Component {
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
    this.props.history.push(
      '/gen-contractor/project_detail/' +
        this.props.currentProjectId +
        '/bidders'
    );
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
              <IconButton onClick={this.handleBack}>
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

const mapStateToProps = state => ({
  selectedContractor: state.cont_data.selectedContractor,
  currentProjectId: state.global_data.currentProjectId,
});

export default compose(
    withStyles(styles),
    connect(mapStateToProps),
)(ContractorDetailView);

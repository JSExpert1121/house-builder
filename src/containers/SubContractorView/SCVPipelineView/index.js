import React          from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper                      from '@material-ui/core/Paper';
import Tabs                       from '@material-ui/core/Tabs';
import Tab                        from '@material-ui/core/Tab';
import NoSsr                      from '@material-ui/core/NoSsr';
import SecuredRoute               from '../../../routers/SecuredRoute';
import { Link, Redirect, Switch } from 'react-router-dom';
import SubmittedProView           from './SubmittedProView';
import WonProView                 from './WonProView';
import InvitedProView             from './InvitedProView';
import AppBar                     from '@material-ui/core/AppBar';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  }
});

class SCVPipelineView extends React.Component {
  render() {
    const { classes, match, location } = this.props;
    const tabNo = {
      '/s_cont/pipeline': 0,
      '/s_cont/pipeline/submitted': 0,
      '/s_cont/pipeline/awarded': 1,
      '/s_cont/pipeline/invited': 2,
    };

    let curTabPos = tabNo[location.pathname];

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={curTabPos}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="auto"
              onChange={() => ({})}
            >
              <Tab
                component={Link}
                to={`${match.url}/submitted`}
                label="Submitted"
              />
              <Tab component={Link} to={`${match.url}/awarded`} label="Won" />
              <Tab
                component={Link}
                to={`${match.url}/invited`}
                label="Invited"
              />
            </Tabs>
          </AppBar>

          <Paper square>
            <Switch>
              <SecuredRoute
                path={`${match.url}/submitted`}
                component={SubmittedProView}
              />
              <SecuredRoute
                path={`${match.url}/awarded`}
                component={WonProView}
              />
              <SecuredRoute
                path={`${match.url}/invited`}
                component={InvitedProView}
              />
              <Redirect path={`${match.url}`} to={`${match.url}/submitted`} />
            </Switch>
          </Paper>
        </div>
      </NoSsr>
    );
  }
}

export default withStyles(styles)(SCVPipelineView);

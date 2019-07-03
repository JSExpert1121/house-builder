import NoSsr              from '@material-ui/core/NoSsr';
import Paper              from '@material-ui/core/Paper';
import {withStyles}       from '@material-ui/core/styles';
import React              from 'react';
import {Redirect, Switch} from 'react-router-dom';
import CustomTabs         from "../../../components/shared/CustomTabs";
import SecuredRoute       from '../../../routers/SecuredRoute';
import InvitedProView     from './InvitedProView';
import SubmittedProView   from './SubmittedProView';
import WonProView         from './WonProView';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class SCVPipelineView extends React.Component {
  render() {
    const { classes, match } = this.props;
    return (
      <NoSsr>
        <div className={classes.root}>
          <Paper square>
            <CustomTabs
              tabs={[
                {
                  href: `${match.url}/submitted`,
                  label: 'Submitted',
                },
                {
                  href: `${match.url}/invited`,
                  label: 'Invited',
                },
              ]}
            />
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

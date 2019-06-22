import React from 'react';

import PropTypes      from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card           from '@material-ui/core/Card';
import Table          from '@material-ui/core/Table';
import TableBody      from '@material-ui/core/TableBody';
import TableHead      from '@material-ui/core/TableHead';
import TableRow       from '@material-ui/core/TableRow';

import CustomTableCell from '../../components/shared/CustomTableCell';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
    height: 'calc(100vh - 64px - 48px - 16px)',
    overflow: 'auto',
    overflowX: 'hidden',
  },
});

class SCVReportsView extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
              <CustomTableCell align="center">A</CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  }
}

SCVReportsView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SCVReportsView);

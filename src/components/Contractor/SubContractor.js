import React          from 'react';
import Grid           from '@material-ui/core/Grid';
import Typography     from '@material-ui/core/Typography';
import Box            from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    textAlign: 'left',
    marginTop: '0',
    marginBottom: '0',
    lineHeight: '2',
  },
  bottomLine: {
    borderBottom: '1px solid #dedede',
  },
  template: {
    display: 'inline',
    fontSize: '1em',
    textAlign: 'left',
    color: '#444',
    marginTop: '0',
  },
  brief: {
    margin: 0,
  },
  desc: {
    color: '#444',
    marginTop: '0',
    textDecoration: 'none',
  },
  email: {
    display: 'inline-block',
    fontSize: '1em',
    textAlign: 'left',
    fontWeight: '600',
    color: '#666',
    textDecoration: 'none',
  },
  status: {
    fontSize: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.palette.primary.light,
    textDecoration: 'none',
  },
});

const TITLE = 'SubContractor Information';
const SubContractorView = ({ classes, subContractor }) => {
  return (
    <Box className={classes.root}>
      <Typography variant="subtitle1" className={classes.title}>
        {TITLE}
      </Typography>
      <Box style={{ width: '100%' }}>
        <Grid container id="sub-contractor-info" className={classes.brief}>
          <Grid item xs={12} sm={10} style={{ padding: '4px' }}>
            <Box className={classes.email}>Email: {subContractor.email}</Box>
          </Grid>
          <Grid item xs={12} sm={2} style={{ padding: '4px' }}>
            <Box className={classes.status}>{subContractor.status}</Box>
          </Grid>
          {subContractor.address && (
            <Grid item xs={12} style={{ padding: '4px' }}>
              <Typography className={classes.desc}>
                From {subContractor.address.name},{' '}
                {subContractor.address.street}, {subContractor.address.city}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(SubContractorView);

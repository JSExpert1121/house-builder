import React     from 'react';
import PropTypes from 'prop-types';

import Grid       from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box        from '@material-ui/core/Box';

import {withStyles}  from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';

const styles = theme => ({
  root: {
    padding: 0,
  },
  title: {
    fontSize: '1.8em',
    textAlign: 'left',
    color: '#333',
    marginTop: '0',
    marginBottom: '0',
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
    marginTop: 0,
    marginBottom: 0,
    color: '#444',
  },
  desc: {
    color: '#444',
    marginTop: '0',
    '& > p': {
      margin: theme.spacing(1, 0),
    },
  },
  briefdesc: {
    display: 'inline-block',
    fontSize: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#444',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 10px)',
    top: 'calc(50%-10px)',
  },
  status: {
    margin: 0,
    fontSize: '1em',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.palette.primary.light,
  },
  submitBtn: {
    border: '1px solid #4a148c',
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: '#FFFFFF',
    margin: 5,
    float: 'right',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&:disabled': {
      backgroundColor: '#FFFFFF',
    },
  },
});

const ProposalView = ({ classes, proposal }) => {
  return (
    <Box className={classes.root}>
      <Typography
        variant="subtitle1"
        noWrap
        style={{ fontWeight: '600', fontSize: '20px', marginTop: '0' }}
      >
        Proposal
      </Typography>
      <Grid container id="proposal-description">
        <Grid item xs={6} sm={10}>
          <Box className={classes.brief}>
            <Typography className={classes.briefdesc}>
              {proposal.budget}$ in {proposal.duration} days
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Box className={classes.status}>
            {proposal.status && proposal.status.toUpperCase()}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.brief}>
            <Typography style={{ fontWeight: '700' }}>
              {' '}
              Description:{' '}
            </Typography>
            <ReactMarkdown
              source={proposal.description}
              className={classes.desc}
            />
          </Box>
          <Box className={classes.brief}>
            {proposal.proposalFiles && proposal.proposalFiles.length > 0 && (
              <>
                <Typography style={{ fontWeight: '700' }}> Files </Typography>
                {proposal.proposalFiles.map(file => (
                  <Typography className={classes.desc} key={file.id}>
                    {file.name}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
ProposalView.propTypes = {
  classes: PropTypes.object.isRequired,
  proposal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    proposalFiles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default withStyles(styles)(ProposalView);

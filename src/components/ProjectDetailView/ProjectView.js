import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { withStyles } from '@material-ui/core/styles';
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
  subtitle: {
    fontSize: '1.2em',
    textAlign: 'left',
    color: '#333',
    marginTop: '0',
    marginBottom: '4px',
    fontWeight: 'bold',
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: '#444',
  },
  desc: {
    color: '#444',
    marginTop: '0',
    '& > p': {
      margin: theme.spacing(1, 0),
    },
  },
  budget: {
    display: 'inline-block',
    fontSize: '1em',
    textAlign: 'left',
    fontWeight: '600',
    color: '#444',
  },
  posttime: {
    display: 'inline-block',
    paddingLeft: theme.spacing(3),
    fontSize: '1em',
    textAlign: 'left',
    fontWeight: 'normal',
    color: '#666',
  },
  busy: {
    position: 'absolute',
    left: 'calc(50% - 10px)',
    top: 'calc(50%-10px)',
  },
  status: {
    margin: theme.spacing(1, 0, 0, 0),
    fontSize: '1em',
    textAlign: 'left',
    fontWeight: '600',
    color: theme.palette.primary.light,
  },
  margin: theme.spacing(1),
  minWidth: 120,
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

const ProjectView = ({ classes, project, showFiles = true }) => {
  const posttime = project.updatedAt;
  const postdate = new Date(posttime);
  console.log('ProjectView: ', project.description);
  const desc = project.description.replace(/\n/g, '\n\n');
  return (
    <Box className={classes.root}>
      <Grid container id="project-description">
        {/* <Grid container item sm={12} md={9} spacing={2}> */}
        <Grid item xs={12} sm={10} className="desc">
          <h1 className={classes.title}>{project.title}</h1>
        </Grid>
        <Grid item xs={12} sm={2}>
          <p className={classes.status}>
            {project.status && project.status.toUpperCase()}
          </p>
        </Grid>

        <Grid item xs={12}>
          <Box className={classes.brief}>
            <Typography className={classes.budget}>
              Budget: {project.budget}
            </Typography>
            <Typography className={classes.posttime}>
              Posted: {postdate.toDateString()}
            </Typography>
          </Box>
          {project.due && (
            <Box className={classes.brief}>
              <Typography className={classes.budget}>
                Due Date: {project.due.slice(0, 10)}
              </Typography>
            </Box>
          )}
          <Box className={classes.brief}>
            <Typography style={{ fontWeight: '700' }}>
              {' '}
              Description:{' '}
            </Typography>
            <ReactMarkdown
              source={desc}
              className={classes.desc}
            />
          </Box>
          {showFiles && (
            <Box className={classes.brief}>
              {project.projectFiles && project.projectFiles.length > 0 && (
                <>
                  <Typography style={{ fontWeight: '700' }}> Files </Typography>
                  {project.projectFiles.map(file => (
                    <Typography className={classes.desc} key={file.id}>
                      {file.name}
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

ProjectView.propTypes = {
  classes: PropTypes.object.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    status: PropTypes.string,
    genContractor: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    projectFiles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    projectTemplates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        template: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          categoryList: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              type: PropTypes.string.isRequired,
              value: PropTypes.string.isRequired,
              optionList: PropTypes.arrayOf(PropTypes.object),
            })
          ),
        }),
      })
    ),
  }).isRequired,
};

// const mapStateToProps = (state) => ({
//   project: state.gen_data.selectedProject
// })

// const mapDispatchToProps = {

// }

// const ConnectedProjectView = connect(mapStateToProps)(ProjectView);
export default withStyles(styles)(ProjectView);

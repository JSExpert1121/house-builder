import React, { Component }                                                       from 'react';
import { createStyles, Theme, withStyles }                                        from '@material-ui/core/styles';
import { Button, CircularProgress, Link, Paper, Snackbar, TextField }             from '@material-ui/core';
import { connect }                                                                from 'react-redux';
import { deleteOption, editOption, selectCategory, selectOption, selectTemplate } from '../../../actions/tem-actions';
import SplitPane                                                                  from 'react-split-pane';
import SimpleMDE                                                                  from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { MaterialThemeHOC, UserProfile }                                          from '../../../types/global';
import { History }                                                                from 'history';
import { compose }                                                                from "redux";

const styles = (theme: Theme) => createStyles({
  descTag: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    margin: theme.spacing(1),
    borderBottom: '5px solid ' + theme.palette.primary.light,
    height: 'calc((100vh - 64px - 48px - 16px) / 2)',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 64px - 48px - 16px)',
    },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  halfWidth: {
    width: 'calc(33% - 20px)',
  },
  optList: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    margin: theme.spacing(1),
    borderBottom: '5px solid ' + theme.palette.primary.light,
    height: 'calc((100vh - 64px - 48px - 16px) / 2)',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 64px - 48px - 16px)',
    },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50vw - 10px)',
    top: 'calc(50vh - 10px)',
  },
  editField: {
    lineHeight: '1.5rem',
  },
});

interface Option {
  name: string;
  value: string;
  description: string;
  tem_name: any;
  cat_name: any;
  id: number;
}
interface ConnOptionDetailViewProps extends MaterialThemeHOC {
  option: Option;
  selectTemplate: typeof selectTemplate;
  editOption: typeof editOption;
  selectCategory: typeof selectCategory;
  deleteOption: typeof deleteOption;
  selectOption: typeof selectOption;
  history: History;
  userProfile: UserProfile;
}

interface ConnOptionDetailViewState {
  name: any;
  value: any;
  description: any;
  openCategoryForm: any;
  isSaving: any;
  isEditing: any;
  isDeleting: any;
  snackBar: any;
  snackBarContent: any;
  type: any;
}

class OptionDetailView extends Component<
  ConnOptionDetailViewProps,
  ConnOptionDetailViewState
> {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      value: '',
      description: '',
      openCategoryForm: false,
      isSaving: false,
      isEditing: false,
      snackBar: false,
      snackBarContent: '',
      isDeleting: false,
      type: null,
    };
  }

  componentDidMount() {
    const { option } = this.props;
    if (!option) return;

    this.setState({
      name: option.name,
      value: option.value,
      description: option.description,
    });
  }

  render() {
    const { classes, option } = this.props;

    if (option === null) return <div> </div>;

    if (option['isLoading'] === true)
      return <CircularProgress className={classes.waitingSpin} />;

    return (
      <div>
        <SplitPane
          minSize={50}
          defaultSize={400}
          style={{ position: 'relative' }}
        >
          <Paper className={classes.descTag}>
            <div>
              <Link
                style={{ float: 'left' }}
                onClick={async () => {
                  await this.props.selectTemplate(option.tem_name.id);
                  this.props.history.push('/m_temp/template_detail');
                }}
              >
                {option.tem_name.name}{' '}
              </Link>{' '}
              <span style={{ float: 'left' }}> &ensp;->&ensp; </span>{' '}
              <Link
                style={{ float: 'left' }}
                onClick={async () => {
                  await this.props.selectCategory(option.cat_name.id);
                  this.props.history.push('/m_temp/category_detail');
                }}
              >
                {option.cat_name.name}
              </Link>
            </div>
            <TextField
              label="option name"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.name}
              onChange={val => this.setState({ name: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            <TextField
              label="option value"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.value}
              onChange={val => this.setState({ value: val.target.value })}
              InputProps={{ classes: { input: classes.editField } }}
            />
            // @ts-ignore
            <SimpleMDE
              style={{
                height: '209px',
                overflow: 'auto',
                marginBottom: '8px',
                textAlign: 'left',
              }}
              value={this.state.description}
              onChange={val => this.setState({ description: val })}
              options={{
                placeholder: 'Description here',
              }}
            />
            <div>
              <Button
                className={classes.halfWidth}
                onClick={() =>
                  this.props.history.push('/m_temp/category_detail')
                }
                color="primary"
              >
                Cancel
              </Button>
              <Button
                className={classes.halfWidth}
                disabled={this.state.isSaving}
                onClick={async () => {
                  this.setState({ isSaving: true });
                  const { userProfile } = this.props;
                  const data = {
                    name: this.state.name,
                    type: this.state.type,
                    value: this.state.value,
                    description: this.state.description,
                    updatedBy: userProfile.email,
                  };

                  await this.props.editOption(option.id, data, res => {
                    this.setState({
                      snackBar: true,
                      snackBarContent: res
                        ? 'edit option success'
                        : 'edit option failed',
                    });
                  });
                  await this.props.selectOption(option.id);

                  this.setState({ openCategoryForm: false, isSaving: false });
                }}
                color="primary"
              >
                Save{' '}
                {this.state.isSaving && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
              <Button
                className={classes.halfWidth}
                disabled={this.state.isDeleting}
                onClick={async () => {
                  this.setState({ isDeleting: true });
                  await this.props.deleteOption(option.id, res => {});

                  await this.props.selectCategory(option.cat_name.id);
                  this.props.history.push('/m_temp/category_detail');
                  this.setState({ isDeleting: false });
                }}
                color="primary"
              >
                Delete
                {this.state.isDeleting && (
                  <CircularProgress size={24} thickness={4} />
                )}
              </Button>
            </div>
          </Paper>
          <Paper className={classes.optList}></Paper>
        </SplitPane>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackBar}
          onClose={() =>
            this.setState({
              snackBar: false,
            })
          }
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id"> {this.state.snackBarContent}</span>}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  option: state.tem_data.selectedOption,
  userProfile: state.global_data.userProfile,
});

const mapDispatchToProps = {
  selectOption,
  selectTemplate,
  selectCategory,
  editOption,
  deleteOption,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OptionDetailView)
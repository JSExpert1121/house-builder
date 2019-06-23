import React, { Component }                            from 'react';
import { History }                                     from 'history';
import { createStyles, Theme, withStyles }             from '@material-ui/core/styles';
import TextField                                       from '@material-ui/core/TextField';
import { Avatar, Box, Button, Card, CircularProgress } from '@material-ui/core';

import auth0Client from '../../auth0/auth';

import TSnackbarContent from '../../components/SnackBarContent';
import axios            from 'axios';

import { connect }                       from 'react-redux';
import { setUserProfileAction }          from '../../actions/global-actions';
import { MaterialThemeHOC, UserProfile } from '../../types/global';
import { compose }                       from 'redux';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 136px)',
    marginTop: 'auto',
    marginBottom: 'auto',
    overflow: 'auto',
    flexDirection: 'column',
    width: '100%'
  },
  container: {
    position: 'relative',
    left: '0px',
    right: '0px',
    width: '300px',
    height: 'auto',
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '0',
    [theme.breakpoints.up('sm')]: {
      width: '400px',
    },
  },
  textFieldHalf: {
    margin: theme.spacing(1),
    width: '120px',
    [theme.breakpoints.up('sm')]: {
      width: '170px',
    },
  },
  textFieldFull: {
    margin: theme.spacing(1),
    width: '260px',

    [theme.breakpoints.up('sm')]: {
      width: '360px',
    },
  },
  avatar: {
    marginLeft: 90,
    marginTop: 20,
    marginBottom: 30,
    width: 100,
    height: 100,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 140,
    },
  },
  status: {
    position: 'absolute',
    left: '20px',
    top: '10px',
    color: 'blue',
    fontSize: '12px',
  },
  btnBox: {
    margin: theme.spacing(1),
  },
  submitButton: {
    width: 120,
    [theme.breakpoints.up('sm')]: {
      width: 170,
    },
    border: '1px solid #4a148c',
    color: 'white',
    marginLeft: '20px',
    backgroundColor: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&:disabled': {
      backgroundColor: '#FFFFFF',
    },
  },
  cancelButton: {
    border: '1px solid #c7a4ff',
    width: 120,
    [theme.breakpoints.up('sm')]: {
      width: 170,
    },
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },

  successAlert: {
    width: '400px',
    marginBottom: '10px',
  },
});

interface ProfileEditViewProps extends MaterialThemeHOC {
  userProfile: UserProfile;
  setUserProfileAction: (profile: UserProfile) => any;
  history: History;
}

interface ProfileEditViewState {
  firstname: any;
  lastname: any;
  email: any;
  picture: any;
  password: any;
  passwordc: any;
  profile: any;
  isSuccess: boolean;
  company: any;
  street: any;
  city: any;
  phone: any;
  isGenChecked: boolean;
  isSubChecked: boolean;
  isSaving: boolean;
  isDataLoaded: boolean;
  hasFiles: any;
  status: any;
}

class ProfileEditView extends Component<
  ProfileEditViewProps,
  ProfileEditViewState
> {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      picture: '',
      password: '',
      passwordc: '',
      profile: null,
      isSuccess: false,
      company: '',
      street: '',
      city: '',
      phone: '',
      isGenChecked: false,
      isSubChecked: false,
      isSaving: false,
      isDataLoaded: false,
      hasFiles: false,
      status: '',
    };
  }

  async componentDidMount() {
    const { userProfile } = this.props;

    try {
      let res = await axios.get(
        process.env.REACT_APP_PROJECT_API +
          'contractors/' +
          userProfile.user_metadata.contractor_id
      );
      let address = res.data.address || {
        name: '',
        city: '',
        street: '',
        phone: '',
      };
      let status = res.data.status;
      this.setState({
        status: status,
        company: address.name,
        street: address.street,
        city: address.city,
        phone: address.phone,
        firstname: userProfile.user_metadata.firstname,
        lastname: userProfile.user_metadata.lastname,
        email: userProfile.email,
        picture: userProfile.picture,
        isGenChecked:
          userProfile.user_metadata.roles.includes('Gen') ||
          userProfile.user_metadata.roles.includes('GenSub')
            ? true
            : false,
        isSubChecked:
          userProfile.user_metadata.roles.includes('Sub') ||
          userProfile.user_metadata.roles.includes('GenSub')
            ? true
            : false,
        isDataLoaded: true,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSuccess: false });
  };

  handleRoleChange = name => event => {
    // this.setState({ [name]: event.target.checked });
  };

  handleConfirm = async () => {
    const { userProfile } = this.props;

    this.setState({
      isSuccess: false,
      isSaving: true,
    });

    let cont_id = userProfile.user_metadata.contractor_id;
    // let addr;
    await axios
      .get(process.env.REACT_APP_PROJECT_API + 'contractors/' + cont_id)
      .then(response => {
        // addr = response.data.address;
      })
      .catch(error => {
        console.log(error.message);
      });

    let addressData = {
      name: this.state.company,
      street: this.state.street,
      city: this.state.city,
      phone: this.state.phone,
    };

    await axios.post(
      process.env.REACT_APP_PROJECT_API + 'contractors/' + cont_id,
      {
        email: userProfile.user_metadata.email,
        updatedBy: userProfile.user_metadata.email,
        address: addressData,
      }
    );

    const new_prof = {
      user_metadata: {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
      },
    };

    await auth0Client.updateProfile(new_prof, profile => {
      this.props.setUserProfileAction(profile);
      this.setState({
        isSuccess: true,
        isSaving: false,
      });
    });
  };

  render() {
    const { classes } = this.props;
    const status = 'Status: ' + this.state.status.toUpperCase();
    if (this.state.isDataLoaded === false)
      return <CircularProgress className={classes.waitingSpin} />;

    return (
      <div className={classes.root}>
        {this.state.isSuccess ? (
          <TSnackbarContent
            className={classes.successAlert}
            onClose={this.handleClose}
            variant="success"
            message="Your profile has been saved!"
          />
        ) : (
          <div />
        )}
        <form noValidate autoComplete="off">
          <Card className={classes.container}>
            <Avatar
              alt="Ivan"
              src={this.state.picture}
              className={classes.avatar}
            />
            <TextField
              label="first name"
              className={classes.textFieldHalf}
              value={this.state.firstname}
              onChange={val => this.setState({ firstname: val.target.value })}
              margin="normal"
            />

            <TextField
              label="last name"
              className={classes.textFieldHalf}
              value={this.state.lastname}
              onChange={val => this.setState({ lastname: val.target.value })}
              margin="normal"
            />

            <TextField
              disabled
              label="email"
              className={classes.textFieldFull}
              value={this.state.email}
              onChange={val => this.setState({ email: val.target.value })}
              margin="normal"
            />
            <TextField
              label="company"
              className={classes.textFieldFull}
              value={this.state.company}
              onChange={val => this.setState({ company: val.target.value })}
              margin="normal"
            />

            <TextField
              label="street"
              className={classes.textFieldHalf}
              value={this.state.street}
              onChange={val => this.setState({ street: val.target.value })}
              margin="normal"
            />

            <TextField
              label="city"
              className={classes.textFieldHalf}
              value={this.state.city}
              onChange={val => this.setState({ city: val.target.value })}
              margin="normal"
            />

            <TextField
              label="phone"
              className={classes.textFieldFull}
              value={this.state.phone}
              onChange={val => this.setState({ phone: val.target.value })}
              margin="normal"
            />
            <Box component="div" className={classes.status}>
              {status}
            </Box>

            <Box className={classes.btnBox}>
              <Button
                className={classes.cancelButton}
                onClick={() => this.props.history.replace('/')}
              >
                Cancel
              </Button>
              <Button
                disabled={this.state.isSaving}
                className={classes.submitButton}
                onClick={this.handleConfirm}
              >
                Confirm
              </Button>
            </Box>
            {this.state.isSaving && (
              <CircularProgress />
            )}
          </Card>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setUserProfileAction
};

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProfileEditView)

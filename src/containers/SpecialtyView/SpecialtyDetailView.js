
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { UpdateSpec, LoadSpec } from '../../actions/spec-actions';

import {
    withStyles, Paper, Button, Container,
    Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText,
    TextField, CircularProgress,
} from '@material-ui/core';


const styles = theme => ({
    root: {
        width: '300px',
		[theme.breakpoints.up('sm')]: {
            width: '400px',
		},
        position: "relative"
    },
    waitingSpin: {
        position: "absolute",
        left: "calc(50% - 20px)",
        top: "calc(50% - 20px)",
    },
    busy: {
        position: "absolute",
        left: "calc(50% - 16px)",
        top: "calc(50% - 16px)"
    },
    btnWidth: {
        width: "calc(33% - 20px)"
    },
    descTag: {
        padding: theme.spacing.unit,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        margin: theme.spacing.unit,
        borderBottom: "5px solid " + theme.palette.primary.light,
        height: "calc((100vh - 64px - 72px - 20px) / 2)",
        [theme.breakpoints.up('md')]: {
            height: "calc(100vh - 64px - 72px - 20px)",
        },
        display: 'flex',
        flexDirection: "column",
        overflow: "scroll"
    }
});

export class SpecialtyDetailView extends Component {

    state = {
        updating: false,
        loading: true,
        showAlert: false,
        title: '',
        message: '',
        value: '',
        name: '',
        description: ''
    }

    static propTypes = {
        specid: PropTypes.string.isRequired,
        history: PropTypes.shape({
            push: PropTypes.func.isRequired
        }).isRequired,
        updateSpec: PropTypes.func.isRequired,
        loadSpec: PropTypes.func.isRequired,
        user: PropTypes.shape({
            email: PropTypes.string.isRequired,
        }).isRequired
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const data = await this.props.loadSpec(this.props.specid);
            this.setState({ loading: false, name: data.name, value: data.value, description: data.description });
        } catch (error) {
            this.setState({ loading: false, showAlert: true, title: 'error', message: 'Loading failed.' });
        }
    }

    handleSave = async () => {
        const spec = {
            id: this.props.specid,
            name: this.state.name,
            value: this.state.value,
            description: this.state.description,
            updatedBy: this.props.user.email
        };

        this.setState({ updating: true });
        console.log(spec);
        try {
            await this.props.updateSpec(spec);
            this.setState({ showAlert: true, updating: false, title: 'info', message: 'Updated successfully.' });
        } catch (error) {
            this.setState({ showAlert: true, updating: false, title: 'error', message: 'Updating failed.' });
        }
    }

    handlePop = () => {
        this.props.history.push("/m_spec");
    }

    render() {

        const { classes } = this.props;

        if (this.state.loading) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Container fixed className={classes.root}>
                {this.state.updating && <CircularProgress className={classes.busy} />}
                <Paper className={classes.descTag}>
                    <TextField
                        label="specialty name" margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={this.state.name}
                        onChange={(val) => this.setState({ name: val.target.value })}
                        InputProps={{ classes: { input: classes.editField } }} />
                    <TextField
                        label="value" margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={this.state.value}
                        onChange={(val) => this.setState({ value: val.target.value })} />
                    <TextField
                        label="description" multiline
                        rows="10" margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={this.state.description}
                        onChange={(val) => this.setState({ description: val.target.value })} />
                    <div>
                        <Button disabled={this.state.updating} onClick={this.handlePop} color="primary" className={classes.btnWidth}>
                            Cancel
                        </Button>
                        <Button disabled={this.state.updating} onClick={this.handleSave} color="primary" className={classes.btnWidth}>
                            Save
                        </Button>
                    </div>
                    <Dialog
                        open={this.state.showAlert}
                        onClose={this.showAlert}
                        aria-labelledby="alert-dialog-title">
                        <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.state.message}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handlePop} color="primary" autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    specid: state.spec_data.currentSpecId,
    user: state.global_data.userProfile
});

const mapDispatchToProps = dispatch => ({
    loadSpec: (id) => dispatch(LoadSpec(id)),
    updateSpec: (spec) => dispatch(UpdateSpec(spec))
});

const connectedSpecDetailView = connect(mapStateToProps, mapDispatchToProps)(SpecialtyDetailView);
export default withRouter(withStyles(styles)(connectedSpecDetailView));

import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import Button from 'components/CustomButtons/Button.jsx';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar from 'components/shared/CustomSnackbar';
import { approveContractor, rejectContractor } from 'actions/cont-actions';

import { ContractorStatus, ContractorInfo } from 'types/contractor';
import { ISnackbarProps } from 'types/components';


const styles = createStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        position: 'relative'
    },
    waitingSpin: {
        position: 'absolute',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    textField: {
        boxShadow: '0 0 5px #999999',
        width: '100%',
    },
    buttons: {
        marginTop: theme.spacing(1),
        textAlign: 'center',
    }
}));

export interface IContractorInfoViewProps {
    approveContractor: (id: string, data: ContractorStatus) => Promise<void>;
    rejectContractor: (id: string, data: ContractorStatus) => Promise<void>;
    contractorUpdated: () => Promise<void>;
    selectedContractor: ContractorInfo;
    classes: ClassNameMap<string>;
}

export interface IContractorInfoViewState extends ContractorStatus, ISnackbarProps {
    isBusy: boolean;
}

class ContractorInfoView extends React.Component<IContractorInfoViewProps, IContractorInfoViewState> {
    constructor(props: IContractorInfoViewProps) {
        super(props);

        this.state = {
            isBusy: false,
            status: props.selectedContractor.status,
            statusReason: props.selectedContractor.statusReason,
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    reasonChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ statusReason: event.target.value });
    }

    approve = async () => {
        const { 
            selectedContractor, 
            approveContractor,
            contractorUpdated
        } = this.props;

        this.setState({ isBusy: true });
        try {
            await approveContractor(
                selectedContractor.id,
                {
                    status: 'ACTIVE',
                    statusReason: this.state.statusReason
                }
            );

            await contractorUpdated();
            this.setState({
                showMessage: true,
                message: 'Approve success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('Approve: ', error);
            this.setState({
                showMessage: true,
                message: 'Approve failed',
                variant: 'error',
                isBusy: false
            });
        }
    }

    reject = async () => {
        const {
            selectedContractor, 
            rejectContractor, 
            contractorUpdated 
        } = this.props;

        this.setState({ isBusy: true });
        try {
            await rejectContractor(
                selectedContractor.id,
                {
                    status: 'REJECTED',
                    statusReason: this.state.statusReason
                }
            );

            await contractorUpdated();
            this.setState({
                showMessage: true,
                message: 'Reject success',
                variant: 'success',
                isBusy: false
            });
        } catch (error) {
            console.log('Reject: ', error);
            this.setState({
                showMessage: true,
                message: 'Reject failed',
                variant: 'error',
                isBusy: false
            });
        }
    }

    public render() {

        const { classes, selectedContractor } = this.props;
        return (
            <Box className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Email</CustomTableCell>
                            <CustomTableCell align="center">Name</CustomTableCell>
                            <CustomTableCell align="center">City</CustomTableCell>
                            <CustomTableCell align="center">Street</CustomTableCell>
                            <CustomTableCell align="center">Status</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={classes.row} hover>
                            <CustomTableCell component="th" scope="row" align="center">
                                {selectedContractor ? selectedContractor.email : 'N/A'}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                {selectedContractor.address
                                    ? selectedContractor.address.name
                                    : 'N/A'}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                {selectedContractor.address
                                    ? selectedContractor.address.city
                                    : 'N/A'}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                {selectedContractor.address
                                    ? selectedContractor.address.street
                                    : 'N/A'}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                {selectedContractor.status ? selectedContractor.status : 'N/A'}
                            </CustomTableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <br />
                Approve/Reject Reason
                <br />
                <br />
                <TextField
                    placeholder=""
                    multiline={true}
                    rows={4}
                    value={this.state.statusReason}
                    onChange={this.reasonChange}
                    className={classes.textField}
                />
                <Box className={classes.buttons}>
                    <Button variant="contained" onClick={this.reject}>
                        Reject
                    </Button>
                    <Button color="primary" onClick={this.approve}>
                        Approve
                    </Button>
                </Box>
                <CustomSnackbar
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={this.state.handleClose}
                />
                {this.state.isBusy && <CircularProgress className={classes.waitingSpin} />}
            </Box>
        );
    }
}

const mapDispatchToProps = {
    approveContractor,
    rejectContractor,
};

export default compose(
    withStyles(styles),
    connect(
        null,
        mapDispatchToProps
    )
)(ContractorInfoView);

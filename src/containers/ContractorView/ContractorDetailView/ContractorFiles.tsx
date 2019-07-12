import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { DropzoneDialog } from 'material-ui-dropzone';

import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar from 'components/shared/CustomSnackbar';
import {
    addFiles,
    deleteFile,
    getContractorDetailById
} from '../../../actions/cont-actions';
import { ContractorInfo } from 'types/contractor';
import { ISnackbarProps } from 'types/components';

const styles = createStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    titleBtn: {
        color: '#fff',
        padding: '6px',
    },
    button: {
        padding: '6px',
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
}));

export interface IContractorFilesProps {
    contractorUpdated: () => Promise<void>;
    addFiles: (id: string, files: File[]) => Promise<void>;
    deleteFile: (id: string, name: string) => Promise<void>;
    getContractorDetailById: (id: string) => Promise<void>;
    selectedContractor: ContractorInfo;
    classes: ClassNameMap<string>;
}

export interface IContractorFilesState extends ISnackbarProps {
    openUploadForm: boolean;
    isBusy: boolean;
    files: File[];
}

class ContractorFiles extends React.Component<IContractorFilesProps, IContractorFilesState> {
    constructor(props: IContractorFilesProps) {
        super(props);

        this.state = {
            openUploadForm: false,
            isBusy: false,
            files: [],
            showMessage: false,
            variant: 'success',
            message: '',
            handleClose: this.closeMessage
        }
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleUploadFiles = async files => {
        const { selectedContractor } = this.props;

        this.setState({ isBusy: true });
        try {
            await this.props.addFiles(selectedContractor.id, files);
            await this.props.contractorUpdated();
            this.setState({
                openUploadForm: false,
                isBusy: false,
                showMessage: true,
                message: 'File Upload Success',
                variant: 'success'
            });
        } catch (error) {
            console.log('ContractorFiles.handleUploadFiles: ', error);
            this.setState({
                openUploadForm: false,
                isBusy: false,
                showMessage: true,
                message: 'File Upload Failed',
                variant: 'error'
            });
        }
    }

    handleDeleteFile = async name => {
        const { selectedContractor } = this.props;

        this.setState({
            isBusy: true,
        });

        try {
            await this.props.deleteFile(selectedContractor.id, name);
            await this.props.contractorUpdated();
            // await this.props.getContractorDetailById(selectedContractor.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Delete Success',
                variant: 'success'
            });
        } catch (error) {
            console.log('ContractorFiles.handleDeleteFile: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'File Delete Failed',
                variant: 'error'
            });
        }
    };


    public render() {

        const { classes, selectedContractor } = this.props;
        const contractorFiles = selectedContractor.contractorFiles;
        const remoteRoot = process.env.REACT_APP_PROJECT_API + '/contractors/' + selectedContractor.id + '/files/';

        return (
            <Box className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell align="center">Name</CustomTableCell>
                            <CustomTableCell align="center">
                                <IconButton
                                    className={classes.titleBtn}
                                    onClick={() => this.setState({ openUploadForm: true })}
                                >
                                    <NoteAddIcon />
                                </IconButton>
                            </CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contractorFiles.map(row => (
                            <TableRow className={classes.row} key={row.id} hover>
                                <CustomTableCell component="th" scope="row" align="center">
                                    <a download={row.name} href={remoteRoot + row.name}>
                                        {row.name}
                                    </a>
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <IconButton
                                        className={classes.button}
                                        aria-label="Delete"
                                        color="primary"
                                        onClick={() => this.handleDeleteFile(row.name)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <DropzoneDialog
                    open={this.state.openUploadForm}
                    onSave={this.handleUploadFiles}
                    maxFileSize={52428800}
                    showPreviewsInDropzone={true}
                    showPreviews={false}
                    acceptedFiles={[
                        'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
                    ]}
                    filesLimit={100}
                    onClose={() => this.setState({ openUploadForm: false })}
                />
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
    addFiles,
    deleteFile,
    getContractorDetailById
};

export default compose(
    withStyles(styles),
    connect(
        null,
        mapDispatchToProps
    )
)(ContractorFiles);

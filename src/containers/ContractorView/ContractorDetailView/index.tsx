import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import ContractorInfoView from './ContractorInfo';
import ContractorSpecialties from './ContractorSpecialties';
import ContractorFiles from './ContractorFiles';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { selectContractor, updateContractor } from 'actions/cont-actions';
import { ContractorInfo } from 'types/contractor';


const styles = createStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 'calc(100vh - 64px - 56px - 16px)',
    },
    toolbarstyle: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        flexGrow: 1,
    },
    backBtn: {
        color: theme.palette.primary.dark,
    },
}));

interface IContractorDetailViewProps extends RouteComponentProps<{ id: string }> {
    selectedContractor: ContractorInfo;
    selectContractor: (id: string) => Promise<void>;
    updateContractor: (id: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

interface IContractorDetailViewState {
    curDetailTab: number;
}

class ContractorDetailView extends React.Component<IContractorDetailViewProps, IContractorDetailViewState> {

    constructor(props: Readonly<IContractorDetailViewProps>) {
        super(props);

        this.state = {
            curDetailTab: 0,
        };
    }

    componentDidMount() {
        this.props.selectContractor(this.props.match.params.id);
    }

    handleTabChange = (event, value) => {
        this.setState({
            curDetailTab: value,
        });
    };

    handleBack = () => {
        this.props.history.push('/m_cont');
    };

    contractorUpdated = () => {
        this.props.updateContractor(this.props.match.params.id);
    }

    public render() {

        const { classes, selectedContractor } = this.props;
        const curDetailTab = this.state.curDetailTab;

        if (!selectedContractor) {
            return <CircularProgress style={{ position: 'relative', left: 'calc(50% - 10px)', top: '40vh' }} />;
        }

        return (
            <Box className={classes.root}>
                <Paper square>
                    <Box style={{ display: 'flex' }}>
                        <IconButton className={classes.backBtn} onClick={this.handleBack}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Tabs
                            value={curDetailTab}
                            onChange={this.handleTabChange}
                            variant="scrollable"
                            indicatorColor="primary"
                            textColor="primary"
                            scrollButtons="off"
                            className={classes.toolbarstyle}
                        >
                            <Tab label="Info" />
                            <Tab label="Files" />
                            <Tab label="Specialties" />
                        </Tabs>
                    </Box>
                    {curDetailTab === 0 && (
                        <ContractorInfoView
                            selectedContractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                    {curDetailTab === 1 && (
                        <ContractorFiles
                            selectedContractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                    {curDetailTab === 2 && (
                        <ContractorSpecialties
                            selectedContractor={selectedContractor}
                            contractorUpdated={this.contractorUpdated}
                        />
                    )}
                </Paper>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    selectedContractor: state.cont_data.selectedContractor,
});

const mapDispatchToProps = {
    selectContractor,
    updateContractor
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ContractorDetailView));
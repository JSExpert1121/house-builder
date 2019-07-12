import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppsIcon from '@material-ui/icons/Apps';

import CustomTabs from 'components/shared/CustomTabs';
import SecuredRoute from 'routers/SecuredRoute';
import AllContractorsView from './AllContractorsView';
import ContractorDetailView from './ContractorDetailView';
import { UserProfile } from 'types/global';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    contentWrapper: {
        padding: theme.spacing(1),
    },
}));

interface IContractorViewProps extends RouteComponentProps {
    userProfile: UserProfile;
}

const ContractorView: React.SFC<IContractorViewProps> = (props) => {

    const classes = useStyles({});
    return (
        <Box className={classes.root}>
            <CustomTabs
                tabs={[
                    {
                        href: `/m_cont/all_contractors`,
                        label: 'All Contractors',
                        icon: AppsIcon,
                    },
                ]}
            />
            <Box component='main' className={classes.contentWrapper}>
                <Switch>
                    <SecuredRoute
                        path="/m_cont/all_contractors"
                        component={AllContractorsView}
                    />
                    <SecuredRoute
                        path="/m_cont/contractor_detail/:id"
                        component={ContractorDetailView}
                    />
                    <Redirect path="/m_cont" to={`/m_cont/all_contractors`} />
                </Switch>
            </Box>
        </Box>
    );
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default connect(mapStateToProps)(ContractorView);


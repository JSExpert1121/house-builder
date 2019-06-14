import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        padding: theme.spacing(1, 0)
    },
    title: {
        fontSize: "20px",
        fontWeight: '600',
        textAlign: "left",
        marginTop: "0",
        marginBottom: "0",
        lineHeight: '2'
    },
    bottomLine: {
        borderBottom: "1px solid #dedede"
    },
    template: {
        display: "inline",
        fontSize: "1em",
        textAlign: "left",
        color: "#444",
        marginTop: "0",
    },
    brief: {
        margin: 0,
    },
    desc: {
        color: "#444",
        marginTop: "0",
        textDecoration: "none"
    },
    email: {
        display: "inline-block",
        fontSize: "1em",
        textAlign: "left",
        fontWeight: "600",
        color: "#666",
        textDecoration: "none"
    },
    status: {
        display: "inline-block",
        fontSize: "16px",
        textAlign: "left",
        fontWeight: "600",
        color: theme.palette.primary.light,
        textDecoration: "none"
    }
});

const TITLE = 'Contractor Information';
const GenContractorView = ({ classes, contractor, fullview = false }) => {
    return (
        <Box className={classes.root}>
            <Typography variant='subtitle1' className={classes.title}>
                {TITLE}
            </Typography>
            <Box style={{ width: '100%' }}>
                <Grid container id="contractor-info" className={classes.brief}>
                    {fullview ? (
                        <>
                            <Grid item xs={12} sm={10} style={{ padding: '4px' }}>
                                <Box className={classes.email}>Email: {contractor.email}</Box>
                            </Grid>
                            <Grid item xs={12} sm={2} style={{ padding: '4px' }}>
                                <Box className={classes.status}>{contractor.status}</Box>
                            </Grid>
                        </>
                    ) : (
                            <>
                                <Grid item xs={12} style={{ padding: '4px' }}>
                                    <Box className={classes.email}>Email: {contractor.email}</Box>
                                </Grid>
                                <Grid item xs={12} style={{ padding: '4px' }}>
                                    <Box className={classes.email}>Status:&nbsp;</Box>
                                    <Box className={classes.status}>{contractor.status}</Box>
                                </Grid>
                            </>
                        )}
                    {contractor.address && (
                        <Grid item xs={12} style={{ padding: '4px' }}>
                            <Typography className={classes.desc}>
                                From {contractor.address.name}, {contractor.address.street}, {contractor.address.city}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box >
    )
}

GenContractorView.propTypes = {
    classes: PropTypes.object.isRequired,
    fullview: PropTypes.bool,
    contractor: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        address: PropTypes.shape({
            name: PropTypes.string,
            street: PropTypes.string,
            city: PropTypes.string
        }),
    }),
}
export default withStyles(styles)(GenContractorView);

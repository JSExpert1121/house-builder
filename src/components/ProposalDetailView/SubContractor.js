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
        padding: theme.spacing(1)
    },
    title: {
        fontSize: "1.2em",
        fontWeight: '600',
        textAlign: "left",
        color: "#333",
        marginTop: "0",
        paddingLeft: theme.spacing(1),
        marginBottom: "0"
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
        paddingLeft: theme.spacing(1)
    },
    brief: {
        margin: 0,
        padding: theme.spacing(1),
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
        margin: theme.spacing(1, 0, 0, 1),
        fontSize: "1em",
        textAlign: "left",
        fontWeight: "600",
        color: theme.palette.primary.light,
        textDecoration: "none"
    }
});

const TITLE = 'SubContractor Information';
const SubContractorView = ({ classes, subContractor }) => {
    return (
        <Card className={classes.root} title={TITLE}>
            <Typography variant='h1' className={classes.title}>
                {TITLE}
            </Typography>
            <Box to='#' style={{ width: '100%' }}>
                <Grid container spacing={3} id="sub-contractor-info" className={classes.brief}>
                    <Grid item xs={12} sm={8} style={{ padding: '4px' }}>
                        <Box className={classes.email}>Email: {subContractor.email}</Box>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ padding: '4px' }}>
                        <Box className={classes.status}>{subContractor.status}</Box>
                    </Grid>
                    {subContractor.address && (
                        <Grid item xs={12} style={{ padding: '4px' }}>
                            <Typography className={classes.desc}>
                                From {subContractor.address.name}, {subContractor.address.street}, {subContractor.address.city}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Card >
    )
}

export default withStyles(styles)(SubContractorView);

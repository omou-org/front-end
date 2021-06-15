/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    TextField,
    TableContainer,
    TableCell,
    TableHead,
    Table,
    TableRow,
    TableBody,
    Breadcrumbs,
} from '@material-ui/core';

import { useHistory, withRouter, NavLink } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        padding: '1em',
    },
});

const EditTuitionRules = ({ location, match }) => {
    const classes = useStyles();
    let title = location.state?.title;
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <Breadcrumbs separator='>' aria-label='breadcrumb'>
                    <NavLink color='inherit' to='/adminportal/tuition-rules'>
                        ALL TOPICS
                    </NavLink>

                    <NavLink color='inherit' to='/adminportal/tuition-rules'>
                        {title}
                    </NavLink>
                </Breadcrumbs>
            </Grid>
            <Grid item xs={2}>
                <h1>{title}</h1>
            </Grid>
        </Grid>
    );
};

export default withRouter(EditTuitionRules);

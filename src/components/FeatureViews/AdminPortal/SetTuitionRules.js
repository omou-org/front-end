import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    Grid,
    // TextField,
    // TableContainer,
    // TableCell,
    // TableHead,
    // Table,
    // TableRow,
    // TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        padding: '1em',
    },
});

const SetTuitionRules = ({
    location /*match  you can use this propety to get the id  */,
}) => {
    const classes = useStyles();
    let title = location.state?.name;

    return (
        <Grid container className={classes.root}>
            <Grid item xs={1}>
                <NavLink color='inherit' to='/adminportal/tuition-rules/'>
                    {'< ALL TOPICS'}
                </NavLink>
            </Grid>
            <Grid item xs={2}>
                <h1>{title}</h1>
            </Grid>
        </Grid>
    );
};

export default withRouter(SetTuitionRules);

SetTuitionRules.propTypes = {
    location: PropTypes.object,
    // match: PropTypes.object,
};

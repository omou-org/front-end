import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
/**
 * @param {string} title - Main header of Eyebrow component
 * @param {string} subText - Below eyebrow to show smaller text
 * @returns React JSX with Typography
 */

const useStyles = makeStyles({
    root: {
        textAlign: 'left',
    },
    eyebrow: {
        fontSize: '17px',
        fontWeight: 500,
    },
    subtext: {
        fontStyle: 'italic',
        fontSize: '15px',
    },
});

const Eyebrow = ({ title, subText }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography className={classes.eyebrow}>{title}</Typography>
            {subText && (
                <Typography className={classes.subtext}>{subText}</Typography>
            )}
        </div>
    );
};

export default Eyebrow;

Eyebrow.propTypes = {
    title: PropTypes.string,
    subText: PropTypes.string,
};

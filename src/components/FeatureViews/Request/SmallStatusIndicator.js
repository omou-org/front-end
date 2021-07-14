import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {cloudy, green2} from 'theme/muiTheme';
import PropTypes from "prop-types";

const useStyles = makeStyles({
    circle: {
        height: '16px',
        width: '16px',
        margin: '0px',
        backgroundColor: cloudy,
        borderRadius: '50%',
    },
    line: {
        height: '2px',
        width: '23px',
        backgroundColor: cloudy,
    },
    active: {
        backgroundColor: green2,
    },
    indicatorContainer: {
        width: '94px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Circle = ({isActive}) => {
    const classes = useStyles();

    return (
        <div
            className={`${classes.circle} ${isActive && classes.active}`}
        ></div>
    );
};

Circle.propTypes = {
    isActive: PropTypes.bool,
};

const Line = ({isActive}) => {
    const classes = useStyles();

    return (
        <div className={`${classes.line} ${isActive && classes.active}`}></div>
    );
};

Line.propTypes = {
    isActive: PropTypes.bool,
};

const SmallStatusIndicator = ({status}) => {
    const classes = useStyles();

    let statusArr = Array(5).fill(false);

    switch (status) {
        case 'submitted':
            statusArr = [...Array(1).fill(true), ...Array(4).fill(false)];
            break;
        case 'instructorApproved':
            statusArr = [...Array(3).fill(true), ...Array(2).fill(false)];
            break;
        case 'verified':
            statusArr = [...Array(5).fill(true)];
            break;
    }

    return (
        <div className={classes.indicatorContainer}>
            <Circle isActive={statusArr[0]}/>
            <Line isActive={statusArr[1]}/>
            <Circle isActive={statusArr[2]}/>
            <Line isActive={statusArr[3]}/>
            <Circle isActive={statusArr[4]}/>
        </div>
    );
};

SmallStatusIndicator.propTypes = {
    status: PropTypes.string,
};

export default SmallStatusIndicator;

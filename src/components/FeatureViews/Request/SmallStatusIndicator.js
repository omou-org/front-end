import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    circle: {
        height: '16px',
        width: '16px',
        margin: '0px',
        backgroundColor: '#C4C4C4',
        borderRadius: '50%'
    },
    line: {
        height: '2px',
        width: '23px',
        backgroundColor: '#C4C4C4',
    },
    active: {
        backgroundColor: '#27AE60'
    },
    indicatorContainer: {
        width: '94px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const Circle = ({isActive}) => {

    const classes = useStyles();

    return (
        <div className={`${classes.circle} ${isActive && classes.active}`}></div>
    )
}

const Line = ({isActive}) => {
    const classes = useStyles();

    return (
        <div className={`${classes.line} ${isActive && classes.active}`}></div>
    )
}

// Status choices
// submitted
// instructorApproved
// verified
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
    )
}

export default SmallStatusIndicator;
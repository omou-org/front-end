import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles({
    circle: {
        height: '26px',
        width: '26px',
        margin: '0px',
        backgroundColor: '#C4C4C4',
        borderRadius: '50%'
    },
    line: {
        height: '2px',
        width: '30vw',
        backgroundColor: '#C4C4C4',
    },
    active: {
        backgroundColor: '#27AE60'
    },
    indicatorDisplay: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    indicatorLabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 5vw 0px 5vw'
    },
    iconStyle: {
        color: 'white'
    }
})

const Circle = ({isActive}) => {

    const classes = useStyles();

    return (
        <div className={`${classes.circle} ${isActive && classes.active}`}>
            <CheckIcon className={classes.iconStyle}/>
        </div>
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
const LargeStatusIndicator = ({status}) => {

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
            <div className={classes.indicatorDisplay}>
                <Circle isActive={statusArr[0]}/>
                <Line isActive={statusArr[1]}/>
                <Circle isActive={statusArr[2]}/>
                <Line isActive={statusArr[3]}/>
                <Circle isActive={statusArr[4]}/>
            </div>
            <div className={classes.indicatorLabels}>
                <Typography variant='h5'>Submit Request</Typography>
                <Typography variant='h5'>Instructor's Response</Typography>
                <Typography variant='h5'>Verification</Typography>
            </div>
        </div>
        
    )
}

export default LargeStatusIndicator;
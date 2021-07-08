import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import { Typography } from '@material-ui/core';
import { cloudy, green2 } from 'theme/muiTheme';

const useStyles = makeStyles({
    circle: {
        height: '26px',
        width: '26px',
        margin: '0px',
        backgroundColor: cloudy,
        borderRadius: '50%',
    },
    line: {
        height: '2px',
        width: '30vw',
        backgroundColor: cloudy,
    },
    active: {
        backgroundColor: green2,
    },
    indicatorDisplay: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        marginBottom: '40px',
    },
    iconStyle: {
        color: 'white',
    },
    submitText: {
        position: 'absolute',
        marginTop: '5px',
        marginLeft: '-29px',
        width: '100px',
    },
    instructorText: {
        position: 'absolute',
        marginTop: '5px',
        marginLeft: '-43px',
        width: '125px',
    },
    verifiedText: {
        position: 'absolute',
        marginTop: '5px',
        marginLeft: '-20px',
        width: '80px',
    },
    inactiveText: {
        color: cloudy,
    },
    labelContainer: {
        position: 'relative',
    },
});

const Circle = ({ isActive }) => {
    const classes = useStyles();

    return (
        <div className={`${classes.circle} ${isActive && classes.active}`}>
            <CheckIcon className={classes.iconStyle} />
        </div>
    );
};

const Line = ({ isActive }) => {
    const classes = useStyles();

    return (
        <div className={`${classes.line} ${isActive && classes.active}`}></div>
    );
};

const LargeStatusIndicator = ({ status }) => {
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
                <div className={classes.labelContainer}>
                    <Circle isActive={statusArr[0]} />
                    <Typography
                        variant='h5'
                        className={`${classes.submitText} ${
                            !statusArr[0] && classes.inactiveText
                        }`}
                    >
                        Submit Request
                    </Typography>
                </div>
                <Line isActive={statusArr[1]} />
                <div className={classes.labelContainer}>
                    <Circle isActive={statusArr[2]} />
                    <Typography
                        variant='h5'
                        className={`${classes.instructorText} ${
                            !statusArr[2] && classes.inactiveText
                        }`}
                    >
                        Instructor's Response
                    </Typography>
                </div>
                <Line isActive={statusArr[3]} />
                <div className={classes.labelContainer}>
                    <Circle isActive={statusArr[4]} />
                    <Typography
                        variant='h5'
                        className={`${classes.verifiedText} ${
                            !statusArr[4] && classes.inactiveText
                        }`}
                    >
                        Verification
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default LargeStatusIndicator;

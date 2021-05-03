import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import {Face, Schedule} from '@material-ui/icons';
import {fullName} from '../../../utils';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    sessionPopover: {
        padding: theme.spacing(3),
        height: '100%',
        cursor: 'pointer',
    },
    popover: {
        pointerEvents: 'none',
    },
    sessionInfo: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
    },
}));

export const SessionPopover = ({
    session: { start, end, title, instructor },
}) => {
    const classes = useStyles();

    const timeText = (time) => moment(time).format('h:mma');
    return (
        <div className={classes.sessionPopover}>
            <Typography variant='h3'>{title}</Typography>
            <div className={classes.sessionInfo}>
                <Schedule style={{ marginRight: '8px' }} />
                <Typography variant='body1'>
                    {`${timeText(start)} - ${timeText(end)}`}
                </Typography>
            </div>
            <div className={classes.sessionInfo}>
                <Face style={{ marginRight: '8px' }} />
                <Typography variant='body1'>{fullName(instructor)}</Typography>
            </div>
        </div>
    );
};

SessionPopover.propTypes = {
    session: PropTypes.any,
};
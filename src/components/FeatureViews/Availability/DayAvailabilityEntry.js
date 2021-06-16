import React, { useContext, useEffect, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { KeyboardTimePicker } from '@material-ui/pickers/TimePicker';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import { TimeAvailabilityContext } from './TimeAvailabilityContext';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import moment from 'moment';
import { checkTimeSegmentOverlap, setCurrentDate } from '../../../utils';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { errorRed } from '../../../theme/muiTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DeleteIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import TimeIcon from '@material-ui/icons/Schedule';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    availabilityRow: {
        display: 'block',
        margin: '10px 0',
        position: 'relative',
    },
}));

const AvailabilityRow = ({
    startTime,
    endTime,
    dayIndex,
    availabilityId,
    setDisplayNewAvailability,
    conflictError,
    toDisable,
}) => {
    const { updateAvailability } = useContext(TimeAvailabilityContext);
    const classes = useStyles();

    const timesNotValid = (startTime, endTime) => {
        if (startTime && endTime) {
            const startTimeVal = setCurrentDate(moment(startTime)),
                endTimeVal = setCurrentDate(moment(endTime));
            const timeDiff = moment.duration(endTimeVal.diff(startTimeVal));
            return timeDiff <= 0;
        }
        return false;
    };

    const handleOnStartChange = (e) => {
        updateAvailability(e, endTime, dayIndex, availabilityId, false);
        setDisplayNewAvailability(false);
    };

    const handleOnEndChange = (e) => {
        updateAvailability(startTime, e, dayIndex, availabilityId, false);
    };

    const validTime = (time) => {
        if (typeof time === 'string') {
            return moment(time).format('h:mm A');
        }
        return time;
    };

    return (
        <div className={classes.availabilityRow}>
            <KeyboardTimePicker
                value={validTime(startTime) || null}
                onChange={handleOnStartChange}
                inputVariant='outlined'
                keyboardIcon={<TimeIcon />}
                disabled={toDisable}
                error={
                    (endTime && !startTime) ||
                    conflictError ||
                    timesNotValid(startTime, endTime)
                }
            />
            <div
                style={{
                    margin: '25px',
                    width: '10px',
                    borderBottom: 'solid black 1px',
                    display: 'inline-block',
                }}
            />
            <KeyboardTimePicker
                value={validTime(endTime) || null}
                onChange={handleOnEndChange}
                inputVariant='outlined'
                keyboardIcon={<TimeIcon />}
                disabled={toDisable}
                error={
                    (!endTime && startTime) ||
                    conflictError ||
                    timesNotValid(startTime, endTime)
                }
            />
            {startTime && endTime && !toDisable && (
                <IconButton
                    style={{
                        top: '5px',
                        position: 'absolute',
                        color: errorRed,
                    }}
                    onClick={() =>
                        updateAvailability(
                            null,
                            null,
                            dayIndex,
                            availabilityId,
                            true
                        )
                    }
                >
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    );
};

AvailabilityRow.propTypes = {
    startTime: PropTypes.any,
    endTime: PropTypes.any,
    dayIndex: PropTypes.number,
    availabilityId: PropTypes.number,
    setDisplayNewAvailability: PropTypes.func,
    conflictError: PropTypes.any,
    toDisable: PropTypes.bool,
};

export default function DayAvailabilityEntry({
    dayOfWeek,
    availabilities,
    dayIndex,
}) {
    const [displayNewAvailability, setDisplayNewAvailability] = useState(false);
    const [conflictErrorMessage, setConflictErrorMessage] = useState(false);
    const [conflictErrorDialogOpen, setConflictErrorDialogOpen] =
        useState(false);
    const [notAvailable, setNotAvailable] = useState(false);
    const { updateAvailability } = useContext(TimeAvailabilityContext);
    const classes = useStyles();

    useEffect(() => {
        const availabilitySegments = Object.values(availabilities)
            .filter((availability) => !availability.toDelete)
            .map(({ startTime, endTime }) => [
                startTime || endTime,
                endTime || startTime,
            ]);
        const conflict = checkTimeSegmentOverlap(availabilitySegments);
        setConflictErrorMessage(conflict);
        if (conflict) setConflictErrorDialogOpen(true);
    }, [availabilities]);

    const handleDialogClose = (e) => {
        e.preventDefault();
        setConflictErrorDialogOpen(false);
    };

    const handleNotAvailable = () => {
        setNotAvailable(!notAvailable);
        if (!notAvailable) {
            Object.values(availabilities).forEach(
                ({ startTime, endTime, id }) => {
                    updateAvailability(
                        startTime,
                        endTime,
                        dayIndex,
                        id,
                        true,
                        true
                    );
                }
            );
        }
    };

    return (
        <>
            <TableRow>
                <TableCell>{dayOfWeek}</TableCell>
                <TableCell style={{ width: '45vw' }}>
                    {Object.values(availabilities)
                        .sort((a, b) =>
                            moment(a.startTime).diff(moment(b.startTime))
                        )
                        .filter(
                            (availability) =>
                                !availability?.toDelete ||
                                availability.toDisable
                        )
                        .map(({ startTime, endTime, id, toDisable }) => (
                            <AvailabilityRow
                                key={id}
                                startTime={startTime || ''}
                                endTime={endTime || ''}
                                dayIndex={dayIndex}
                                availabilityId={id}
                                setDisplayNewAvailability={
                                    setDisplayNewAvailability
                                }
                                conflictError={conflictErrorMessage}
                                toDisable={toDisable}
                            />
                        ))}
                    {(displayNewAvailability ||
                        Object.values(availabilities).filter(
                            (availability) =>
                                !availability.toDelete || availability.toDisable
                        ).length === 0) && (
                        <AvailabilityRow
                            dayIndex={dayIndex}
                            setDisplayNewAvailability={
                                setDisplayNewAvailability
                            }
                        />
                    )}
                    {!displayNewAvailability &&
                        Object.values(availabilities).filter(
                            (availability) => !availability.toDelete
                        ).length > 0 && (
                            <div className={classes.availabilityRow}>
                                <ResponsiveButton
                                    variant='outlined'
                                    color='primary'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDisplayNewAvailability(true);
                                    }}
                                    startIcon={
                                        <AddCircleIcon
                                            style={{ marginRight: '10px' }}
                                        />
                                    }
                                >
                                    Add Availability
                                </ResponsiveButton>
                            </div>
                        )}
                </TableCell>
                <TableCell>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notAvailable}
                                onChange={handleNotAvailable}
                                color='primary'
                            />
                        }
                        label='Select to clear availabilities'
                    />
                </TableCell>
            </TableRow>
            <Dialog open={conflictErrorDialogOpen} onClose={handleDialogClose}>
                <DialogTitle disableTypography style={{ color: errorRed }}>
                    {`Sorry, the times don't quite make sense. Please check again!`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {conflictErrorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton onClick={handleDialogClose}>
                        {`Ok, I'll change it`}
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

DayAvailabilityEntry.propTypes = {
    dayOfWeek: PropTypes.string,
    availabilities: PropTypes.array,
    dayIndex: PropTypes.number,
};

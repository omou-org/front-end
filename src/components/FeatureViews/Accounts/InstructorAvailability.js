import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import CalendarIcon from '@material-ui/icons/CalendarViewDay';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { TimePicker } from '@material-ui/pickers';

import './Accounts.scss';
import { capitalizeString, DayConverter } from 'utils';
import { instance } from 'actions/apiActions';
import { POST_INSTRUCTORAVAILABILITY_SUCCESS } from 'actions/actionTypes';
import { timeParser } from 'components/Form/FormUtils';

const formatTime = (time) => time && `${time.getHours()}:${time.getMinutes()}`;

// fills out all 7 days, even if some dont exist
// { sunday: {start, end}, monday: {start, end}, ...etc}
const fillWorkHours = (workHours) =>
    Object.keys(DayConverter).reduce((hours, dayNum) => {
        const availObj = Object.values(workHours).find(
            ({ day }) => dayNum == day
        );
        return {
            ...hours,
            [dayNum]: availObj
                ? {
                      day: dayNum,
                      end: timeParser(availObj.end),
                      id: availObj.availability_id,
                      start: timeParser(availObj.start),
                  }
                : {
                      day: dayNum,
                      end: null,
                      start: null,
                  },
        };
    }, {});

// format for API request
const convertAvailObj = ({ day, end, start }, instructor) => ({
    day_of_week: DayConverter[day],
    end_time: formatTime(end),
    instructor,
    start_time: formatTime(start),
});

const endpoint = '/account/instructor-availability/';

const InstructorAvailability = ({ instructorID, button = true }) => {
    const dispatch = useDispatch();
    // USERS selector
    const instructor = useSelector(
        ({ Users }) => Users.InstructorList[instructorID]
    );
    const [availability, setAvailability] = useState(() => fillWorkHours({}));
    const [openDialog, setOpenDialog] = useState(false);
    // for future error message
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(false);

    // set availability intial value based on stored hours
    useEffect(() => {
        if (instructor.schedule.work_hours) {
            setAvailability(fillWorkHours(instructor.schedule.work_hours));
        }
    }, [instructor.schedule.work_hours]);

    const updateTime = useCallback(
        (day, type) => (time) => {
            setAvailability((prevAvail) => ({
                ...prevAvail,
                [day]: {
                    ...prevAvail[day],
                    [type]: time,
                    updated: true,
                },
            }));
        },
        []
    );

    const toggleDialog = useCallback(() => {
        setOpenDialog((isOpen) => !isOpen);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const edited = Object.values(availability).filter(
                ({ updated }) => updated
            );

            // patch for days that already exist in DB
            const patchResponses = await Promise.all(
                edited
                    .filter(({ id }) => id)
                    .map((avail) =>
                        instance.patch(
                            `${endpoint}${avail.id}/`,
                            convertAvailObj(avail, instructorID)
                        )
                    )
            );

            // post for days not yet in DB
            const postResponses = await Promise.all(
                edited
                    .filter(({ id }) => !id)
                    .map((avail) =>
                        instance.post(
                            endpoint,
                            convertAvailObj(avail, instructorID)
                        )
                    )
            );

            dispatch({
                payload: {
                    response: {
                        data: patchResponses
                            .concat(postResponses)
                            .map(({ data }) => data),
                    },
                },
                type: POST_INSTRUCTORAVAILABILITY_SUCCESS,
            });
            toggleDialog();
        } catch (err) {
            setError(err);
        }
    }, [availability, dispatch, instructorID, toggleDialog]);

    const allValid = useMemo(
        () =>
            Object.values(availability)
                .filter(({ day }) => day != 0)
                .every(({ start, end }) => start < end || (!start && !end)),
        [availability]
    );

    return (
        <>
            {button ? (
                <ResponsiveButton
                    onClick={toggleDialog}
                    variant='outlined'
                    startIcon={<CalendarIcon />}
                >
                    SET AVAILABILITY
                </ResponsiveButton>
            ) : (
                <MenuItem onClick={toggleDialog} selected>
                    <CalendarIcon /> SET AVAILABILITY
                </MenuItem>
            )}
            <Dialog
                aria-labelledby='simple-dialog-title'
                className='oooDialog'
                fullWidth
                maxWidth='md'
                onClose={toggleDialog}
                open={openDialog}
            >
                <DialogContent>
                    <div className='title'>
                        Schedule Instructor Availability
                    </div>
                    <div className='instructor'>
                        Instructor: {instructor.name}
                    </div>
                    <Grid
                        alignItems='center'
                        container
                        direction='column'
                        spacing={2}
                    >
                        <Grid container direction='row' item spacing={4}>
                            {Object.values(availability)
                                .filter(({ day }) => day != 0)
                                .map(({ start, end, day }) => (
                                    <Grid item key={day} md={2}>
                                        <div className='select'>Start Time</div>
                                        <TimePicker
                                            autoOk
                                            error={start > end}
                                            label={capitalizeString(
                                                DayConverter[day]
                                            )}
                                            onChange={updateTime(day, 'start')}
                                            value={start}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                        <Grid container direction='row' item spacing={4}>
                            {Object.values(availability)
                                .filter(({ day }) => day != 0)
                                .map(({ start, end, day }) => (
                                    <Grid item key={day} md={2}>
                                        <div className='select'>End Time</div>
                                        <TimePicker
                                            autoOk
                                            error={start > end}
                                            label={capitalizeString(
                                                DayConverter[day]
                                            )}
                                            onChange={updateTime(day, 'end')}
                                            value={end}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton onClick={toggleDialog} variant='outlined'>
                        Cancel
                    </ResponsiveButton>
                    <ResponsiveButton
                        className='save-availability'
                        color='primary'
                        disabled={!allValid}
                        onClick={handleSave}
                        variant='contained'
                    >
                        Save Form
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

InstructorAvailability.propTypes = {
    button: PropTypes.bool,
    instructorID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
};

export default InstructorAvailability;

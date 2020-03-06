import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {instance} from "actions/apiActions";
import {POST_INSTRUCTORAVAILABILITY_SUCCESS} from "actions/actionTypes";
import PropTypes from "prop-types";

import AwayIcon from "@material-ui/icons/EventBusy";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import {TimePicker} from "material-ui-pickers";

import "./Accounts.scss";

import {DayConverter} from "utils";
import {timeParser} from "components/Form/FormUtils";

const styles = {
    "maxHeight": "80vh",
    "minHeight": "80vh",
};

const formatTime = (time) => time && `${time.getHours()}:${time.getMinutes()}`;

// fills out all 7 days, even if some dont exist
// { sunday: {start, end}, monday: {start, end}, ...etc}
const fillWorkHours = (workHours) => Object.keys(DayConverter).reduce(
    (hours, dayNum) => {
        const availObj = Object.values(workHours).find(({day}) => dayNum == day);
        return {
            ...hours,
            [dayNum]: availObj
                ? {
                    "day": dayNum,
                    "end": timeParser(availObj.end),
                    "id": availObj.availability_id,
                    "start": timeParser(availObj.start),
                }
                : {
                    "day": dayNum,
                    "end": null,
                    "start": null,
                },
        };
    }, {}
);

// format for API request
const convertAvailObj = ({day, end, start}, instructor) => ({
    "day_of_week": DayConverter[day],
    "end_time": formatTime(end),
    instructor,
    "start_time": formatTime(start),
});

const endpoint = "/account/instructor-availability/";

const InstructorAvailability = ({instructorID}) => {
    const dispatch = useDispatch();
    const instructor = useSelector(({Users}) => Users.InstructorList[instructorID]);
    const [availability, setAvailability] = useState(() => fillWorkHours({}));
    const [openDialog, setOpenDialog] = useState(false);
    // for future error message
    const [error, setError] = useState(false);

    // set availability intial value based on stored hours
    useEffect(() => {
        if (instructor.schedule.work_hours) {
            setAvailability(fillWorkHours(instructor.schedule.work_hours));
        }
    }, [instructor]);

    const updateTime = useCallback((day, type) => (time) => {
        setAvailability((prevAvail) => ({
            ...prevAvail,
            [day]: {
                ...prevAvail[day],
                [type]: time,
                "updated": true,
            },
        }));
    }, []);

    const toggleDialog = useCallback(() => {
        setOpenDialog((isOpen) => !isOpen);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const edited = Object.values(availability)
                .filter(({updated}) => updated);

            // patch for days that already exist in DB
            const patchResponses = await Promise.all(
                edited.filter(({id}) => id).map((avail) => instance.patch(
                    `${endpoint}${avail.id}/`,
                    convertAvailObj(avail, instructorID)
                ))
            );

            // post for days not yet in DB
            const postResponses = await Promise.all(
                edited.filter(({id}) => !id).map((avail) => instance.post(
                    endpoint,
                    convertAvailObj(avail, instructorID)
                ))
            );

            dispatch({
                "payload": {
                    "response": {
                        "data": patchResponses.concat(postResponses)
                            .map(({data}) => data),
                    },
                },
                "type": POST_INSTRUCTORAVAILABILITY_SUCCESS,
            });
            toggleDialog();
        } catch (err) {
            setError(err);
        }
    }, [availability, dispatch, instructorID, toggleDialog]);

    const allValid = useMemo(() => Object.values(availability)
        .every(({start, end}) => start < end),
    [availability]);

    return (
        <>
            <Button
                className="editButton"
                onClick={toggleDialog}
                variant="outlined">
                <AwayIcon />
                Instructor Availability
            </Button>
            <Dialog
                aria-labelledby="simple-dialog-title"
                classes={{"paper": styles}}
                className="oooDialog"
                fullWidth
                maxWidth="md"
                onClose={toggleDialog}
                open={openDialog}>
                <DialogContent>
                    <div className="title">
                        Schedule Insutructor Availability
                    </div>
                    <div className="instructor">
                        Instructor: {instructor.name}
                    </div>
                    <Grid
                        alignItems="center"
                        container
                        direction="row"
                        md={12}
                        spacing={3}>
                        {
                            Object.values(availability).map(({start, end, day}) => (
                                <Grid
                                    item
                                    key={day}
                                    md={1}>
                                    <div className="select">
                                        Start Time
                                    </div>
                                    <TimePicker
                                        autoOk
                                        error={start > end}
                                        label={DayConverter[day]}
                                        onChange={updateTime(day, "start")}
                                        value={start} />
                                </Grid>

                            ))
                        }
                        <Grid
                            item
                            md={5} />
                        {
                            Object.values(availability).map(({start, end, day}) => (
                                <Grid
                                    item
                                    key={day}
                                    md={1}>
                                    <div className="select">
                                        End Time
                                    </div>
                                    <TimePicker
                                        autoOk
                                        error={start > end}
                                        label={DayConverter[day]}
                                        onChange={updateTime(day, "end")}
                                        value={end} />
                                </Grid>

                            ))
                        }
                        <Grid
                            item
                            md={5} />
                    </Grid>
                    <Grid
                        container
                        md={12}>
                        <Grid
                            item
                            md={8} />
                        <Grid
                            item
                            md={2}>
                            <Button
                                className="button"
                                onClick={toggleDialog}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid
                            item
                            md={2}>
                            <Button
                                className="button"
                                disabled={!allValid}
                                onClick={handleSave}>
                                Save Form
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

InstructorAvailability.propTypes = {
    "instructorID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default InstructorAvailability;

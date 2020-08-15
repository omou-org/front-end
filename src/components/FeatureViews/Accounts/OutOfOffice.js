import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";

import {DatePicker, TimePicker} from "@material-ui/pickers";
import AwayIcon from "@material-ui/icons/EventBusy";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import "./Accounts.scss";
import {instance} from "actions/apiActions";
import InstructorConflictCheck from "components/OmouComponents/InstructorConflictCheck";
import {POST_OOO_SUCCESS} from "actions/actionTypes";

const formatDate = (date, allDay) => {
    const datePart =
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timePart = `${date.getHours()}:${date.getMinutes()}`;
    return allDay ? `${datePart} 00:00` : `${datePart} ${timePart}`;
};

const OutOfOffice = ({instructorID, button}) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [allDay, setAllDay] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const {name} = useSelector(({Users}) => Users.InstructorList[instructorID]);

    // for future error message
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(false);

    const toggleAllDay = useCallback(({target}) => {
        setAllDay(target.checked);
    }, []);

    const updateDescription = useCallback(({target}) => {
        setDescription(target.value);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const response = await instance.post(
                "/account/instructor-out-of-office/",
                {
                    "description": `${name} - ${description}`,
                    "end_datetime": formatDate(end, allDay),
                    "instructor": instructorID,
                    "start_datetime": formatDate(start, allDay),
                }
            );
            dispatch({
                "payload": {
                    response,
                },
                "type": POST_OOO_SUCCESS,
            });
            setOpenDialog(false);
        } catch {
            setError(true);
        }
    }, [name, description, dispatch, instructorID, allDay, end, start]);

    const canSubmit = useMemo(() => start && end && end > start, [start, end]);

    const toggleDialog = useCallback(() => {
        setOpenDialog((prevOpen) => !prevOpen);
    }, []);

    return (
        <>
            {
                button
                    ? <Button
                        onClick={toggleDialog}
                        variant="outlined">
                        <AwayIcon /> SET OOO
                    </Button>
                    : <MenuItem
                        onClick={toggleDialog}>
                        <AwayIcon /> SET OOO
                    </MenuItem>
            }
            <Dialog
                aria-labelledby="simple-dialog-title"
                className="oooDialog"
                fullWidth
                maxWidth="md"
                onClose={toggleDialog}
                open={openDialog}>
                <DialogContent>
                    <div className="title">
                        Schedule Out of Office
                    </div>
                    <div className="instructor">
                        Instructor: {name}
                    </div>
                    <TextField
                        label="Description"
                        onChange={updateDescription}
                        value={description} />
                    <Grid
                        container
                        item
                        md={12}>
                        <Grid
                            item
                            md={3}>
                            <div className="select">
                                Select OOO Start Date
                            </div>
                            <DatePicker
                                animateYearScrolling
                                format="MM/dd/yyyy"
                                label="Start Date"
                                onChange={setStart}
                                openTo="day"
                                required
                                value={start}
                                views={["year", "month", "date"]} />
                        </Grid>
                        <Grid
                            item
                            md={3}>
                            <div className="select">
                                Select OOO End Date
                            </div>
                            <DatePicker
                                animateYearScrolling
                                format="MM/dd/yyyy"
                                label="End Date"
                                onChange={setEnd}
                                openTo="day"
                                required
                                value={end}
                                views={["year", "month", "date"]} />
                        </Grid>
                        <Grid
                            item
                            md={6} />
                        <Grid
                            item
                            md={3}>
                            <div className="select">
                                Select OOO Start Time
                            </div>
                            <TimePicker
                                disabled={allDay}
                                label="Start Time"
                                onChange={setStart}
                                value={start} />
                        </Grid>
                        <Grid
                            item
                            md={3}>
                            <div className="select">
                                Select OOO End Time
                            </div>
                            <TimePicker
                                disabled={allDay}
                                label="End Time"
                                onChange={setEnd}
                                value={end} />
                        </Grid>
                        <Grid
                            item
                            md={2}>
                            <Grid container>
                                <Checkbox
                                    checked={allDay}
                                    className="checkbox"
                                    inputProps={{
                                        "aria-label": "primary checkbox",
                                    }}
                                    onChange={toggleAllDay}
                                    value="primary" />
                                <div className="checkboxText">
                                    All Day
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        className="button"
                        onClick={toggleDialog}
                        variant="outlined">
                        Cancel
                    </Button>
                    <InstructorConflictCheck
                        end={end}
                        ignoreAvailablity
                        instructorID={instructorID}
                        onSubmit={handleSave}
                        start={start}>
                        <Button
                            className="button"
                            disabled={!canSubmit}
                            variant="outlined">
                            Save OOO
                        </Button>
                    </InstructorConflictCheck>
                </DialogActions>
            </Dialog>
        </>
    );
};

OutOfOffice.propTypes = {
    "button": PropTypes.bool,
    "instructorID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default OutOfOffice;

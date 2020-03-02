import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {instance} from "actions/apiActions";
import {POST_OOO_SUCCESS} from "actions/actionTypes";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";


import {DatePicker, TimePicker} from "material-ui-pickers";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import "./Accounts.scss";

const styles = {
    "maxHeight": "80vh",
    "minHeight": "80vh",
};

const formatDate = (date, allDay) => {
    const datePart = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timePart = `${date.getHours()}:${date.getMinutes()}`;
    return allDay ? `${datePart} 00:00` : `${datePart} ${timePart}`;
};

const OutOfOffice = ({onClose, instructorID, open}) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [allDay, setAllDay] = useState(false);
    // for future error message
    const [error, setError] = useState(false);
    const {name} = useSelector(({Users}) => Users.InstructorList[instructorID]);

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
                    description,
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
            onClose();
        } catch {
            setError(true);
        }
    }, [description, dispatch, instructorID, onClose, allDay, end, start]);

    const canSubmit = useMemo(() => start && end && end > start, [start, end]);

    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            classes={{"paper": styles}}
            className="oooDialog"
            fullWidth
            maxWidth="md"
            open={open}>
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
                            * Select OOO Start Date
                        </div>
                        <DatePicker
                            animateYearScrolling
                            format="MM/dd/yyyy"
                            label="Start Date"
                            margin="normal"
                            onChange={setStart}
                            openTo="day"
                            value={start}
                            views={["year", "month", "date"]} />
                    </Grid>
                    <Grid
                        item
                        md={3}>
                        <div className="select">
                            * Select OOO End Date
                        </div>
                        <DatePicker
                            animateYearScrolling
                            format="MM/dd/yyyy"
                            label="End Date"
                            margin="normal"
                            onChange={setEnd}
                            openTo="day"
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
                            * Select OOO Start Time
                        </div>
                        <TimePicker
                            autoOk
                            disabled={allDay}
                            label="Start Time"
                            value={start}
                            onChange={setStart} />
                    </Grid>
                    <Grid
                        item
                        md={3}>
                        <div className="select">
                            * Select OOO End Time
                        </div>
                        <TimePicker
                            autoOk
                            disabled={allDay}
                            label="End Time"
                            value={end}
                            onChange={setEnd} />
                    </Grid>
                    <Grid
                        item
                        md={2}>
                        <Grid container>
                            <Grid>
                                <Checkbox
                                    checked={allDay}
                                    className="checkbox"
                                    inputProps={{
                                        "aria-label": "primary checkbox",
                                    }}
                                    onChange={toggleAllDay}
                                    value="primary" />
                            </Grid>
                            <Grid>
                                <div className="checkboxText">
                                    All Day
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
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
                            onClick={onClose}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid
                        item
                        md={2}>
                        <Button
                            className="button"
                            disabled={!canSubmit}
                            onClick={handleSave}>
                            Save OOO
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

OutOfOffice.propTypes = {
    "instructorID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    "onClose": PropTypes.func.isRequired,
    "open": PropTypes.bool.isRequired,
};

export default withStyles(styles)(OutOfOffice);

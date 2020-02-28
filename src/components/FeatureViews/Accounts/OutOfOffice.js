/* eslint-disable react/no-multi-comp */
import {instance} from "actions/apiActions";
import React, {useCallback, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";


import {DatePicker, DateTimePicker, TimePicker} from "material-ui-pickers";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";

import "./Accounts.scss";

const styles = {
    "maxHeight": "80vh",
    "minHeight": "80vh",
};

const DateChooser = ({allDay, label, value, onChange}) =>
    allDay
        ? <DatePicker
            animateYearScrolling
            format="MM/dd/yyyy"
            label={label}
            margin="normal"
            onChange={onChange}
            openTo="day"
            value={value}
            views={["year", "month", "date"]} />
        : <DateTimePicker
            format="MM/dd/yyyy hh:mm a"
            label={label}
            margin="normal"
            onChange={onChange}
            value={value} />;

const formatDate = (date, allDay) => {
    const datePart = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timePart = `${date.getHours()}:${date.getMinutes()}`;
    return allDay ? `${datePart} 00:00` : `${datePart} ${timePart}`;
};

const OutOfOffice = ({onClose, instructorID, open}) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [allDay, setAllDay] = useState(false);
    // for future error message
    const [error, setError] = useState(false);

    const toggleAllDay = useCallback((event) => {
        setAllDay(event.target.checked);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            await instance.post("/account/instructor-out-of-office/", {
                "end_datetime": formatDate(end, allDay),
                "instructor": instructorID,
                "start_datetime": formatDate(start, allDay),
            });
            onClose();
        } catch {
            setError(true);
        }
    }, [instructorID, onClose, allDay, end, start]);

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
                    Instructor:
                </div>
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

DateChooser.propTypes = {
    "allDay": PropTypes.bool.isRequired,
    "label": PropTypes.string,
    "onChange": PropTypes.func.isRequired,
    "value": PropTypes.object.isRequired,
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

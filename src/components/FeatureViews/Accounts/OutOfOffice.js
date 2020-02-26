import {instance} from "actions/apiActions";
import React, {useCallback, useState, useMemo} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";


import {DatePicker, TimePicker} from "material-ui-pickers";
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

const OutOfOffice = ({onClose, instructorID, open}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [checked, setChecked] = useState(false);

    const handlecheckChange = useCallback((event) => {
        setChecked(event.target.checked);
    }, []);

    const handleInputChange = useCallback((setter) => (date) => {
        setter(date);
    }, []);

    const handleSave = useCallback(() => {
        instance.post("/account/", {
            "instructor": instructorID,
        });
        onClose();
    }, [onClose, instructorID, endDate, endTime, startDate, startTime]);

    const canSubmit = useMemo(() =>
        [startDate, endDate, startTime, endTime]
            .every((input) => input !== null),
        [startDate, endDate, startTime, endTime]);

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
                    Schedule OOO
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
                            onChange={handleInputChange(setStartDate)}
                            openTo="day"
                            value={startDate}
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
                            onChange={handleInputChange(setEndDate)}
                            openTo="day"
                            value={endDate}
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
                            disabled={checked}
                            label="Start Time"
                            value={startTime}
                            onChange={handleInputChange(setStartTime)} />
                    </Grid>
                    <Grid
                        item
                        md={3}>
                        <div className="select">
                            * Select OOO End Time
                        </div>
                        <TimePicker
                            autoOk
                            disabled={checked}
                            label="End Time"
                            value={endTime}
                            onChange={handleInputChange(setEndTime)} />
                    </Grid>
                    <Grid
                        item
                        md={2}>
                        <Grid container>
                            <Grid>
                                <Checkbox
                                    checked={checked}
                                    className="checkbox"
                                    inputProps={{
                                        "aria-label": "primary checkbox",
                                    }}
                                    onChange={handlecheckChange}
                                    value="primary" />
                            </Grid>
                            <Grid>
                                <div
                                    className="checkboxText">
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
                            disabled={!canSubmit}
                            className="button"
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

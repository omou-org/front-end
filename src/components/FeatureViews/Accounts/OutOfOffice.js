import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {instance} from "actions/apiActions";
import {POST_OOO_SUCCESS} from "actions/actionTypes";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import {DatePicker, TimePicker} from "material-ui-pickers";
import AwayIcon from "@material-ui/icons/EventBusy";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import InstructorConflictCheck from "components/InstructorConflictCheck";

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

const OutOfOffice = ({instructorID, button}) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [allDay, setAllDay] = useState(false);
    // for future error message
    const [error, setError] = useState(false);

    const [openOOODialog, setOpenOOODialog] = useState(false);
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
                    description: `${name} - ${description}`,
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
            setOpenOOODialog(false);
        } catch {
            setError(true);
        }
    }, [description, dispatch, instructorID, allDay, end, start]);

    const canSubmit = useMemo(() => start && end && end > start, [start, end]);

    const handleOpenOOODialog = useCallback(() => {
        setOpenOOODialog((prevOpen) => !prevOpen);
    }, []);

    return (
        <>
            {
                button ? <Button
                    onClick={handleOpenOOODialog}
                    variant="outlined">
                    <AwayIcon /> SET OOO
                </Button>
                    : <MenuItem
                        onClick={handleOpenOOODialog}>
                        <AwayIcon /> SET OOO
                    </MenuItem>
            }
            <Dialog
                aria-labelledby="simple-dialog-title"
                classes={{"paper": styles}}
                className="oooDialog"
                fullWidth
                maxWidth="md"
                onClose={handleOpenOOODialog}
                open={openOOODialog}>
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
                                onChange={setStart}
                                value={start} />
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
                                onChange={setEnd}
                                value={end} />
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
                                onClick={handleOpenOOODialog}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid
                            item
                            md={2}>
                            <InstructorConflictCheck
                                ignoreAvailablity
                                instructorID={instructorID}
                                end={end}
                                start={start}>
                                <Button
                                    className="button"
                                    disabled={!canSubmit}>
                                    // onClick={handleSave}>
                                    Save OOO
                                </Button>
                            </InstructorConflictCheck>
                        </Grid>
                    </Grid>
                </DialogContent>
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

export default withStyles(styles)(OutOfOffice);

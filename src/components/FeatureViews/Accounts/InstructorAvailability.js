import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { instance } from "actions/apiActions";
import { POST_INSTRUCTORAVAILABILITY_SUCCESS } from "actions/actionTypes";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";


import { DatePicker, TimePicker } from "material-ui-pickers";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import "./Accounts.scss";
import AwayIcon from "@material-ui/icons/EventBusy";

const styles = {
    "maxHeight": "80vh",
    "minHeight": "80vh",
};

const formatDate = (date) => {
    const timePart = `${date.getHours()}:${date.getMinutes()}`;
    return `${timePart}`;
};

const InstructorAvailability = ({ instructorID }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(null);
    const [mondayTime, setMondayTime] = useState(null);
    const [tuesdayTime, setTuesdayTime] = useState(null);
    const [wednesdayTime, setWednesdayTime] = useState(null);
    const [thursdayTime, setThursdayTime] = useState(null);
    const [fridayTime, setFridayTime] = useState(null);
    const [saturdayTime, setSaturdayTime] = useState(null);
    const [sundayTime, setSundayTime] = useState(null);
    const [mondayEndTime, setMondayEndTime] = useState(null);
    const [tuesdayEndTime, setTuesdayEndTime] = useState(null);
    const [wednesdayEndTime, setWednesdayEndTime] = useState(null);
    const [thursdayEndTime, setThursdayEndTime] = useState(null);
    const [fridayEndTime, setFridayEndTime] = useState(null);
    const [saturdayEndTime, setSaturdayEndTime] = useState(null);
    const [sundayEndTime, setSundayEndTime] = useState(null);

    const [end, setEnd] = useState(null);
    // for future error message
    const [error, setError] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const { name } = useSelector(({ Users }) => Users.InstructorList[instructorID]);

    const updateDescription = useCallback(({ target }) => {
        setDescription(target.value);
    }, []);


    const handleOpenDialog = (event) => {
        event.preventDefault();
        setOpenDialog(!openDialog);
    };

    return (<>
        <Button
            onClick={handleOpenDialog}
            className="editButton"
        >
            <AwayIcon />
            Instructor Availability
        </Button>
        <Dialog
            aria-labelledby="simple-dialog-title"
            classes={{ "paper": styles }}
            className="oooDialog"
            fullWidth
            maxWidth="md"
            onClose={handleOpenDialog}
            open={openDialog}>
            <DialogContent>
                <div className="title">
                    Schedule Insutructor Availability
                </div>
                <div className="instructor">
                    Instructor: {name}
                </div>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    alignItems="center"
                    md={12}>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Monday"
                            value={mondayTime}
                            onChange={setMondayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Tuesday"
                            value={tuesdayTime}
                            onChange={setTuesdayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Wednesday"
                            value={wednesdayTime}
                            onChange={setWednesdayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Thursday"
                            value={thursdayTime}
                            onChange={setThursdayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Friday"
                            value={fridayTime}
                            onChange={setFridayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Saturday"
                            value={saturdayTime}
                            onChange={setSaturdayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            Start Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Sunday"
                            value={sundayTime}
                            onChange={setSundayTime} />
                    </Grid>
                    <Grid item md={5} />
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Monday"
                            value={mondayEndTime}
                            onChange={setMondayEndTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Tuesday"
                            value={tuesdayTime}
                            onChange={setTuesdayTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Wednesday"
                            value={wednesdayEndTime}
                            onChange={setWednesdayEndTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Thursday"
                            value={thursdayEndTime}
                            onChange={setThursdayEndTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Friday"
                            value={fridayEndTime}
                            onChange={setFridayEndTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Saturday"
                            value={saturdayEndTime}
                            onChange={setSaturdayEndTime} />
                    </Grid>
                    <Grid
                        item
                        md={1}>
                        <div className="select">
                            End Time
                        </div>
                        <TimePicker
                            autoOk
                            label="Sunday"
                            value={sundayEndTime}
                            onChange={setSundayEndTime} />
                    </Grid>
                    <Grid item md={5} />
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
                            onClick={handleOpenDialog}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid
                        item
                        md={2}>
                        <Button
                            className="button">
                            Save OOO
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    </>);
};

InstructorAvailability.propTypes = {
    "instructorID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default withStyles(styles)(InstructorAvailability);
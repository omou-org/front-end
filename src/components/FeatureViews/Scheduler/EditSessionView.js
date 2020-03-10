import React, {useEffect, useMemo, useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as calendarActions from "../../../actions/calendarActions";
import * as userActions from "../../../actions/userActions.js";
import {useDispatch, useSelector} from "react-redux";
import {FormControl, Typography} from "@material-ui/core";
import {useHistory, withRouter} from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {DatePicker, TimePicker} from "material-ui-pickers";
import SearchSelect from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION} from "./SessionView";
import {dateFormat, timeFormat} from "../../../utils";
import InstructorConflictCheck from "components/InstructorConflictCheck";

const EditSessionView = ({course, session, editSelection}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(calendarActions, dispatch),
        }),
        [dispatch]
    );
    const history = useHistory();

    const [sessionFields, setSessionFields] = useState({
        "start_time": "",
        "instructor": "",
        "end_time": "",
        "title": "",
        "category": "",
        "is_confirmed": "",
        "duration": "",
        "updatedDuration": "",
    });

    useEffect(() => {
        api.initializeRegistration();
        api.fetchCourses();
    }, [api]);

    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);

    useEffect(() => {
        if (course && session) {
            let durationHours = Math.abs(session.end_datetime - session.start_datetime) / 36e5;
            durationHours === 0 ? durationHours = 1 : durationHours = durationHours;
            const category = categories.find((category) => category.id === course.category);

            setSessionFields({
                category: { value: category.id, label: category.name },
                instructor: { value: session.instructor, label: instructors[session.instructor].name },
                start_time: session.start_datetime,
                end_time: session.end_datetime,
                duration: durationHours,
                title: session.title,
                is_confirmed: session.is_confirmed,
            });
        }
    }, [categories, course, instructors, session]);

    const handleDateTimeChange = (date) => {
        const {end_time, duration} = sessionFields;
        if (date.end_time) {

        }
        end_time.setDate(date.getDate());
        end_time.setHours(date.getHours() + duration);
        end_time.setMinutes(date.getMinutes());

        setSessionFields({
            ...sessionFields,
            "start_time": date,
            end_time,
        });
    };

    const categoriesList = categories
        .map(({id, name}) => ({
            "value": id,
            "label": name,
        }));

    const handleCategoryChange = (event) => {
        setSessionFields({
            ...sessionFields,
            "category": event,
        });
    };

    const handleInstructorChange = (event) => {
        setSessionFields({
            ...sessionFields,
            "instructor": event,
        });
    };

    const handleTextChange = (field) => (event) => {
        setSessionFields({
            ...sessionFields,
            [field]: event.target.value,
        });
    };

    const handleDurationSelect = (event) => {
        const {start_time} = sessionFields;
        const newEndTime = new Date(start_time);

        switch (event.target.value) {
            case 1:
                newEndTime.setHours(start_time.getHours() + 1);
                break;
            case 1.5:
                newEndTime.setHours(start_time.getHours() + 1);
                newEndTime.setMinutes(start_time.getMinutes() + 30);
                break;
            case 2:
                newEndTime.setHours(start_time.getHours() + 2);
                break;
            case 0.5:
                newEndTime.setMinutes(start_time.getMinutes() + 30);
                break;
            default:
                return;

        }
        setSessionFields({
            ...sessionFields,
            "duration": event.target.value,
            "end_time": newEndTime,
        });
    };

    const courseDurationOptions = [1, 1.5, 2, 0.5];

    const updateSession = () => {
        const {start_time, end_time, is_confirmed, instructor, duration} = sessionFields;
        switch (editSelection) {
            case EDIT_CURRENT_SESSION: {
                const patchedSession = {
                    start_datetime: start_time.toISOString(),
                    end_datetime: end_time.toISOString(),
                    is_confirmed,
                    instructor: instructor.value,
                    duration,
                    title,
                };
                api.patchSession(session.id, patchedSession);
                break;
            }
            case EDIT_ALL_SESSIONS: {
                const patchedCourse = {
                    "course_category": sessionFields.category.value,
                    "subject": sessionFields.title,
                    "start_time": start_time.toLocaleString("eng-US", timeFormat),
                    "end_time": end_time.toLocaleString("eng-US", timeFormat),
                    "instructor": instructor.value,
                    is_confirmed,
                    "start_date": start_time.toLocaleString("sv-SE", dateFormat),
                    "end_date": course.schedule.end_date.toLocaleString("sv-SE", dateFormat),
                };
                api.patchCourse(course.course_id, patchedCourse);
            }
            // no default
        }
        history.push("/scheduler/");
    };

    const onConfirmationChange = (event) => {
        setSessionFields({
            ...sessionFields,
            "is_confirmed": event.target.value,
        });
    };

    const instructorList = Object.values(instructors).map(({user_id, name, email}) => ({
        "value": user_id,
        "label": `${name} - ${email}`,
    }));

    return (
        <>
            <Grid
                className="session-view"
                container
                direction="row"
                spacing={2}>
                <Grid
                    item
                    sm={12}>
                    <TextField
                        fullWidth
                        onChange={handleTextChange("title")}
                        value={sessionFields.title} />
                </Grid>
                <Grid
                    align="left"
                    className="session-view-details"
                    container
                    spacing={16}
                    xs={6}>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Subject </Typography>
                        <SearchSelect
                            className="search-options"
                            isClearable
                            onChange={handleCategoryChange}
                            options={categoriesList}
                            placeholder="Choose a Category"
                            value={sessionFields.category} />
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Room</Typography>
                        <TextField
                            value={course.room_id} />
                    </Grid>

                    <Grid
                        item
                        xs={12}>
                        <Typography variant="h5"> Instructor </Typography>
                        <SearchSelect
                            onChange={handleInstructorChange}
                            options={instructorList}
                            placeholder="Choose an Instructor"
                            value={sessionFields.instructor} />
                        <FormControl>
                            <InputLabel>
                                Is instructor confirmed?
                            </InputLabel>
                            <Select
                                onChange={onConfirmationChange}
                                value={sessionFields.is_confirmed}>
                                <MenuItem value>
                                    Yes, Instructor Confirmed.
                                </MenuItem>
                                <MenuItem value={false}>
                                    No, Instructor is NOT Confirmed.
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Date</Typography>
                        <DatePicker
                            inputVariant="outlined"
                            label="Date"
                            margin="normal"
                            onChange={handleDateTimeChange}
                            value={sessionFields.start_time} />
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Start Time</Typography>
                        <TimePicker
                            inputVariant="outlined"
                            label="Start Time"
                            margin="normal"
                            onChange={handleDateTimeChange}
                            value={sessionFields.start_time} />
                    </Grid>

                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Duration </Typography>
                        <Select
                            onChange={handleDurationSelect}
                            value={sessionFields.duration}>
                            {courseDurationOptions.map((duration, index) => (<MenuItem
                                key={index}
                                value={duration}>
                                {`${duration} hour(s)`}
                                                                             </MenuItem>))}
                        </Select>
                    </Grid>

                </Grid>
            </Grid>

            <Grid
                className="session-detail-action-control"
                container
                direction="row"
                justify="flex-end">
                <Grid item>
                    <InstructorConflictCheck
                        end={sessionFields.end_time}
                        eventID={editSelection === EDIT_CURRENT_SESSION ? session.id : course.course_id}
                        instructorID={sessionFields.instructor.value}
                        start={sessionFields.start_time}
                        type={editSelection === EDIT_CURRENT_SESSION ? "session" : "course"}
                        onSubmit={updateSession}>
                        <Button
                            className="button"
                            color="secondary"
                            variant="outlined">
                            Save
                        </Button>
                    </InstructorConflictCheck>
                </Grid>
            </Grid>
        </>
    );
}

export default withRouter(EditSessionView);

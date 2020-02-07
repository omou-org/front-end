import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as calendarActions from "../../../actions/calendarActions";
import * as userActions from "../../../actions/userActions.js"
import { useDispatch, useSelector } from "react-redux";
import { FormControl, Typography } from "@material-ui/core";
import { useHistory, withRouter } from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DatePicker, TimePicker } from "material-ui-pickers";
import SearchSelect from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION } from "./SessionView";

function EditSessionView({ course, session, editSelection }) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(calendarActions, dispatch)
        }),
        [dispatch]
    );
    const history = useHistory();

    const [sessionFields, setSessionFields] = useState({
        start_time: "",
        instructor: "",
        end_time: "",
        title: "",
        category: "",
        is_confirmed: "",
        duration: "",
        tempDuration: ""
    });

    useEffect(() => {
        api.initializeRegistration();
        api.fetchCourses();
    }, [api]);

    const categories = useSelector(({ "Course": { CourseCategories } }) => CourseCategories);
    const instructors = useSelector(({ "Users": { InstructorList } }) => InstructorList);

    let instructor = course && instructors[course.instructor_id] ? instructors[course.instructor_id] : { name: "N/A" };

    useEffect(() => {
        if (course && session) {
            let durationHours = Math.abs(session.end_datetime - session.start_datetime) / 36e5;
            durationHours === 0 ? durationHours = 1 : durationHours = durationHours;
            let category = categories.find(category => category.id === course.category);

            setSessionFields({
                category: { value: category.id, label: category.name },
                instructor: { value: session.instructor, label: instructors[session.instructor].name },
                start_time: session.start_datetime,
                end_time: session.end_datetime,
                duration: durationHours,
                title: course.title,
                is_confirmed: session.is_confirmed,
            });
        }
    }, [course, session]);

    const handleDateTimeChange = date => {
        let { end_time, duration } = sessionFields;
        end_time.setHours(date.getHours() + duration);
        end_time.setMinutes(date.getMinutes());

        setSessionFields({
            ...sessionFields,
            start_time: date,
            end_time: end_time,
        });
    };

    const categoriesList = categories
        .map(({ id, name }) => ({
            value: id,
            label: name,
        }));

    const handleCategoryChange = event => {
        setSessionFields({
            ...sessionFields,
            category: event,
        });
    };

    const handleInstructorChange = event => {
        setSessionFields({
            ...sessionFields,
            instructor: event,
        });
    };

    const handleTextChange = (field) => event => {
        setSessionFields({
            ...sessionFields,
            [field]: event.target.value,
        });
    };

    const handleDurationSelect = event => {
        // take the start time
        let { start_time } = sessionFields
        // make start time a local variable so it can't be changed 
        const newEndTime = new Date(start_time)

        switch (event.target.value) {
            case 1:
                newEndTime.setHours(start_time.getHours() + 1)
                break;
            case 1.5:
                newEndTime.setHours(start_time.getHours() + 1)
                newEndTime.setMinutes(newEndTime.getMinutes() + 30)
                break;
            case 2:
                newEndTime.setHours(start_time.getHours() + 2)
                break;
            case 0.5:
                newEndTime.setMinutes(start_time.getMinutes() + 30)
                break;
            default:
                return;

        }
        setSessionFields({
            ...sessionFields,
            duration: event.target.value,
            tempDuration: newEndTime
        })
    }

    let courseDurationOptions = [1, 1.5, 2, 0.5];

    const updateSession = event => {
        event.preventDefault();
        let { start_time, end_time, is_confirmed, instructor, duration, tempDuration } = sessionFields;
        if (editSelection === EDIT_CURRENT_SESSION) {
            let patchedSession = {
                start_datetime: start_time.toISOString(),
                end_datetime: tempDuration.toISOString(),
                is_confirmed: is_confirmed,
                instructor: instructor.value,
                duration: duration
            };
            api.patchSession(session.id, patchedSession);
        }

        let patchedCourse = {
            course_category: sessionFields.category.value,
            subject: sessionFields.title,
            start_time: start_time.toISOString(),
            // .substr(start_time.toISOString().indexOf("T")+1,5),
            end_time: end_time.toISOString(),
            // .substr(end_time.toISOString().indexOf("T")+1,5)
        };
        if (editSelection === EDIT_ALL_SESSIONS) {
            patchedCourse = {
                ...patchedCourse,
                instructor: instructor.value,
                is_confirmed: is_confirmed,
                start_date: start_time.toISOString().substr(0, 10),
                end_date: end_time.toISOString().substr(0, 10),
            }
        }

        // api.patchCourse(course.course_id, patchedCourse);
        history.push("/scheduler/")
    };

    const onConfirmationChange = event => {
        setSessionFields({
            ...sessionFields,
            is_confirmed: event.target.value,
        });
    };

    const instructorList = Object.values(instructors).map(({ user_id, name, email }) => ({
        value: user_id,
        label: `${name} - ${email}`,
    }));


    return (
        <>
            <Grid className="session-view"
                container spacing={2} direction={"row"}>
                <Grid item sm={12}>
                    <TextField
                        fullWidth={true}
                        value={sessionFields.title}
                        onChange={handleTextChange("title")}
                    />
                </Grid>
                <Grid
                    align="left"
                    className="session-view-details"
                    container spacing={16} xs={6}
                >
                    <Grid item xs={6}>
                        <Typography variant="h5"> Subject </Typography>
                        <SearchSelect
                            className="search-options"
                            isClearable
                            onChange={handleCategoryChange}
                            placeholder={"Choose a Category"}
                            value={sessionFields.category}
                            options={categoriesList}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5"> Room</Typography>
                        <TextField
                            value={course.room_id}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5"> Instructor </Typography>
                        <SearchSelect
                            value={sessionFields.instructor}
                            onChange={handleInstructorChange}
                            placeholder={"Choose an Instructor"}
                            options={instructorList}
                        />
                        <FormControl>
                            <InputLabel>
                                Is instructor confirmed?
                            </InputLabel>
                            <Select
                                onChange={onConfirmationChange}
                                value={sessionFields.is_confirmed}
                            >
                                <MenuItem value={true}>
                                    Yes, Instructor Confirmed.
                                </MenuItem>
                                <MenuItem value={false}>
                                    No, Instructor is NOT Confirmed.
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5"> Date</Typography>
                        <DatePicker
                            margin="normal"
                            label={"Date"}
                            value={sessionFields.start_time}
                            onChange={handleDateTimeChange}
                            inputVariant={"outlined"}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5"> Start Time</Typography>
                        <TimePicker
                            margin="normal"
                            label={"Start Time"}
                            value={sessionFields.start_time}
                            onChange={handleDateTimeChange}
                            inputVariant={"outlined"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Typography variant="h5"> Duration </Typography>
                        <Select
                            onChange={handleDurationSelect}
                            value={sessionFields.duration}
                        >
                            {courseDurationOptions.map((duration) => {
                                return <MenuItem
                                    value={duration}
                                >{duration + " hour(s)"}
                                </MenuItem>
                            })}
                        </Select>
                        {/* <SearchSelect
                            className="search-options"
                            isClearable
                            onChange={handleDurationSelect}
                            placeholder={"Choose a Duration"}
                            value={sessionFields.duration}
                            options={courseDurationOptions}
                        /> */}
                    </Grid>

                </Grid>
            </Grid>

            <Grid className="session-detail-action-control"
                container direction="row" justify="flex-end">
                <Grid item>
                    <Button
                        className="button"
                        color="secondary"
                        onClick={updateSession}
                        variant="outlined">
                        Save
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

EditSessionView.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};

export default withRouter(EditSessionView);

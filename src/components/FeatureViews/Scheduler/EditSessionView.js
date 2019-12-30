import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as calendarActions from "../../../actions/calendarActions";
import * as userActions from "../../../actions/userActions.js"
import { useDispatch, useSelector} from "react-redux";
import {Typography} from "@material-ui/core";
import {NavLink, withRouter} from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import {DatePicker, TimePicker} from "material-ui-pickers";
import {stringToColor} from "../Accounts/accountUtils";
import SearchSelect from "react-select";
import {useHistory} from "react-router-dom"

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function EditSessionView({course, session}) {
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
        start_time:"",
        end_time:"",
        title:"",
        category:"",
    });

    useEffect(()=>{
        api.initializeRegistration();
        api.fetchCourses();
    },[api]);

    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);
    const classes = useStyles();
    const styles = (username) => ({
        "backgroundColor": stringToColor(username),
        "color": "white",
        "width": "3vw",
        "height": "3vw",
        "fontSize": 15,
        "margin-right": 10,
    });
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);

    let instructor = course && instructors[course.instructor_id] ? instructors[course.instructor_id] : { name: "N/A" };

    const setDateInPSTDate = (date, time) => {
        let PSTDate = new Date(date);
        PSTDate.setDate(date.getDate()-1);
        PSTDate.setHours(Number(time.substr(11,2)));
        PSTDate.setMinutes(Number(time.substr(14,2)));
        return PSTDate;
    }

    useEffect(()=>{
        if(course && session) {
            let startTime = new Date(session.start_datetime);
            startTime = setDateInPSTDate(startTime,session.start_datetime);
            let endTime = new Date(session.end_datetime);
            endTime = setDateInPSTDate(endTime, session.end_datetime);
            let durationHours = Math.abs(endTime - startTime)/ 36e5;
            durationHours === 0 ? durationHours = 1 : durationHours = durationHours;
            let category = categories.find(category => category.id === course.category);
            setSessionFields({
                category: {value: category.id, label: category.name} ,
                start_time: startTime,
                end_time: endTime,
                duration: durationHours,
                title: course.title,
            });
        }
    }, [course,session]);

    const handleDateTimeChange = date => {
        let {end_time, duration} = sessionFields;
        end_time.setHours(date.getHours()+duration);
        end_time.setMinutes(date.getMinutes());

        setSessionFields({
            ...sessionFields,
            start_time:date,
            end_time:end_time,
        });
    };

    const categoriesList = categories
        .map(({id,name})=> ({
            value: id,
            label: name,
        }));

    const handleCategoryChange = event => {
        setSessionFields({
            ...sessionFields,
            category: event,
        });
    };

    const handleTextChange = (field) => event => {
        setSessionFields({
            ...sessionFields,
            [field]:event.target.value,
        });
    };
    const stringifyDateInPST = (date) => {
        let dateISO = date.toISOString();
        let dateISOHour = date.getHours();
        dateISOHour = dateISOHour === 0 ? "00" : dateISOHour.toString();
        let dateISOMinute = date.getMinutes();
        dateISOMinute = dateISOMinute === 0 ? "00" : dateISOMinute.toString();
        let dateISOTime = dateISO.substr(11,5);
        return dateISO.replace(dateISOTime, dateISOHour + ":" + dateISOMinute)
    }
    const updateSession = event => {
        event.preventDefault();
        let {start_time, end_time} = sessionFields;
        let start = new Date(start_time);
        start = stringifyDateInPST(start);
        let end = new Date(end_time);
        end = stringifyDateInPST(end);
        let patchedSession = {
            start_datetime: start,
            end_datetime: end,
        };
        api.patchSession(session.id, patchedSession);

        let patchedCourse = {
            course_category: sessionFields.category.value,
            subject: sessionFields.title,
        };
        api.patchCourse(course.course_id, patchedCourse);
        history.push("/scheduler/")
    };

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
                        <TextField
                            value={instructor.name}
                        />
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

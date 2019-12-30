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

function EditSessionView({course, session, enrolledStudents, handleToggleEditing}) {
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

    useEffect(()=>{
        if(course && session) {
            let startTime = new Date(session.start_datetime);
            // console.log(session.start_datetime.substr(5,2));
            startTime.setDate(startTime.getDate()-1);
            startTime.setHours(Number(session.start_datetime.substr(11,2)));
            startTime.setMinutes(Number(session.start_datetime.substr(14,2)));
            let category = categories.find(category => category.id === course.category);
            setSessionFields({
                category: {value: category.id, label: category.name} ,
                start_time: startTime,
                title: course.title,
            });
        }
    }, [course,session]);

    const studentKeys = Object.keys(enrolledStudents);

    const handleDateTimeChange = date => {
        setSessionFields({
            ...sessionFields,
            start_time:date,
        });
    };

    const categoriesList = categories
        .map(({id,name})=> ({
            value: id,
            label: name,
        }));

    const handleCategoryChange = event => {
        console.log(event);
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

    const updateSession = event => {
        event.preventDefault();
        let patchedSession = {
            start_datetime: sessionFields.start_time,
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

                <Grid item xs={6}>
                    <Typography variant="h5" align="left"> Students Enrolled  </Typography>
                    <Grid container direction='row'>
                        {studentKeys.map(key =>
                            <NavLink to={`/accounts/student/${enrolledStudents[key].id}`}
                                     style={{ textDecoration: "none" }}>
                                <Avatar
                                    style={styles(enrolledStudents[key].name)}
                                >
                                    {
                                        enrolledStudents[key].name.match(/\b(\w)/g).join("")
                                    }
                                </Avatar>
                            </NavLink>)}
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

import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import BackArrow from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/styles";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import {connect, useDispatch, useSelector} from "react-redux";
import {FormControl, Typography} from "@material-ui/core";
import {NavLink, withRouter} from "react-router-dom";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import {dayOfWeek} from "../../Form/FormUtils";
import {DatePicker, TimePicker} from "material-ui-pickers";
import {stringToColor} from "../Accounts/accountUtils";

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
        }),
        [dispatch]
    );

    const [sessionFields, setSessionFields] = useState({
        category:"",
        start_time:"",
    });

    const [courseFields, setCourseFields] = useState({
        subject:"",
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

    const goToCourse = (courseID) => () => {
        // props.history.push(`/registration/course/${courseID}`);
    };
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);

    let instructor = course && instructors[course.instructor_id] ? instructors[course.instructor_id] : { name: "N/A" };

    useEffect(()=>{
        if(course && session) {
            let startTime = new Date(session.start_datetime);
            // console.log(session.start_datetime.substr(5,2));
            startTime.setHours(Number(session.start_datetime.substr(11,2)));
            startTime.setMinutes(Number(session.start_datetime.substr(14,2)));
            setSessionFields({
                category: categories.find(category => category.id === course.category),
                start_time: startTime,
            });
            console.log(course, session, startTime)
        }
    }, [course,session]);

    const studentKeys = Object.keys(enrolledStudents);
    return (
        <>
            <Grid className="session-view"
                  container spacing={2} direction={"row"}>
                <Grid item sm={12}>
                    <TextField
                        fullWidth={true}
                        value={course.title}
                    />
                </Grid>
                <Grid
                    align="left"
                    className="session-view-details"
                    container spacing={16} xs={6}
                >
                    <Grid item xs={6}>
                        <Typography variant="h5"> Subject </Typography>
                        <TextField
                            value={sessionFields.category.name}
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
                            animateYearScrolling
                            margin="normal"
                            label={"Date"}
                            value={sessionFields.start_time}
                            onChange={(date) =>{ console.log("hi") }}
                            openTo={"day"}
                            format="MM/dd/yyyy"
                            views={["year", "month", "date"]}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5"> Time </Typography>
                        <TimePicker autoOk
                                    label={"Start Time"}
                                    value={sessionFields.start_time}
                                    // onChange={(date) =>{ this.setState((prevState)=>{
                                    //     prevState[label][fieldTitle] = date;
                                    //     return prevState;
                                    // }) } }
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
                        component={NavLink}
                        to="/scheduler"
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

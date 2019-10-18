import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {NavLink} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const weekday = {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat",
};

const CourseList = (props) => props.filteredCourses.map((course) => {
    let start_date = new Date(course.schedule.start_date),
        end_date = new Date(course.schedule.end_date),
        start_time = course.schedule.start_time.substr(1),
        end_time = course.schedule.end_time.substr(1),
        days = course.schedule.days.map((day) => weekday[day]);
    start_date = start_date.toDateString().substr(3);
    end_date = end_date.toDateString().substr(3);
    const date = `${start_date} - ${end_date}`,
        time = `${start_time} - ${end_time}`;
    return (
        <Paper className="row" key={course.course_id}>
            <Grid container alignItems="center" layout="row">
                <Grid
                    item
                    md={3} xs={12}
                    component={NavLink}
                    to={`/registration/course/${course.course_id}`}
                    style={{"textDecoration": "none", "cursor": "pointer"}}>
                    <Typography className="course-heading" align="left">
                        {course.title}
                    </Typography>
                </Grid>
                <Grid
                    item
                    md={5} xs={12}
                    component={NavLink}
                    to={`/registration/course/${course.course_id}`}
                    style={{"textDecoration": "none", "cursor": "pointer"}}>
                    <Grid
                        container className="course-detail">
                        <Grid
                            item
                            md={4} xs={3}
                            className="heading-det"
                            align="left">
                            Date
                        </Grid>
                        <Grid
                            item
                            md={8} xs={9}
                            className="value"
                            align="left">
                            {date} | {days} {time}
                        </Grid>
                    </Grid>
                    <Grid container className="course-detail">
                        <Grid
                            item
                            md={4} xs={3}
                            className="heading-det"
                            align="left">
                            Instructor
                        </Grid>
                        <Grid item md={8} xs={9}
                            className="value"
                            align="left">
                            {props.instructors[course.instructor_id].name}
                        </Grid>
                    </Grid>
                    <Grid container className="course-detail">
                        <Grid
                            item
                            md={4} xs={3}
                            className="heading-det"
                            align="left">
                            Tuition
                        </Grid>
                        <Grid
                            item
                            md={8} xs={9}
                            className="value"
                            align="left">
                            ${course.tuition}
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid
                    item
                    md={4} xs={12}
                    className="course-action">
                    <Grid
                        container
                        alignItems="center"
                        layout="row"
                        style={{"height": "100%"}}>
                        <Grid
                            item xs={6}
                            className="course-status">
                            <span className="stats">
                                {course.roster.length} / {course.capacity}
                            </span>
                            <span className="label">
                                Status
                            </span>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                component={NavLink}
                                to={`/registration/form/course/${course.course_id}`}
                                variant="contained"
                                disabled={course.capacity <= course.filled}
                                className="button primary">+ REGISTER</Button>
                        </Grid>
                    </Grid>
                </Grid> */}
            </Grid>
        </Paper>
    );
});

const mapStateToProps = (state) => ({
    "instructors": state.Users["InstructorList"],
    "courses": state.Course["NewCourseList"],
    "courseCategories": state.Course["CourseCategories"],
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseList);

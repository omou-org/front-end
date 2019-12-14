import React from "react";
import {Link} from "react-router-dom";
import {connect, useSelector} from "react-redux";

// Material UI Imports
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";

const weekday = {
    "0": "Sun",
    "1": "Mon",
    "2": "Tue",
    "3": "Wed",
    "4": "Thu",
    "5": "Fri",
    "6": "Sat",
};

const CourseList = (props) => {
    let filteredCourses = props.filteredCourses;
    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    return filteredCourses.map((course) => {
        let start_date = new Date(course.schedule.start_date),
            end_date = new Date(course.schedule.end_date),
            start_time = course.schedule.start_time && course.schedule.start_time.substr(1),
            end_time = course.schedule.end_time && course.schedule.end_time.substr(1),
            days = course.schedule.days;
        start_date = start_date && start_date.toDateString().substr(3);
        end_date = end_date && end_date.toDateString().substr(3);
        const date = `${start_date} - ${end_date}`,
            time = `${start_time} - ${end_time}`;
        return (
            <Paper
                className="row"
                key={course.course_id}>
                <Grid
                    alignItems="center"
                    container
                    layout="row">
                    <Grid
                        component={Link}
                        item
                        md={3}
                        style={{"textDecoration": "none",
                            "cursor": "pointer"}}
                        to={`/registration/course/${course.course_id}`}
                        xs={12}>
                        <Typography
                            align="left"
                            className="course-heading">
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid
                        // component={Link}
                        item
                        md={5}
                        style={{"textDecoration": "none",
                            "cursor": "pointer"}}
                        // to={`/registration/course/${course.course_id}`}
                        xs={12}>
                        <Grid
                            className="course-detail"
                            container>
                            <Grid
                                align="left"
                                className="heading-det"
                                item
                                md={4}
                                xs={3}>
                                Date
                            </Grid>
                            <Grid
                                align="left"
                                item
                                md={8}
                                xs={9}>
                                {date} | {days} {time}
                            </Grid>
                        </Grid>
                        <Grid
                            className="course-detail"
                            container>
                            <Grid
                                align="left"
                                className="heading-det"
                                item
                                md={4}
                                xs={3}>
                                Instructor
                            </Grid>
                            <Grid
                                align="left"
                                item
                                md={8}
                                xs={9}>
                                { course.instructor_id && instructors[course.instructor_id].name}
                            </Grid>
                        </Grid>
                        <Grid
                            className="course-detail"
                            container>
                            <Grid
                                align="left"
                                className="heading-det"
                                item
                                md={4}
                                xs={3}>
                                Tuition
                            </Grid>
                            <Grid
                                align="left"
                                item
                                md={8}
                                xs={9}>
                                {course.tuition && `$ ${course.tuition}`}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        className="course-action"
                        item
                        md={4}
                        xs={12}>
                        <Grid
                            alignItems="center"
                            container
                            layout="row"
                            style={{"height": "100%"}}>
                            <Grid
                                className="course-status"
                                item
                                xs={6}>
                                {/*<span className="stats">*/}
                                    {course.roster.length} / {course.capacity}
                                {/*</span>*/}
                                <span className="label">
                                    Status
                                </span>
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                {
                                    props.registration.CurrentParent && <Button
                                        className="button primary"
                                        component={Link}
                                        disabled={course.capacity <= course.filled}
                                        to={`/registration/form/course/${course.course_id}`}
                                        variant="contained">+ REGISTER
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    });
};

const mapStateToProps = (state) => ({
    "registration": state.Registration,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseList);

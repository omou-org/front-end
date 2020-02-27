import PropTypes from "prop-types";
import React from "react";
import {connect, useSelector} from "react-redux";
// Material UI Imports
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {courseDateFormat} from "../../../utils";

const CourseList = (props) => {
    let filteredCourses = props.filteredCourses.filter(course => course.capacity >= 1);
    const instructors = useSelector(({ "Users": { InstructorList } }) => InstructorList);
    return filteredCourses.map((course) => {
        const {start_date, end_date, start_time, end_time, days} = courseDateFormat(course);
        const date = `${start_date} - ${end_date}`,
            time = `${start_time} - ${end_time}`;
        return (
            <Paper elevation={2}
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
                        style={{
                            "textDecoration": "none",
                            "cursor": "pointer"
                        }}
                        to={`/registration/course/${course.course_id}`}
                        xs={12}>
                        <Typography
                            align="left"
                            className="course-heading">
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md={5}
                        style={{
                            "textDecoration": "none",
                            "cursor": "pointer"
                        }}
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
                                {date}
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
                                Time
                            </Grid>
                            <Grid
                                align="left"
                                item
                                md={8}
                                xs={9}>
                                {days} {time}
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
                                {course.instructor_id && (instructors[course.instructor_id] && instructors[course.instructor_id].name)}
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
                                {course.total_tuition && `$${course.total_tuition}`}
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
                            style={{ "height": "100%" }}>
                            <Grid
                                className="course-status"
                                item
                                xs={6}>
                                {/*<span className="stats">*/}
                                {course.roster.length} / {course.capacity}
                                {/*</span>*/}
                                <span className="label">
                                    Enrolled
                                </span>
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                {
                                    (props.registration.CurrentParent !== "none" && props.registration.CurrentParent) &&
                                    <Button
                                        className="button primary"
                                        component={Link}
                                        disabled={course.capacity <= course.roster.length}
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

CourseList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.object).isRequired,
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

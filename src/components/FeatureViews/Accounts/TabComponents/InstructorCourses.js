import * as hooks from "actions/hooks";
import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import ConfirmIcon from "@material-ui/icons/CheckCircle";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import UnconfirmIcon from "@material-ui/icons/Cancel";

import {capitalizeString, courseDateFormat} from "utils";

const InstructorCourses = ({instructorID}) => {
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const courseStatus = hooks.useCourse();

    const courseIDs = useMemo(() =>
        Object.keys(courses).filter((courseID) =>
            instructorID === courses[courseID].instructor_id)
    , [courses, instructorID]);

    if (Object.keys(courses).length === 0) {
        if (hooks.isLoading(courseStatus)) {
            return <Loading />;
        }
        if (hooks.isFail(courseStatus)) {
            return "Error loading courses!";
        }
    }

    return (
        <Grid container>
            <Grid
                item
                xs={12}>
                <Grid
                    className="accounts-table-heading"
                    container>
                    <Grid
                        item
                        xs={4}>
                        <Typography
                            align="left"
                            className="table-header">
                            Session
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={3}>
                        <Typography
                            align="left"
                            className="table-header">
                            Dates
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}>
                        <Typography
                            align="left"
                            className="table-header">
                            Day
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}>
                        <Typography
                            align="left"
                            className="table-header">
                            Time
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={1}>
                        <Typography
                            align="left"
                            className="table-header">
                            Confirmed
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row-reverse"
                spacing={8}>
                {
                    courseIDs.sort((courseA, courseB) =>
                        new Date(courses[courseB].schedule.start_date) -
                        new Date(courses[courseA].schedule.start_date))
                        .map((courseID) => {
                            const course = courses[courseID];
                            const {days, start_date, end_date, start_time,
                                end_time, is_confirmed} =
                                courseDateFormat(course);
                            return (
                                <Grid
                                    className="accounts-table-row"
                                    component={Link}
                                    item
                                    key={courseID}
                                    to={`/registration/course/${courseID}`}
                                    xs={12}>
                                    <Paper square>
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={4}>
                                                <Typography align="left">
                                                    {course.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography align="left">
                                                    {start_date} - {end_date}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography align="left">
                                                    {capitalizeString(days)}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography align="left">
                                                    {start_time} - {end_time}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                md={1}>
                                                {
                                                    is_confirmed
                                                        ? <ConfirmIcon className="confirmed course-icon" />
                                                        : <UnconfirmIcon className="unconfirmed course-icon" />
                                                }
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })
                }
            </Grid>
        </Grid>
    );
};

InstructorCourses.propTypes = {
    "instructorID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default InstructorCourses;

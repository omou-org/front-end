import * as hooks from "actions/hooks";
import { Link, useLocation } from "react-router-dom";
import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { NoListAlert } from "../../../NoListAlert";
import { courseDateFormat } from "../../../../utils";

const today = new Date();

const paymentStatus = (numPaidCourses) => {
    if (numPaidCourses > 3) {
        return "good";
    } else if (numPaidCourses <= 3 && numPaidCourses > 0) {
        return "warning";
    } else if (numPaidCourses <= 0) {
        return "bad";
    }
};

const StudentCourseViewer = ({ studentID, current = true }) => {
    const courses = useSelector(({ Course }) => Course.NewCourseList);
    const enrollments = useSelector(({ Enrollments }) => Enrollments);
    const { pathname } = useLocation();

    const enrollmentStatus = hooks.useEnrollmentByStudent(studentID);
    const courseList = useMemo(() =>
        enrollments[studentID] ? Object.keys(enrollments[studentID]) : []
        , [enrollments, studentID]);
    const courseStatus = hooks.useCourse(courseList);

    const coursePaymentStatusList = useMemo(() =>
        enrollments[studentID] ? Object.entries(enrollments[studentID])
            .map(([courseID, enrollment]) => {
                return { course: courseID, sessions: enrollment.sessions_left }
            }) : [], [enrollments, studentID]);
    let coursePaymentStatus = {};
    coursePaymentStatusList.forEach(({ course, sessions }) => coursePaymentStatus[course] = sessions);

    const numPaidCourses = useCallback((courseID) => {
        if (!enrollments[studentID][courseID]) {
            return 0;
        }

        return enrollments[studentID][courseID].sessions_left || 0;
    }, [enrollments, studentID]);

    const filterCourseByDate = useCallback((endDate) => {
        const inputEndDate = new Date(endDate);
        // see if course is current or not
        // and match it appropriately with the passed filter
        return current === (inputEndDate >= today);
    }, [current]);

    const displayedCourses = useMemo(() =>
        courseList.filter((courseID) => courses[courseID] &&
            filterCourseByDate(courses[courseID].schedule.end_date)),
        [courseList, courses, filterCourseByDate]);

    if (!enrollments[studentID] && !hooks.isSuccessful(enrollmentStatus)) {
        if (hooks.isLoading(enrollmentStatus, courseStatus)) {
            return <Loading />;
        }

        if (hooks.isFail(enrollmentStatus, courseStatus)) {
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
                            Course
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
                            Class Day(s)
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
                            Status
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={8}>
                    {displayedCourses.length !== 0
                        ? displayedCourses.map((courseID) => {
                            const course = courses[courseID];
                            if (!course) {
                                return "Loading...";
                            }
                            const { days, start_date, end_date, start_time, end_time } = courseDateFormat(course);
                            return (
                                <Grid
                                    className="accounts-table-row"
                                    component={Link}
                                    item
                                    key={courseID}
                                    md={12}
                                    to={`${pathname}/${courseID}`}
                                    xs={12}>
                                    <Paper square>
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={4}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {course.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {start_date} - {end_date}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {days.charAt(0).toUpperCase() + days.slice(1)}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {start_time} - {end_time}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={1}
                                            >
                                                <div className={`sessions-left-chip ${paymentStatus(numPaidCourses(courseID))}`}>
                                                    {coursePaymentStatus[courseID]}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })
                        : <NoListAlert list={"Course"} />
                    }
                </Grid>
            </Grid>
        </Grid>
    );
};

StudentCourseViewer.propTypes = {
    "current": PropTypes.bool,
    "studentID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default StudentCourseViewer;

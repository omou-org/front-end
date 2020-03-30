import React, {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import {Link, useLocation} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LoadingError from "./LoadingCourseError"
import * as hooks from "actions/hooks";
import {capitalizeString, courseDateFormat, dateTimeToDate} from "utils";
import NoListAlert from "components/NoListAlert";

const today = dateTimeToDate(new Date());

const paymentStatus = (numPaidCourses) => {
    if (numPaidCourses > 3) {
        return "good";
    } else if (0 < numPaidCourses && numPaidCourses <= 3) {
        return "warning";
    }
    return "bad";
};

const StudentCourseViewer = ({studentID, current = true}) => {
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const {pathname} = useLocation();

    const enrollmentStatus = hooks.useEnrollmentByStudent(studentID);
    const courseList = useMemo(() => Object.keys(enrollments[studentID] || {}), [
        enrollments,
        studentID,
    ]);
    const courseStatus = hooks.useCourse(courseList);

    const coursePaymentStatus = useMemo(
        () =>
            Object.entries(enrollments[studentID] || {}).reduce(
                (obj, [courseID, {sessions_left}]) => ({
                    ...obj,
                    [courseID]: sessions_left,
                }),
                {}
            ),
        [enrollments, studentID]
    );

    const numPaidCourses = useCallback(
        (courseID) => {
            if (!enrollments[studentID][courseID]) {
                return 0;
            }
            return enrollments[studentID][courseID].sessions_left || 0;
        },
        [enrollments, studentID]
    );

    const filterCourseByDate = useCallback(
        (endDate) => {
            const inputEndDate = dateTimeToDate(new Date(endDate));
            // see if course is current or not
            // and match it appropriately with the passed filter
            return current === inputEndDate >= today;
        },
        [current]
    );

    const displayedCourses = useMemo(
        () =>
            courseList.filter(
                (courseID) =>
                    courses[courseID] &&
                    filterCourseByDate(courses[courseID].schedule.end_date)
            ),
        [courseList, courses, filterCourseByDate]
    );

    if (!enrollments[studentID] && !hooks.isSuccessful(enrollmentStatus)) {
        if (hooks.isLoading(enrollmentStatus, courseStatus)) {
            return <Loading small loadingText="LOADING COURSES"/>;
        }
        if (hooks.isFail(enrollmentStatus, courseStatus)) {
            return <LoadingError error="courses"/>;
        }
    }

    return (
        <>
            <Grid className="accounts-table-heading" container>
                <Grid item xs={4}>
                    <Typography align="left" className="table-header">
                        Course
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography align="left" className="table-header">
                        Dates
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography align="left" className="table-header">
                        Class Day(s)
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography align="left" className="table-header">
                        Time
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography align="left" className="table-header">
                        Status
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                {displayedCourses.length !== 0 ? (
                    displayedCourses.map((courseID) => {
                        const course = courses[courseID];
                        if (!course) {
                            return "Loading...";
                        }
                        const {
                            days,
                            start_date,
                            end_date,
                            start_time,
                            end_time,
                        } = courseDateFormat(course);
                        return (
                            <Grid
                                className="accounts-table-row"
                                component={Link}
                                item
                                key={courseID}
                                to={`${pathname}/${courseID}`}
                                xs={12}
                            >
                                <Paper square>
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Typography align="left" className="accounts-table-text">
                                                {course.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography align="left" className="accounts-table-text">
                                                {start_date} - {end_date}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography align="left" className="accounts-table-text">
                                                {capitalizeString(days)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography align="left" className="accounts-table-text">
                                                {start_time} - {end_time}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <div
                                                className={`sessions-left-chip ${paymentStatus(
                                                    numPaidCourses(courseID)
                                                )}`}
                                            >
                                                {coursePaymentStatus[courseID]}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        );
                    })
                ) : (
                    <NoListAlert list="Course"/>
                )}
            </Grid>
        </>
    );
};

StudentCourseViewer.propTypes = {
    current: PropTypes.bool,
    studentID: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default StudentCourseViewer;

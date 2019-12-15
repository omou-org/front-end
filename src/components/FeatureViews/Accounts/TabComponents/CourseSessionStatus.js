import {Link, useParams} from "react-router-dom";
import BackButton from "../../../BackButton";
import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import * as hooks from "actions/hooks";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Notes from "components/FeatureViews/Notes/Notes";

const DayConverter = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
};

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
};
const dateOptions = {
    "year": "numeric",
    "month": "numeric",
    "day": "numeric",
};

const courseDataParser = ({schedule, status, tuition}) => {
    const DaysString = schedule.days
        .reduce((string, day) => `${string}${DayConverter[day]}, `, "")
        .slice(0, -2);

    const endDate = new Date(schedule.end_date + schedule.end_time),
        startDate = new Date(schedule.start_date + schedule.start_time);

    return {
        "date": `${startDate.toLocaleDateString("en-US", dateOptions)} - ${endDate.toLocaleDateString("en-US", dateOptions)}`,
        "day": DaysString,
        "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
        "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
        status,
        tuition,
    };
};

const CourseSessionStatus = () => {
    const {"accountID": studentID, courseID} = useParams();
    const courseSessions = useSelector(({Course}) => Course.CourseSessions);
    const usersList = useSelector(({Users}) => Users);
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const course = courses[courseID];

    const studentStatus = hooks.useStudent(studentID);
    const courseStatus = hooks.useCourse(courseID);
    const instructorStatus = hooks.useInstructor(course && course.instructor_id);
    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);

    const enrollment = (enrollments[studentID] && enrollments[studentID][courseID]) || {};

    const noteInfo = useMemo(() => ({
        courseID,
        "enrollmentID": enrollment.enrollment_id,
        studentID,
    }), [courseID, enrollment.enrollment_id, studentID]);

    const sessionDataParse = useCallback(({start, end, course_id, status}) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        return {
            "date": startDate.toLocaleDateString("en-US", dateOptions),
            "day": DayConverter[startDate.getDay()],
            "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
            "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
            status,
            "tuition": courses[course_id].tuition,
        };
    }, [courses]);

    if (hooks.isFail(courseStatus, enrollmentStatus, studentStatus)) {
        return "Error loading data";
    } else if (hooks.isLoading(courseStatus, enrollmentStatus, studentStatus)) {
        return "Loading...";
    }

    const calendarSessions = courseSessions[courseID],
        paymentSessionStatus = enrollment.session_payment_status,
        statusKey = (status) => {
            if (status === 1) {
                return "Paid";
            } else if (status === 0) {
                return "Unpaid";
            }
            return "Waived";

        };

    const sessions = course.type === "T"
        ? Object.values(calendarSessions).map((session) => ({
            ...session,
            "status": statusKey(paymentSessionStatus[session.session_id]),
        }))
        : [
            {
                ...course,
                "status": Object.values(paymentSessionStatus).some((session) => session === 0)
                    ? "Unpaid"
                    : "Paid",
                "type": "C",
            },
        ];

    return (
        <Paper className="paper">
            <Grid
                className="course-session-status"
                container>
                <Grid
                    item
                    xs={12}>
                    <BackButton />
                    <hr />
                </Grid>
                <Grid
                    item
                    xs={12}>
                    <Typography
                        align="left"
                        variant="h4">
                        {course.title}
                    </Typography>
                    <Typography align="left">
                        Student:
                        <Link to={`/accounts/student/${studentID}`}>
                            {usersList.StudentList[studentID].name}
                        </Link>
                    </Typography>
                    {
                        hooks.isSuccessful(instructorStatus) &&
                        <Typography align="left">
                            Instructor:
                            <Link to={`/accounts/instructor/${course.instructor_id}`}>
                                {usersList.InstructorList[course.instructor_id].name}
                            </Link>
                        </Typography>
                    }
                </Grid>
                <Grid
                    item
                    xs={12}>
                    <Grid
                        className="accounts-table-heading"
                        container>
                        <Grid
                            item
                            xs={1} />
                        <Grid
                            item
                            xs={3}>
                            <Typography
                                align="left"
                                className="table-text">
                                Session Date
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="left"
                                className="table-text">
                                Day
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="left"
                                className="table-text">
                                Time
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="left"
                                className="table-text">
                                Tuition
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}>
                            <Typography
                                align="left"
                                className="table-text">
                                Status
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={8}>
                    {sessions
                        ? sessions.map((session) => {
                            const {day, date, startTime, endTime, status, tuition} =
                                course.type === "T" ? sessionDataParse(session) : courseDataParser(session);
                            return (
                                <Grid
                                    className="accounts-table-row"
                                    item
                                    key={session}
                                    xs={12}>
                                    <Paper square>
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={1} />
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography align="left">
                                                    {date}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography align="left">
                                                    {day}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography align="left">
                                                    {startTime} - {endTime}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography align="left">
                                                    ${tuition}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <div className={`sessions-left-chip ${status}`}>
                                                    {status}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })
                        : <Grid
                            item
                            xs={12}>
                            <Paper className="info">
                                <Typography style={{"fontWeight": 700}}>
                                    No Courses Yet!
                                </Typography>
                            </Paper>
                        </Grid>
                    }
                </Grid>
                <Grid
                    item
                    style={{
                        "marginTop": "10px",
                    }}
                    xs={12}>
                    <Notes
                        ownerID={noteInfo}
                        ownerType="enrollment" />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CourseSessionStatus;

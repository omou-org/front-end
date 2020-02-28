import * as hooks from "actions/hooks";
import React, {useMemo} from "react";
import FullCalendar from "@fullcalendar/react";
import Loading from "components/Loading";
import PropTypes from "prop-types";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useSelector} from "react-redux";

const toHours = (ms) => ms / 1000 / 60 / 60;

const Schedule = ({instructorID}) => {
    const sessions = useSelector(({Calendar}) => Calendar.CourseSessions);
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const instructor = useSelector(({Users}) => Users.InstructorList[instructorID]);
    const courseStatus = hooks.useCourse();
    const availabilityStatus = hooks.useInstructorAvailability(instructorID);
    const enrollmentStatus = hooks.useClassSessionsInPeriod("month");

    const fullCalendarSessions = useMemo(() =>
        Object.values(sessions[instructorID] || {})
            .map((session) => ({
                "end": new Date(session.end_datetime),
                "start": new Date(session.start_datetime),
                "title": courses[session.course]
                    ? courses[session.course].title
                    : "Loading...",
            })), [courses, sessions, instructorID]);

    const hoursWorked = useMemo(() =>
        Object.values(sessions[instructorID] || [])
            .reduce((hours, session) => {
                const start = new Date(session.start_datetime);
                const end = new Date(session.end_datetime);
                if (start > Date.now()) {
                    return hours;
                } else if (end < Date.now()) {
                    return hours + toHours(end - start);
                }
                return hours + toHours(end - Date.now());
            }, 0),
    [sessions, instructorID]);

    const businessHours = useMemo(() =>
        instructor
            ? Object.values(instructor.schedule.work_hours)
                .map(({day, start, end}) => ({
                    "daysOfWeek": [day],
                    "endTime": end,
                    "startTime": start,
                }))
            : [],
    [instructor]);

    if (fullCalendarSessions.length === 0) {
        if (hooks.isLoading(enrollmentStatus)) {
            return <Loading />;
        }

        if (hooks.isFail(enrollmentStatus)) {
            return "Unable to load schedule!";
        }
    }

    return (
        <>
            <h1>{hoursWorked} hour(s) worked this month</h1>
            <FullCalendar
                allDaySlot={false}
                businessHours={businessHours}
                columnHeaderFormat={{"weekday": "short"}}
                defaultView="timeGridWeek"
                events={fullCalendarSessions}
                header={false}
                height={337}
                plugins={[timeGridPlugin]} />
        </>
    );
};

Schedule.propTypes = {
    "instructorID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default Schedule;

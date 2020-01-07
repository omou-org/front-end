import * as hooks from "actions/hooks";
import React, {useMemo} from "react";
import FullCalendar from "@fullcalendar/react";
import PropTypes from "prop-types";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useSelector} from "react-redux";

const Schedule = () => {
    const sessions = useSelector(({Calendar}) => Calendar.CourseSessions);
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const courseStatus = hooks.useCourse();
    const status = hooks.useSessionsToday();

    const fullCalendarSessions = useMemo(() => sessions.map((session) => ({
        "end": new Date(session.end_datetime),
        "start": new Date(session.start_datetime),
        "title": courses[session.course]
            ? courses[session.course].title
            : "Loading...",
    })), [courses, sessions]);

    if (hooks.isFail(status)) {
        return "ERR";
    }

    return (
        <FullCalendar
            allDaySlot={false}
            columnHeaderFormat={{"weekday": "short"}}
            defaultView="timeGridWeek"
            events={fullCalendarSessions}
            header={false}
            height={337}
            plugins={[timeGridPlugin]} />
    );
};

export default Schedule;

import React from "react";
import PropTypes from "prop-types"
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const Schedule = ({work_hours}) => (
    <FullCalendar
        allDaySlot={false}
        columnHeaderFormat={{"weekday": "short"}}
        defaultView="timeGridWeek"
        events={Object.values(work_hours)}
        header={false}
        height={337}
        plugins={[timeGridPlugin]} />
);

Schedule.propTypes = {
    "work_hours": PropTypes.object.isRequired,
};

export default Schedule;

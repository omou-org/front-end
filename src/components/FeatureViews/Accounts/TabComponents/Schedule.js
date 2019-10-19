
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

function Schedule(props) {

    return (
        <FullCalendar
            header={false}
            columnHeaderFormat={{ weekday: "short" }}
            allDaySlot={false}
            height={337}
            defaultView="timeGridWeek"
            plugins={[timeGridPlugin]}
            events={Object.values(props.work_hours)}

        />
    )
}

Schedule.propTypes = {};



export default Schedule;
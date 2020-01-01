import React, {useMemo, useEffect} from "react";
import PropTypes from "prop-types"
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiActions from "../../../../actions/apiActions";
import * as userActions from "../../../../actions/userActions";
import * as calendarActions from "../../../../actions/calendarActions";

function Schedule(){
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(calendarActions, dispatch)
        }),
        [dispatch]
    );

    useEffect(()=>{
        calendarActions.fetchSessions({
            config: {
                params: {
                    time_frame: "week",
                    view_option: "tutoring",
                    time_shift: 0,
                }
            }
        });
    },[api, calendarActions]);

    return (<FullCalendar
        allDaySlot={false}
        columnHeaderFormat={{"weekday": "short"}}
        defaultView="timeGridWeek"
        events={Object.values(work_hours)}
        header={false}
        height={337}
        plugins={[timeGridPlugin]} />)
}

// Schedule.propTypes = {
//     "work_hours": PropTypes.object.isRequired,
// };

export default Schedule;

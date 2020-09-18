import React, { useState } from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core"
import moment from 'moment';
import { Calendar, momentLocalizer, } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";

import CustomPopever from "./CalendarPopover"

import { CustomToolbar } from "./CalendarToolbar"
import { useSelector } from "react-redux";

import { useSessionStorage } from "../../../utils"
const useStyles = makeStyles({
    root: {

    },
    toolbarContainer: {

    },
    labelDate: {
        alighContent: "center"
    },
    calendarContainer: {
        padding: 50
    },
    dropdownStyle: {
        borderRadius: "10px",
    },
})


const localizer = momentLocalizer(moment)

const palette =
    ["#F503B2", "#F47FD4", "#FCA8E4", "#FFC5EF",
        "#DD0000", "#EA2632", "#EB5757", "#FF9191",
        "#2F80ED", "#2D9CDB", "#56CCF2", "#9B51E0",
        "#46D943", "#219653", "#27AE60", "#6FCF97",
        "#F78017", "#F2994A", "#FEBF87", "#FFE3CA",
        "#FFC103", "#F2C94C", "#F4D77D", "#FFEDB5",
        "#72FFFF", "#43D9D9", "#92E2DE", "#BAF7F3",
        "#1F82A1", "#588FA0", "#88ACB7", "#BEDAE2",
        "#96007E", "#B96AAC", "#CD9BC5", "#CD9BC5"]

const hashCode = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
        hash += string.charCodeAt(i);
    }
    return hash;
}
const colorizer = (string) => {
    return palette[hashCode(string) % 40]
}

const eventStyleGetter = (event) => ({
    style: {
        backgroundColor: colorizer(event.instructor)
    }

});





export const SchedulerV3 = () => {

    const prevState =
        JSON.parse(sessionStorage.getItem('schedulerState')) || {};

    const sessions = useSelector((state) => state.Calendar.CourseSessions.sessions || []);
    const [view, setView] = useState("day")
    const [timeShift, setTimeShift] = useSessionStorage("timeShift", prevState.timeShift || 0)
    const [timeFrame, setTimeFrame] = useSessionStorage("timeFrame", prevState.viewOption || "day")
    const [viewOption, setViewOption] = useSessionStorage("viewOption", 'tutoring');



    const currentSession = sessions.map(({ course: { instructor, ...courseValues }, endDatetime, startDatetime, id }) => {
        let instructorName = `${instructor.user.firstName} ${instructor.user.lastName}`;
        return {
            "color": colorizer(instructorName),
            "courseID": courseValues.id,
            "description": courseValues.description,
            "end": moment(endDatetime).toDate(),
            "id": id,
            "instructor": instructorName,
            "instructor_id": instructor.user.id,
            "isConfirmed": courseValues.isConfirmed,
            "resourceId": courseValues
                ? courseValues.room
                : 1,
            "start": moment(startDatetime).toDate(),
            "title": courseValues.title,
            "type": courseValues.courseType,

        }
    })



    const classes = useStyles()
    return (
        <div className={classes.calendarContainer}>
            <Grid item xs={12} container>
                <BackgroundPaper className="scheduler" elevation={2}>
                    <Typography align="left" className="scheduler-title" variant="h3">
                        Scheduler
				</Typography>
                    <br />

                    <Calendar
                        popup
                        localizer={localizer}
                        defaultView={view}
                        events={[...currentSession]}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        onNavigate={date => {

                        }}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            toolbar: CustomToolbar,
                            eventWrapper: CustomPopever,

                        }}
                    />
                </BackgroundPaper>
            </Grid>
        </div>
    )
}

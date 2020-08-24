import React from "react";
import Scheduler from "../Scheduler/Scheduler"
import { useLazyQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading"
import moment from "moment"
import { GET_ALL_EVENTS } from "./SchedulerQueries";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



const calendarViewToFilterVal = {
    "dayGridMonth": "month",
    "timeGridDay": "day",
    "timeGridWeek": "week",
};

const SchedulerWrapper = () => {
    const [userID, setUserID] = useState(null)



    const prevState =
        JSON.parse(sessionStorage.getItem("schedulerState")) || {};
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


    const currentUserID = useSelector(({ auth }) => auth);
    useEffect(() => {
        if (currentUserID.accountType === "ADMIN") {
            setUserID(null)
        } else {
            setUserID(currentUserID.user.id)
        }

    }, [setUserID])


    const [getSessions, { loading, data, error }] = useLazyQuery(GET_ALL_EVENTS);

    useEffect(() => {
        getSessions({
            variables: {
                instructorId: userID,
                timeFrame: calendarViewToFilterVal[prevState.view],
                timeShift: prevState.timeShift,
                viewOption: prevState.courseType
            }
        })
    }, [getSessions])

    if (loading || data === undefined) return <Loading />
    if (error) console.error(error)

    const { sessions } = data
    const currentSession = sessions.map(({ course: { instructor, ...courseValues }, endDatetime, startDatetime, id }) => {
        let instructorName = `${instructor.user.firstName} ${instructor.user.lastName}`;
        return {
            "color": colorizer(instructorName),
            "courseID": courseValues.id,
            "description": courseValues.description,
            "end": moment(endDatetime).format("YYYY-MM-DDTHH:mm"),
            "id": id,
            "instructor": instructorName,
            "instructor_id": instructor.user.id,
            "isConfirmed": courseValues.isConfirmed,
            "resourceId": courseValues
                ? courseValues.room
                : 1,
            "start": moment(startDatetime).format("YYYY-MM-DDTHH:mm"),
            "title": courseValues.title,
            "type": courseValues.courseType,

        }
    })




    return <Scheduler currentSessions={[...currentSession]} getSessions={getSessions} currentUserID={userID} />
}

export default SchedulerWrapper


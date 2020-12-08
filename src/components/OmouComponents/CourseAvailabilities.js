import React from "react";
import { Typography } from "@material-ui/core";
import { DayAbbreviation, sessionsAtSameTimeInMultiDayCourse } from "utils";
import moment from "moment";

const CourseAvailabilites = ({ availabilityList, variant="body2", style }) => {

    const formatAvailabilites = (availabilityList) => {
        let day;
        let startTime;
        let endTime;

        if (sessionsAtSameTimeInMultiDayCourse(availabilityList)) {

            let days = availabilityList.reduce((allDays, { dayOfWeek }, index) => {
                return allDays + DayAbbreviation[dayOfWeek.toLowerCase()] + (index !== availabilityList.length - 1 ? " / " : ", ");
            }, "")

            startTime = moment(availabilityList[0].startTime, ["HH:mm:ss"]).format("h:mma");
            endTime = moment(availabilityList[0].endTime, ["HH:mm:ss"]).format("h:mma");

            return `${days}${startTime} - ${endTime}`;

        }
        else {
            console.log("second")
            return availabilityList.reduce((allAvailabilites, availability, i) => {

                day = DayAbbreviation[availability.dayOfWeek.toLowerCase()];
                startTime = moment(availability.startTime, ["HH:mm:ss"]).format("h:mma");
                endTime = moment(availability.endTime, ["HH:mm:ss"]).format("h:mma");
    
                return allAvailabilites + `${day}, ${startTime} - ${endTime}${i !== availabilityList.length - 1 ? " / " : ""}` 
            }, "")
        }

    }
    
    return (
        <Typography align="left" 
                    style={{...style}} variant={variant}>
            {formatAvailabilites(availabilityList)}
        </Typography>
    )
}

export default CourseAvailabilites;
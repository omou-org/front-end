import React from "react";
import PropTypes from "prop-types";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {handleToolTip} from "../../Scheduler/SchedulerUtils";
import { fullName } from "utils.js";
import {stringToColor} from "../accountUtils";

const GET_INSTRUCTOR_INFO = gql`
	query getCourses($instructorID: ID!) {
		instructor(userId: $instructorID) {
			accountType
			user {
			  firstName
			  lastName
			  id
			  instructor {
				sessionSet {
				  endDatetime
				  startDatetime
				  title
				}
				instructoravailabilitySet {
				  dayOfWeek
				  endDatetime
				  startDatetime
				  startTime
				  endTime
				}
				instructoroutofofficeSet {
					endDatetime
					startDatetime
					description
				  }
			  }
			}
		  }
	  }
`

const toHours = (ms) => ms / 1000 / 60 / 60;

const InstructorSchedule = ({instructorID}) => {


	const { loading, error, data } = useQuery(GET_INSTRUCTOR_INFO, {
		variables: {instructorID}
	})

	if (loading ) return null;

	if (error ) return "Unable to load schedule";

	const { user } = data.instructor;

	const today = new Date(Date.now());

	const hoursWorkedThisMonth = parseInt(user.instructor.sessionSet.reduce((hours, session) => {
		const start = new Date(session.startDatetime);
		const end = new Date(session.endDatetime);

		if (start.getMonth() === today.getMonth() &&
			start.getFullYear() === today.getFullYear()) {
			return hours + toHours(end - start);
		} else {
			return hours;
		}

	}, 0));

	const instructorBusinessHours = user.instructor.instructoravailabilitySet.map(({dayOfWeek, startTime, endTime}) => ({
		dayOfWeek: [dayOfWeek],
		startTime, 
		endTime
	}))

	const teachingSessions = user.instructor.sessionSet.map(({endDatetime, startDatetime, title}) => ({
		title: title,
		end: new Date(endDatetime),
		start: new Date(startDatetime),
	}));

	// Out Of Office
	const OOO = user.instructor.instructoroutofofficeSet.map(({startDatetime, endDatetime, description}) => ({
		title: description,
		start: new Date(startDatetime),
		end: new Date(endDatetime)
	}));

	console.log(teachingSessions);
	const allDayOOO = true;
	
	return (
		<>
			<h3 style={{float: "left"}}>
				{hoursWorkedThisMonth} hour{hoursWorkedThisMonth !== 1 && "s"} worked this month
			</h3>
			<FullCalendar
				allDaySlot={allDayOOO}
				businessHours={instructorBusinessHours}
				columnHeaderFormat={{weekday: "short"}}
				defaultView="timeGridWeek"
				eventColor={stringToColor(fullName(user) || "")}
				eventMouseEnter={handleToolTip}
				events={[...teachingSessions, ...OOO]}
				header={false}
				height={337}
				minTime="09:00:00"
				plugins={[timeGridPlugin]}
				slotDuration="01:00"
			/>
		</>
	);
};

InstructorSchedule.propTypes = {
	instructorID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
};

export default InstructorSchedule;

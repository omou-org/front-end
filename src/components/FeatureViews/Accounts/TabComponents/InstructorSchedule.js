import React from "react";
import PropTypes from "prop-types";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";

import {handleToolTip} from "../../Scheduler/SchedulerUtils";
import { fullName } from "utils.js";
import {stringToColor} from "../accountUtils";
import Loading from "components/OmouComponents/Loading";

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

	if (loading ) return <Loading small/>;

	if (error ) return "Unable to load schedule";

	const { user, user : { instructor } } = data.instructor;

	const today = moment();

	const hoursWorkedThisMonth = parseInt(instructor.sessionSet.reduce((hours, session) => {
		const start = moment(session.startDatetime);
		const end = moment(session.endDatetime);

		// Ignore sessions in the future
		if (today.diff(start) < 0) {
			return hours;
		}
		// If session is in the same month add hours
		else if (start.month() === today.month() &&
			start.year() === today.year()) {
			return hours + toHours(end.diff(start));
		} else {
			return hours;
		}

	}, 0));

	const instructorBusinessHours = instructor.instructoravailabilitySet.map(({dayOfWeek, startTime, endTime}) => ({
		dayOfWeek: [dayOfWeek],
		startTime, 
		endTime
	}))

	const teachingSessions = instructor.sessionSet.map(({endDatetime, startDatetime, title}) => ({
		title: title,
		start: new Date(startDatetime),
		end: new Date(endDatetime)
	}));

	let allDayOOO = false;
	// Out Of Office
	const OOOEvents = instructor.instructoroutofofficeSet.map(({startDatetime, endDatetime, description}) => {
		let start = new Date(startDatetime);
		let end = new Date(endDatetime);
		let allDay = false;

		if (start.diff(end, 'days') >= 1 ) {
			start = null;
			allDay = true;
			allDayOOO = true;
		}
		return {
			title: description,
			start,
			end,
			allDay
		}
	});
	
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
				events={[...teachingSessions, ...OOOEvents]}
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

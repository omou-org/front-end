import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import * as hooks from "actions/hooks";
import {handleToolTip} from "../../Scheduler/SchedulerUtils";
import Loading from "components/Loading";
import {stringToColor} from "../accountUtils";

const toHours = (ms) => ms / 1000 / 60 / 60;

const InstructorSchedule = ({instructorID}) => {
	const sessions = useSelector(({Calendar}) => Calendar.CourseSessions);
	const instructor = useSelector(
		({Users}) => Users.InstructorList[instructorID]
	);
	const OOOstatus = hooks.useOutOfOffice();
	const availabilityStatus = hooks.useInstructorAvailability(instructorID);
	const classEnrollmentStatus = hooks.useClassSessionsInPeriod("week");
	const tutoringEnrollmentStatus = hooks.useTutoringSessionsInPeriod("week");

	const teachingSessions = useMemo(
		() =>
			Object.values(sessions[instructorID] || {}).map((session) => ({
				end: new Date(session.end_datetime),
				start: new Date(session.start_datetime),
				title: session.title,
			})),
		[sessions, instructorID]
	);

	const OOO = useMemo(
		() =>
			instructor
				? Object.values(instructor.schedule.time_off).map(
				({all_day, description, start, end}) => {
					const endDate = new Date(end);
					// since the end date for allDay events is EXCLUSIVE
					// must add one day to include the end specified by user
					if (all_day) {
						endDate.setDate(endDate.getDate() + 1);
					}
					return {
						allDay: all_day,
						end: endDate,
						start,
						title: description || "Out of Office",
					};
				}
				)
				: [],
		[instructor]
	);

	const allDayOOO = useMemo(() => OOO.some(({allDay}) => allDay), [OOO]);

	const hoursWorked = useMemo(
		() =>
			Math.round(
				Object.values(sessions[instructorID] || []).reduce((hours, session) => {
					const start = new Date(session.start_datetime);
					const end = new Date(session.end_datetime);
					if (start > Date.now()) {
						return hours;
					} else if (end < Date.now()) {
						return hours + toHours(end - start);
					}
					return hours + toHours(end - Date.now());
				}, 0) * 100
			) / 100,
		[sessions, instructorID]
	);

	const instructorBusinessHours = useMemo(
		() =>
			instructor
				? Object.values(instructor.schedule.work_hours).map(
				({day, start, end}) => ({
					daysOfWeek: [day],
					endTime: end,
					startTime: start,
				})
				)
				: [],
		[instructor]
	);

	if (
		teachingSessions.length === 0 &&
		instructorBusinessHours.length === 0 &&
		OOO.length === 0
	) {
		if (
			hooks.isLoading(
				tutoringEnrollmentStatus,
				OOOstatus,
				classEnrollmentStatus,
				availabilityStatus
			)
		) {
			return <Loading/>;
		} else if (
			hooks.isFail(
				tutoringEnrollmentStatus,
				OOOstatus,
				classEnrollmentStatus,
				availabilityStatus
			)
		) {
			return "Unable to load schedule!";
		}
	}

	return (
		<>
			<h3 style={{float: "left"}}>
				{hoursWorked} hour{hoursWorked !== 1 && "s"} worked this month
			</h3>
			<FullCalendar
				allDaySlot={allDayOOO}
				businessHours={instructorBusinessHours}
				columnHeaderFormat={{weekday: "short"}}
				defaultView="timeGridWeek"
				eventColor={stringToColor(instructor.name || "")}
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

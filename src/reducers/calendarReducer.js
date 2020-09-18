import initialState from "./initialState";
import * as actions from "../actions/actionTypes";
import { REQUEST_ALL } from "../actions/apiActions";

export default function Calendar(
	state = initialState.CalendarData,
	{ payload, type }
) {
	let newState = state;

	switch (type) {

		case actions.GET_CALENDAR_EVENTS:
			return {
				...newState,
				CourseSessions: payload
			}
		default:
			return newState;
	}
}

const getSessions = (state, { id, response }) => {
	const { data } = response;
	let { CourseSessions } = state;
	if (id === REQUEST_ALL) {
		data.forEach((session) => {
			CourseSessions = updateSessions(
				CourseSessions,
				session.instructor,
				session
			);
		});
	} else if (Array.isArray(id)) {
		response.forEach(({ data }) => {
			CourseSessions = updateSessions(CourseSessions, data.instructor, data);
		});
	} else {
		CourseSessions = updateSessions(
			CourseSessions,
			response.data.instructor,
			response.data
		);
	}

	return {
		...state,
		CourseSessions,
	};
};

const updateSessions = (sessions, instructorID, session) => ({
	...sessions,
	[instructorID]: {
		...sessions[instructorID],
		[session.id]: session,
	},
});


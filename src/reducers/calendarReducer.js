import initialState from "./initialState";
import * as actions from "../actions/actionTypes";
import {REQUEST_ALL} from "../actions/apiActions";

export default function Calendar(
	state = initialState.CalendarData,
	{payload, type}
) {
	let newState = state;

	switch (type) {
		case actions.ADD_EVENT:
			newState.events_in_view.push(payload);
			return newState;

		case actions.DELETE_EVENT:
			const removeIndex = newState.events_in_view
				.map((item) => {
					return item.id;
				})
				.indexOf(payload.id);
			newState.events_in_view.splice(removeIndex, 1);
			return newState;

		case actions.DELETE_ALL_EVENTS:
			return state;

		case actions.FILTER_EVENT:
			const filter_key = payload.key;
			const filter_value = payload.value;

			// Search by subject
			newState.events_in_view
				.filter((allCourse) => allCourse[filter_key] === filter_value)
				.map((finalResult) => {
					return {
						...finalResult,
					};
				});

			return newState;
		case actions.GET_SESSIONS_STARTED:
			return {
				...state,
				CourseSessions: {},
			};
		case actions.GET_SESSIONS_SUCCESS:
			return getSessions(state, payload);
		case actions.GET_SESSIONS_FAILED:
			return newState;
		default:
			return newState;
	}
}

const getSessions = (state, {id, response}) => {
	const {data} = response;
	let {CourseSessions} = state;
	if (id === REQUEST_ALL) {
		data.forEach((session) => {
			CourseSessions = updateSessions(
				CourseSessions,
				session.instructor,
				session
			);
		});
	} else if (Array.isArray(id)) {
		response.forEach(({data}) => {
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

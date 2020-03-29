import * as types from "./actionTypes";
import {instance, REQUEST_ALL, wrapGet, wrapPatch} from "./apiActions";
import {wrapUseEndpoint} from "./hooks";

export function addEvent(event) {
	return {
		type: types.ADD_EVENT,
		payload: event,
	};
}

export function deleteEvent(event) {
	return {
		type: types.DELETE_EVENT,
		payload: event,
	};
}

export function filterEvent(event) {
	return {type: types.FILTER_EVENT, payload: event};
}

export const fetchSession = ({config, id}) =>
	wrapGet(
    "/scheduler/session/",
    [
		types.GET_SESSIONS_STARTED,
		types.GET_SESSIONS_SUCCESS,
		types.GET_SESSIONS_FAILED,
    ],
    {
		config,
		id,
    }
	);

export const useSession = (id, config) =>
	wrapUseEndpoint("/scheduler/session/", types.GET_SESSIONS_SUCCESS)(
		id,
		config
	);

export const patchSession = (id, data) =>
	wrapPatch(
    "/scheduler/session/",
    [
		types.PATCH_SESSION_STARTED,
		types.PATCH_SESSION_SUCCESS,
		types.PATCH_SESSION_FAILED,
    ],
    {
		id,
		data,
    }
	);

export const resetSchedulerStatus = () => ({
	type: types.RESET_SCHEDULER_STATUS,
	payload: "",
});

export const fetchAllSessions = ({config}) => (dispatch) =>
	new Promise((resolve) => {
    dispatch({
		type: types.GET_SESSIONS_STARTED,
		payload: 1,
    });
    resolve();
	}).then(() => {
    // fetch courses
		instance
			.request({
				method: "get",
				url: "/course/catalog/",
			})
			.then(
				(courseResponse) => {
					dispatch({
						type: types.FETCH_COURSE_SUCCESSFUL,
						payload: {
							id: REQUEST_ALL,
							response: courseResponse,
            },
					});

					instance
						.request({
							method: "get",
							url: "/account/instructor/",
						})
						.then(
							(instructorResponse) => {
								dispatch({
									type: types.FETCH_INSTRUCTOR_SUCCESSFUL,
									payload: {
										id: REQUEST_ALL,
										response: instructorResponse,
									},
								});
								instance
									.request({
										method: "get",
										url: "/scheduler/session/",
										...config,
									})
									.then((sessionResponse) => {
										dispatch(
											{
												type: types.GET_SESSIONS_SUCCESS,
												payload: {
													id: REQUEST_ALL,
													response: sessionResponse,
												},
											},
											(error) => {
												dispatch({
													type: types.GET_SESSIONS_FAILED,
													payload: error,
												});
											}
										);
									});
							},
							(error) => {
								dispatch({
									type: types.FETCH_INSTRUCTOR_FAILED,
									payload: error,
                });
							}
						);
				},
				(error) => {
					dispatch({
						type: types.FETCH_COURSE_FAILED,
						payload: error,
					});
				}
			);
	});

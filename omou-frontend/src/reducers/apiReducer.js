import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import * as api from "../actions/apiActions";

export default (state = initialState.RequestStatus, {payload, type}) => {
    switch (type) {
        case actions.FETCH_COURSES_STARTED:
            return updateCourseFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_COURSES_SUCCESSFUL:
            return updateCourseFetch(state, payload.id, api.REQUEST_SUCCESS);
        case actions.FETCH_COURSES_FAILED:
            return updateCourseFetch(state, payload.id, api.REQUEST_FAILED);

        case actions.FETCH_INSTRUCTORS_STARTED:
            return updateInstructorFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_INSTRUCTORS_SUCCESSFUL:
            return updateInstructorFetch(state, payload.id, api.REQUEST_SUCCESS);
        case actions.FETCH_INSTRUCTORS_FAILED:
            return updateInstructorFetch(state, payload.id, api.REQUEST_FAILED);

        default:
            return state;
    }
};

const updateCourseFetch = (state, id, status) => {
    let newState = {...state};
    newState.course[actions.GET][id] = status;
    return newState;
};

const updateInstructorFetch = (state, id, status) => {
    let newState = {...state};
    newState.instructor[actions.GET][id] = status;
    return newState;
};

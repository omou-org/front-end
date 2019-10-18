import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import * as api from "../actions/apiActions";

export default (state = initialState.RequestStatus, {payload, type}) => {
    let status;
    if (payload && payload.response && payload.response.status) {
        ({status} = payload.response);
    } else {
        // general server error
        status = 500;
    }
    console.log(type)
    switch (type) {
        case actions.LOGIN_STARTED:
            return updateLogin(state, api.REQUEST_STARTED);
        case actions.LOGIN_SUCCESSFUL:
            return updateLogin(state, status);
        case actions.LOGIN_FAILED:
            return updateLogin(state, status);
        case actions.RESET_ATTEMPT:
            return clearLogin(state);
        case actions.LOGOUT:
            return clearLogin(state);

        case actions.FETCH_COURSES_STARTED:
            return updateCourseFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_COURSES_SUCCESSFUL:
            return updateCourseFetch(state, payload.id, status);
        case actions.FETCH_COURSES_FAILED:
            return updateCourseFetch(state, payload.id, status);

        case actions.FETCH_INSTRUCTORS_STARTED:
            return updateInstructorFetch(state, payload.id, payload.REQUEST_STARTED);
        case actions.FETCH_INSTRUCTORS_SUCCESSFUL:
            return updateInstructorFetch(state, payload.id, status);
        case actions.FETCH_INSTRUCTORS_FAILED:
            return updateInstructorFetch(state, payload.id, status);

        default:
            return state;
    }
};

const clearLogin = (state) => ({
    ...state,
    "login": null,
});

const updateLogin = (state, status) => ({
    ...state,
    "login": status,
});

const updateCourseFetch = (state, id, status) => {
    const newState = {...state};
    newState.course[actions.GET][id] = status;
    return newState;
};

const updateInstructorFetch = (state, id, status) => {
    const newState = {...state};
    newState.instructor[actions.GET][id] = status;
    return newState;
};

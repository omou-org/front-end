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

        case actions.FETCH_COURSE_STARTED:
            return updateCourseFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_COURSE_SUCCESSFUL:
            return updateCourseFetch(state, payload.id, status);
        case actions.FETCH_COURSE_FAILED:
            return updateCourseFetch(state, payload.id, status);

        case actions.FETCH_INSTRUCTOR_STARTED:
            return updateInstructorFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorFetch(state, payload.id, status);
        case actions.FETCH_INSTRUCTOR_FAILED:
            return updateInstructorFetch(state, payload.id, status);

        case actions.FETCH_STUDENT_STARTED:
            return updateStudentFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_STUDENT_SUCCESSFUL:
            return updateStudentFetch(state, payload.id, status);
        case actions.FETCH_STUDENT_FAILED:
            return updateStudentFetch(state, payload.id, status);

        case actions.FETCH_PARENT_STARTED:
            return updateParentFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_PARENT_SUCCESSFUL:
            return updateParentFetch(state, payload.id, status);
        case actions.FETCH_PARENT_FAILED:
            return updateParentFetch(state, payload.id, status);

        case actions.FETCH_ENROLLMENT_STARTED:
            return updateEnrollmentFetch(state, api.REQUEST_STARTED);
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            return updateEnrollmentFetch(state, status);
        case actions.FETCH_ENROLLMENT_FAILED:
            return updateEnrollmentFetch(state, status);

        case actions.POST_INSTRUCTOR_STARTED:
            return updateInstructorPost(state, api.REQUEST_STARTED);
        case actions.POST_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorPost(state, status);
        case actions.POST_INSTRUCTOR_FAILED:
            return updateInstructorPost(state, status);

        case actions.PATCH_INSTRUCTOR_STARTED:
            return updateInstructorPatch(state, payload.id, api.REQUEST_STARTED);
        case actions.POST_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorPatch(state, payload.id, status);
        case actions.POST_INSTRUCTOR_FAILED:
            return updateInstructorPatch(state, payload.id, status);

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
    let newState = JSON.parse(JSON.stringify(state));
    newState.course[actions.GET][id] = status;
    return newState;
};

const updateStudentFetch = (state, id, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.student[actions.GET][id] = status;
    return newState;
};

const updateParentFetch = (state, id, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.parent[actions.GET][id] = status;
    return newState;
};

const updateInstructorFetch = (state, id, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.GET][id] = status;
    return newState;
};

const updateInstructorPost = (state, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.POST] = status;
    return newState;
};

const updateInstructorPatch = (state, id, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.PATCH][id] = status;
    return newState;
};

const updateEnrollmentFetch = (state, id, status) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.enrollment[actions.GET] = status;
    return newState;
};

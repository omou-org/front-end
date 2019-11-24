import * as types from "./actionTypes";
// import {instance} from "./apiActions";
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN,
});

const typeToEndpoint = {
    "student": "/account/student/",
    "parent": "/account/parent/",
    "instructor": "/account/instructor/",
    "course": "/course/catalog/",
};

const typeToFetchActions = {
    "student": [
        types.FETCH_STUDENT_SUCCESSFUL,
        types.FETCH_STUDENT_FAILED,
    ],
    "parent": [
        types.FETCH_PARENT_SUCCESSFUL,
        types.FETCH_PARENT_FAILED,
    ],
    "instructor": [
        types.FETCH_INSTRUCTOR_SUCCESSFUL,
        types.FETCH_INSTRUCTOR_FAILED,
    ],
    "course": [
        types.FETCH_COURSE_SUCCESSFUL,
        types.FETCH_COURSE_FAILED,
    ],
};

const typeToPostActions = {
    "student": [
        types.POST_STUDENT_SUCCESSFUL,
        types.POST_STUDENT_FAILED,
    ],
    "parent": [
        types.POST_PARENT_SUCCESSFUL,
        types.POST_PARENT_FAILED,
    ],
    "instructor": [
        types.POST_INSTRUCTOR_SUCCESSFUL,
        types.POST_INSTRUCTOR_FAILED,
    ],
    "course": [
        types.POST_COURSE_SUCCESSFUL,
        types.POST_COURSE_FAILED,
    ],
    "course category": [
        types.POST_CATEGORY_SUCCESSFUL,
        types.POST_CATEGORY_FAILED,
    ],
};

export const fetchData = (type) => {
    if (typeToEndpoint.hasOwnProperty(type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToFetchActions[type];
        return (dispatch, getState) => instance.get(endpoint, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
        })
            .then(({data}) => {
                dispatch({
                    type: successAction,
                    payload: data,
                });
            })
            .catch((error) => {
                dispatch({type: failAction, payload: error});
            });
    } else {
        console.error(`Invalid data type ${type}, must be one of ${Object.keys(typeToEndpoint)}`);
    }
};

export const postData = (type, body) => {
    if (typeToEndpoint.hasOwnProperty(type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch, getState) => new Promise((resolve) => {
            dispatch({
                type: types.SUBMIT_INITIATED,
                payload: null,
            });
            resolve();
        }).then(() => {
            instance.post(endpoint, body, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            })
                .then(({data}) => {
                    dispatch({
                        type: successAction,
                        payload: data,
                    });
                })
                .catch((error) => {
                    dispatch({type: failAction, payload: error});
                });
        });
    } else {
        console.error(`Invalid data type ${type}, must be one of ${Object.keys(typeToEndpoint)}`);
    }
};

export const patchData = (type, body, id) => {
    if (typeToEndpoint.hasOwnProperty(type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch, getState) => new Promise((resolve) => {
            dispatch({
                type: types.SUBMIT_INITIATED,
                payload: null,
            });
            resolve();
        }).then(() => {
            instance.patch(`${endpoint}${id}/`, body, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            })
                .then(({data}) => {
                    dispatch({
                        type: successAction,
                        payload: data,
                    });
                })
                .catch((error) => {
                    dispatch({type: failAction, payload: error});
                });
        });
    } else {
        console.error(`Invalid data type ${type}, must be one of ${Object.keys(typeToEndpoint)}`);
    }
};

export const submitParentAndStudent = (parent, student, parentID, studentID) => {
    const studentEndpoint = typeToEndpoint["student"];
    const parentEndpoint = typeToEndpoint["parent"];
    const [studentSuccessAction, studentFailAction] = typeToPostActions["student"];
    const [parentSuccessAction, parentFailAction] = typeToPostActions["parent"];
    return (dispatch, getState) => new Promise((resolve) => {
        dispatch({
            type: types.SUBMIT_INITIATED,
            payload: null,
        });
        resolve();
    }).then(() => {
        instance.request({
            "data": parent,
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
            "method": parentID ? "patch" : "post",
            "url": parentID ? `${parentEndpoint}${parentID}/` : parentEndpoint,
        })
            .then((parentResponse) => {
                dispatch({
                    type: parentSuccessAction,
                    payload: parentResponse.data,
                });
                instance.request({
                    "data": {
                        ...student,
                        "primary_parent": parentResponse.data.user.id,
                    },
                    "headers": {
                        "Authorization": `Token ${getState().auth.token}`,
                    },
                    "method": studentID ? "patch" : "post",
                    "url": studentID ? `${studentEndpoint}${studentID}/` : studentEndpoint,
                })
                    .then((studentResponse) => {
                        dispatch({
                            type: studentSuccessAction,
                            payload: studentResponse.data,
                        });
                    }, (error) => {
                        dispatch({type: studentFailAction, payload: error});
                    });
            }, (error) => {
                dispatch({type: parentFailAction, payload: error});
            });
    });
};

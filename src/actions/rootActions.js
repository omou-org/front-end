import * as types from "./actionTypes";
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN,
});

const typeToEndpoint = {
    "student": "/account/students/",
    "parent": "/account/parents/",
    "instructor": "/account/instructors/",
    "course": "/courses/catalog/",
    "course category": "/courses/categories/",
};

const typeToFetchActions = {
    "student": [
        types.FETCH_STUDENTS_SUCCESSFUL,
        types.FETCH_STUDENTS_FAILED,
    ],
    "parent": [
        types.FETCH_PARENTS_SUCCESSFUL,
        types.FETCH_PARENTS_FAILED,
    ],
    "instructor": [
        types.FETCH_INSTRUCTORS_SUCCESSFUL,
        types.FETCH_INSTRUCTORS_FAILED,
    ],
    "course": [
        types.FETCH_COURSES_SUCCESSFUL,
        types.FETCH_COURSES_FAILED,
    ],
    "course category": [
        types.FETCH_CATEGORIES_SUCCESSFUL,
        types.FETCH_CATEGORIES_FAILED,
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
        return (dispatch) => instance.get(endpoint, {
            headers: {
                "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
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
        return (dispatch) => new Promise((resolve) => {
            dispatch({
                type: types.SUBMIT_INITIATED,
                payload: null,
            });
            resolve();
        }).then(() => {
            instance.post(endpoint, body, {
                headers: {
                    "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
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
        return (dispatch) => new Promise((resolve) => {
            dispatch({
                type: types.SUBMIT_INITIATED,
                payload: null,
            });
            resolve();
        }).then(() => {
            instance.patch(`${endpoint}${id}/`, body, {
                headers: {
                    "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
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
    return (dispatch) => new Promise((resolve) => {
        dispatch({
            type: types.SUBMIT_INITIATED,
            payload: null,
        });
        resolve();
    }).then(() => {
        instance.request({
            "data": parent,
            "headers": {
                "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
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
                        "parent": parentResponse.data.user.id,
                    },
                    "headers": {
                        "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
                        "Content-Type": "application/json",
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

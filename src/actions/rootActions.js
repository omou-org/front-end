import * as types from './actionTypes';
import { instance } from './apiActions';

const typeToEndpoint = {
    student: '/account/student/',
    parent: '/account/parent/',
    instructor: '/account/instructor/',
    course: '/course/catalog/',
    admin: '/account/admin/',
};

const typeToFetchActions = {
    student: [types.FETCH_STUDENT_SUCCESSFUL, types.FETCH_STUDENT_FAILED],
    parent: [types.FETCH_PARENT_SUCCESSFUL, types.FETCH_PARENT_FAILED],
    instructor: [
        types.FETCH_INSTRUCTOR_SUCCESSFUL,
        types.FETCH_INSTRUCTOR_FAILED,
    ],
    course: [types.FETCH_COURSE_SUCCESSFUL, types.FETCH_COURSE_FAILED],
};

export const typeToPostActions = {
    student: [types.POST_STUDENT_SUCCESSFUL, types.POST_STUDENT_FAILED],
    parent: [types.POST_PARENT_SUCCESSFUL, types.POST_PARENT_FAILED],
    instructor: [
        types.POST_INSTRUCTOR_SUCCESSFUL,
        types.POST_INSTRUCTOR_FAILED,
    ],
    course: [types.POST_COURSE_SUCCESSFUL, types.POST_COURSE_FAILED],
    'course category': [
        types.POST_CATEGORY_SUCCESS,
        types.POST_CATEGORY_FAILED,
    ],
    admin: [types.POST_ADMIN_SUCCESSFUL, types.POST_ADMIN_FAILED],
};

export const fetchData = (type) => {
    if (Object.prototype.hasOwnProperty.call(typeToEndpoint, type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToFetchActions[type];
        return (dispatch) =>
            instance
                .get(endpoint)
                .then(({ data }) => {
                    dispatch({
                        type: successAction,
                        payload: data,
                    });
                })
                .catch((error) => {
                    dispatch({ type: failAction, payload: error });
                });
    } else {
        console.error(
            `Invalid data type ${type}, must be one of ${Object.keys(
                typeToEndpoint
            )}`
        );
    }
};

export const postData = (type, body) => {
    if (Object.prototype.hasOwnProperty.call(typeToEndpoint, type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch) =>
            new Promise((resolve) => {
                dispatch({
                    type: types.SUBMIT_INITIATED,
                    payload: null,
                });
                resolve();
            }).then(() => {
                instance
                    .post(endpoint, body)
                    .then((response) => {
                        let { data } = response;
                        dispatch({
                            type: successAction,
                            payload: data,
                        });
                    })
                    .catch((error) => {
                        dispatch({ type: failAction, payload: error });
                    });
            });
    } else {
        console.error(
            `Invalid data type ${type}, must be one of ${Object.keys(
                typeToEndpoint
            )}`
        );
    }
};

export const patchData = (type, body, id) => {
    if (Object.prototype.hasOwnProperty.call(typeToEndpoint, type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch) =>
            new Promise((resolve) => {
                dispatch({
                    type: types.SUBMIT_INITIATED,
                    payload: null,
                });
                resolve();
            }).then(() => {
                instance
                    .patch(`${endpoint}${id}/`, body)
                    .then(({ data }) => {
                        dispatch({
                            type: successAction,
                            payload: data,
                        });
                    })
                    .catch((error) => {
                        dispatch({ type: failAction, payload: error });
                    });
            });
    } else {
        console.error(
            `Invalid data type ${type}, must be one of ${Object.keys(
                typeToEndpoint
            )}`
        );
    }
};

export const submitParentAndStudent = (
    parent,
    student,
    parentID,
    studentID
) => {
    const studentEndpoint = typeToEndpoint['student'];
    const parentEndpoint = typeToEndpoint['parent'];
    const [studentSuccessAction, studentFailAction] =
        typeToPostActions['student'];
    const [parentSuccessAction, parentFailAction] = typeToPostActions['parent'];
    return (dispatch) =>
        new Promise((resolve) => {
            dispatch({
                type: types.SUBMIT_INITIATED,
                payload: null,
            });
            resolve();
        }).then(() => {
            let formatDate = new Date(parent.birth_date)
                .toISOString()
                .substring(0, 10);
            instance
                .request({
                    data: { ...parent, birth_date: formatDate },
                    method: parentID ? 'patch' : 'post',
                    url: parentID
                        ? `${parentEndpoint}${parentID}/`
                        : parentEndpoint,
                })
                .then(
                    (parentResponse) => {
                        dispatch({
                            type: parentSuccessAction,
                            payload: parentResponse.data,
                        });
                        instance
                            .request({
                                data: {
                                    ...student,
                                    primary_parent: parentResponse.data.user.id,
                                },
                                method: studentID ? 'patch' : 'post',
                                url: studentID
                                    ? `${studentEndpoint}${studentID}/`
                                    : studentEndpoint,
                            })
                            .then(
                                (studentResponse) => {
                                    dispatch({
                                        type: studentSuccessAction,
                                        payload: studentResponse.data,
                                    });
                                },
                                (error) => {
                                    dispatch({
                                        type: studentFailAction,
                                        payload: error,
                                    });
                                }
                            );
                    },
                    (error) => {
                        dispatch({ type: parentFailAction, payload: error });
                    }
                );
        });
};

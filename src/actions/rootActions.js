import * as types from "./actionTypes";
import {instance} from "./apiActions";

const typeToEndpoint = {
    "student": "/account/student/",
    "parent": "/account/parent/",
    "instructor": "/account/instructor/",
    "course": "/course/catalog/",
    "admin": "/account/admin/",
};

export const typeToPostActions = {
    "student": [types.POST_STUDENT_SUCCESSFUL, types.POST_STUDENT_FAILED],
    "parent": [types.POST_PARENT_SUCCESSFUL, types.POST_PARENT_FAILED],
    "instructor": [
        types.POST_INSTRUCTOR_SUCCESSFUL,
        types.POST_INSTRUCTOR_FAILED,
    ],
    "course": [types.POST_COURSE_SUCCESSFUL, types.POST_COURSE_FAILED],
    "course category": [
        types.POST_CATEGORY_SUCCESS,
        types.POST_CATEGORY_FAILED,
    ],
    "admin": [types.POST_ADMIN_SUCCESSFUL, types.POST_ADMIN_FAILED],
};


export const postData = (type, body) => {
    if (typeToEndpoint.hasOwnProperty(type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch) =>
            new Promise((resolve) => {
                dispatch({
                    "type": types.SUBMIT_INITIATED,
                    "payload": null,
                });
                resolve();
            }).then(() => {
                instance
                    .post(endpoint, body)
                    .then((response) => {
                        const {data} = response;
                        dispatch({
                            "type": successAction,
                            "payload": data,
                        });
                    })
                    .catch((error) => {
                        dispatch({"type": failAction,
                            "payload": error});
                    });
            });
    }
    console.error(
            `Invalid data type ${type}, must be one of ${Object.keys(
                typeToEndpoint,
            )}`,
    );
};

export const patchData = (type, body, id) => {
    if (typeToEndpoint.hasOwnProperty(type)) {
        const endpoint = typeToEndpoint[type];
        const [successAction, failAction] = typeToPostActions[type];
        return (dispatch) =>
            new Promise((resolve) => {
                dispatch({
                    "type": types.SUBMIT_INITIATED,
                    "payload": null,
                });
                resolve();
            }).then(() => {
                instance
                    .patch(`${endpoint}${id}/`, body)
                    .then(({data}) => {
                        dispatch({
                            "type": successAction,
                            "payload": data,
                        });
                    })
                    .catch((error) => {
                        dispatch({"type": failAction,
                            "payload": error});
                    });
            });
    }
    console.error(
            `Invalid data type ${type}, must be one of ${Object.keys(
                typeToEndpoint,
            )}`,
    );
};

export const submitParentAndStudent = (
    parent,
    student,
    parentID,
    studentID,
) => {
    const studentEndpoint = typeToEndpoint.student;
    const parentEndpoint = typeToEndpoint.parent;
    const [studentSuccessAction, studentFailAction] = typeToPostActions.student;
    const [parentSuccessAction, parentFailAction] = typeToPostActions.parent;
    return (dispatch) =>
        new Promise((resolve) => {
            dispatch({
                "type": types.SUBMIT_INITIATED,
                "payload": null,
            });
            resolve();
        }).then(() => {
            const formatDate = new Date(parent.birth_date)
                .toISOString()
                .substring(0, 10);
            instance
                .request({
                    "data": {...parent,
                        "birth_date": formatDate},
                    "method": parentID ? "patch" : "post",
                    "url": parentID ?
                        `${parentEndpoint}${parentID}/` :
                        parentEndpoint,
                })
                .then(
                    (parentResponse) => {
                        dispatch({
                            "type": parentSuccessAction,
                            "payload": parentResponse.data,
                        });
                        instance
                            .request({
                                "data": {
                                    ...student,
                                    "primary_parent": parentResponse.data.user.id,
                                },
                                "method": studentID ? "patch" : "post",
                                "url": studentID ?
                                    `${studentEndpoint}${studentID}/` :
                                    studentEndpoint,
                            })
                            .then(
                                (studentResponse) => {
                                    dispatch({
                                        "type": studentSuccessAction,
                                        "payload": studentResponse.data,
                                    });
                                },
                                (error) => {
                                    dispatch({
                                        "type": studentFailAction,
                                        "payload": error,
                                    });
                                },
                            );
                    },
                    (error) => {
                        dispatch({"type": parentFailAction,
                            "payload": error});
                    },
                );
        });
};

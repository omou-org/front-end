import * as types from "./actionTypes";
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000",
});

const typeToEndpoint = {
    "student": "/account/students/",
    "parent": "/account/parents/",
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
    "course": [
        types.POST_COURSE_SUCCESSFUL,
        types.POST_COURSE_FAILED,
    ],
    "course category": [
        types.POST_CATEGORY_SUCCESSFUL,
        types.POST_CATEGORY_FAILED,
    ],
};

/**
 * Fetch data from the database. Results are stored into redux
 * @param {String} type Type of data to fetch (student, parent, course, or course category)
 */
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
        return (dispatch) => instance.post(endpoint, body, {
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
    } else {
        console.error(`Invalid data type ${type}, must be one of ${Object.keys(typeToEndpoint)}`);
    }
};

export const postParentAndStudent = (parent, student) => {
    const studentEndpoint = typeToEndpoint["student"];
    const parentEndpoint = typeToEndpoint["parent"];
    const [studentSuccessAction, studentFailAction] = typeToPostActions["student"];
    const [parentSuccessAction, parentFailAction] = typeToPostActions["parent"];
    return (dispatch) => instance.post(parentEndpoint, parent, {
        headers: {
            "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
        },
    })
        .then((parentResponse) => {
            dispatch({
                type: parentSuccessAction,
                payload: parentResponse.data,
            });
            console.log(parentResponse);
            instance.post(studentEndpoint, {
                ...student,
                "parent": parentResponse.data.user.id,
            }, {
                headers: {
                    "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
                },
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
};

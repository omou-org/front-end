import * as types from "./actionTypes";
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8000",
});

const typeToRequestSettings = {
    "student": [
        "/account/students/",
        types.FETCH_STUDENTS_SUCCESSFUL,
        types.FETCH_STUDENTS_FAILED,
    ],
    "parent": [
        "/account/parents/",
        types.FETCH_PARENTS_SUCCESSFUL,
        types.FETCH_PARENTS_FAILED,
    ],
    "course": [
        "/courses/catalog/",
        types.FETCH_COURSES_SUCCESSFUL,
        types.FETCH_COURSES_FAILED,
    ],
    "course category": [
        "/courses/categories/",
        types.FETCH_CATEGORIES_SUCCESSFUL,
        types.FETCH_CATEGORIES_FAILED,
    ],
};

/**
 * Fetch data from the database. Results are stored into redux
 * @param {String} type Type of data to fetch (student, parent, course, or course category)
 */
export const fetchData = (type) => {
    if (typeToRequestSettings.hasOwnProperty(type)) {
        const [endpoint, successType, failType] = typeToRequestSettings[type];
        return (dispatch) => instance.get(`${endpoint}`, {
            headers: {
                "Authorization": `Token ${sessionStorage.getItem("authToken")}`,
            },
        })
            .then(({data}) => {
                dispatch({
                    type: successType,
                    payload: data,
                });
            })
            .catch((error) => {
                dispatch({type: failType, payload: error});
            });
    } else {
        console.error(`Invalid data type ${type}, must be one of ${Object.keys(typeToRequestSettings)}`);
    }
};

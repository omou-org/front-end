import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function users(state = initialState.Users, {payload, type}) {
    switch (type) {
        case actions.FETCH_STUDENTS_SUCCESSFUL:
            console.log("FETCHED STUDENTS", payload);
            return state;
        case actions.FETCH_STUDENTS_FAILED:
            console.error("FAILED TO FETCH STUDENTS", payload);
            return state;
        case actions.FETCH_PARENTS_SUCCESSFUL:
            console.log("FETCHED PARENTS", payload);
            return state;
        case actions.FETCH_PARENTS_FAILED:
            console.error("FAILED TO FETCH PARENTS", payload);
            return state;
        case actions.FETCH_COURSES_SUCCESSFUL:
            console.log("FETCHED COURSES", payload);
            return state;
        case actions.FETCH_COURSES_FAILED:
            console.error("FAILED TO FETCH COURSES", payload);
            return state;
        case actions.FETCH_CATEGORIES_SUCCESSFUL:
            console.log("FETCHED STUDENTS", payload);
            return state;
        case actions.FETCH_CATEGORIES_FAILED:
            console.error("FAILED TO FETCH CATEGORIES", payload);
            return state;
        default:
            return state;
    }
}

import * as types from './actionTypes';

// function BaseURL() {
//     return 'http://www.omou.io/api/';
// }

export function fetchCourses() {
    return (dispatch) => {
        // return
    }
}

export function fetchStudents() {
    return {type: types.ALERT, payload:'lol'}
}

export function getRegistrationForm(){
    return {type: types.ALERT, payload: 'alert stuff'}
}

export function addStudentField(){
    return {type: types.ADD_STUDENT_FIELD, payload: 'alert stuff'}
}
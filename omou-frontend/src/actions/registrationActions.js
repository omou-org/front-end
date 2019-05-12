import * as types from './actionTypes';

function BaseURL() {
    return 'http://www.omou.io/api/';
}

export function fetchCourses() {
    return (dispatch) => {
        // return
    }
    // {type: types.RECEIVE_STUFF, payload: json.stuff};
}

export function fetchStudents() {
    return {type: types.ALERT, payload:'lol'}
}

export function getRegistrationForm(){
    return {type: types.ALERT, payload: 'alert stuff'}
}
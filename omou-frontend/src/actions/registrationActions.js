import * as types from './actionTypes';

import axios from 'axios';

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
    return {type: types.ADD_STUDENT_FIELD, payload: ""}
}

export function addCourseField(){
    return {type: types.ADD_COURSE_FIELD, payload:""}
}

export function addField(path){
    return {type: types.ADD_FIELD, payload:path}
}

export function fetchRandomColor(){
    return (dispatch) => {
        return axios.get("http://api.open-notify.org/astros.json")
        .then(res =>{
            dispatch({type: types.RAND_COLOR, payload: res.data});
        })
            .catch(error=> {
                throw(error);
            })
    }
}
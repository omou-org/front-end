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


export function removeField(path){
    return {type: types.REMOVE_FIELD, payload:path}
}

export function getManiframe(){
    return (dispatch) => {
        return axios.post("http://localhost:8000/auth_token/",{
            "username":"daniel@gmail.com",
            "password":"daniel"
        })
        .then(res =>{
            console.log("Pass", res)
            dispatch({type: types.MAINFRAME, payload: res.data});
        })
            .catch(error=> {
                throw(error);
            })
    }
}

export function submitForm(state) {
    return {type: types.SUBMIT_FORM, payload: state};
}

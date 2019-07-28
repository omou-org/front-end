import * as types from "./actionTypes";

export const getRegistrationForm = () =>
    ({type: types.ALERT, payload: "alert stuff"});

export const addStudentField = () =>
    ({type: types.ADD_STUDENT_FIELD, payload: ""});

export const addCourseField = () =>
    ({type: types.ADD_COURSE_FIELD, payload: ""});

export const addField = (path) =>
    ({type: types.ADD_FIELD, payload: path});

export const removeField = (path, fieldIndex, conditional) =>
    ({type: types.REMOVE_FIELD, payload: [path, fieldIndex, conditional]});

export const submitForm = (state) =>
    ({type: types.SUBMIT_FORM, payload: state});

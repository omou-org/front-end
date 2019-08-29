import * as types from "./actionTypes";
import {submitParentAndStudent, postData} from "./rootActions";

const parseGender = {
    "Male": "M",
    "Female": "F",
    "Do not disclose": "U",
};

const parseBirthday = (date) => {
    const [year, month, day] = date.split("/");
    return `${year}-${month}-${day}`;
};

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

export const submitForm = (state, id) => {
    switch (state.form) {
        case "student": {
            const student = {
                "user": {
                    "first_name":
                        state["Basic Information"]["Student First Name"],
                    "last_name":
                        state["Basic Information"]["Student Last Name"],
                    "email": state["Basic Information"]["Student Email"],
                    "password": "password123",
                },
                "gender":
                    parseGender[state["Basic Information"]["Gender"]],
                "address": state["Parent Information"]["Address"],
                "city": state["Parent Information"]["City"],
                "phone_number":
                    state["Basic Information"]["Student Phone Number"] ||
                    null,
                "state": state["Parent Information"]["State"],
                "zipcode": state["Parent Information"]["Zip Code"],
                "grade": state["Basic Information"]["Grade"],
                "age": state["Basic Information"]["Age"],
                "school": state["Basic Information"]["School"],
                "birth_date": "2019-01-01",
            };
            const parent = {
                "user": {
                    "email": state["Parent Information"]["Parent Email"],
                    "password": "password123",
                    "first_name":
                        state["Parent Information"]["Parent First Name"],
                    "last_name":
                        state["Parent Information"]["Parent Last Name"],
                },
                "gender":
                    parseGender[state["Parent Information"]["Gender"]],
                "address": state["Parent Information"]["Address"],
                "city": state["Parent Information"]["City"],
                "state": state["Parent Information"]["State"],
                "phone_number":
                    state["Parent Information"]["Phone Number"] ||
                    null,
                "zipcode": state["Parent Information"]["Zip Code"],
                "relationship":
                    state["Parent Information"]["Relationship to Student"]
                        .toUpperCase(),
                "birth_date": "2019-01-01",
            };
            const selectedParent = state["Parent Information"]["Select Parent"];
            return submitParentAndStudent(parent, student,
                selectedParent ? selectedParent.value : null, id);
        }
        case "instructor": {
            return postData("instructor", {
                "user": {
                    "email": state["Basic Information"]["E-Mail"],
                    "password": "password123",
                    "first_name": state["Basic Information"]["First Name"],
                    "last_name": state["Basic Information"]["Last Name"],
                },
                "gender": parseGender[state["Basic Information"]["Gender"]],
                "address": state["Basic Information"]["Address"],
                "city": state["Basic Information"]["City"],
                "state": "CA",
                "phone_number": state["Basic Information"]["Phone Number"],
                "zipcode": state["Basic Information"]["Zip Code"],
                "age": 0,
                "birth_date": parseBirthday(state["Basic Information"]["Date of Birth (MM/DD/YYYY)"]),
            });
        }
        default:
            console.error(`Invalid form type ${state.form}`);
    }
};

export const resetSubmitStatus = () =>
    ({type: types.RESET_SUBMIT_STATUS, payload: null});

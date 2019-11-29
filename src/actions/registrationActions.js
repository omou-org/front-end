import * as types from "./actionTypes";
import {submitParentAndStudent, postData, patchData} from "./rootActions";
import {wrapGet, postCourse} from "./apiActions";

const parseGender = {
    "Male": "M",
    "Female": "F",
    "Do not disclose": "U",
};

const parseDate = (date) => {
    if (!date) {
        return null;
    }
    return date.substring(0,10);
};

const parseTime = (time) => {
    if (!time) {
        return null;
    }
    const [hourStr, secondPart] = time.split(":");
    const hourNum = parseInt(hourStr, 10);
    const hour = hourNum === 12 ? hourNum - 12 : hourNum;
    const [minute, dayHalf] = secondPart.split(" ");
    if (dayHalf.toUpperCase() === "PM") {
        return `${hour + 12}:${minute}`;
    }
    return `${hour}:${minute}`;
};

export const getRegistrationForm = () =>
    ({type: types.ALERT, payload: "alert stuff"});

export const setRegisteringParent = (parent) =>
    ({type: types.SET_PARENT, payload: parent});

export const addStudentField = () =>
    ({type: types.ADD_STUDENT_FIELD, payload: ""});

export const addCourseField = () =>
    ({type: types.ADD_COURSE_FIELD, payload: ""});

export const addField = (path) =>
    ({type: types.ADD_FIELD, payload: path});

export const removeField = (path, fieldIndex, conditional) =>
    ({type: types.REMOVE_FIELD, payload: [path, fieldIndex, conditional]});

export const submitForm = (state, id) => {
    console.log(state.form);
    switch (state.form) {
        case "student": {
            const student = {
                "user": {
                    "first_name":
                        state["Basic Information"]["Student First Name"],
                    "last_name":
                        state["Basic Information"]["Student Last Name"],
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
                "birth_date": parseDate(state["Basic Information"]["Birthday"]),
            };
            const parent = {
                "user": {
                    "email": state["Parent Information"]["Parent Email"],
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
                "birth_date": parseDate(state["Parent Information"]["Parent Birthday"]),
            };
            const selectedParent = state["Parent Information"]["Select Parent"];
            return submitParentAndStudent(parent, student,
                selectedParent ? selectedParent.value : null, id);
        }
        case "parent": {
            const parent = {
                "user": {
                    "email": state["Parent Information"]["Email"],
                    "first_name":
                        state["Parent Information"]["First Name"],
                    "last_name":
                        state["Parent Information"]["Last Name"],
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
                    state["Parent Information"]["Relationship to Student(s)"]
                        .toUpperCase(),
                "birth_date": parseDate(state["Parent Information"]["Birthday"]),
            };
            if (id) {
                return patchData("parent", parent, id);
            } else {
                return postData("parent", parent);
            }
        }
        case "instructor": {
            const instructor = {
                "user": {
                    "email": state["Basic Information"]["E-Mail"],
                    "first_name": state["Basic Information"]["First Name"],
                    "last_name": state["Basic Information"]["Last Name"],
                },
                "gender": parseGender[state["Basic Information"]["Gender"]],
                "address": state["Basic Information"]["Address"],
                "city": state["Basic Information"]["City"],
                "state": "CA",
                "phone_number": state["Basic Information"]["Phone Number"],
                "zipcode": state["Basic Information"]["Zip Code"],
                "age": 21,
                "birth_date": parseDate(state["Basic Information"]["Date of Birth"]),
            };
            if (id) {
                return patchData("instructor", instructor, id);
            } else {
                return postData("instructor", instructor);
            }
        }
        case "course_details": {
            const course = {
                "subject": state["Course Info"]["Name"],
                "description": state["Course Info"]["Description"],
                "instructor": state["Course Info"]["Instructor"].value,
                "tuition": state["Course Info"]["Tuition"],
                "day_of_week": state["Course Info"]["Day"],
                "start_date": parseDate(state["Course Info"]["Start Date"]),
                "end_date": parseDate(state["Course Info"]["End Date"]),
                "start_time": parseTime(state["Course Info"]["Start Time"]),
                "end_time": parseTime(state["Course Info"]["End Time"]),
                "max_capacity": state["Course Info"]["Capacity"],
            };
            for (const key in course) {
                if (course.hasOwnProperty(key) && !course[key]) {
                    delete course[key];
                }
            }
            if (id) {
                return patchData("course", course, id);
            }
        }
        case "tutoring":{
            return { type: types.ADD_TUTORING_REGISTRATION, payload: state }
        }
        case "course": {
            return { type: types.ADD_CLASS_REGISTRATION, payload: state }
        }
        default:
            console.error(`Invalid form type ${state.form}`);
    }
};

export const resetSubmitStatus = () =>
    ({type: types.RESET_SUBMIT_STATUS, payload: null});

export const fetchEnrollments = () => wrapGet(
    "/course/enrollment/",
    [
        types.FETCH_ENROLLMENT_STARTED,
        types.FETCH_ENROLLMENT_SUCCESSFUL,
        types.FETCH_ENROLLMENT_FAILED,
    ],
    // enrollmentId
);

export const initializeRegistration = () =>
    ({type: types.INIT_COURSE_REGISTRATION, payload:""});

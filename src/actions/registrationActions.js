import * as types from "./actionTypes";
import {submitParentAndStudent, postData, patchData, typeToPostActions} from "./rootActions";
import {wrapGet, postCourse, formatCourse, wrapPost, instance, wrapPatch} from "./apiActions";

const parseGender = {
    "Male": "male",
    "Female": "female",
    "Do not disclose": "unspecified",
};

const parseDate = (date) => {
    if (!date) {
        return null;
    }
    if (typeof date === 'string'){
        return date.substring(0,10);
    } else {
        return date.toISOString().substring(0,10)
    }

};

const parseTime = (time) => {
    if (!time) {
        return null;
    }
    // const [hourStr, secondPart] = time.split(":");
    // const hourNum = parseInt(hourStr, 10);
    // const hour = hourNum === 12 ? hourNum - 12 : hourNum;
    // const [minute, dayHalf] = secondPart.split(" ");

    // if (dayHalf.toUpperCase() === "PM") {
    //     return `${hour + 12}:${minute}`;
    // }
    if(typeof time === 'string'){
        return time.substring(12,16);
    } else {
        return time.toISOString().substring(12,16);
    }
};

export const getRegistrationForm = () =>
    ({type: types.ALERT, payload: "alert stuff"});

export const setRegisteringParent = (parent) =>
    ({type: types.SET_PARENT, payload: parent});

export const resetRegistration = () =>
    ({type: types.RESET_REGISTRATION, payload: ""});

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
                        .toLowerCase(),
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
                "subjects": state["Experience"]["Subject(s) Tutor Can Teach"],
                "biography": state["Experience"]["Background"],
                "experience": state["Experience"]["Teaching Experience (Years)"],
                "language": state["Experience"]["Languages"],
            };
            if (id) {
                return patchData("instructor", instructor, id);
            } else {
                return postData("instructor", instructor);
            }
        }
        case "course_details": {
            const course = formatCourse(state["Course Info"],"class");

            for (const key in course) {
                if (course.hasOwnProperty(key) && !course[key]) {
                    delete course[key];
                }
            }
            const updatedCourse = {
                ...course,
                hourly_tuition: state["Tuition"]["Hourly Tuition"],
                total_tuition: state["Tuition"]["Total Tuition"]
            };
            if (id) {
                return patchData("course", updatedCourse, id);
            } else {
                return postData("course", updatedCourse);
            }
        }
        case "tutoring":{
            return { type: types.ADD_TUTORING_REGISTRATION, payload: {...state} }
        }
        case "course": {
            return { type: types.ADD_CLASS_REGISTRATION, payload: {...state, id} }
        }
        case "small_group":{
            return { type: types.ADD_CLASS_REGISTRATION, payload: {...state} }
        }
        default:
            console.error(`Invalid form type ${state.form}`);
    }
};

export const patchCourse = (id,data) => wrapPatch(
    '/course/catalog/',
    [
        types.PATCH_COURSE_STARTED,
        types.PATCH_COURSE_SUCCESSFUL,
        types.PATCH_COURSE_FAILED,
    ],
    {
        id:id,
        data:data,
    }
);

export const fetchPayments = (id) => wrapGet(
    '/payment/payment/',
    [
        types.GET_PAYMENT_STARTED,
        types.GET_PAYMENT_SUCCESS,
        types.GET_PAYMENT_FAILED,
    ],
    {
        id:id,
    }
)

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
    {}
);

export const initializeRegistration = () =>
    ({type: types.INIT_COURSE_REGISTRATION, payload:""});
export const closeRegistration = () =>
    ({type: types.CLOSE_COURSE_REGISTRATION, payload: ""});

export const editRegistration = (editedRegistration) =>
    ({type: types.EDIT_COURSE_REGISTRATION, payload: editedRegistration});

export const addCourseRegistration = (form) =>
    ({type: types.ADD_CLASS_REGISTRATION, payload:{...form}});

export const setParentAddCourseRegistration = (parentID, form) => {
    const parentEndpoint = `/account/parent/${parentID}/`;
    return (dispatch, getState) => new Promise((resolve) =>{
        dispatch({
            type:types.FETCH_PARENT_STARTED,
            payload:parentID,
        });
        resolve();
    }).then(()=>{
        instance.request({
            "headers":{
                "Authorization": `Token ${getState().auth.token}`,
            },
            "method":"get",
            "url":parentEndpoint,
        })
            .then((parentResponse)=>{
                dispatch({
                    type: types.FETCH_PARENT_SUCCESSFUL,
                    payload:{ id:parentID, response:parentResponse},
                });
                const {data} = parentResponse;
                const parent = {
                    ...data,
                    user:{
                        ...data.user,
                        user_uuid: data.user.id,
                        name: data.user.first_name + " " + data.user.last_name,
                    }
                };
                dispatch({
                    type: types.SET_PARENT,
                    payload: parent,
                });
                dispatch({
                    type: types.ADD_CLASS_REGISTRATION,
                    payload: {...form},
                });
            })
    })
};

export const initRegistration = (tutoringRegistrations, classRegistrations, paymentInfo) =>
    ({
        type: types.SET_REGISTRATION,
        payload: {
            tutoringRegistrations: tutoringRegistrations,
            classRegistrations: classRegistrations,
            payment: paymentInfo,
        }
    });

const enrollmentEndpoint = "/course/enrollment/";
const courseEndpoint = "/course/catalog/";

export const addCourse = (course) => wrapPost(
    '/course/catalog/',
    [
        types.POST_COURSE_STARTED,
        types.POST_COURSE_SUCCESSFUL,
        types.POST_COURSE_FAILED,
    ],
    course,
);
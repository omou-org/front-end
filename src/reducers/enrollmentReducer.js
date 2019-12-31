import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function enrollment(state = initialState.Enrollments, {payload, type}) {
    switch (type) {
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            console.log("successful enrollment fetch");
            return handleEnrollment(state, payload, "GET");
        case actions.FETCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNoteFetch(state, payload);
        case actions.POST_ENROLLMENT_NOTE_SUCCESSFUL:
        case actions.PATCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNotesPost(state, payload);
        case actions.POST_ENROLLMENT_STARTED:
            return state;
        case actions.POST_ENROLLMENT_SUCCESS:
            return handleEnrollment(state, payload, "POST");
        case actions.POST_ENROLLMENT_FAILED:
            return state;
        default:
            return state;
    }
}

const handleEnrollment = (state, payload, requestType) => {
    let data;
    if(payload.response){
        data = payload.response.data
    } else {
        data = payload;
    }
    const newState = JSON.parse(JSON.stringify(state));
    switch(requestType) {
        case "GET":{
            data.forEach(({student, course, id}) => {
                let newStudentData = newState[student] || {};
                let newCourseData = newStudentData[course] || {
                    "enrollment_id": id,
                    "course_id": course,
                    "student_id": student,
                    "notes": {},
                    "session_payment_status": {
                        1: 1,
                        2: 1,
                        3: 1,
                        4: 1,
                        5: 1,
                        6: 1,
                        7: 1,
                        8: 1,
                        9: 1,
                        10: 1,
                        11: 1,
                        12: 1,
                        13: 1,
                        14: 1,
                        15: 1,
                    },
                };
                console.log(newStudentData,newState)
                newStudentData[course] = newCourseData;
                newState[student] = newStudentData;
            });
            break;
        }
        case "POST":{
            let {student, course, id} = data;
            let newStudentData = newState[student] || {};
            let newCourseData = newStudentData[course] || {
                "enrollment_id": id,
                "course_id": course,
                "student_id": student,
                "notes": {},
                "session_payment_status": {
                    1: 1,
                    2: 1,
                    3: 1,
                    4: 1,
                    5: 1,
                    6: 1,
                    7: 1,
                    8: 1,
                    9: 1,
                    10: 1,
                    11: 1,
                    12: 1,
                    13: 1,
                    14: 1,
                    15: 1,
                },
            };
            newStudentData[course] = newCourseData;
            newState[student] = newStudentData;
        }
    }
    return newState;
};

const handleEnrollmentNotesPost = (state, {response, ...rest}) => handleEnrollmentNoteFetch(state, {
    "response": {
        ...response,
        "data": [response.data],
    },
    ...rest,
});

const handleEnrollmentNoteFetch = (state, {courseID, studentID, response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));
    data.forEach((note) => {
        newState[studentID][courseID].notes[note.id] = note;
    });
    return newState;
};

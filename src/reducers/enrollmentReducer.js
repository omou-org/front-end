import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function enrollment(state = initialState.Enrollments, {payload, type}) {
    switch (type) {
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            return handleEnrollmentFetch(state, payload);
        case actions.FETCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNoteFetch(state, payload);
        case actions.POST_ENROLLMENT_NOTE_SUCCESSFUL:
        case actions.PATCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNotesPost(state, payload);
        default:
            return state;
    }
}

const handleEnrollmentFetch = (state, {response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));

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
        newStudentData[course] = newCourseData;
        newState[student] = newStudentData;
    });
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

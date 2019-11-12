import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function enrollment(state = initialState.Enrollments, {payload, type}) {
    switch (type) {
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            return handleEnrollmentFetch(state, payload);
        default:
            return state;
    }
}

const handleEnrollmentFetch = (state, {response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));

    data.forEach(({student, course}) => {
        let newStudentData = state[student] || {};
        let newCourseData = newStudentData[course] || {
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

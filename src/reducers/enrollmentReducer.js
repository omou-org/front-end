import * as actions from './../actions/actionTypes';
import initialState from './initialState';

export default function enrollment(
    state = initialState.Enrollments,
    { payload, type }
) {
    switch (type) {
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            return handleEnrollment(state, payload, 'GET');
        case actions.FETCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNoteFetch(state, payload);
        case actions.POST_ENROLLMENT_NOTE_SUCCESSFUL:
        case actions.PATCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleEnrollmentNotesPost(state, payload);
        case actions.DELETE_ENROLLMENT_NOTE_SUCCESSFUL:
            return handleNoteDelete(state, payload);
        case actions.POST_ENROLLMENT_STARTED:
            return state;
        case actions.POST_ENROLLMENT_SUCCESS:
            return handleEnrollment(state, payload, 'POST');
        case actions.DELETE_ENROLLMENT_SUCCESS:
            return handleEnrollment(state, payload, 'DELETE');
        case actions.POST_ENROLLMENT_FAILED:
            return state;
        default:
            return state;
    }
}

const handleEnrollment = (state, payload, requestType) => {
    let data;
    if (payload.response && !payload.courseID) {
        data = payload.response.data;
    } else {
        data = payload;
    }
    const newState = JSON.parse(JSON.stringify(state));
    switch (requestType) {
        case 'GET': {
            data.forEach(
                ({
                    student,
                    course,
                    id,
                    payment_list,
                    enrollment_balance,
                    sessions_left,
                    last_paid_session_datetime,
                }) => {
                    let newStudentData = newState[student] || {};
                    let newCourseData = {
                        enrollment_id: id,
                        course_id: course,
                        student_id: student,
                        enrollment_balance,
                        last_paid_session_datetime,
                        sessions_left,
                        notes: {},
                        payment_list: payment_list,
                        balance: enrollment_balance,
                    };

                    newStudentData[course] = newCourseData;
                    newState[student] = newStudentData;
                }
            );
            break;
        }
        case 'POST': {
            const { student, course, id } = data;
            const newStudentData = newState[student] || {};
            const newCourseData = newStudentData[course] || {
                enrollment_id: id,
                course_id: course,
                student_id: student,
                notes: {},
                session_payment_status: {},
            };
            newStudentData[course] = newCourseData;
            newState[student] = newStudentData;
            break;
        }
        case 'DELETE': {
            delete newState[data.studentID][data.courseID];
            break;
        }
        // no default
    }
    return newState;
};

const handleEnrollmentNotesPost = (state, { response, ...rest }) =>
    handleEnrollmentNoteFetch(state, {
        response: {
            ...response,
            data: [response.data],
        },
        ...rest,
    });

const handleEnrollmentNoteFetch = (
    state,
    { courseID, studentID, response }
) => {
    const { data } = response;
    const newState = JSON.parse(JSON.stringify(state));
    data.forEach((note) => {
        newState[studentID][courseID].notes[note.id] = note;
    });
    return newState;
};

const handleNoteDelete = (
    state,
    { ownerID: { courseID, studentID }, noteID }
) => {
    const newState = JSON.parse(JSON.stringify(state));
    delete newState[studentID][courseID].notes[noteID];
    return newState;
};

import * as types from "./actionTypes";
import {instance, wrapGet, wrapPatch, wrapPost} from "./apiActions";

export const patchInstructor = (id, data) => wrapPatch(
    "/account/instructor/",
    [
        types.PATCH_INSTRUCTOR_STARTED,
        types.PATCH_INSTRUCTOR_SUCCESSFUL,
        types.PATCH_INSTRUCTOR_FAILED,
    ],
    {id:id, data: data}
);

export const fetchStudents = (id) => wrapGet(
    "/account/student/",
    [
        types.FETCH_STUDENT_STARTED,
        types.FETCH_STUDENT_SUCCESSFUL,
        types.FETCH_STUDENT_FAILED,
    ],
    {id:id},
);

export const fetchParents = (id) => wrapGet(
    "/account/parent/",
    [
        types.FETCH_PARENT_STARTED,
        types.FETCH_PARENT_SUCCESSFUL,
        types.FETCH_PARENT_FAILED,
    ],
    {id:id},
);

export const fetchInstructors = (id) => wrapGet(
    "/account/instructor/",
    [
        types.FETCH_INSTRUCTOR_STARTED,
        types.FETCH_INSTRUCTOR_SUCCESSFUL,
        types.FETCH_INSTRUCTOR_FAILED,
    ],
    {id:id},
);

const wrapNoteGet = (endpoint, paramName, [startType, successType, failType], payloadInfo) =>
    (ownerID, ownerType) => async (dispatch, getState) => {
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    ...(payloadInfo || {}),
                    ownerID,
                    ownerType,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.get(endpoint, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
                "params": {
                    [paramName]: ownerID,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch (error) {
            // failed request
            newAction(failType, error.response);
        }
    };

const wrapNotePost = (endpoint, [startType, successType, failType], payloadInfo) =>
    (data, ownerType) => async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    ...(payloadInfo || {}),
                    response,
                    ownerType,
                },
            });
        };

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.post(endpoint, data, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
            newAction(failType, response);
        }
    };


export const wrapNotePatch = (endpoint, [startType, successType, failType], payloadInfo) =>
    (id, data, ownerType, ownerID) => async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    ...(payloadInfo || {}),
                    response,
                    ownerType,
                    ownerID,
                },
            });
        };
        // request starting
        newAction(startType, {});

        try {
            const response = await instance.patch(`${endpoint}${id}/`, data, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch (error) {
            // failed request
            newAction(failType, error.response);
        }
    };

export const fetchAccountNotes = wrapNoteGet(
    "/account/note/",
    "user_id",
    [
        types.FETCH_ACCOUNT_NOTE_STARTED,
        types.FETCH_ACCOUNT_NOTE_SUCCESSFUL,
        types.FETCH_ACCOUNT_NOTE_FAILED,
    ]
);

export const postAccountNote = wrapNotePost(
    "/account/note/",
    [
        types.POST_ACCOUNT_NOTE_STARTED,
        types.POST_ACCOUNT_NOTE_SUCCESSFUL,
        types.POST_ACCOUNT_NOTE_FAILED,
    ]
);

export const patchAccountNote = wrapNotePatch(
    "/account/note/",
    [
        types.PATCH_ACCOUNT_NOTE_STARTED,
        types.PATCH_ACCOUNT_NOTE_SUCCESSFUL,
        types.PATCH_ACCOUNT_NOTE_FAILED,
    ]
);

export const fetchCourseNotes = wrapNoteGet(
    "/course/catalog_note/",
    "course_id",
    [
        types.FETCH_COURSE_NOTE_STARTED,
        types.FETCH_COURSE_NOTE_SUCCESSFUL,
        types.FETCH_COURSE_NOTE_FAILED,
    ]
);

export const postCourseNote = wrapNotePost(
    "/course/catalog_note/",
    [
        types.POST_COURSE_NOTE_STARTED,
        types.POST_COURSE_NOTE_SUCCESSFUL,
        types.POST_COURSE_NOTE_FAILED,
    ]
);

export const patchCourseNote = wrapNotePatch(
    "/course/catalog_note/",
    [
        types.PATCH_COURSE_NOTE_STARTED,
        types.PATCH_COURSE_NOTE_SUCCESSFUL,
        types.PATCH_COURSE_NOTE_FAILED,
    ]
);

export const fetchEnrollmentNotes = (enrollmentID, studentID, courseID) => {
    return wrapNoteGet(
        "/course/enrollment_note/",
        "enrollment_id",
        [
            types.FETCH_ENROLLMENT_NOTE_STARTED,
            types.FETCH_ENROLLMENT_NOTE_SUCCESSFUL,
            types.FETCH_ENROLLMENT_NOTE_FAILED,
        ],
        {
            courseID,
            enrollmentID,
            studentID,
        }
    )(enrollmentID, "enrollment");
};

export const postEnrollmentNote = (data, enrollmentID, studentID, courseID) => {
    return wrapNotePost(
        "/course/enrollment_note/",
        [
            types.POST_ENROLLMENT_NOTE_STARTED,
            types.POST_ENROLLMENT_NOTE_SUCCESSFUL,
            types.POST_ENROLLMENT_NOTE_FAILED,
        ],
        {
            courseID,
            enrollmentID,
            studentID,
        }
    )(data, "enrollment");
};

export const patchEnrollmentNote = (id, data, enrollmentID, studentID, courseID) => {
    return wrapNotePatch(
        "/course/enrollment_note/",
        [
            types.PATCH_ENROLLMENT_NOTE_STARTED,
            types.PATCH_ENROLLMENT_NOTE_SUCCESSFUL,
            types.PATCH_ENROLLMENT_NOTE_FAILED,
        ],
        {
            courseID,
            enrollmentID,
            studentID,
        }
    )(id, data, "enrollment", enrollmentID);
};

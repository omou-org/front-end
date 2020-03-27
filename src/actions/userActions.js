import * as types from "./actionTypes";
import {
    instance, wrapGet, wrapPatch,
} from "./apiActions";
import {wrapUseNote} from "./hooks";
import {useMemo} from "react";

export const patchInstructor = (id, data) => wrapPatch(
    "/account/instructor/",
    [
        types.PATCH_INSTRUCTOR_STARTED,
        types.PATCH_INSTRUCTOR_SUCCESSFUL,
        types.PATCH_INSTRUCTOR_FAILED,
    ],
    {
        data,
        id,
    }
);

export const fetchStudents = (id) => wrapGet(
    "/account/student/",
    [
        types.FETCH_STUDENT_STARTED,
        types.FETCH_STUDENT_SUCCESSFUL,
        types.FETCH_STUDENT_FAILED,
    ],
    {id}
);

export const fetchParents = (id) => wrapGet(
    "/account/parent/",
    [
        types.FETCH_PARENT_STARTED,
        types.FETCH_PARENT_SUCCESSFUL,
        types.FETCH_PARENT_FAILED,
    ],
    {id}
);

export const fetchInstructors = (id) => wrapGet(
    "/account/instructor/",
    [
        types.FETCH_INSTRUCTOR_STARTED,
        types.FETCH_INSTRUCTOR_SUCCESSFUL,
        types.FETCH_INSTRUCTOR_FAILED,
    ],
    {id}
);

const wrapNoteGet =
    (endpoint, paramName, [startType, successType, failType], payloadInfo) =>
        (ownerID, ownerType) => async (dispatch) => {
            const newAction = (type, response) => {
                dispatch({
                    "payload": {
                        ...payloadInfo || {},
                        ownerID,
                        ownerType,
                        response,
                    },
                    type,
                });
            };

            // request starting
            newAction(startType, {});

            try {
                const response = await instance.get(endpoint, {
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

const wrapNotePost =
    (endpoint, [startType, successType, failType], payloadInfo) =>
        (data, ownerType) => async (dispatch) => {
        // creates a new action based on the response given
            const newAction = (type, response) => {
                dispatch({
                    "payload": {
                        ...payloadInfo || {},
                        ownerType,
                        response,
                    },
                    type,
                });
            };

            // request starting
            newAction(startType, {});

            try {
                const response = await instance.post(endpoint, data);
                // succesful request
                newAction(successType, response);
            } catch ({response}) {
            // failed request
                newAction(failType, response);
            }
        };


const wrapNotePatch =
    (endpoint, [startType, successType, failType], payloadInfo) =>
        (id, data, ownerType, ownerID) => async (dispatch) => {
        // creates a new action based on the response given
            const newAction = (type, response) => {
                dispatch({
                    "payload": {
                        ...payloadInfo || {},
                        ownerID,
                        ownerType,
                        response,
                    },
                    type,
                });
            };
            // request starting
            newAction(startType, {});

            try {
                const response = await instance
                    .patch(`${endpoint}${id}/`, data);
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

export const useAccountNotes = (ownerID, ownerType) => wrapUseNote(
    "/account/note/",
    types.FETCH_ACCOUNT_NOTE_SUCCESSFUL,
    {
        ownerID,
        ownerType,
    }
)(null, useMemo(() => ({
    "params": {
        "user_id": ownerID,
    },
}), [ownerID]));

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

export const fetchEnrollmentNotes = (enrollmentID, studentID, courseID) =>
    wrapNoteGet(
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

export const useEnrollmentNotes = (enrollmentID, studentID, courseID) =>
    wrapUseNote(
        "/course/enrollment_note/",
        types.FETCH_ENROLLMENT_NOTE_SUCCESSFUL,
        {
            courseID,
            enrollmentID,
            studentID,
        }
    )(null, useMemo(() => ({
        "params": {
            "enrollment_id": enrollmentID,
        },
    }), [enrollmentID]));

export const postEnrollmentNote =
    (data, enrollmentID, studentID, courseID) => wrapNotePost(
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

export const patchEnrollmentNote =
    (id, data, enrollmentID, studentID, courseID) => wrapNotePatch(
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

export const fetchOutOfOffice = () =>
    wrapGet(
        "/account/instructor-out-of-office/",
        [
            types.FETCH_OOO_STARTED,
            types.FETCH_OOO_SUCCESS,
            types.FETCH_OOO_FAILED,
        ],
        {}
    );

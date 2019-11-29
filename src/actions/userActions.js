import * as types from "./actionTypes";
import {instance, wrapGet, wrapPatch} from "./apiActions";

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

const notesEndpoint = "/account/note/";

export const fetchNotes = (userID, userType) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                userID,
                userType,
                response,
            },
        });
    };

    // request starting
    newAction(types.FETCH_NOTE_STARTED, {});

    try {
        const response = await instance.get(notesEndpoint, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
            "params": {
                "user_id": userID,
            },
        });
        // succesful request
        newAction(types.FETCH_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.FETCH_NOTE_FAILED, response);
    }
};

export const postNote = (data, userType) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                response,
                userType,
            },
        });
    };

    // request starting
    newAction(types.POST_NOTE_STARTED, {});

    try {
        const response = await instance.post(notesEndpoint, data, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
        });
        // succesful request
        newAction(types.POST_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.POST_NOTE_FAILED, response);
    }
};

export const patchNote = (id, data, userType) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                response,
                userType,
                "userID": data.user,
            },
        });
    };

    // request starting
    newAction(types.PATCH_NOTE_STARTED, {});

    try {
        const response = await instance.patch(`${notesEndpoint}${id}/`, data, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
        });
        // succesful request
        newAction(types.PATCH_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.PATCH_NOTE_FAILED, response);
    }
};


const courseNoteEndpoint = "/course/catalog_note/";

export const fetchCourseNotes = (courseID) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                courseID,
                response,
            },
        });
    };

    // request starting
    newAction(types.FETCH_COURSE_NOTE_STARTED, {});

    try {
        const response = await instance.get(courseNoteEndpoint, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
            "params": {
                "course_id": courseID,
            },
        });
        // succesful request
        newAction(types.FETCH_COURSE_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.FETCH_COURSE_NOTE_FAILED, response);
    }
};

export const postCourseNote = (data) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                response,
            },
        });
    };

    // request starting
    newAction(types.POST_NOTE_STARTED, {});

    try {
        const response = await instance.post(courseNoteEndpoint, data, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
        });
        // succesful request
        newAction(types.POST_COURSE_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.POST_COURSE_NOTE_FAILED, response);
    }
};

export const patchCourseNote = (id, data) => async (dispatch, getState) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                response,
                "courseID": data.course,
            },
        });
    };

    // request starting
    newAction(types.PATCH_COURSE_NOTE_STARTED, {});

    try {
        const response = await instance.patch(`${courseNoteEndpoint}${id}/`, data, {
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
        });
        // succesful request
        newAction(types.PATCH_COURSE_NOTE_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.PATCH_COURSE_NOTE_FAILED, response);
    }
};

import * as types from "./actionTypes";
import {wrapGet, wrapPatch} from "./apiActions";

export const patchInstructor = (id, data) => wrapPatch(
    "/account/instructor/",
    [
        types.PATCH_INSTRUCTOR_STARTED,
        types.PATCH_INSTRUCTOR_SUCCESSFUL,
        types.PATCH_INSTRUCTOR_FAILED,
    ],
    id,
    data,
);

export const fetchStudents = (id) => wrapGet(
    "/account/student/",
    [
        types.FETCH_STUDENT_STARTED,
        types.FETCH_STUDENT_SUCCESSFUL,
        types.FETCH_STUDENT_FAILED,
    ],
    id,
);

export const fetchParents = (id) => wrapGet(
    "/account/parent/",
    [
        types.FETCH_PARENT_STARTED,
        types.FETCH_PARENT_SUCCESSFUL,
        types.FETCH_PARENT_FAILED,
    ],
    id,
);

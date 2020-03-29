import * as types from "./actionTypes";
import {useMemo} from "react";
import {wrapUseNote} from "./hooks";

export const useCourseNotes = (ownerID, ownerType) => wrapUseNote(
    "/course/catalog_note/",
    types.FETCH_COURSE_NOTE_SUCCESSFUL,
    {
        ownerID,
        ownerType,
    }
)(null, useMemo(() => ({
    "params": {
        "course_id": ownerID,
    },
}), [ownerID]));

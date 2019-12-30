import * as types from './actionTypes';
import {wrapGet, wrapPatch} from "./apiActions";

export function fetchTeacherAvailabilities(event){

}

export function addEvent(event) {
    return { type: types.ADD_EVENT, payload: event };
}

export function deleteEvent(event) {
    return { type: types.DELETE_EVENT, payload: event }
}

export function filterEvent(event) {
    return { type: types.FILTER_EVENT, payload: event }
}

export const fetchSessions = ({config, id}) => wrapGet(
    "/scheduler/session/",
    [
        types.GET_SESSIONS_STARTED,
        types.GET_SESSIONS_SUCCESS,
        types.GET_SESSIONS_FAILED,
    ],
    {
        config:config,
        id: id,
    }
);

export const patchSession = (id, data) => wrapPatch(
    '/scheduler/session/',
    [
        types.PATCH_SESSION_STARTED,
        types.PATCH_SESSION_SUCCESS,
        types.PATCH_SESSION_FAILED,
    ],
    {
        id:id,
        data:data,
    }
);
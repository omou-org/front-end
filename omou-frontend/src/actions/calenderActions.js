import * as types from './actionTypes';

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
import * as types from './actionTypes';

export function fetchSearchQuery(event) {
    return { type: types.ADD_EVENT, payload: event };
}

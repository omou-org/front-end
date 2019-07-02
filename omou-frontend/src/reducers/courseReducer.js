import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function course(state = initialState.Course, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_COURSES:
            console.log('FETCH_COURSES Action');
            return payload;
        default:
            return state;
    }
}
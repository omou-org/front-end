import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function users(state = initialState.Users, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_COURSES_SUCCESSFUL:
            console.log('FETCH_COURSES Action');
            return payload;
        default:
            return state;
    }
}

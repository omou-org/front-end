import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function course(state = initialState.Enrollments, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_COURSE_SUCCESSFUL:
            return state;
        default:
            return state;
    }
}

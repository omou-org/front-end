import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function registration(state = initialState.RegistrationForms, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_COURSES:
            console.log('FETCH_COURSES Action');
            return payload;
        case actions.FETCH_STUDENTS:
            newState = payload;
            console.log('RECEIVE_STUDENTS Action');
            return newState;
        case actions.GET_REGISTRATION_FORM:
            newState = payload;
            console.log('RECEIVE_REGISTRATION Action');
        default:
            // console.log('reducer state: ', state);
            return state;
    }
}
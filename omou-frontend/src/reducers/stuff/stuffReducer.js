import initialState from '../initialState';
import * as actions from "../../actions/actionTypes"

export default function stuff(state = initialState.stuff, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_STUFF:
            console.log('FETCH_STUFF Action');
            return payload;
        case actions.RECEIVE_STUFF:
            newState = payload;
            console.log('RECEIVE_STUFF Action');
            return newState;
        case actions.ALERT:
            newState = payload;
            console.log('RECEIVE_STUFF Action');
            break;
        default:
            // console.log('reducer state: ', state);
            return state;
    }
}
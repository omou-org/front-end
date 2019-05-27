
import * as types from './actionTypes';

export function receiveStuff(json) {
    return {type: types.RECEIVE_STUFF, stuff: json.stuff};
}

export function fetchStuff() {
    return {type: types.ALERT, stuff:'lol'}
}

export function alertFunction(){
    return {type: types.ALERT, payload: 'alert stuff'}
}
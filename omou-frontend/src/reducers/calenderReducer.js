import initialState from './initialState';
import * as actions from "../actions/actionTypes"

export default function calender(state = initialState.CalenderData, { payload, type }) {
    let newState = state;
    let obj = newState.events_in_view;
    switch (type) {
        case actions.ADD_EVENT:
            newState.events_in_view.push(payload);
            console.log('CalenderData Action', payload, newState);
            return state;

        case actions.DELETE_EVENT:
            for (let i = 0; i < newState.events_in_view.length; i++) {
                let obj = newState.events_in_view[i];
                if (payload.indexOf(obj.id) !== -1) {
                    newState.events_in_view.splice(i, 1);
                }
            }
            return state;

        case actions.DELETE_ALL_EVENTS:
            for (let i = 0; i < newState.events_in_view.length; i++) {
                let obj = newState.events_in_view[i];
                console.log(obj)
            }
            return state;

        case actions.FILTER_EVENT:
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].course === payload) {
                    const e = obj.filter(event => event.course === payload)
                    newState.events_in_view.splice(0, obj.length, ...e)
                } else if (obj[i].instructor === payload) {
                    const e = obj.filter(event => event.instructor === payload)
                    newState.events_in_view.splice(0, obj.length, ...e)
                }
            }
            return state;

        default:
            return newState;
    }
}
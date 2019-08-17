import initialState from './initialState';
import * as actions from "../actions/actionTypes"

export default function calender(state = initialState.CalenderData, { payload, type, }) {
    let newState = state;

    switch (type) {
        case actions.ADD_EVENT:
            newState.events_in_view.push(payload);
            return newState;

        case actions.DELETE_EVENT:
            const removeIndex = newState.events_in_view.map((item) => { return item.id; }).indexOf(payload.id);
            newState.events_in_view.splice(removeIndex, 1)
            return newState;


        case actions.DELETE_ALL_EVENTS:
            return state;


        case actions.FILTER_EVENT:


            const filter_key = payload.key
            const filter_value = payload.value


            // Search by subject
            newState.events_in_view.filter((allCourse) => {
                return allCourse[filter_key] === filter_value
            })
                .map((finalResult) => {
                    console.log(finalResult)
                    return {
                        ...finalResult
                    }
                })


            return newState;

        default:
            return newState;
    }
}
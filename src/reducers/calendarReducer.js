import initialState from './initialState';
import * as actions from "../actions/actionTypes"
import {REQUEST_ALL} from "../actions/apiActions";
import {setHours} from 'date-fns';

export default function Calendar(state = initialState.CalendarData, { payload, type, }) {
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
                    return {
                        ...finalResult
                    }
                });


            return newState;
        case actions.GET_SESSIONS_SUCCESS:
            // console.log("Succeeded", payload)
            return getSessions(state, payload);
        case actions.GET_SESSIONS_FAILED:
            // console.log("failed to get sessions", payload);
            return newState;
        default:
            return newState;
    }
}

const getSessions = (state, {response}) => {
    let {data} = response;
    if (!Array.isArray(data)) {
        data = [data];
    }
    const notUpdated = state.CourseSessions.filter((session) =>
        !data.find((sesh) => session.id === sesh.id));
    return {
        ...state,
        "CourseSessions": [
            ...notUpdated,
            ...data,
        ],
    };
};

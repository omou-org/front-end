import initialState from './initialState';
import * as actions from "../actions/actionTypes"
import {REQUEST_ALL} from "../actions/apiActions";

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

const getSessions = (state,{id,response}) => {
    const {data} = response;
    if(id !== REQUEST_ALL){
        let updatedState = {...state};
        if(updatedState["CourseSessions"]){
            updatedState["CourseSessions"].push(data);
        } else {
            updatedState["CourseSessions"] = [data];
        }
        return updatedState;
    } else {
        return {
            ...state,
            CourseSessions: data,
        }
    }
}
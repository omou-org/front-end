import * as actions from "actions/actionTypes";
import initialState from "./initialState";

const {Authentication} = initialState;

export default (state = Authentication, {payload, type}) => {
    switch (type) {
        case actions.SET_CREDENTIALS:
            return {
                ...state,
                ...payload,
            };
        case actions.LOGOUT:
            return Authentication;
        case actions.SET_GOOGLE_TOKEN:
            return {
                ...state,
                ...payload,
            }
        case actions.SET_GOOGLE_COURSES:
            return {
                ...state,
                ...payload,
            }
        case actions.GET_GOOGLE_CLASSCODE:
            return {
                ...state,
                ...payload,
            }
        default:
            return state;
    }
};

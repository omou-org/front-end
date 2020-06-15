import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState.Authentication, {payload, type}) => {
    switch (type) {
        case actions.SET_CREDENTIALS:
            return {
                ...state,
                ...payload,
            };
        case actions.LOGOUT:
            return {
                "isAdmin": false,
                "token": null,
            };
        default:
            return state;
    }
};

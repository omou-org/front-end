import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default function auth(state = initialState.Authentication, {payload, type}) {
    switch (type) {
        case actions.LOGIN_SUCCESSFUL:
            return onSuccess(state, payload.response);
        case actions.LOGOUT:
            return onLogout(state);
        default:
            return state;
    }
}

const onSuccess = (state, {data, saveLogin}) => {
    if (saveLogin) {
        localStorage.setItem("authToken", data.token);
    }
    sessionStorage.setItem("authToken", data.token);
    return {
        ...state,
        "token": data.token,
    };
};

const onLogout = (state) => {
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authToken");
    return {
        ...state,
        "token": null,
    };
};

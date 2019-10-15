import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default function auth(state = initialState.Authentication, {payload, type}) {
    switch (type) {
        case actions.LOGIN_SUCCESSFUL:
            return onSuccess(state, payload);
        case actions.LOGOUT:
            return onLogout(state);
        default:
            return state;
    }
}

const onSuccess = (state, {response, savePassword}) => {
    if (savePassword) {
        localStorage.setItem("authToken", response.data.token);
    }
    sessionStorage.setItem("authToken", response.data.token);
    return {
        ...state,
        "token": response.data.token,
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

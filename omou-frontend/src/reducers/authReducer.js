import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default function registration(state = initialState.auth, {payload, type}) {
    switch (type) {
        case actions.SUCCESSFUL_LOGIN:
            return onSuccess(state, payload);
        case actions.FAILED_LOGIN:
            return onFail(state);
        case actions.LOGOUT:
            return onLogout(state);
        case actions.RESET_ATTEMPT:
            return resetStatus(state);
        default:
            return state;
    }
}

const onSuccess = (state, {data, saveLogin}) => {
    if (saveLogin) {
        localStorage.setItem("authToken", data.token);
    }
    return {
        ...state,
        "token": data.token,
        "failedLogin": false,
    };
};

const onFail = (state) => ({
    ...state,
    "failedLogin": true,
});

const onLogout = (state) => {
    localStorage.removeItem("authToken");
    return {
        ...state,
        "token": null,
    };
};

const resetStatus = (state) => ({
    ...state,
    "failedLogin": false,
});

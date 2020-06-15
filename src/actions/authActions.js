import * as types from "./actionTypes";
import {instance} from "./apiActions";

export const setCredentials = (credentials, shouldSave) => {
    if (shouldSave) {
        const prevAuth = JSON.parse(localStorage.getItem("auth")) || {};
        localStorage.setItem("auth", JSON.stringify({
            ...prevAuth,
            ...credentials,
        }));
    }
    return {
        "payload": credentials,
        "type": types.SET_CREDENTIALS,
    };
};

export const logout = () => {
    localStorage.removeItem("auth");
    return {
        "type": types.LOGOUT,
    };
};

export const fetchUserStatus = (token) => async (dispatch) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            "payload": {
                response,
                token,
            },
            type,
        });
    };

    // request starting
    newAction(types.FETCH_USER_STARTED, {});

    try {
        const response = await instance.get("/account/user/", {
            "headers": {
                "Authorization": `Token ${token}`,
            },
        });
        // succesful request
        newAction(types.FETCH_USER_SUCCESSFUL, response);
    } catch ({response}) {
        // failed request
        newAction(types.FETCH_USER_FAILED, response);
    }
};

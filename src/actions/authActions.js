import * as types from "./actionTypes";
import {instance} from "./apiActions";

export const login = (email, password, savePassword) => async (dispatch) => {
    // request starting
    dispatch({"type": types.LOGIN_STARTED});

    try {
        const response = await instance
            .post("/auth_token/", {
                "username": email,
                password,
            });
        // succesful request
        dispatch({
            "type": types.LOGIN_SUCCESSFUL,
            "payload": {
                response,
                savePassword,
            },
        });
    } catch (error) {
        // failed request
        dispatch({
            "type": types.LOGIN_FAILED,
            "payload": error,
        });
    }
};

export const logout = () => ({"type": types.LOGOUT});

export const fetchUserStatus = (token) => async (dispatch) => {
    // creates a new action based on the response given
    const newAction = (type, response) => {
        dispatch({
            type,
            "payload": {
                response,
                token,
            },
        });
    };

    // request starting
    newAction(types.FETCH_USER_STARTED, {});

    try {
        const response = await instance.get("/account/user", {
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

export const resetAttemptStatus = () => ({"type": types.RESET_ATTEMPT});

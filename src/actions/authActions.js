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

export const resetAttemptStatus = () => ({"type": types.RESET_ATTEMPT});

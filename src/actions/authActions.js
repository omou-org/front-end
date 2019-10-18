import * as types from "./actionTypes";
import axios from "axios";

export const login = (email, password, savePassword) => async (dispatch) => {
    // request starting
    dispatch({"type": types.LOGIN_STARTED});

    try {
        const response = await axios
            .post("/auth_token/", {
                "username": email,
                password,
            }, {
                "baseURL": "http://localhost:8000",
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

import * as types from "./actionTypes";
import axios from "axios";

export const login = (email, password, saveLogin) =>
    (dispatch) => axios.post("http://localhost:8000/auth_token/", {
        username: email,
        password,
    })
        .then(({data}) => {
            dispatch({
                type: types.SUCCESSFUL_LOGIN,
                payload: {
                    saveLogin,
                    data,
                },
            });
        })
        .catch((error) => {
            dispatch({type: types.FAILED_LOGIN, payload: error});
        });

export const logout = () => ({type: types.LOGOUT});

export const resetAttemptStatus = () => ({type: types.RESET_ATTEMPT});

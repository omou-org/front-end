
import * as types from './actionTypes';
import axios from 'axios';

export const instance = axios.create({
    "baseURL": "http://api.giphy.com/v1/gifs/",
});

export function receiveCats(meow) {
    return { type: types.GET_GIF_SUCCESS, gifs: meow };
}
// Alter defaults after instance has been created
delete instance.defaults.headers.common.Authorization;

export function fetchCats(meow) {
    return async (dispatch) => {
        try {
            const response = await instance.get("random", {
                params: {
                    "tag": meow,
                    "api_key": "X7MCaaM0oOaoShVzhtqcEN8JiKF39oRu",
                    "rating": "g"
                },
            })
            dispatch({ type: types.GET_GIF_SUCCESS, payload: { response, meow } });
        } catch (error) {
            dispatch({ type: types.GET_GIF_FAIL, payload: error });
        }
    };
}





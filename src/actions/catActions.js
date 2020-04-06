import * as types from "./actionTypes";
import axios from "axios";

export const giphy_instance = axios.create({
	baseURL: "http://api.giphy.com/v1/gifs/",
});

export function fetchCats(meow) {
	return async (dispatch) => {
		try {
			const response = await giphy_instance.get("random", {
				params: {
					tag: meow,
					api_key: "X7MCaaM0oOaoShVzhtqcEN8JiKF39oRu",
					rating: "g",
				},
			});
			dispatch({type: types.GET_GIF_SUCCESS, payload: {response, meow}});
		} catch (error) {
			dispatch({type: types.GET_GIF_FAIL, payload: error});
		}
	};
}

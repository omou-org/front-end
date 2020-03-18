import initalState from './initialState';
import { GET_GIF_SUCCESS, GET_GIF_FAIL, GET_GIF_LOADING } from '../actions/actionTypes';

export default function catReducer(state = initalState.Cats, { type, payload }) {
    let newState = { ...state };
    switch (type) {
        case GET_GIF_SUCCESS:
            console.log(payload);
            newState["firstCat"] = payload.response.data.data.images.fixed_height.url;
            newState["secondCat"] = payload.response.data.data.images.fixed_height.url;
            return newState;
        case GET_GIF_FAIL:
            console.log(payload);
            return newState;
        case GET_GIF_LOADING:
            console.log("loading");
            return newState;
        default:
            return state;
    }
}


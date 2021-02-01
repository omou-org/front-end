import initalState from './initialState';
import {
    GET_GIF_FAIL,
    GET_GIF_LOADING,
    GET_GIF_SUCCESS,
} from '../actions/actionTypes';

export default function catReducer(
    state = initalState.Cats,
    { type, payload }
) {
    let newState = { ...state };
    switch (type) {
        case GET_GIF_SUCCESS:
            newState['catGif'] = payload.response.data.data.images.fixed_height;
            return newState;
        case GET_GIF_FAIL:
            return newState;
        case GET_GIF_LOADING:
            return newState;
        default:
            return state;
    }
}

import * as actions from 'actions/actionTypes';
import initialState from './initialState';

const { Authentication } = initialState;

export default (state = Authentication, { payload, type }) => {
    switch (type) {
        case actions.SET_CREDENTIALS:
            return {
                ...state,
                ...payload,
            };
        case actions.LOGOUT:
            return Authentication;
        case actions.SET_GOOGLE_COURSES:
            return {
                ...state,
                ...payload,
            };
        case actions.STORE_COURSES:
            return {
                ...state,
                ...payload,
            };
        case actions.STORE_TOKEN:
            return {
                ...state,
                ...payload,
            };
        default:
            return state;
    }
};

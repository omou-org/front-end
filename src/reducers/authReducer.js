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
        default:
            return state;
    }
};

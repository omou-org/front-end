import {combineReducers} from 'redux';
import stuff from './stuff/stuffReducer';

const rootReducer = combineReducers({
    stuff
});

export default rootReducer;
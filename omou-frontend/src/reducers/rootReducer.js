import {combineReducers} from 'redux';
import stuff from './stuff/stuffReducer';
import Registration from './registrationReducer'

const rootReducer = combineReducers({
    stuff,
    Registration
});

export default rootReducer;
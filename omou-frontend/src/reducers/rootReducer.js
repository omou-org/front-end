import {combineReducers} from 'redux';
import stuff from './stuff/stuffReducer';
import Registration from './registrationReducer';
import Users from './usersReducer';
import Course from './courseReducer';

const rootReducer = combineReducers({
    stuff,
    Registration,
    Users,
    Course,
});

export default rootReducer;
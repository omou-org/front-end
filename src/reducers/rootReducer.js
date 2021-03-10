import Admin from './adminReducer';
import auth from './authReducer';
import Calendar from './calendarReducer';
import { combineReducers } from 'redux';
import Course from './courseReducer';
import Payments from './paymentsReducer';
import Registration from './registrationReducer';
import Search from './searchResultsReducer';
import Users from './usersReducer';

const rootReducer = combineReducers({
    Admin,
    Calendar,
    Course,
    Payments,
    Registration,
    Search,
    Users,
    auth,
});

export default rootReducer;

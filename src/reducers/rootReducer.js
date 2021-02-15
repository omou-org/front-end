import { combineReducers } from 'redux';
import RequestStatus from './apiReducer';
import Registration from './registrationReducer';
import auth from './authReducer';
import Course from './courseReducer';
import Users from './usersReducer';
import Calendar from './calendarReducer';
import Enrollments from './enrollmentReducer';
import Payments from './paymentsReducer';
import Search from './searchResultsReducer';
import Admin from './adminReducer';
import Cat from './catReducer';

const rootReducer = combineReducers({
    auth,
    Calendar,
    Course,
    Enrollments,
    Payments,
    Registration,
    Users,
    RequestStatus,
    Search,
    Admin,
    Cat,
});

export default rootReducer;

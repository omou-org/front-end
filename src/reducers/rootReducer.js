import {combineReducers} from "redux";
import RequestStatus from "./apiReducer";
import Registration from "./registrationReducer";
import auth from "./authReducer";
import Course from "./courseReducer";
import Users from "./usersReducer";
import Calendar from "./calenderReducer";
import Enrollments from "./enrollmentReducer";
import Payments from "./paymentsReducer";
import Search from "./searchResultsReducer";

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
});

export default rootReducer;

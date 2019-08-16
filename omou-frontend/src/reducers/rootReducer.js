import {combineReducers} from "redux";
import Registration from "./registrationReducer";
import auth from "./authReducer";
import Course from "./courseReducer";
import Users from "./usersReducer";
import Calender from "./calenderReducer";
import Enrollment from "./enrollmentReducer";
import Payments from "./paymentsReducer";

const rootReducer = combineReducers({
    Registration,
    auth,
    Course,
    Users,
    Calender,
    Enrollment,
    Payments,
});

export default rootReducer;

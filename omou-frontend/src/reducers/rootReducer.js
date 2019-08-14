import {combineReducers} from "redux";
import Registration from "./registrationReducer";
import auth from "./authReducer";
import Course from "./courseReducer";
import Users from "./usersReducer";
import Calender from "./calenderReducer"

const rootReducer = combineReducers({
    Registration,
    auth,
    Course,
    Users,
    Calender,
});

export default rootReducer;

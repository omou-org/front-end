import {combineReducers} from "redux";
import Registration from "./registrationReducer";
import auth from "./authReducer";
import Course from "./courseReducer";
import Users from "./usersReducer";

const rootReducer = combineReducers({
    Registration,
    auth,
    Course,
    Users
});

export default rootReducer;

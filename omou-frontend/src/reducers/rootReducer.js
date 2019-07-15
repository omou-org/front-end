import {combineReducers} from "redux";
import Registration from "./registrationReducer";
import auth from "./authReducer";

const rootReducer = combineReducers({
    Registration,
    auth,
});

export default rootReducer;

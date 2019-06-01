import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function registration(state = initialState.RegistrationForms, {payload, type}) {
    let newState;
    switch (type) {
        case actions.FETCH_COURSES:
            console.log('FETCH_COURSES Action');
            return payload;
        case actions.FETCH_STUDENTS:
            newState = payload;
            console.log('RECEIVE_STUDENTS Action');
            return newState;
        case actions.GET_REGISTRATION_FORM:
            newState = payload;
            console.log('RECEIVE_REGISTRATION Action');
            break;
        case actions.ADD_STUDENT_FIELD:
            newState = addAStudentField(state);
            return newState;
        default:
            // console.log('reducer state: ', state);
            return state;
    }
}

function addAStudentField(prevState){
    let SmallGroupList = prevState.registration_form.tutoring["Student(s)"]["Small Group"];
    let NewStudentField = {
        ... SmallGroupList[0],
        field: "Student " + (SmallGroupList.length+1).toString() + " Name",
        required: false,
    };
    SmallGroupList.push(NewStudentField);
    prevState.registration_form.tutoring["Student(s)"]["Small Group"] = SmallGroupList;
    return prevState;
}
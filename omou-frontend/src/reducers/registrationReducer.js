import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function registration(state = initialState.RegistrationForms, { payload, type }) {
    let newState = state;
    switch (type) {
        case actions.FETCH_COURSES_SUCCESSFUL:
            console.log('FETCH_COURSES_SUCCESSFUL Action', payload, newState);
            return newState;
        case actions.FETCH_COURSES_FAILED:
            console.log('FETCH_COURSES_FAILED Action');
            return newState;
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
        case actions.ADD_COURSE_FIELD:
            newState = addACourseField(state);
            return newState;
        case actions.ADD_FIELD:
            newState = addField(state, payload);
            return newState;
        case actions.SUBMIT_FORM:
            submitForm(payload);
            return state;
        case actions.REMOVE_FIELD:
            let path = payload[0];
            let removeFieldIndex = payload[1];
            let conditional = payload[2];
            if(conditional){
                path.push(conditional);
            }
            newState = removeField(state, path, removeFieldIndex, conditional);
            return newState;
        default:
            return state;
    }
}

function addAStudentField(prevState) {
    let SmallGroupList = prevState.registration_form.tutoring["Student(s)"]["Small Group"];
    let NewStudentField = {
        ...SmallGroupList[0],
        field: "Student " + (SmallGroupList.length + 1).toString() + " Name",
        required: false,
    };
    SmallGroupList.push(NewStudentField);
    prevState.registration_form.tutoring["Student(s)"]["Small Group"] = SmallGroupList;
    return prevState;
}

function addACourseField(prevState) {
    let NewState = prevState;
    let CourseFieldList = prevState.registration_form.course["Course Selection"];
    let NewCourseField = {
        ...CourseFieldList[0],
        field: "Course " + (CourseFieldList.length + 1).toString() + " Name",
        required: false,
    }
    CourseFieldList.push(NewCourseField);
    NewState.registration_form.course["Course Selection"] = CourseFieldList;
    return NewState;
}

function addField(prevState, path) {
    let NewState = prevState;
    let fieldIndex = path.pop();
    let SectionFieldList = getSectionFieldList(path, prevState.registration_form);
    let fieldName = SectionFieldList[0].field;
    let NewField = {
        ...SectionFieldList[fieldIndex],
        field: `${fieldName} ${(SectionFieldList.length+1)}`,
        required: false,
    };
    SectionFieldList.push(NewField);
    setSectionFieldList(path, SectionFieldList, prevState.registration_form);
    // console.log(SectionFieldList);
    return NewState;
}

function removeField(prevState, path, fieldIndex, conditional) {
    let NewState = prevState;
    let SectionFieldList;

    if(conditional){
        SectionFieldList = getSectionFieldList(JSON.parse(JSON.stringify(path)), prevState.registration_form)
    } else {
        SectionFieldList = getSectionFieldList(JSON.parse(JSON.stringify(path)), prevState.registration_form);
    }

    if(SectionFieldList.length>0){
        SectionFieldList.splice(fieldIndex, 1);
    } else if(SectionFieldList.length === 2){
        SectionFieldList.pop();
    }
    let baseFieldName, curFieldName;

    SectionFieldList = SectionFieldList.map((field,i)=>{
        if(i === 0 && field.field_limit > 1){
            baseFieldName = field.field;
            curFieldName = baseFieldName;
        } else if(field.field.indexOf(baseFieldName) > -1 && field.field_limit > 1){
            curFieldName = baseFieldName + " " +i;
        }else {
            curFieldName = field.field;
        }

       return {...field, field:curFieldName};
    });

    if(conditional){
        NewState["registration_form"][path[0]][path[1]][conditional] = SectionFieldList;
    } else {
        NewState["registration_form"][path[0]][path[1]] = SectionFieldList;
    }
    return NewState;
}

function getSectionFieldList(path, formList) {
    if (Array.isArray(path)) {
        if (path.length === 0) {
            return formList;
        }
        return getSectionFieldList(path, formList[path.shift()])
    }
    Error("Path variable not an array");
}

function setSectionFieldList(path, formList, form) {
    if (Array.isArray(path)) {
        if (path.length === 0) {
            form = formList;
            return;
        }
        let firstPathStep = path.shift();
        return setSectionFieldList(path, formList, form[firstPathStep])
    }
    Error("Path variable not an array");
}

function submitForm(state) {
    // submit information to database
    console.log("Received state: ", state);
}

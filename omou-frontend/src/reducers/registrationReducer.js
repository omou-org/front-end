import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function registration(state = initialState.RegistrationForms, { payload, type }) {
    let newState = state;
    switch (type) {
        case actions.ADD_STUDENT_FIELD:
            newState = addAStudentField(state);
            return newState;
        case actions.ADD_COURSE_FIELD:
            newState = addACourseField(state);
            return newState;
        case actions.ADD_FIELD:
            newState = addField(state, payload);
            return newState;
        case actions.REMOVE_FIELD:
            let path = payload[0];
            let removeFieldIndex = payload[1];
            let conditional = payload[2];
            if(conditional){
                path.push(conditional);
            }
            newState = removeField(state, path, removeFieldIndex, conditional);
            return newState;
        case actions.POST_STUDENT_SUCCESSFUL:
            console.log("POSTED STUDENT", payload);
            return successSubmit(state);
        case actions.POST_STUDENT_FAILED:
            console.error("FAILED TO POST STUDENT", payload);
            return failedSubmit(state);
        case actions.POST_PARENT_SUCCESSFUL:
            console.log("POSTED PARENT", payload);
            return successSubmit(state);
        case actions.POST_PARENT_FAILED:
            console.error("FAILED TO POST PARENT", payload);
            return failedSubmit(state);
        case actions.POST_INSTRUCTOR_SUCCESSFUL:
            console.log("POSTED INSTRUCTOR", payload);
            return successSubmit(state);
        case actions.POST_INSTRUCTOR_FAILED:
            console.error("FAILED TO POST INSTRUCTOR", payload);
            return failedSubmit(state);
        case actions.SUBMIT_INITIATED:
            console.log("STARTED SUBMIT");
            return onSubmit(state);
        case actions.RESET_SUBMIT_STATUS:
            return onSubmit(state);
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
    let fieldName = SectionFieldList[fieldIndex].field;
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

const onSubmit = (state) => ({
    ...state,
    "submitStatus": null,
});

const successSubmit = (state) => ({
    ...state,
    "submitStatus": "success",
});

const failedSubmit = (state) => ({
    ...state,
    "submitStatus": "fail",
});

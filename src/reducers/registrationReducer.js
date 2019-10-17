import initialState from './initialState';
import * as actions from "./../actions/actionTypes"

export default function registration(state = initialState.RegistrationForms, {payload, type}) {
    let newState = JSON.parse(JSON.stringify(state));
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
            if (conditional) {
                path.push(conditional);
            }
            newState = removeField(state, path, removeFieldIndex, conditional);
            return newState;
        case actions.POST_STUDENT_SUCCESSFUL:
            return successSubmit(state);
        case actions.POST_STUDENT_FAILED:
            return failedSubmit(state);
        case actions.POST_PARENT_SUCCESSFUL:
            return successSubmit(state);
        case actions.POST_PARENT_FAILED:
            return failedSubmit(state);
        case actions.POST_INSTRUCTOR_SUCCESSFUL:
            return successSubmit(state);
        case actions.POST_INSTRUCTOR_FAILED:
            return failedSubmit(state);
        case actions.SUBMIT_INITIATED:
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

const addField = (prevState, path) => {
    let NewState = prevState;
    let fieldIndex = path.pop();
    let SectionFieldList = getSectionFieldList(path, prevState.registration_form);
    let fieldName = SectionFieldList[fieldIndex].field;
    const numFieldType = SectionFieldList.reduce((total, {field}) => total + (field === fieldName), 1);
    let NewField = {
        ...SectionFieldList[fieldIndex],
        name: `${fieldName} ${numFieldType}`,
        required: false,
    };
    SectionFieldList.push(NewField);
    setSectionFieldList(path, SectionFieldList, prevState.registration_form);
    return NewState;
};

function removeField(prevState, path, fieldIndex, conditional) {
    let NewState = prevState;
    let SectionFieldList =
        getSectionFieldList(JSON.parse(JSON.stringify(path)), prevState.registration_form);

    if (SectionFieldList.length <= 1) {
        return prevState;
    }

    SectionFieldList = SectionFieldList.slice(0, fieldIndex).concat(SectionFieldList.slice(fieldIndex + 1));

    let fieldCounts = {};

    SectionFieldList = SectionFieldList.map((field, i) => {
        if (!fieldCounts.hasOwnProperty(field.field)) {
            fieldCounts[field.field] = 1;
            return {
                ...field,
                "name": field.field,
            };
        }

        fieldCounts[field.field]++;
        return {
            ...field,
            "name": `${field.field} ${fieldCounts[field.field]}`,
        };
    });

    if (conditional) {
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

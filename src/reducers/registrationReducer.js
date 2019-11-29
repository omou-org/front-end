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
        case actions.PATCH_COURSE_SUCCESSFUL:
            return successSubmit(state);
        case actions.PATCH_COURSE_FAILED:
            return failedSubmit(state);
        case actions.POST_COURSE_SUCCESSFUL:
            return successSubmit(state);
        case actions.POST_COURSE_FAILED:
            return failedSubmit(state);
        case actions.SUBMIT_INITIATED:
            return onSubmit(state);
        case actions.RESET_SUBMIT_STATUS:
            return onSubmit(state);
        case actions.SET_PARENT:
            newState["CurrentParent"] = payload;
            return newState;
        case actions.ADD_CLASS_REGISTRATION:
            return addClassRegistration(newState, payload);
        case actions.ADD_TUTORING_REGISTRATION:
            return addTutoringRegistration(newState, payload);
        case actions.ADD_SMALL_GROUP_REGISTRATION:
            console.log("add small group registration reducer")
            return addSmallGroupRegistration(newState, payload);
        case actions.INIT_COURSE_REGISTRATION:
            return initializeRegistration(newState);
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

const addClassRegistration = (prevState, form) => {
    let studentID = form["Student"].Student.value;
    let studentName = form["Student"].Student.label;
    let courseID = form["Course Selection"].Course.value;
    let courseName = form["Course Selection"].Course.label;
    let isStudentCurrentlyRegistered = Object.keys(prevState.registered_courses).includes(studentID);
    let studentInfoNote = stringifyStudentInformation(form);

    let enrollmentObject = {
        type: "class",
        student_id: studentID,
        course_id: courseID,
        enrollment_note: studentInfoNote,
        display:{
            student_name: studentName,
            course_name: courseName,
        }
    };

    let enrollmentExists = false;
    prevState.registered_courses[studentID] && prevState.registered_courses[studentID].forEach((enrollment)=>{
        if(enrollment.student_id === enrollmentObject.student_id && enrollment.course_id === enrollmentObject.course_id){
            enrollmentExists = true;
        }
    });

    // Registration Model:
    // Registration: {
    //     CurrentParent: "Eileen Hong",
    //     registered_courses: {
    //         [joey_id] : [
    //             joey's registration forms
    //         ],
    //         [catherine_id] : [
    //             catherine's registration forms
    //         ]
    //     }
    // }
    if(!enrollmentExists){
        if(isStudentCurrentlyRegistered){
            prevState.registered_courses[studentID].push(enrollmentObject);
        } else {
            prevState.registered_courses[studentID] = [enrollmentObject];
        }
    }
    sessionStorage.setItem("registered_courses",JSON.stringify(prevState.registered_courses));
    prevState.submitStatus = "success";
    // console.log(prevState);
    return prevState;
};

const addTutoringRegistration = (prevState, form) => {
    let studentID = form["Student"].Student.value;
    let studentName = form["Student"].Student.label;
    let subject = form["Tutor Selection"]["Course / Subject"];
    let instructorID = form["Tutor Selection"].Instructor.value;
    let instructorName = form["Tutor Selection"].Instructor.label;
    let courseName = instructorName.substring(0,instructorName.indexOf(" ")) + " x " +
                        studentName.substring(0,studentName.indexOf(" ")) + " - " + subject;
    let studentInfoNote = stringifyStudentInformation(form);
    let startDate = form["Schedule"]["Start Date"];
    let dayOfWeek = new Date(startDate).getDay();
    let startTime = new Date(form["Schedule"]["Session Start Time"]);
    let duration = () => {
        switch(form["Schedule"]["Duration"]){
            case "0.5 Hours": {
                return 0.5;
            }
            case "1 Hour": {
                return 1;
            }
            case "1.5 Hours": {
                return 1.5;
            }
            case "2 Hours": {
                return 2;
            }
        }
    };
    let numSessions = form["Schedule"]["Number of Sessions"];
    let endTime = startTime;
    endTime.setHours(endTime.getHours()+duration());
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate()+(7*numSessions));
    let isStudentCurrentlyRegistered = Object.keys(prevState.registered_courses).includes(studentID);
    let enrollmentObject = {
        type: "tutoring",
        new_course: {
            subject: subject,
            title: courseName, // create class with instructor and name as INSTRUCTOR-LASTNAME x STUDENT-FIRSTNAME - SUBJECT
            type: "T",
            instructor: instructorID,
            //tuition: //default subject + grade price on backend?
            schedule:{
                start_date: startDate,
                start_time: dateToTimeString(startTime),
                end_date: endDate.toUTCString(),
                end_time: dateToTimeString(endTime), //generated from course duration
            },
            day_of_week: dayOfWeek,
            max_capacity: 1,
            enrollment_id_list: [studentID], //array with student_id
        },
        student_id: studentID,
        course_id: "T" + (isStudentCurrentlyRegistered ? (prevState.registered_courses.length + 1).toString() : "0"),
        enrollment_note: studentInfoNote,
        display:{
            student_name: studentName,
            course_name: courseName,
        }
    };

    let enrollmentExists = false;
    prevState.registered_courses[studentID] && prevState.registered_courses[studentID].forEach((enrollment)=>{
        if(enrollment.student_id === enrollmentObject.student_id &&
            enrollment.new_course.subject === enrollmentObject.new_course.subject){
            enrollmentExists = true;
        }
    });

    if(!enrollmentExists){
        if(isStudentCurrentlyRegistered){
            prevState.registered_courses[studentID].push(enrollmentObject);
        } else {
            prevState.registered_courses[studentID] = [enrollmentObject];
        }
    }
    sessionStorage.setItem("registered_courses",JSON.stringify(prevState.registered_courses));
    prevState.submitStatus = "success";
    console.log(prevState);
    return prevState;
}

const addSmallGroupRegistration = (prevState, form) => {
    console.log(form,"small group registration");
    let studentID = form["Student"].Student.value;
    let studentName = form["Student"].Student.label;
    return {};
}

const stringifyStudentInformation = (form)=>{
    let studentInfoList = Object.entries(form["Student Information"]);
    let studentInfoNote = "";
    studentInfoList.forEach((infoPair) => {
        studentInfoNote += infoPair[0] + ": " + infoPair[1] + "\n";
    });
    return studentInfoNote;
}

const dateToTimeString = (date) => {
    return date.getHours().toString()+":"+ (date.getMinutes() !== 0 ? date.getMinutes().toString(): "00")
}

const initializeRegistration = (prevState)=>{
    let prevRegisteredCourses = JSON.parse(sessionStorage.getItem("registered_courses"));
    if(prevRegisteredCourses){
        prevState.registered_courses = prevRegisteredCourses;
    }
    return prevState;
};
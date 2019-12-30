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
            return successSubmit(state, payload);
        case actions.PATCH_COURSE_FAILED:
            return failedSubmit(state);
        case actions.POST_COURSE_SUCCESSFUL:
            return successSubmit(state,payload);
        case actions.POST_COURSE_FAILED:
            return failedSubmit(state);
        case actions.SUBMIT_INITIATED:
            return onSubmit(state);
        case actions.RESET_SUBMIT_STATUS:
            return onSubmit(state);
        case actions.POST_PRICE_RULE_SUCCESS:
            return successSubmit(state);
        case actions.POST_DISCOUNT_DATE_RANGE_SUCCESS:
            return successSubmit(state);
        case actions.POST_DISCOUNT_MULTI_COURSE_SUCCESS:
            return successSubmit(state);
        case actions.POST_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return successSubmit(state);
        case actions.SET_PARENT:
            newState["CurrentParent"] = payload;
            return newState;
        case actions.RESET_REGISTRATION:
            newState["registered_courses"] = {};
            return newState;
        case actions.ADD_CLASS_REGISTRATION:
            return addClassRegistration(newState, payload);
        case actions.ADD_TUTORING_REGISTRATION:
            return addTutoringRegistration(newState, payload);
        case actions.ADD_SMALL_GROUP_REGISTRATION:
            return addSmallGroupRegistration(newState, payload);
        case actions.INIT_COURSE_REGISTRATION:
            return initializeRegistration(newState);
        case actions.CLOSE_COURSE_REGISTRATION:
            return closeRegistration(newState);
        case actions.EDIT_COURSE_REGISTRATION:
            return editCourseRegistration(newState, payload);
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
    let courseID;
    let courseName;
    let studentInfoNote = "";
    if(form["Course Selection"]){
        courseID = form["Course Selection"].Course.value;
        courseName = form["Course Selection"].Course.label;
        studentInfoNote = stringifyStudentInformation(form);
    } else if(form.isSmallGroup){
        courseID = Number(form.id.substring(form.id.indexOf("+")));
    } else {
        courseID = form["Group Details"]["Select Group"].value;
        courseName = form["Group Details"]["Select Group"].label;
    }

    let enrollmentObject = {
        type: "class",
        student_id: studentID,
        course_id: courseID,
        enrollment_note: studentInfoNote,
        sessions: 0,
        display:{
            student_name: studentName,
            course_name: courseName,
        },
        form:{
            ...form,
            activeStep:0,
            activeSection:"Student"
        },
    };

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

    prevState.registered_courses = addStudentRegistration(studentID, prevState.registered_courses, "class", enrollmentObject);
    prevState.submitStatus = "success";

    return {...prevState};
};

export const academicLevelParse = {
    "Elementary School":"elementary_lvl",
    "Middle School":"middle_lvl",
    "High School":"high_lvl",
    "College":"college_lvl",
    "elementary_lvl": "Elementary School",
    "middle_lvl": "Middle School",
    "high_lvl":"High School",
    "college_lvl":"College"
};
export const courseTypeParse = {
    "Tutoring":"tutoring",
    "Small Group":"small_group",
    "tutoring": "Tutoring",
    "small_group": "Small Group"
}

const addTutoringRegistration = (prevState, form) => {
    let studentID = form["Student"].Student.value;
    let studentName = form["Student"].Student.label;
    let subject = form["Tutor Selection"]["Course Name"];
    let instructorID = form["Tutor Selection"].Instructor.value;
    let instructorName = form["Tutor Selection"].Instructor.label;
    let courseName = instructorName.substring(0,instructorName.indexOf(" ")) + " x " +
                        studentName.substring(0,studentName.indexOf(" ")) + " - " + subject;
    let studentInfoNote = stringifyStudentInformation(form);
    let startDate = form["Schedule"]["Start Date"];
    console.log(startDate);
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
    let academicLevel = academicLevelParse[form["Student"]["Grade Level"]];
    let category = form["Tutor Selection"]["Category"].value;
    let endTime = new Date(startTime);
    endTime.setHours(endTime.getHours()+duration());
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate()+(7*numSessions));
    let isStudentCurrentlyRegistered = prevState.registered_courses ? Object.keys(prevState.registered_courses).includes(studentID.toString()):false;
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
                end_date: endDate,
                end_time: dateToTimeString(endTime), //generated from course duration
            },
            day_of_week: dayOfWeek,
            max_capacity: 1,
            enrollment_id_list: [studentID], //array with student_id
            description: studentInfoNote,
        },
        student_id: studentID,
        course_id: "T" + (isStudentCurrentlyRegistered ? (prevState.registered_courses[studentID].length + 1).toString() : "0"),
        sessions: numSessions,
        academic_level: academicLevel,
        category: category,
        display:{
            student_name: studentName,
            course_name: courseName,
        },
        form:{
            ...form,
            activeStep:0,
            activeSection:"Student"
        },
    };

    prevState.registered_courses = addStudentRegistration(studentID, prevState.registered_courses, "tutoring", enrollmentObject);
    prevState.submitStatus = "success";

    return {...prevState};
}

const addSmallGroupRegistration = (prevState, {formMain, new_course}) => {
    let studentID = formMain["Student"].Student.value;
    let studentName = formMain["Student"].Student.label;

    let {Student, Student_validated, existingUser, hasLoaded, nextSection, preLoaded, submitPending} = formMain;

    let enrollmentObject = {
        type: "class",
        student_id: studentID,
        course_id: new_course.id,
        enrollment_note: "",
        sessions: new_course.max_capacity,
        display:{
            student_name: studentName,
            course_name: new_course.subject,
        },
        form:{
            Student: Student,
            Student_validated: Student_validated,
            existingUser: existingUser,
            form: "class",
            hasLoaded: hasLoaded,
            nextSection: nextSection,
            preLoaded: preLoaded,
            submitPending: submitPending,
            activeStep:0,
            activeSection:"Student",
            isSmallGroup: true,
        },
    };

    prevState.registered_courses = addStudentRegistration(studentID, prevState.registered_courses, "small group", enrollmentObject);
    prevState.submitStatus = "success";
    return {...prevState};
};

const addStudentRegistration = (studentID, registeredCourses, courseType, enrollmentObject) =>{
    let enrollmentExists = false;
    let isStudentCurrentlyRegistered = registeredCourses ? Object.keys(registeredCourses).includes(studentID.toString()) : false;

    if(isStudentCurrentlyRegistered){
        registeredCourses[studentID] && registeredCourses[studentID].forEach((enrollment)=>{
            if(courseType !== "tutoring" && enrollment.student_id === enrollmentObject.student_id &&
                enrollment.course_id === enrollmentObject.course_id && !enrollmentObject.form.isSmallGroup){
                enrollmentExists = true;
            } else if( courseType === "tutoring" && enrollment.student_id === enrollmentObject.student_id && enrollment.new_course){
                if(enrollment.new_course.subject === enrollmentObject.new_course.subject){
                    enrollmentExists = true;
                }
            } else {
                // This is a small group
                enrollment = enrollmentObject.student_id;
            }
        });
        if(!enrollmentExists) {
            registeredCourses[studentID].push(enrollmentObject);
        }
    } else if(registeredCourses){ // new student, same parent
        registeredCourses[studentID] = [enrollmentObject];
    } else { // new student, first one registered by parent
        registeredCourses = {};
        registeredCourses[studentID] = [enrollmentObject];
    }

    sessionStorage.setItem("registered_courses",JSON.stringify(registeredCourses));
    return {...registeredCourses};
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
    return {
        ...prevState,
        registered_courses: prevRegisteredCourses,
    };
};

const editCourseRegistration = (prevState, {student_id, course_id, enrollment_note, new_course, sessions, form}) => {
    let editedRegistration = prevState.registered_courses[student_id].find((course)=>{return course.course_id === course_id});
    let studentName;
    if(form){
        studentName = form["Student"].Student.label;
    }
    const renderCourseName = (type, form, new_course) => {
        if(type === "tutoring"){
            return new_course.subject;
        } else {
            return  form["Course Selection"].Course.label;
        }
    };

    // SMALL GROUPS + CLASSES - edits to course information must be done through the "EDIT COURSE" action
    for(let [key, value] of Object.entries(editedRegistration)){
        switch(key){
            case "student_id":
                if(value !== student_id){
                    editedRegistration = {
                        ...editedRegistration,
                        student_id : student_id,
                        display: {
                            ...editedRegistration.display,
                            student_name: studentName ? studentName : "Invalid Student",
                        }
                    }
                }
                break;
            case "course_id":
                if(value !== course_id){
                    editedRegistration = {
                        ...editedRegistration,
                        course_id : course_id,
                        display: {
                            ...editedRegistration.display,
                            course_name: renderCourseName(editedRegistration.type, form, new_course),
                        }
                    }
                }
                break;
            case "sessions":
                if(value !== sessions){
                    editedRegistration = {
                        ...editedRegistration,
                        sessions: sessions,
                    }
                }
                break;
            case "enrollment_note":
                if(value !== enrollment_note){
                    editedRegistration = {
                        ...editedRegistration,
                        enrollment_note: enrollment_note,
                    }
                }
                break;
            case "new_course":
                if(new_course){
                    editedRegistration = {
                        ...editedRegistration,
                        new_course: new_course,
                    }
                }
                break;
        }
    }
    let updated_registered_courses = prevState.registered_courses[student_id].map((registration) => {
        if(registration.course_id === course_id){
            return editedRegistration;
        } else {
            return registration;
        }
    });

    let updatedRegistration = {
        ...prevState,
        registered_courses:{
            ...prevState.registered_courses,
            [student_id]: updated_registered_courses,
        }
    }

    sessionStorage.setItem("registered_courses", JSON.stringify(updatedRegistration.registered_courses));

    return {...updatedRegistration};
};

const closeRegistration = (state) =>{
    sessionStorage.removeItem("registered_courses");
    sessionStorage.removeItem("CurrentParent");
    return {
        ...state,
        CurrentParent:"none",
        registered_courses: null,
    };
}
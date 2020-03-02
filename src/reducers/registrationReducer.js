import initialState from './initialState';
import * as actions from "./../actions/actionTypes"
import { dateParser } from "../components/Form/FormUtils";

export default function registration(state = initialState.RegistrationForms, { payload, type }) {
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
            const path = payload[0];
            const removeFieldIndex = payload[1];
            const conditional = payload[2];
            if (conditional) {
                path.push(conditional);
            }
            newState = removeField(state, path, removeFieldIndex, conditional);
            return newState;
        case actions.POST_STUDENT_SUCCESSFUL:
            return successSubmit(state);
        case actions.POST_STUDENT_FAILED:
            return failedSubmit(state);
        case actions.POST_ADMIN_SUCCESSFUL:
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
            return successSubmit(state, payload);
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
            newState.CurrentParent = payload;
            return {...newState};
        case actions.RESET_REGISTRATION:
            newState.registered_courses = {};
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
        case actions.SET_REGISTRATION:
            newState.registration = payload;
            return { ...newState };
        default:
            return state;
    }
}

function addAStudentField(prevState) {
    const SmallGroupList = prevState.registration_form.tutoring["Student(s)"]["Small Group"];
    const NewStudentField = {
        ...SmallGroupList[0],
        "field": `Student ${(SmallGroupList.length + 1).toString()} Name`,
        "required": false,
    };
    SmallGroupList.push(NewStudentField);
    prevState.registration_form.tutoring["Student(s)"]["Small Group"] = SmallGroupList;
    return prevState;
}

function addACourseField(prevState) {
    const NewState = prevState;
    const CourseFieldList = prevState.registration_form.course["Course Selection"];
    const NewCourseField = {
        ...CourseFieldList[0],
        "field": `Course ${(CourseFieldList.length + 1).toString()} Name`,
        "required": false,
    };
    CourseFieldList.push(NewCourseField);
    NewState.registration_form.course["Course Selection"] = CourseFieldList;
    return NewState;
}

const addField = (prevState, path) => {
    const NewState = prevState;
    const fieldIndex = path.pop();
    const SectionFieldList = getSectionFieldList(path, prevState.registration_form);
    const fieldName = SectionFieldList[fieldIndex].field;
    const numFieldType = SectionFieldList.reduce((total, {field}) => total + (field === fieldName), 1);
    const NewField = {
        ...SectionFieldList[fieldIndex],
        name: `${fieldName} ${numFieldType}`,
        required: false,
    };
    SectionFieldList.push(NewField);
    setSectionFieldList(path, SectionFieldList, prevState.registration_form);
    return NewState;
};

function removeField(prevState, path, fieldIndex, conditional) {
    const NewState = prevState;
    let SectionFieldList =
        getSectionFieldList(JSON.parse(JSON.stringify(path)), prevState.registration_form);

    if (SectionFieldList.length <= 1) {
        return prevState;
    }

    SectionFieldList = SectionFieldList.slice(0, fieldIndex).concat(SectionFieldList.slice(fieldIndex + 1));

    const fieldCounts = {};

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
        NewState.registration_form[path[0]][path[1]][conditional] = SectionFieldList;
    } else {
        NewState.registration_form[path[0]][path[1]] = SectionFieldList;
    }
    return NewState;
}

function getSectionFieldList(path, formList) {
    if (Array.isArray(path)) {
        if (path.length === 0) {
            return formList;
        }
        return getSectionFieldList(path, formList[path.shift()]);
    }
    Error("Path variable not an array");
}

function setSectionFieldList(path, formList, form) {
    if (Array.isArray(path)) {
        if (path.length === 0) {
            form = formList;
            return;
        }
        const firstPathStep = path.shift();
        return setSectionFieldList(path, formList, form[firstPathStep]);
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
    const studentID = form.Student.Student.value;
    const studentName = form.Student.Student.label;
    let courseID;
    let courseName;
    let studentInfoNote = "";
    if (form["Course Selection"]) {
        courseID = form["Course Selection"].Course.value;
        courseName = form["Course Selection"].Course.label;
        studentInfoNote = stringifyStudentInformation(form);
    } else if (form.isSmallGroup) {
        courseID = Number(form.id.substring(form.id.indexOf("+")));
    } else {
        courseID = form["Group Details"]["Select Group"].value;
        courseName = form["Group Details"]["Select Group"].label;
    }

    let enrollmentObject = {
        type: "class",
        student_id: studentID,
        course_id: Number(courseID),
        enrollment_note: studentInfoNote,
        sessions: 0,
        display: {
            student_name: studentName,
            course_name: courseName,
            course_id: Number(courseID)
        },
        form: {
            ...form,
            activeStep: 0,
            activeSection: "Student"
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

    return { ...prevState };
};

export const academicLevelParse = {
    "Elementary School": "elementary_lvl",
    "Middle School": "middle_lvl",
    "High School": "high_lvl",
    "College": "college_lvl",
    "elementary_lvl": "Elementary School",
    "middle_lvl": "Middle School",
    "high_lvl": "High School",
    "college_lvl": "College",
};
export const courseTypeParse = {
    "Tutoring": "tutoring",
    "Small Group": "small_group",
    "tutoring": "Tutoring",
    "small_group": "Small Group",
};

const addTutoringRegistration = (prevState, form) => {
    const studentID = form.Student.Student.value;
    const studentName = form.Student.Student.label;
    const subject = form["Tutor Selection"]["Course Name"];
    const instructorID = form["Tutor Selection"].Instructor.value;
    const instructorName = form["Tutor Selection"].Instructor.label;
    const courseName = `${instructorName.substring(0, instructorName.indexOf(" "))} x ${
        studentName.substring(0, studentName.indexOf(" "))} - ${subject}`;
    const studentInfoNote = stringifyStudentInformation(form);
    const startDate = form.Schedule["Start Date"];
    const dayOfWeek = new Date(startDate).getDay();
    const startTime = new Date(form.Schedule["Session Start Time"]);
    const duration = () => {
        switch (form.Schedule.Duration) {
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
    const instructorConfirmation = form["Tutor Selection"]["Did instructor confirm?"] === "Yes, Instructor Confirm";
    const numSessions = form.Schedule["Number of Sessions"];
    const academicLevel = academicLevelParse[form.Student["Grade Level"]];
    const category = form["Tutor Selection"].Category.value;
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + duration());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (7 * (numSessions - 1)));
    const isStudentCurrentlyRegistered = prevState.registered_courses ? Object.keys(prevState.registered_courses).includes(studentID.toString()) : false;

    const enrollmentObject = {
        "course_type": "tutoring",
        "new_course": {
            subject,
            "title": courseName, // create class with instructor and name as INSTRUCTOR-LASTNAME x STUDENT-FIRSTNAME - SUBJECT
            "course_type": "tutoring",
            "instructor": instructorID,
            "schedule": {
                "start_date": dateParser(startDate).substring(0, 10),
                "start_time": dateToTimeString(startTime),
                "end_date": dateParser(endDate).substring(0, 10),
                "end_time": dateToTimeString(endTime), // generated from course duration
            },
            "day_of_week": dayOfWeek,
            "max_capacity": 1,
            "enrollment_id_list": [studentID], // array with student_id
            "description": studentInfoNote,
            "academic_level": academicLevel,
            "course_category": category,
            "is_confirmed": instructorConfirmation,
        },
        student_id: studentID,
        course_id: "T" + (isStudentCurrentlyRegistered ? (prevState.registered_courses[studentID].length + 1).toString() : "0"),
        sessions: numSessions,
        academic_level: academicLevel,
        category: category,
        display: {
            student_name: studentName,
            course_name: courseName,
        },
        form: {
            ...form,
            activeStep: 0,
            activeSection: "Student"
        },
    };

    prevState.registered_courses = addStudentRegistration(studentID, prevState.registered_courses, "tutoring", enrollmentObject);
    prevState.submitStatus = "success";

    return { ...prevState };
};

const addSmallGroupRegistration = (prevState, {formMain, new_course}) => {
    const studentID = formMain.Student.Student.value;
    const studentName = formMain.Student.Student.label;

    const {Student, Student_validated, existingUser, hasLoaded, nextSection, preLoaded, submitPending} = formMain;

    const enrollmentObject = {
        type: "small_group",
        student_id: studentID,
        course_id: new_course.id,
        enrollment_note: "",
        sessions: new_course.max_capacity,
        display: {
            student_name: studentName,
            course_name: new_course.subject,
        },
        form: {
            Student: Student,
            Student_validated: Student_validated,
            existingUser: existingUser,
            form: "small_group",
            hasLoaded: hasLoaded,
            nextSection: nextSection,
            preLoaded: preLoaded,
            submitPending: submitPending,
            activeStep: 0,
            activeSection: "Student",
            isSmallGroup: true,
        },
    };

    prevState.registered_courses = addStudentRegistration(studentID, prevState.registered_courses, "small group", enrollmentObject);
    prevState.submitStatus = "success";
    return { ...prevState };
};

const addStudentRegistration = (studentID, registeredCourses, courseType, enrollmentObject) => {
    let enrollmentExists = false;
    const isStudentCurrentlyRegistered = registeredCourses ? Object.keys(registeredCourses).includes(studentID.toString()) : false;

    if (isStudentCurrentlyRegistered) {
        registeredCourses[studentID] && registeredCourses[studentID].forEach((enrollment) => {
            if (courseType !== "tutoring" && enrollment.student_id === enrollmentObject.student_id &&
                enrollment.course_id === enrollmentObject.course_id && !enrollmentObject.form.isSmallGroup) {
                enrollmentExists = true;
            } else if (courseType === "tutoring" && enrollment.student_id === enrollmentObject.student_id && enrollment.new_course) {
                if (enrollment.new_course.subject === enrollmentObject.new_course.subject) {
                    enrollmentExists = true;
                }
            } else {
                // This is a small group
                enrollment = enrollmentObject.student_id;
            }
        });
        if (!enrollmentExists) {
            registeredCourses[studentID].push(enrollmentObject);
        }
    } else if (registeredCourses) { // new student, same parent
        registeredCourses[studentID] = [enrollmentObject];
    } else { // new student, first one registered by parent
        registeredCourses = {};
        registeredCourses[studentID] = [enrollmentObject];
    }

    sessionStorage.setItem("registered_courses", JSON.stringify(registeredCourses));
    return {...registeredCourses};
};

const stringifyStudentInformation = (form) => {
    let studentInfoList = Object.entries(form["Student Information"]);
    let studentInfoNote = "";
    studentInfoList.forEach((infoPair) => {
        studentInfoNote += `${infoPair[0]}: ${infoPair[1]}\n`;
    });
    return studentInfoNote;
};

const dateToTimeString = (date) => `${date.getHours().toString()}:${date.getMinutes() !== 0 ? date.getMinutes().toString() : "00"}`;

const initializeRegistration = (prevState) => {
    const prevRegisteredCourses = JSON.parse(sessionStorage.getItem("registered_courses"));
    const prevParent = JSON.parse(sessionStorage.getItem("CurrentParent"));
    if (prevRegisteredCourses && prevParent) {
        prevState.registered_courses = prevRegisteredCourses;
        prevState.CurrentParent = prevParent;
    }
    return {...prevState};
};

const editCourseRegistration = (prevState, course) => {
    const {student_id, course_id, enrollment_note, new_course, sessions, form, courseID} = course;
    let editedRegistration = prevState.registered_courses[student_id].find((course) => course.course_id === course_id);
    editedRegistration.courseID = courseID;
    let studentName;
    if (form) {
        studentName = form.Student.Student.label;
    }
    const renderCourseName = (type, form, new_course) =>
        type === "tutoring"
            ? new_course.subject
            : form["Course Selection"].Course.label;
    // SMALL GROUPS + CLASSES - edits to course information must be done through the "EDIT COURSE" action
    for (const [key, value] of Object.entries(editedRegistration)) {
        switch (key) {
            case "student_id":
                if (value !== student_id) {
                    editedRegistration = {
                        ...editedRegistration,
                        student_id: student_id,
                        display: {
                            ...editedRegistration.display,
                            "student_name": studentName || "Invalid Student",
                        },
                    };
                }
                break;
            case "course_id":
                if (value !== course_id) {
                    editedRegistration = {
                        ...editedRegistration,
                        course_id: course_id,
                        display: {
                            ...editedRegistration.display,
                            "course_name": renderCourseName(editedRegistration.type, form, new_course),
                        },
                    };
                }
                break;
            case "sessions":
                if (value !== sessions) {
                    editedRegistration = {
                        ...editedRegistration,
                        sessions,
                    };
                }
                break;
            case "enrollment_note":
                if (value !== enrollment_note) {
                    editedRegistration = {
                        ...editedRegistration,
                        enrollment_note,
                    };
                }
                break;
            case "new_course":
                if (new_course) {
                    editedRegistration = {
                        ...editedRegistration,
                        new_course,
                    };
                }
                break;
            default:
                console.warn(`Unhandled key ${key}`);
        }
    }
    const updated_registered_courses = prevState.registered_courses[student_id].map((registration) => {
        if (registration.course_id === course_id) {
            return editedRegistration;
        }
        return registration;

    });

    const updatedRegistration = {
        ...prevState,
        registered_courses: {
            ...prevState.registered_courses,
            [student_id]: updated_registered_courses,
        },
    };
    sessionStorage.setItem("registered_courses", JSON.stringify(updatedRegistration.registered_courses));

    return { ...updatedRegistration };
};

const closeRegistration = (state) => {
    sessionStorage.removeItem("registered_courses");
    sessionStorage.removeItem("CurrentParent");
    return {
        ...state,
        CurrentParent: "none",
        registered_courses: null,
    };
};

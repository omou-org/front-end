import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";
import {REQUEST_ALL} from "../actions/apiActions";

export default function users(state = initialState.Users, {payload, type}) {
    switch (type) {
        case actions.FETCH_STUDENT_SUCCESSFUL:
            return handleStudentsFetch(state, payload);
        case actions.FETCH_PARENT_SUCCESSFUL:
            return handleParentsFetch(state, payload);
        case actions.FETCH_INSTRUCTOR_SUCCESSFUL:
            return handleInstructorsFetch(state, payload);
        case actions.FETCH_ACCOUNT_NOTE_SUCCESSFUL:
            return handleAccountNotesFetch(state, payload);
        case actions.POST_ACCOUNT_NOTE_SUCCESSFUL:
        case actions.PATCH_ACCOUNT_NOTE_SUCCESSFUL:
            return handleAccountNotesPost(state, payload);
        case actions.DELETE_ACCOUNT_NOTE_SUCCESSFUL:
            return handleNoteDelete(state, payload);
        case actions.POST_STUDENT_SUCCESSFUL:
            return handleStudentPost(state, payload);
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS:
            return handleAccountSearchResults(state, payload);
        case actions.POST_OOO_SUCCESS:
        case actions.FETCH_OOO_SUCCESS:
            return handleOOOFetch(state, payload);
        case actions.FETCH_INSTRUCTOR_AVAILABILITY_SUCCESS:
        case actions.POST_INSTRUCTORAVAILABILITY_SUCCESS:
            return handleAvailabilityFetch(state, payload);
        default:
            return state;
    }
}

const parseRelationship = {
    "mother": "Mother",
    "father": "Father",
    "guardian": "Guardian",
    "other": "Other",
};

const dayToNum = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
};

const parseBirthday = (date) => {
    if (date !== null) {
        const [year, month, day] = date.split("-");
        return `${month}/${day}/${year}`;
    }
    return "01/01/2000";
};

const handleAccountNotesPost = (state, {response, ...rest}) =>
    handleAccountNotesFetch(state, {
        "response": {
            ...response,
            "data": [response.data],
        },
        "ownerID": response.data.user,
        ...rest,
    });

const handleAccountNotesFetch = (state, {ownerID, ownerType, response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));
    data.forEach((note) => {
        switch (ownerType) {
            case "student":
                if (!newState.StudentList[ownerID]) {
                    newState.StudentList[ownerID] = {
                        "notes": {},
                    };
                }
                newState.StudentList[ownerID].notes[note.id] = note;
                break;
            case "parent":
                if (!newState.ParentList[ownerID]) {
                    newState.ParentList[ownerID] = {
                        "notes": {},
                    };
                }
                newState.ParentList[ownerID].notes[note.id] = note;
                break;
            case "instructor":
                if (!newState.InstructorList[ownerID]) {
                    newState.InstructorList[ownerID] = {
                        "notes": {},
                    };
                }
                newState.InstructorList[ownerID].notes[note.id] = note;
                break;
            case "receptionist":
                if (!newState.ReceptionistList[ownerID]) {
                    newState.ReceptionistList[ownerID] = {
                        "notes": {},
                    };
                }
                newState.ReceptionistList[ownerID].notes[note.id] = note;
                break;
            default:
                console.error("Bad user type", ownerType);
        }
    });
    return newState;
};

const handleNoteDelete = (state, {ownerID, ownerType, noteID}) => {
    const newState = JSON.parse(JSON.stringify(state));
    switch (ownerType) {
        case "student":
            if (!newState.StudentList[ownerID]) {
                newState.StudentList[ownerID] = {
                    "notes": {},
                };
            }
            delete newState.StudentList[ownerID].notes[noteID];
            break;
        case "parent":
            if (!newState.ParentList[ownerID]) {
                newState.ParentList[ownerID] = {
                    "notes": {},
                };
            }
            delete newState.ParentList[ownerID].notes[noteID];
            break;
        case "instructor":
            if (!newState.InstructorList[ownerID]) {
                newState.InstructorList[ownerID] = {
                    "notes": {},
                };
            }
            delete newState.InstructorList[ownerID].notes[noteID];
            break;
        case "receptionist":
            if (!newState.ReceptionistList[ownerID]) {
                newState.ReceptionistList[ownerID] = {
                    "notes": {},
                };
            }
            delete newState.ReceptionistList[ownerID].notes[noteID];
            break;
        default:
            console.error("Bad user type", ownerType);
    }
    return newState;
};


export const handleParentsFetch = (state, payload) => {
    let id, response;
    if (payload.id) {
        id = payload.id;
        response = payload.response;
    } else {
        id = payload.data.user.id;
        response = payload;
    }
    let {ParentList} = state;
    if (id === REQUEST_ALL) {
        response.data.forEach((parent) => {
            ParentList = updateParent(ParentList, parent.user.id, parent);
        });
    } else if (Array.isArray(id)) {
        response.forEach(({data}) => {
            ParentList = updateParent(ParentList, data.user.id, data);
        });
    } else {
        ParentList = updateParent(ParentList, id, response.data);
    }
    return {
        ...state,
        ParentList,
    };
};

export const updateParent = (parents, id, parent) => ({
    ...parents,
    [id]: {
        "user_id": parent.user.id,
        "gender": parent.gender,
        "birthday": parseBirthday(parent.birth_date),
        "address": parent.address,
        "city": parent.city,
        "phone_number": parent.phone_number,
        "state": parent.state,
        "zipcode": parent.zipcode,
        "relationship": parseRelationship[parent.relationship],
        "first_name": parent.user.first_name,
        "last_name": parent.user.last_name,
        "name": `${parent.user.first_name} ${parent.user.last_name}`,
        "email": parent.user.email,
        "student_ids": parent.student_list,
        "updated_at": parent.updated_at,
        "role": "parent",
        "notes": (parents[id] && parents[id].notes) || {},
        "balance": parent.balance,
    },
});

export const handleAdminsFetch = (state, payload) => {
    let id, response;
    if (payload.id) {
        id = payload.id;
        response = payload.response;
    } else {
        id = payload.data.user.id;
        response = payload;
    }
    let {ReceptionistList} = state;
    if (id === REQUEST_ALL) {
        response.data.forEach((admin) => {
            ReceptionistList = updateAdmin(ReceptionistList, admin.user.id, admin);
        });
    } else if (Array.isArray(id)) {
        response.forEach(({data}) => {
            ReceptionistList = updateAdmin(ReceptionistList, data.user.id, data);
        });
    } else {
        ReceptionistList = updateAdmin(ReceptionistList, id, response.data);
    }
    return {
        ...state,
        ReceptionistList,
    };
};

export const updateAdmin = (admins, id, admin) => ({
    ...admins,
    [id]: {
        "user_id": admin.user.id,
        "gender": admin.gender,
        "birthday": parseBirthday(admin.birth_date),
        "address": admin.address,
        "city": admin.city,
        "phone_number": admin.phone_number,
        "state": admin.state,
        "zipcode": admin.zipcode,
        "account_type": admin.user.account_type,
        "first_name": admin.user.first_name,
        "last_name": admin.user.last_name,
        "name": `${admin.user.first_name} ${admin.user.last_name}`,
        "email": admin.user.email,
        "updated_at": admin.updated_at,
        "role": "admin",
        "notes": (admins[id] && admins[id].notes) || {},
    },
});

export const handleStudentsFetch = (state, payload) => {
    let data;
    let id;
    let response;
    if (payload.id) {
        id = payload.id;
        data = payload.response.data;
        response = payload.response;
    } else {
        data = payload.data;
        id = payload.data.user.id;
        response = payload;
    }
    let {StudentList} = state;
    if (id === REQUEST_ALL) {
        data.forEach((student) => {
            StudentList = updateStudent(StudentList, student.user.id, student);
        });
    } else if (Array.isArray(id)) {
        response.forEach(({data}) => {
            StudentList = updateStudent(StudentList, data.user.id, data);
        });
    } else {
        StudentList = updateStudent(StudentList, id, data);
    }
    return {
        ...state,
        StudentList,
    };
};

export const handleStudentPost = (state, data) => {
    let {StudentList, ParentList} = state;
    StudentList = updateStudent(StudentList, data.user.id, data);
    // Add student to parent in state
    if (ParentList[data.user.id]) {
        const currentStudent = StudentList[data.user.id];
        ParentList[currentStudent.parent_id].student_ids.push(data.user.id);
    }

    return {
        ...state,
        StudentList,
        ParentList,
    };
};

export const updateStudent = (students, id, student) => ({
    ...students,
    [id]: {
        "user_id": student.user.id,
        "summit_id": student.user_uuid,
        "gender": student.gender,
        "birthday": parseBirthday(student.birth_date),
        "address": student.address,
        "city": student.city,
        "phone_number": student.phone_number,
        "state": student.state,
        "zipcode": student.zipcode,
        "grade": student.grade,
        "age": student.age,
        "school": student.school,
        "first_name": student.user.first_name,
        "last_name": student.user.last_name,
        "name": `${student.user.first_name} ${student.user.last_name}`,
        "email": student.user.email,
        "parent_id": student.primary_parent,
        "updated_at": student.updated_at,
        // below is not from database
        "role": "student",
        "balance": 0,
        "notes": (students[id] && students[id].notes) || {},
    },
});

const updateOOO = (instructors, {id, instructor, start_datetime, description, end_datetime}) => {
    const newInstructors = JSON.parse(JSON.stringify(instructors));
    if (!newInstructors[instructor]) {
        newInstructors[instructor] = {
            "schedule": {
                "time_off": {},
                "work_hours": {},
            },
        };
    }

    const end = new Date(end_datetime),
        start = new Date(start_datetime);
    newInstructors[instructor].schedule.time_off = {
        ...newInstructors[instructor].schedule.time_off,
        [id]: {
            "all_day": start.getHours() === end.getHours() &&
                start.getMinutes() === end.getMinutes(),
            description,
            end,
            "instructor_id": instructor,
            "ooo_id": id,
            start,
        },
    };
    return newInstructors;
};

const updateAvailability = (instructors, availability) => {
    const newInstructors = JSON.parse(JSON.stringify(instructors));
    const instructorID = availability.instructor;
    if (!newInstructors[instructorID]) {
        newInstructors[instructorID] = {
            "schedule": {
                "work_hours": {},
            },
        };
    }
    newInstructors[instructorID].schedule.work_hours = {
        ...instructors[instructorID].schedule.work_hours,
        [availability.id]: {
            "availability_id": availability.id,
            "day": dayToNum[availability.day_of_week],
            "end": availability.end_time,
            "start": availability.start_time,
        },
    };
    return newInstructors;
};


export const handleOOOFetch = (state, {response}) => {
    const {data} = response;
    let {InstructorList} = state;
    if (Array.isArray(data)) {
        data.forEach((OOO) => {
            InstructorList = updateOOO(InstructorList, OOO);
        });
    } else {
        InstructorList = updateOOO(InstructorList, data);
    }
    return {
        ...state,
        InstructorList,
    };
};

export const handleAvailabilityFetch = (state, {response}) => {
    const {data} = response;
    let {InstructorList} = state;
    if (Array.isArray(data)) {
        data.forEach((availability) => {
            InstructorList = updateAvailability(InstructorList, availability);
        });
    } else {
        InstructorList = updateAvailability(InstructorList, data);
    }
    return {
        ...state,
        InstructorList,
    };
};

export const handleInstructorsFetch = (state, {id, response}) => {
    const {data} = response;
    let {InstructorList} = state;
    if (id !== REQUEST_ALL) {
        InstructorList = updateInstructor(InstructorList, id, data);

    } else {
        data.forEach((instructor) => {
            InstructorList = updateInstructor(InstructorList, instructor.user.id, instructor);
        });
    }
    return {
        ...state,
        InstructorList,
    };
};


export const updateInstructor = (instructors, id, instructor) => {
    const {address, birth_date, city, gender, phone_number,
        state, user, user_uuid, zipcode,
        biography, experience, subjects, language} = instructor;
    let newInstructor = instructors[id] || {};
    const schedule = newInstructor.schedule || {};
    newInstructor = {
        "user_id": user.id,
        "summit_id": user_uuid,
        gender,
        "birth_date": parseBirthday(birth_date),
        address,
        city,
        phone_number,
        state,
        zipcode,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "name": `${user.first_name} ${user.last_name}`,
        "email": user.email,
        "updated_at": instructor.updated_at,
        "role": "instructor",
        "background": {
            "bio": biography,
            experience,
            subjects,
            "languages": language,
        },
        "schedule": {
            "work_hours": schedule.work_hours || {},
            "time_off": schedule.time_off || {},
        },
        "notes": newInstructor.notes || {},
    };
    return {
        ...instructors,
        [id]: newInstructor,
    };
};


const handleAccountSearchResults = (state, {response}) => {
    let {StudentList, ParentList, InstructorList} = state;
    const {data} = response;
    data.results.forEach((account) => {
        switch (account.account_type) {
            case "student": {
                StudentList = updateStudent(StudentList, account.user.id, account);
                break;
            }
            case "parent": {
                ParentList = updateParent(ParentList, account.user.id, account);
                break;
            }
            case "instructor": {
                InstructorList = updateInstructor(InstructorList, account.user.id, account);
            }
            // no default
        }
    });
    return {
        ...state,
        InstructorList,
        ParentList,
        StudentList,
    };
};

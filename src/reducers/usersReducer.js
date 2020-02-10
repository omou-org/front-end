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
        case actions.POST_STUDENT_SUCCESSFUL:
            return handleStudentPost(state,payload);
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS:
            console.log("account search setting redux")
            return handleAccountSearchResults(state,payload);
        default:
            return state;
    }
}

const parseRelationship = {
    "MOTHER": "Mother",
    "FATHER": "Father",
    "GUARDIAN": "Guardian",
    "OTHER": "Other",
};

const parseBirthday = (date) => {
    if (date !== null) {
        const [year, month, day] = date.split("-");
        return `${month}/${day}/${year}`;
    } else {
        return "01/01/2000";
    }
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

export const handleParentsFetch = (state, payload) => {
    let response, id;
    if(payload.id){
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
        // below is not from database
        "role": "parent",
        "notes": (parents[id] && parents[id].notes) || {},
    },
});

export const handleStudentsFetch = (state, payload) => {
    let data;
    let id;
    let response;
    if(payload.id) {
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
    if(ParentList[data.user.id]){
        let currentStudent = StudentList[data.user.id];
        ParentList[currentStudent.parent_id].student_ids.push(data.user.id);
    }

    return {
        ...state,
        StudentList,
        ParentList,
    };
}

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
    let {address, birth_date, city, gender, phone_number,
        state, user, user_uuid, zipcode,
        biography, experience, subjects, language
    } = instructor;
    return {
        ...instructors,
        [id]: {
            "user_id": user.id,
            "summit_id": user_uuid,
            "gender": gender,
            "birth_date": parseBirthday(birth_date),
            "address": address,
            "city": city,
            "phone_number": phone_number,
            "state": state,
            "zipcode": zipcode,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": `${user.first_name} ${user.last_name}`,
            "email": user.email,
            "updated_at": instructor.updated_at,
            "role": "instructor",
            "background": {
                "bio": biography,
                "experience": experience,
                "subjects": subjects,
                "languages": language,
            },
            // below is not from database
            "schedule": {
                "work_hours": {
                    "1": {
                        "start": "T17:00",
                        "end": "T20:00",
                        "title": "",
                    },
                    "2": {
                        "start": "T17:00",
                        "end": "T20:00",
                        "title": "",
                    },
                    "3": {
                        "start": "T18:00",
                        "end": "T20:00",
                        "title": "",
                    },
                    "4": {
                        "start": "T00:00",
                        "end": "T00:00",
                        "title": "",
                    },
                    "5": {
                        "start": "T16:00",
                        "end": "T21:00",
                        "title": "",
                    },
                    "6": {
                        "start": "T09:00",
                        "end": "T12:00",
                        "title": "",
                    },
                },
                "time_off": {
                    "1": {
                        "start": "2020-01-14T00:00",
                        "end": "2020-01-21T00:00",
                        "title": "Daniel Time Off",
                    },
                    "2": {
                        "start": "2020-03-22T00:00",
                        "end": "2020-03-22T00:00",
                        "title": "Daniel Time Off",
                    },
                },
            },
            "notes": (instructors[id] && instructors[id].notes) || {},
        },
    };
};


const handleAccountSearchResults = (state, {response}) => {
    let {StudentList, ParentList, InstructorList} = state;
    let {data} = response;
    data.results.forEach((account)=>{
        switch(account.account_type){
            case "STUDENT":{
                StudentList = updateStudent(StudentList, account.user.id, account);
                break;
            }
            case "parent":{
                ParentList = updateParent(ParentList, account.user.id, account);
                break;
            }
            case "INSTRUCTOR":{
                InstructorList = updateInstructor(InstructorList, account.user.id, account);
            }
        }
    });
    return {
        ...state,
        StudentList,
        ParentList,
        InstructorList,
    };
}

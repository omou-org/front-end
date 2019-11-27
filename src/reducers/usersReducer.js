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
        case actions.FETCH_NOTE_SUCCESSFUL:
            return handleNotesFetch(state, payload);
        case actions.POST_NOTE_SUCCESSFUL:
        case actions.PATCH_NOTE_SUCCESSFUL:
            return handleNotesPost(state, payload);
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

const handleNotesPost = (state, {response, ...rest}) => handleNotesFetch(state, {
    "response": {
        ...response,
        "data": [response.data],
    },
    "userID": response.data.user,
    ...rest,
});

const handleNotesFetch = (state, {userID, userType, response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));
    data.forEach((note) => {
        switch (userType) {
            case "student":
                newState.StudentList[userID].notes[note.id] = note;
                break;
            case "parent":
                newState.ParentList[userID].notes[note.id] = note;
                // console.log(newState.ParentList[0]);
                break;
            case "instructor":
                newState.InstructorList[userID].notes[note.id] = note;
                break;
            case "receptionist":
                newState.ReceptionistList[userID].notes[note.id] = note;
                break;
            default:
                console.error("Bad user type", userType);
        }
    });
    return newState;
};

const handleParentsFetch = (state, {id, response}) => {
    const {data} = response;
    let {ParentList} = state;
    if (id !== REQUEST_ALL) {
        ParentList = updateParent(ParentList, id, data);
    } else {
        data.forEach((parent) => {
            ParentList = updateParent(ParentList, parent.user.id, parent);
        });
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
        // below is not from database
        "role": "parent",
        "notes": {},
    },
});

const handleStudentsFetch = (state, {id, response}) => {
    const {data} = response;
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
        // below is not from database
        "role": "student",
        "balance": 0,
        "notes": {},
    },
});

const handleInstructorsFetch = (state, {id, response}) => {
    const {data} = response;
    let {InstructorList} = state;
    if (id !== REQUEST_ALL) {
        InstructorList = updateInstructor(InstructorList, id, data);

    } else {
        data.forEach((instructor, i) => {
            InstructorList = updateInstructor(InstructorList, instructor.user.id, instructor);
        });
    }
    // console.log(InstructorList,"hi");
    return {
        ...state,
        InstructorList,
    };
};


export const updateInstructor = (instructors, id, instructor) => {
    let {address, birth_date, city, gender, phone_number, state, user, user_uuid, zipcode} = instructor;
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
            // below is not from database
            "role": "instructor",
            "background": {
                "bio": "",
                "experience": 0,
                "subjects": [],
                "languages": [],
            },
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
            "notes": {},
        },
    };
};

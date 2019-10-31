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
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
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

const updateParent = (parents, id, parent) => ({
    ...parents,
    [id]: {
        "user_id": parent.user.id,
        "gender": parent.gender,
        "birth_date": parseBirthday(parent.birth_date),
        "address": parent.address,
        "city": parent.city,
        "phone_number": parent.phone_number,
        "state": parent.state,
        "zipcode": parent.zipcode,
        "relationship": parseRelationship[parent.relationship],
        "first_name": parent.user.first_name,
        "last_name": parent.user.last_name,
        "name": `${parent.user.first_name} ${parent.user.last_name}`,
        "email": "example@example.com",
        // below is not from database
        "role": "parent",
        "student_ids": parents[id] ? parents[id].student_ids : [],
        "notes": {},
    },
});

const handleStudentsFetch = (state, {id, response}) => {
    const {data} = response;
    let newState = JSON.parse(JSON.stringify(state));
    if (id !== REQUEST_ALL) {
        newState = updateStudent(newState, id, data);
    } else {
        data.forEach((student) => {
            newState = updateStudent(newState, student.user.id, student);
        });
    }
    return newState;
};

const updateStudent = (state, id, student) => {
    const parent = state.ParentList[student.primary_parent] || {"student_ids": []};
    parent.student_ids.push(id);

    return {
        ...state,
        "ParentList": {
            ...state.ParentList,
            [student.primary_parent]: parent,
        },
        "StudentList": {
            ...state.StudentList,
            [id]: {
                "user_id": student.user.id,
                "gender": student.gender,
                "birth_date": parseBirthday(student.birth_date),
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
            }
        }
    };
};

const handleInstructorsFetch = (state, {id, response}) => {
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


const updateInstructor = (instructors, id, instructor) => ({
    ...instructors,
    [id]: {
        "user_id": instructor.user.id,
        "gender": instructor.gender,
        "birth_date": parseBirthday(instructor.birth_date),
        "address": instructor.address,
        "city": instructor.city,
        "phone_number": instructor.phone_number,
        "state": instructor.state,
        "zipcode": instructor.zipcode,
        "age": instructor.age,
        "first_name": instructor.user.first_name,
        "last_name": instructor.user.last_name,
        "name": `${instructor.user.first_name} ${instructor.user.last_name}`,
        "email": instructor.user.email,
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
});

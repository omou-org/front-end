import initialState from "./initialState";
import * as actions from "./../actions/actionTypes";

export default function users(state = initialState.Users, {payload, type}) {
    switch (type) {
        case actions.FETCH_STUDENTS_SUCCESSFUL:
            console.log("FETCHED STUDENTS", payload);
            return addStudents(state, payload);
        case actions.FETCH_STUDENTS_FAILED:
            console.error("FAILED TO FETCH STUDENTS", payload);
            return state;
        case actions.FETCH_PARENTS_SUCCESSFUL:
            console.log("FETCHED PARENTS", payload);
            return addParents(state, payload);
        case actions.FETCH_PARENTS_FAILED:
            console.error("FAILED TO FETCH PARENTS", payload);
            return state;
        case actions.FETCH_COURSES_SUCCESSFUL:
            console.log("FETCHED COURSES", payload);
            return state;
        case actions.FETCH_COURSES_FAILED:
            console.error("FAILED TO FETCH COURSES", payload);
            return state;
        case actions.FETCH_CATEGORIES_SUCCESSFUL:
            console.log("FETCHED STUDENTS", payload);
            return state;
        case actions.FETCH_CATEGORIES_FAILED:
            console.error("FAILED TO FETCH CATEGORIES", payload);
            return state;
        default:
            return state;
    }
}

const addStudents = (state, students) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.StudentList.push(...students.map((student) => ({
        "user_id": student.user.id,
        "gender": student.gender,
        "address": student.address,
        "city": student.city,
        "phone_number": student.phone_number,
        "state": student.state,
        "zipcode": student.zipcode,
        "updated_at": Date(student.updated_at),
        "created_at": Date(student.created_at),
        "grade": student.grade,
        "age": student.age,
        "school": student.school,
        "first_name": student.user.first_name,
        "last_name": student.user.last_name,
        "name": `${student.user.first_name} ${student.user.last_name}`,
        "email": student.user.email,
        "parent_id": student.parent,
    })));
    return newState;
};

const parseRelationship = {
    "MOTHER": "Mother",
    "FATHER": "Father",
    "GUARDIAN": "Guradian",
    "OTHER": "Other",
};

const addParents = (state, parents) => {
    let newState = JSON.parse(JSON.stringify(state));
    newState.ParentList.push(...parents.map((parent) => ({
        "user_id": parent.user.id,
        "gender": parent.gender,
        "address": parent.address,
        "city": parent.city,
        "phone_number": parent.phone_number,
        "state": parent.state,
        "zipcode": parent.zipcode,
        "updated_at": Date(parent.updated_at),
        "created_at": Date(parent.created_at),
        "relationship": parseRelationship[parent.relationship],
        "first_name": parent.user.first_name,
        "last_name": parent.user.last_name,
        "name": `${parent.user.first_name} ${parent.user.last_name}`,
        "email": parent.user.email,
    })));
    return newState;
};

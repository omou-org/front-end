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
        case actions.FETCH_INSTRUCTORS_SUCCESSFUL:
            console.log("FETCHED INSTRUCTORS", payload);
            return addInstructors(state, payload);
        case actions.FETCH_INSTRUCTORS_FAILED:
            console.error("FAILED TO FETCH INSTRUCTORS", payload);
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

const parseGender = {
    "M": "Male",
    "F": "Female",
    "U": "Neither",
};

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

const addStudents = (state, students) => {
    let newState = JSON.parse(JSON.stringify(state));
    students.forEach((student) => {
        newState.StudentList[student.user.id] = {
            "user_id": student.user.id,
            "gender": parseGender[student.gender],
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
            "parent_id": student.parent,
            // below is not from database
            "role": "student",
            "balance": 0,
            "notes": {},
        };
    });
    return newState;
};

const addParents = (state, parents) => {
    let newState = JSON.parse(JSON.stringify(state));
    parents.forEach((parent) => {
        newState.ParentList[parent.user.id] = {
            "user_id": parent.user.id,
            "gender": parseGender[parent.gender],
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
            "email": parent.user.email,
            // below is not from database
            "role": "parent",
            "notes": {},
        };
    });
    return newState;
};

const addInstructors = (state, instructors) => {
    let newState = JSON.parse(JSON.stringify(state));
    instructors.forEach((instructor) => {
        newState.InstructorList[instructor.user.id] = {
            "user_id": instructor.user.id,
            "gender": parseGender[instructor.gender],
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
            schedule: {
                work_hours: {
                    1: {
                        start: "T17:00",
                        end: "T20:00",
                        title: "",
                    },
                    2: {
                        start: "T17:00",
                        end: "T20:00",
                        title: "",
                    },
                    3: {
                        start: "T18:00",
                        end: "T20:00",
                        title: "",
                    },
                    4: {
                        start: "T00:00",
                        end: "T00:00",
                        title: "",
                    },
                    5: {
                        start: "T16:00",
                        end: "T21:00",
                        title: "",
                    },
                    6: {
                        start: "T09:00",
                        end: "T12:00",
                        title: "",
                    },
                },
                time_off: {
                    1: {
                        start: "2020-01-14T00:00",
                        end: "2020-01-21T00:00",
                        title: "Daniel Time Off",
                    },
                    2: {
                        start: "2020-03-22T00:00",
                        end: "2020-03-22T00:00",
                        title: "Daniel Time Off",
                    },
                },
            },
            "notes": {},
        };
    });
    return newState;
};

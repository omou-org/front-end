import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import {REQUEST_ALL} from "../actions/apiActions";

export default (state = initialState.Course, {payload, type}) => {
    switch (type) {
        case actions.FETCH_COURSES_SUCCESSFUL:
            return handleCoursesFetch(state, payload);
        default:
            return state;
    }
};

const dayToNum = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
};

const handleCoursesFetch = (state, {id, response}) => {
    const {data} = response;
    if (id !== REQUEST_ALL) {
        return updateCourse(state, id, data);
    }
    let {NewCourseList} = state;
    data.forEach((course) => {
        NewCourseList = updateCourse(NewCourseList, course.id, course);
    });
    return {
        ...state,
        NewCourseList,
    };
};


const updateCourse = (courses, id, course) => ({
    ...courses,
    [id]: {
        "course_id": id,
        "title": course.subject,
        "schedule": {
            start_date: "2020-06-02",
            end_date: "2020-08-18",
            start_time: "T18:00",
            end_time: "T20:00",
            days: [1],
        },
        "instructor_id": course.instructor,
        "tuition": course.tuition,
        "capacity": course.max_capacity,
        "grade": 10,
        "description": course.description,
        "room_id": course.room,
        "type": "C",
        "subject": "Math",
        "tags": [],
        "roster": [23, 99, 64],
    },
});

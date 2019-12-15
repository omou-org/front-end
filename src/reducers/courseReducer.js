import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import {REQUEST_ALL} from "../actions/apiActions";

export default (state = initialState.Course, {payload, type}) => {
    switch (type) {
        case actions.FETCH_COURSE_SUCCESSFUL:
            return handleCoursesFetch(state, payload);
        case actions.FETCH_COURSE_NOTE_SUCCESSFUL:
            return handleNotesFetch(state, payload);
        case actions.POST_COURSE_NOTE_SUCCESSFUL:
        case actions.PATCH_COURSE_NOTE_SUCCESSFUL:
            return handleNotesPost(state, payload);
        default:
            return state;
    }
};

const parseTime = (time) => {
    if (time) {
        const [hours, mins] = time.split(":");
        return `T${hours}:${mins}`;
    }
    return null;
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
    let {NewCourseList} = state;
    if (id !== REQUEST_ALL) {
        NewCourseList = updateCourse(NewCourseList, id, data);
    } else {
        data.forEach((course) => {
            course.course_id = 1;
            NewCourseList = updateCourse(NewCourseList, course.course_id, course);
        });
    }
    return {
        ...state,
        NewCourseList,
    };
};

export const updateCourse = (courses, id, course) => ({
    ...courses,
    [id]: {
        "course_id": id,
        "title": course.subject ? course.subject : "",
        "schedule": {
            "start_date": course.start_date,
            "end_date": course.end_date,
            "start_time": parseTime(course.start_time),
            "end_time": parseTime(course.end_time),
            "days": [dayToNum[course.day_of_week]],
        },
        "instructor_id": course.instructor,
        "tuition": course.tuition,
        "capacity": course.max_capacity,
        "grade": 10,
        "description": course.description,
        "room_id": course.room,
        "notes": {},
        "type": "C",
        "subject": "Math",
        "tags": [],
        "roster": course.enrollment_list,
    },
});

const handleNotesPost = (state, {response, ...rest}) => handleNotesFetch(state, {
    "response": {
        ...response,
        "data": [response.data],
    },
    "ownerID": response.data.course,
    ...rest,
});

const handleNotesFetch = (state, {ownerID, response}) => {
    const {data} = response;
    const newState = JSON.parse(JSON.stringify(state));
    data.forEach((note) => {
        newState.NewCourseList[ownerID].notes[note.id] = note;
    });
    return newState;
};

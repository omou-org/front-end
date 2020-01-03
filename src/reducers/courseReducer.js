import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import {REQUEST_ALL} from "../actions/apiActions";

export default (state = initialState.Course, {payload, type}) => {
    switch (type) {
        case actions.POST_CATEGORY_SUCCESS:
            return updateCourseCategories(state, payload, "POST");
        case actions.POST_CATEGORY_FAILED:
            return state;
        case actions.GET_CATEGORY_SUCCESS:
            return updateCourseCategories(state, payload,"GET");
        case actions.PATCH_CATEGORY_SUCCESS:
            return updateCourseCategories(state, payload, "PATCH");
        case actions.FETCH_COURSE_SUCCESSFUL:
            return handleCoursesFetch(state, payload);
        case actions.FETCH_COURSE_NOTE_SUCCESSFUL:
            return handleNotesFetch(state, payload);
        case actions.POST_COURSE_SUCCESSFUL:
            return handleCoursePost(state, payload);
        case actions.POST_COURSE_NOTE_SUCCESSFUL:
        case actions.PATCH_COURSE_NOTE_SUCCESSFUL:
            return handleNotesPost(state, payload);
        case actions.ADD_SMALL_GROUP_REGISTRATION:
            const {new_course} = payload;
            return handleCoursePost(state, new_course);
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS:
            return handleCourseSearchResults(state, payload);
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

const updateCourseCategories = (state, payload, action) => {
    let {response} = payload;
    let {data} = response;
    switch(action){
        case "GET":{
            state["CourseCategories"] = data;
            break;
        }
        case "POST":{
            state["CourseCategories"].push(data);
            break;
        }
        case "PATCH":{
            let categoryList = state["CourseCategories"];
            let updatedCategory = categoryList.find((category)=>{return category.id === data.id});
            state["CourseCategories"] = categoryList.map((category)=>{
                if(category.id === data.id){
                    return updatedCategory;
                } else {
                    return category;
                }
            });
        }
    }
    return {...state};
};

const handleCoursePost = (state, payload) => {
    let {NewCourseList} = state;
    NewCourseList = updateCourse(NewCourseList, payload.id, payload);
    return {
        ...state,
        NewCourseList,
    };
};

const handleCoursesFetch = (state, {id, response}) => {
    let {NewCourseList} = state;
    if (id === REQUEST_ALL) {
        response.data.forEach((course) => {
            NewCourseList = updateCourse(NewCourseList, course.id, course);
        });
    } else if (Array.isArray(id)) {
        response.forEach(({data}) => {
            NewCourseList = updateCourse(NewCourseList, data.id, data);
        });
    } else {
        NewCourseList = updateCourse(NewCourseList, response.data.id, response.data);
    }
    return {
        ...state,
        NewCourseList,
    };
};

export const updateCourse = (courses, id, course) => ({
    ...courses,
    [id]: {
        ...courses[id] || {
            "notes": {},
        },
        "course_id": id,
        "title": course.subject || "",
        "schedule": {
            "start_date": course.start_date,
            "end_date": course.end_date,
            "start_time": parseTime(course.start_time),
            "end_time": parseTime(course.end_time),
            "days": course.day_of_week,
        },
        "instructor_id": course.instructor,
        "tuition": course.tuition,
        "capacity": course.max_capacity,
        "grade": 10,
        "description": course.description,
        "room_id": course.room,
        "type": course.type,
        "category": course.course_category,
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
    if (!newState.NewCourseList[ownerID]) {
        newState.NewCourseList[ownerID] = {};
    }
    if (!newState.NewCourseList[ownerID].notes) {
        newState.NewCourseList[ownerID].notes = {};
    }
    data.forEach((note) => {
        newState.NewCourseList[ownerID].notes[note.id] = note;
    });
    return newState;
};

const handleCourseSearchResults = (state, {response}) => {
    const {data} = response;
    let {NewCourseList} = state;

    data.forEach((course) => {
        NewCourseList = updateCourse(NewCourseList, course.id, course);
    });

    return {
        ...state,
        NewCourseList,
    };
};

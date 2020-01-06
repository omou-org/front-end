import * as types from "./actionTypes";

import axios from "axios";
import {typeToPostActions} from "./rootActions";
import {academicLevelParse} from "../reducers/registrationReducer";

export const instance = axios.create({
    "baseURL": process.env.REACT_APP_DOMAIN,
});

export const MISC_FAIL = 600;
export const REQUEST_ALL = -1;
export const REQUEST_STARTED = 1;

export const wrapGet = (endpoint, [startType, successType, failType], {id, config}) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    "id": id || REQUEST_ALL,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        const requestURL = id ? `${endpoint}${id}/` : endpoint;
        try {
            const response = await instance.get(requestURL, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
                ...(config || {}),
            });
            // successful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapPost = (endpoint, [startType, successType, failType], data) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    response,
                },
            });
        };
        // request starting
        newAction(startType, {});

        try {
            const response = await instance.post(endpoint, data, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // successful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapPatch = (endpoint, [startType, successType, failType], {id, data, config}) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    id,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.patch(`${endpoint}${id}/`, data, config || {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // successful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapDelete = (endpoint, [startType, successType, failType], {id, config}) =>
    async (dispatch, getState) => {
        // creates a new actions based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    id,
                    response,
                },
            });
        };

        //request starting
        newAction(startType, {});

        try{
            const response = await instance.delete(`${endpoint}${id}/`, config || {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // successful response
            newAction(successType, response);
        } catch ({response}) {
            newAction(failType, response);
        }
    };

const courseEndpoint = "/course/catalog/";

export const fetchCourses = (id) =>
    wrapGet(
        courseEndpoint,
        [
            types.FETCH_COURSE_STARTED,
            types.FETCH_COURSE_SUCCESSFUL,
            types.FETCH_COURSE_FAILED,
        ],
        {id:id},
    );
export const submitNewSmallGroup = (form) => {
    const [courseSuccessAction, courseFailAction] = typeToPostActions["course"];
    return (dispatch, getState) => new Promise((resolve) => {
        dispatch({
            type: types.SUBMIT_INITIATED,
            payload: null,
        });
        resolve();
    }).then(() => {
        let newCourse = formatCourse(form["Group Details"],"small_group");
        instance.request({
            "data": newCourse,
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
            "method": "post",
            "url": `${courseEndpoint}` ,
        }).then((courseResponse) => {
                dispatch({
                    type: types.ADD_SMALL_GROUP_REGISTRATION,
                    payload: {formMain: form, new_course: courseResponse.data},
                });
            }, (error) => {
                dispatch({type: courseFailAction, payload: error});
            });
    });
};

export const durationParser = {
    "0.5 Hours": 0.5,
    "1 Hour": 1,
    "1.5 Hours": 1.5,
    "2 Hours": 2,
    0.5 : "0.5 Hours",
    1: "1 Hour",
    1.5 : "1.5 Hours",
    2: "2 Hours",
};

export const formatCourse = (formCourse, type) =>{
    console.log(formCourse);
    let dayOfWeek = ()=>{
        switch(startDate.getDay()){
            case 0:
                return "Sun";
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thu";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
        }
    }
    let startDate = new Date(formCourse["Start Date"]);
    let day = dayOfWeek();
    let endDate = new Date(startDate);
    // 7 days * (number of sessions - 1) = because you can't count the first one
    endDate = new Date(endDate.setDate(startDate.getDate() + 7*(formCourse["Number of Weekly Sessions"])-1));
    let dateFormat = {
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
    };
    startDate = startDate.toLocaleString("sv-SE",dateFormat);
    endDate = endDate.toLocaleString("sv-SE",dateFormat);
    let startString = formCourse["Start Time"];
    let startTime = new Date(startString);
    let endTime = new Date(startString);
    let duration = {
        "0.5 Hours": 0.5,
        "1 Hour": 1,
        "1.5 Hours": 1.5,
        "2 Hours": 2,
    };

    endTime = new Date(endTime.setTime(endTime.getTime() + duration[formCourse["Duration"]]*60*60*1000));
    let timeFormat = {
        hour12:false,
        hour:"2-digit",
        minute:"2-digit",
    };
    endTime = endTime.toLocaleString("eng-US",timeFormat);
    startTime = startTime.toLocaleString("eng-US", timeFormat);

    return {
        "subject": formCourse["Course Name"],
        "course_type": type.toLowerCase(),
        "description": formCourse["Description"],
        "instructor": formCourse["Instructor"].value,
        "day_of_week": day,
        "start_date": startDate,
        "end_date": endDate,
        "start_time": startTime,
        "end_time": endTime,
        "max_capacity": formCourse["Capacity"],
        "course_category": formCourse["Category"].value,
        "academic_level": academicLevelParse[formCourse["Grade Level"]],
        "is_confirmed": formCourse["Did instructor confirm?"] === "Yes, Instructor Confirm",
    };
};

const courseName = (form, type) => {
    if(type === "T"){
        return "1:1 " + form["Instructor"].value + form[""]
    }
};

export const parseTime = (time) =>{
    let formattedTime;
    if(typeof time === "string"){
        let Hour = time.substr(17, 2);
        let to12HourTime = (Hour % 12) || 12;
        let ampm = Hour < 12 ? " am" : " pm";
        formattedTime = to12HourTime + time.substr(19, 3) + ampm;
    } else {
        formattedTime = time;
    }
    return formattedTime;
};

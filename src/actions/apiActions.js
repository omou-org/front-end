import * as types from "./actionTypes";

import axios from "axios";
import {POST_COURSE_SUCCESSFUL} from "./actionTypes";
import {typeToPostActions} from "./rootActions";

export const instance = axios.create({
    "baseURL": process.env.REACT_APP_DOMAIN,
});

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
            const response = await instance.get(requestURL, config || {
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
            // succesful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
            console.log(response);
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
            // succesful request
            newAction(successType, response);
        } catch ({response}) {
            // failed request
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
        let newCourse = formatCourse(form["Group Details"],"T");
        console.log(newCourse);
        instance.request({
            "data": newCourse,
            "headers": {
                "Authorization": `Token ${getState().auth.token}`,
            },
            "method": "post",
            "url": `${courseEndpoint}` ,
        }).then((courseResponse) => {
                console.log(courseResponse);
                dispatch({
                    type: types.ADD_SMALL_GROUP_REGISTRATION,
                    payload: {formMain: form, new_course: courseResponse.data},
                });
            }, (error) => {
                dispatch({type: courseFailAction, payload: error});
            });
    });
};

export const formatCourse = (formCourse, type) =>{
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
    endDate = new Date(endDate.setDate(startDate.getDate() + 7*formCourse["Number of Weekly Sessions"]));
    startDate = startDate.toISOString().substring(0,10);
    endDate = endDate.toISOString().substring(0,10);
    let startTime = new Date(formCourse["Start Time"]);
    let endTime = new Date(startTime);
    let duration = {
        "0.5 Hours": 0.5,
        "1 Hour": 1,
        "1.5 Hours": 1.5,
        "2 Hours": 2,
    };
    endTime = new Date(endTime.setTime(endTime.getTime() + duration[formCourse["Duration"]]*60*60*1000));
    endTime = endTime.toTimeString().substring(0,5);
    startTime = startTime.toTimeString().substring(0,5);

    return {
        "subject": formCourse["Course Name"],
        "type": type,
        "description": formCourse["Description"],
        "instructor": formCourse["Instructor"].value,
        "day_of_week": day,
        "start_date": startDate,
        "end_date": endDate,
        "start_time": startTime,
        "end_time": endTime,
        "max_capacity": formCourse["Capacity"],
        // "course_id": "29"
    };
}

const parseTime = (time) =>{
    let formattedTime;
    if(typeof time === "string"){
        if(time.indexOf("AM") > -1 || time.indexOf("PM") > -1){
            formattedTime = new Date();
            formattedTime.setHours(Number(time.substring(0,time.indexOf(":"))));
            formattedTime.setMinutes(Number(time.substring(time.indexOf(":")+1,time.indexOf(" "))));
            formattedTime.setSeconds(0);
        }
    } else {
        formattedTime = time;
    }
    return formattedTime.toTimeString().substring(0,5)
}
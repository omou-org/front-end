import * as types from "./actionTypes";

import axios from "axios";
import {typeToPostActions} from "./rootActions";
import {academicLevelParse} from "../reducers/registrationReducer";
import {dateFormat, timeFormat} from "../utils";

export const instance = axios.create({
    "baseURL": process.env.REACT_APP_DOMAIN,
});

export const MISC_FAIL = 600;
export const REQUEST_ALL = -1;
export const REQUEST_STARTED = 1;

export const wrapGet = (endpoint, [startType, successType, failType], {id, config}) =>
    async (dispatch) => {
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
            const response = await instance.get(requestURL, config || {});
            // successful request
            newAction(successType, response);
        } catch (error) {
            if (error.response) {
                // failed request
                newAction(failType, error.response);
            } else {
                // coding error
                console.error(error);
            }
        }
    };

    

export const wrapPost = (endpoint, [startType, successType, failType], data) =>
    async (dispatch) => {
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
            const response = await instance.post(endpoint, data);
            // successful request
            newAction(successType, response);
        } catch (error) {
            if (error.response) {
                // failed request
                newAction(failType, error.response);
            } else {
                // coding error
                console.error(error);
            }
        }
    };

export const wrapPatch = (endpoint, [startType, successType, failType], {id, data, config}) =>
    async (dispatch) => {
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
            const response = await instance.patch(`${endpoint}${id}/`, data, config || {});
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

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.delete(`${endpoint}${id}/`, config || {});
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
        {id},
    );
export const submitNewSmallGroup = (form) => {
    const [courseSuccessAction, courseFailAction] = typeToPostActions.course;
    return (dispatch, getState) => new Promise((resolve) => {
        dispatch({
            "type": types.SUBMIT_INITIATED,
            "payload": null,
        });
        resolve();
    }).then(() => {
        const newCourse = formatCourse(form, "small_group");
        instance.request({
            "data": newCourse,
            "method": "post",
            "url": `${courseEndpoint}`,
        }).then((courseResponse) => {
            dispatch({
                "type": types.ADD_SMALL_GROUP_REGISTRATION,
                "payload": {"formMain": form,
                    "new_course": courseResponse.data},
            });
        }, (error) => {
            dispatch({"type": courseFailAction,
                "payload": error});
        });
    });
};

export const durationParser = {
    "0.5 Hours": 0.5,
    "1 Hour": 1,
    "1.5 Hours": 1.5,
    "2 Hours": 2,
    "0.5": "0.5 Hours",
    "1": "1 Hour",
    "1.5": "1.5 Hours",
    "2": "2 Hours",
};

export const formatCourse = (formCourse, type) => {
    const courseInfo = formCourse["Course Info"] || formCourse["Group Details"];
    const tuitionInfo = formCourse["Tuition"] || formCourse["Group Details"];

    const dayOfWeek = () => {
        switch (startDate.getDay()) {
            case 0:
                return "sunday";
            case 1:
                return "monday";
            case 2:
                return "tuesday";
            case 3:
                return "wednesday";
            case 4:
                return "thursday";
            case 5:
                return "friday";
            case 6:
                return "saturday";
        }
    };

    let startDate = new Date(courseInfo["Start Date"]);
    const day = dayOfWeek();
    let endDate = new Date(startDate);
    // 7 days * (number of sessions - 1) = because you can't count the first one
    const numberOfSessions = tuitionInfo["# of Weekly Sessions"];

    endDate = new Date(endDate.setDate(startDate.getDate() + 7 * (numberOfSessions - 1)));

    startDate = startDate.toLocaleString("sv-SE", dateFormat);
    endDate = endDate.toLocaleString("sv-SE", dateFormat);

    const startString = courseInfo["Start Time"];
    let startTime = new Date(startString);
    let endTime = new Date(startString);
    const duration = {
        "0.5 Hours": 0.5,
        "1 Hour": 1,
        "1.5 Hours": 1.5,
        "2 Hours": 2,
    };

    endTime = new Date(endTime.setTime(endTime.getTime() + duration[tuitionInfo.Duration] * 60 * 60 * 1000));

    endTime = endTime.toLocaleString("eng-US", timeFormat);
    startTime = startTime.toLocaleString("eng-US", timeFormat);

    return {
        "subject": courseInfo["Course Name"],
        "course_type": type.toLowerCase(),
        "description": courseInfo.Description,
        "instructor": courseInfo.Instructor.value,
        "day_of_week": day,
        "start_date": startDate,
        "end_date": endDate,
        "start_time": startTime,
        "end_time": endTime,
        "max_capacity": courseInfo.Capacity,
        "is_confirmed": courseInfo["Did instructor confirm?"] === "Yes, Instructor Confirm",
        "sessions": numberOfSessions,
        "course_category": tuitionInfo.Category.value,
        "academic_level": academicLevelParse[tuitionInfo["Grade Level"]],
        "hourly_tuition": tuitionInfo["Hourly Tuition"],
        "total_tuition": tuitionInfo["Total Tuition"],
    };
};

const courseName = (form, type) => {
    if (type === "T") {
        return `1:1 ${form.Instructor.value}${form[""]}`;
    }
};

export const parseTime = (time) => {
    let formattedTime;
    if (typeof time === "string") {
        const Hour = time.substr(17, 2);
        const to12HourTime = (Hour % 12) || 12;
        const ampm = Hour < 12 ? " am" : " pm";
        formattedTime = to12HourTime + time.substr(19, 3) + ampm;
    } else {
        formattedTime = time;
    }
    return formattedTime;
};

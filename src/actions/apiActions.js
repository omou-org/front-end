import * as types from "./actionTypes";
import {dateFormat, DayConverter, durationParser, timeFormat} from "utils";
import {academicLevelParse} from "reducers/registrationReducer";
import axios from "axios";
import {typeToPostActions} from "./rootActions";

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
    async (dispatch) => {
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
        {id}
    );
export const submitNewSmallGroup = (form) => {
    const [, courseFailAction] = typeToPostActions.course;
    return (dispatch) => new Promise((resolve) => {
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
                "payload": {
                    "formMain": form,
                    "new_course": courseResponse.data,
                },
            });
        }, (error) => {
            dispatch({
                "type": courseFailAction,
                "payload": error,
            });
        });
    });
};

export const formatCourse = (formCourse, type) => {
    const courseInfo = formCourse["Course Info"] || formCourse["Group Details"];
    const tuitionInfo = formCourse.Tuition || formCourse["Group Details"];

    let startDate = new Date(courseInfo["Start Date"]);
    const day = DayConverter[startDate.getDay()];
    let endDate = new Date(startDate);
    const numberOfSessions = tuitionInfo["# of Weekly Sessions"];

    endDate = new Date(endDate.setDate(startDate.getDate() + 7 * (numberOfSessions - 1)));

    startDate = startDate.toLocaleString("sv-SE", dateFormat);
    endDate = endDate.toLocaleString("sv-SE", dateFormat);

    const startString = courseInfo["Start Time"];
    let startTime = new Date(startString);
    let endTime = new Date(startString);

    endTime = new Date(endTime.setTime(endTime.getTime() + durationParser[tuitionInfo.Duration] * 60 * 60 * 1000));

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

export const parseTime = (time) => {
    if (typeof time !== "string") {
        return time;
    }
    const Hour = time.substr(17, 2);
    const to12HourTime = (Hour % 12) || 12;
    const ampm = Hour < 12 ? " am" : " pm";
    return to12HourTime + time.substr(19, 3) + ampm;
};

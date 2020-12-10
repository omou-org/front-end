import {instance} from "actions/apiActions";
import {useCallback, useState} from "react";
import {useHistory} from "react-router-dom";
import moment from "moment";

export const USER_TYPES = {
    "admin": "ADMIN",
    "instructor": "INSTRUCTOR",
    "parent": "PARENT",
    "receptionist": "RECEPTIONIST",
    "student": "STUDENT",
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

export const timeFormat = {
    "hour12": false,
    "hour": "2-digit",
    "minute": "2-digit",
};

export const dateFormat = {
    "year": "numeric",
    "month": "2-digit",
    "day": "2-digit",
};

export const dateTimeFormat = {
    ...timeFormat,
    ...dateFormat,
};

export const DayConverter = {
    "0": "sunday",
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
    "6": "saturday",
};

export const DayAbbreviation = {
    "sunday": "S",
    "monday": "M",
    "tuesday": "T",
    "wednesday": "W",
    "thursday": "Th",
    "friday": "F",
    "saturday": "Sa",
}

// Determines if availabilities for a course are at the same time 
// for each day they are held
// ex. M/W 10:00 AM - 11:00 AM -> true
// vs.
// M 10:00 AM - 11:00 AM and W 2:00 PM - 3:00 PM -> false
export const sessionsAtSameTimeInMultiDayCourse = (availabilityList) => {
    let start = availabilityList[0].startTime;
    let end = availabilityList[0].endTime;
  
    for (let availability of availabilityList) {
      if (availability.startTime !== start || availability.endTime !== end) {
        return false;
      }
    }
    return true;
  }

/**
 * Pads a number to the desired length, filling with leading zeros
 * @param {Number} integer Number to pad
 * @param {String} length Minimum number of digits
 * @returns {String} Padded integer
 */
const padNum = (integer, length) => String(integer).padStart(length, "0");

export const isExistingTutoring = (tutoringCourseID) =>
    String(tutoringCourseID).indexOf("T") === -1;

export const dateFormatter = (date) =>
    new Date(date.replace(/-/gu, "/")).toDateString()
        .substr(3);

export const courseDateFormat = ({schedule, is_confirmed}) => ({
    "days": DayConverter[new Date(schedule.start_date).getDay()],
    "end_date": dateFormatter(schedule.end_date),
    "end_time": new Date(`2020-01-01${schedule.end_time}`).toLocaleTimeString(
        "eng-US",
        timeFormat
    ),
    is_confirmed,
    "start_date": dateFormatter(schedule.start_date),
    "start_time": new Date(`2020-01-01${schedule.start_time}`).toLocaleTimeString(
        "eng-US",
        timeFormat
    ),
});

/**
 * Converts a datetime to a date - useful for date specific comparisons
 * @param {Date} date Date to convert
 * @returns {Date} date object without the time
 */
export const dateTimeToDate = (date) => 
    moment(date).format('YYYY/MM/DD');
    

export const courseDataParser = (course) => {
    const timeOptions = {
        "hour": "2-digit",
        "minute": "2-digit",
    };
    const dateOptions = {
        "year": "numeric",
        "month": "numeric",
        "day": "numeric",
    };

    const {schedule, status, tuition, course_id} = course;
    const DaysString = schedule.days;

    const endDate = new Date(schedule.end_date + schedule.end_time),
        startDate = new Date(schedule.start_date + schedule.start_time);

    return {
        "date": `${startDate.toLocaleDateString(
            "en-US",
            dateOptions
        )} - ${endDate.toLocaleDateString("en-US", dateOptions)}`,
        "day": DaysString,
        "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
        "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
        status,
        tuition,
        course_id,
    };
};

export const combineDateAndTime = (date, time) =>
    new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
    );

export const sessionPaymentStatus = (session, enrollment) => {

    
    const session_date = moment(session.startDatetime).format('YYYY/MM/DD')
    const last_session = moment(
            enrollment.lastPaidSessionDatetime).format('YYYY/MM/DD')
        
    const first_payment = moment
            (enrollment.paymentList[0].createdAt).format('YYYY/MM/DD')
        ;

    const sessionIsBeforeLastPaidSession = session_date <= last_session;
    const sessionIsLastPaidSession = session_date === last_session;
    const thereIsPartiallyPaidSession = !Number.isInteger(
        enrollment.sessions_left
    );
    const classSessionNotBeforeFirstPayment = session_date >= first_payment;

    if (
        sessionIsBeforeLastPaidSession &&
      !thereIsPartiallyPaidSession &&
      classSessionNotBeforeFirstPayment
    ) {
        return "Paid";
    } else if (
        sessionIsLastPaidSession &&
      thereIsPartiallyPaidSession &&
      thereIsPartiallyPaidSession
    ) {
        return "Partial";
    } else if (!classSessionNotBeforeFirstPayment) {
        return "NA";
    }
    return "Unpaid";
};

export const courseToRegister = (enrollment, course, student) => ({
    "Enrollment": enrollment.enrollment_id,
    "Course Selection": {
        "Course": {
            "label": course.title,
            "value": Number(course.course_id),
        },
    },
    "Course Selection_validated": {
        "Course": true,
    },
    "Student": {
        "Student": {
            "label": student.name,
            "value": student.user_id,
        },
    },
    "Student_validated": {
        "Student": true,
    },
    "Student Information": {},
    "activeSection": "Student",
    "activeStep": 0,
    "conditional": "",
    "existingUser": false,
    "form": course.course_type,
    "hasLoaded": true,
    "preLoaded": false,
    "submitPending": false,
});

export const truncateStrings = (string, length) =>
    string.length > length ? `${string.slice(0, length - 3).trim()}...` : string;

export const distinctObjectArray = (array) => {
    const result = [];
    const map = new Map();

    for (const item of array) {
        if (!map.has(item.label)) {
            map.set(item.label, true); // set any value to Map
            result.push({
                "label": item.label,
                "value": item.value,
            });
        }
    }
    return result;
};
// Changes incoming payment options to something prettier.
export const paymentToString = (string) => {
    switch (string) {
        case "intl_credit_card":
            return "International Credit Card";
        case "credit_card":
            return "Credit Card";
        default:
            return capitalizeString(string);
    }
};

export const gradeOptions = [
    {
        "label": "Elementary School",
        "value": "elementary_lvl",
    },
    {
        "label": "Middle School",
        "value": "middle_lvl",
    },
    {
        "label": "High School",
        "value": "high_lvl",
    },
    {
        "label": "College",
        "value": "college_lvl",
    },
];

export const gradeLvl = (gradelevel) => {
    switch(gradelevel) {
      case "ELEMENTARY_LVL":
        return "Elementary School";
      case "MIDDLE_LVL": 
        return "Middle School";
      case "HIGH_LVL":
        return "High School";
      case "COLLEGE_LVL":
        return "College";
      default:
        return;
    }
  }

/**
 * Converts a time of day to a backend-friendly format
 * @param {Date} time Time of day to convert
 * @returns {String} Backend-friendly formatted time
 */
export const toApiTime = (time) =>
    `${padNum(time.getHours(), 2)}:${padNum(time.getMinutes(), 2)}`;

/**
 * Converts a date to a backend-friendly format
 * @param {Date} date Date to convert
 * @returns {String} Backend-friendly formatted date
 */
export const toApiDate = (date) =>
    `${date.getFullYear()}-${padNum(date.getMonth() + 1, 2)}-${padNum(
        date.getDate(),
        2
    )}`;

/**
 * Checks if an instructor has conflicts with a certain time
 * @param {Number} instructorID ID of instructor to check
 * @param {Date} start Start date and time
 * @param {Date} end End date and time
 * @returns {Object} "course" and "session" responses of checks, or null if it failed
 */
export const instructorConflictCheck = async (instructorID, start, end) => {
    const sessionParams = {
        "date": toApiDate(start),
        "end_time": toApiTime(end),
        "start_time": toApiTime(start),
    };

    const courseParams = {
        "end_date": toApiDate(end),
        "end_time": toApiTime(end),
        "start_date": toApiDate(start),
        "start_time": toApiTime(start),
    };

    try {
        const [sessionResponse, courseResponse] = await Promise.all([
            instance.get(`/scheduler/validate/session/${instructorID}`, {
                "params": sessionParams,
            }),
            instance.get(`/scheduler/validate/course/${instructorID}`, {
                "params": courseParams,
            }),
        ]);
        return {
            "course": courseResponse,
            "session": sessionResponse,
        };
    } catch (error) {
        return null;
    }
};

export const capitalizeString = (string) =>
    string.replace(/^\w/, (lowerCaseString) => lowerCaseString.toUpperCase());

export const startAndEndDate = (start, end, pacific) => {
    let endDate, getEndDate, setDate, startDate;

    if (!pacific) {
        startDate = start.toString().substr(3, 13);
        getEndDate = end.getDate();
        setDate = end.setDate(getEndDate - 1);
        endDate = new Date(setDate).toString()
            .substr(3, 13);
    } else {
        startDate = start
            .toISOString()
            .substring(0, start.toISOString().indexOf("T"));
        endDate = end.toISOString().substring(0, end.toISOString().indexOf("T"));
    }

    return `${startDate} - ${endDate}`;
};

export const durationStringToNum = {
    "0.5 Hours": 0.5,
    "1 Hour": 1,
    "1.5 Hours": 1.5,
    "2 Hours": 2,
};

/** 
 * @description returns the the time sorted from least to greatest
 * @param {String} firstTimeObject - first object with time key to use in sorted logic for initial comparison
 * @param {String} secondTimeObject - second object with time key to use in sorted logic to compare against initial value
 * @returns {Object} "Sorted object based on time"
*/

export const sortTime = (firstTimeObject, secondTimeObject) => {
    if (moment(firstTimeObject).isBefore(moment(secondTimeObject))) return 1
    if (moment(firstTimeObject).isAfter(moment(secondTimeObject))) return -1
    return 0
};
/**
 * @description returns the upcoming session from a list of sessions
 * @param {Array} sessions - list of sessions to search through
 * @param {Number} courseID - id of the course we want to look at
 * @returns {Object} "session" that's upcoming relative to today's date
 */
export const upcomingSession = (sessions, courseID) =>
    // eslint-disable-next-line eqeqeq
    sessions.filter((session) => session.course == courseID)
        .sort((sessionA, sessionB) =>
            new Date(sessionA.start_datetime) - new Date(sessionB.start_datetime))
        .find(({start_datetime}) => new Date(start_datetime) > Date.now());

/**
 * @description calculate amount paid towards enrollment
 * @param {Object}  courseObject- course object that has schedule
 * @param {Number} numSessions- Total number of session
 * @returns "Amount paid per enrollment"
 */
export const tuitionAmount = (courseObject, numSessions) => {
    const {schedule, hourly_tuition} = courseObject;
    const {end_time, start_date, start_time} = schedule;
    const HOUR = 36e5;

    // Turns string object into Date string
    const end = `${start_date}${end_time}:00Z`,
        start = `${start_date}${start_time}:00Z`,
        duration = Math.abs(new Date(end) - new Date(start)) / HOUR;

    return (hourly_tuition * duration * numSessions).toFixed(2);
};

/**
 * @description calculate amount towards enrollment based on new course object
 * @param {Object} courseObject - course object with a start and an end time and hourly tuition
 * @param {Number} numSessions - total number of sessions
 * @returns "Amount paid"
 * */
export const getTuitionAmount = (courseObject, numSessions) => {
    const {availabilityList, hourlyTuition} = courseObject;
    const duration = moment.duration(moment("2020-01-01T" + availabilityList[0].endTime).diff(moment("2020-01-01T" + availabilityList[0].startTime))).asHours();
    return (hourlyTuition * duration * numSessions).toFixed(2);
};

export const initials = (first, last) => first && last ?
    first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase() : "";

export const useGoToRoute = () => {
    const history = useHistory();
    const goToRoute = useCallback(
        (route) => {
            history.push(route);
        },
        [history]
    );
    return goToRoute;
};

export const removeDashes = (phoneNumber) => phoneNumber.replace(/-/ug, "");

/**
 * Removes duplicate values from an array
 * @param {Array} array Array to de-duplicate
 */
export const uniques = (array) => array.filter(
    (element, index, filteredArray) => filteredArray.indexOf(element) === index
);

/***
 * Returns full name given a user object
 * @param {Object} user
 */
export const fullName = ({firstName, lastName}) => `${firstName} ${lastName}`;

/**
 * Returns if 2 arrays are the same
 * @param {Array} arr1
 * @param {Array} arr2
 * */
export const arraysMatch = function (arr1, arr2) {
    if (!arr1 || !arr2) return false;
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;

};
/**
 * Returns duration in hours using Moment.js
 * @param startDatetime
 * @param endDatetime
 * */
export const getDuration = (startDatetime, endDatetime) =>
    moment.duration(moment(endDatetime).diff(moment(startDatetime))).asHours();

/**
 * @description set year, month, date, and seconds to be the same default value - useful for comparing hh:mm only
 * @returns moment
 * */
export const setCurrentDate = (time) => {
    if (time) {
        // const formattedTime = typeof time === "string" ? moment(time, 'h:mm') : time.format('h:mm');
        return moment(time, 'h:mm');
    }
    return time;
};

/**
 * @description check if there are any time conflicts within a list of time segments
 * @param {Array} timeSegments array of time segments = array of valid start and end times
 * @return Boolean error message if there's a conflict or false if there's no conflicts
 * */
export const checkTimeSegmentOverlap = (timeSegments) => {
    if (timeSegments.length === 1) return false;

    timeSegments.sort((timeSegment1, timeSegment2) =>
        setCurrentDate(timeSegment1[0]).diff(setCurrentDate(timeSegment2[0]))
    );

    const validTime = (time) => {
        if (typeof time === "string") {
            return moment(time);
        }
        return time;
    }
    const timeSegmentString = ([startTime, endTime]) =>
        `${validTime(startTime).format("hh:mm A")} - ${validTime(endTime).format("hh:mm A")}`;

    for (let i = 0; i < timeSegments.length - 1; i++) {
        const currentStartTime = setCurrentDate(timeSegments[i][0]);
        const currentEndTime = setCurrentDate(timeSegments[i][1]);
        const nextStartTime = setCurrentDate(timeSegments[i + 1][0]);

        if (currentEndTime > nextStartTime || nextStartTime === currentStartTime) {
            return `Whoops. ${timeSegmentString(timeSegments[i])} has a conflict with
				${timeSegmentString(timeSegments[i + 1])}! Please correct it.`;
        }
    }

    return false;
};

/**
 * @description list any time conflicts within a list of time segments
 * @param {Array} timeSegments array of time segments = array of valid start and end times
 * @return Boolean error message if there's a conflict or false if there's no conflicts
 * */
export const listTimeSegmentOverlaps = (timeSegments) => {
    if (timeSegments.length === 1) return false;

    timeSegments.sort((timeSegment1, timeSegment2) =>
        setCurrentDate(timeSegment1[0]).diff(setCurrentDate(timeSegment2[0]))
    );

    const validTime = (time) => {
        if (typeof time === "string") {
            return moment(time);
        }
        return time;
    }
    const timeSegmentString = ([startTime, endTime]) =>
        `${validTime(startTime).format("hh:mm A")} - ${validTime(endTime).format("hh:mm A")}`;

    for (let i = 0; i < timeSegments.length - 1; i++) {
        const currentStartTime = moment(timeSegments[i][0]);
        const currentEndTime = moment(timeSegments[i][1]);
        const nextStartTime = moment(timeSegments[i + 1][0]);

        if (currentEndTime > nextStartTime || nextStartTime === currentStartTime) {
            return `Whoops. ${timeSegmentString(timeSegments[i])} has a conflict with
				${timeSegmentString(timeSegments[i + 1])}! Please correct it.`;
        }
    }

    return false;
};

/**
 * @description check if 2 objects are equal including sub objects
 * @param {Object} object1
 * @param {Object} object2
 * @return {Boolean}
 * */
export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjects = isObject(val1) && isObject(val2);
		if (
			areObjects && !deepEqual(val1, val2) ||
			!areObjects && val1 !== val2
		) {
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

// Hook
export function useSessionStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.sessionStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

import {instance} from "actions/apiActions";

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

/**
 * Pads a number to the desired length, filling with leading zeros
 * @param {Number} integer Number to pad
 * @param {String} length Minimum number of digits
 * @returns {String} Padded integer
 */
const padNum = (integer, length) => String(integer).padStart(length, "0");

export const isExistingTutoring = (tutoringCourseID) => String(tutoringCourseID).indexOf("T") === -1;

export const dateFormatter = (date) =>
    new Date(date.replace(/-/ug, "/"))
        .toDateString()
        .substr(3);

export const courseDateFormat = ({ schedule, is_confirmed }) => ({
    "days": DayConverter[new Date(schedule.start_date).getDay()],
    "end_date": dateFormatter(schedule.end_date),
    "end_time": new Date(`2020-01-01${schedule.end_time}`)
        .toLocaleTimeString("eng-US", timeFormat),
    is_confirmed,
    "start_date": dateFormatter(schedule.start_date),
    "start_time": new Date(`2020-01-01${schedule.start_time}`)
        .toLocaleTimeString("eng-US", timeFormat),
});

/**
 * Converts a datetime to a date - useful for date specific comparisons
 * @param {Date} date Date to convert
 * @returns {Date} date object without the time
 */
export const dateTimeToDate = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

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

    let { schedule, status, tuition, course_id } = course;
    const DaysString = schedule.days;

    const endDate = new Date(schedule.end_date + schedule.end_time),
        startDate = new Date(schedule.start_date + schedule.start_time);

    return {
        "date": `${startDate.toLocaleDateString("en-US", dateOptions)} - ${endDate.toLocaleDateString("en-US", dateOptions)}`,
        "day": DaysString,
        "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
        "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
        status,
        tuition,
        "course_id": course_id
    };
};

export const combineDateAndTime = (date, time) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(),
        time.getHours(), time.getMinutes());


export const sessionPaymentStatus = (session, enrollment) => {
    const session_date = dateTimeToDate(new Date(session.start_datetime)),
        last_session = dateTimeToDate(new Date(enrollment.last_paid_session_datetime)),
        first_payment = dateTimeToDate(new Date(enrollment.payment_list[0].created_at));

    const sessionIsBeforeLastPaidSession = session_date <= last_session;
    const sessionIsLastPaidSession = session_date == last_session;
    const thereIsPartiallyPaidSession = !Number.isInteger(enrollment.sessions_left);
    const classSessionNotBeforeFirstPayment = session_date >= first_payment;

    if (sessionIsBeforeLastPaidSession && !thereIsPartiallyPaidSession && classSessionNotBeforeFirstPayment) {
        return "Paid";
    } else if (sessionIsLastPaidSession && thereIsPartiallyPaidSession && thereIsPartiallyPaidSession) {
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


export const truncateStrings = (string, length) => string.length > length
    ? `${string.slice(0, length - 3).trim()}...`
    : string;


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
            return capitalizeString(string)
    }
};

export const gradeOptions = [
    {
        "label": "Elementary School",
        "value": "elementary_lvl"
    },
    {
        "label": "Middle School",
        "value": "middle_lvl"
    },
    {
        "label": "High School",
        "value": "high_lvl"
    },
    {
        "label": "College",
        "value": "college_lvl"
    },
];


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
    `${date.getFullYear()}-${padNum(date.getMonth() + 1, 2)}-${padNum(date.getDate(), 2)}`;

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
            instance.get(
                `/scheduler/validate/session/${instructorID}`,
                { "params": sessionParams },
            ),
            instance.get(
                `/scheduler/validate/course/${instructorID}`,
                { "params": courseParams },
            ),
        ]);
        return {
            "course": courseResponse,
            "session": sessionResponse,
        };
    } catch (error) {
        return null;
    }
};

export const capitalizeString = (string) => string
    .replace(/^\w/, (lowerCaseString) => lowerCaseString.toUpperCase());

export const startAndEndDate = (start, end, pacific) => {
    let endDate, getEndDate, setDate, startDate;

    if (!pacific) {
        startDate = start.toString().substr(3, 13);
        getEndDate = end.getDate();
        setDate = end.setDate(getEndDate - 1);
        endDate = new Date(setDate).toString()
            .substr(3, 13);
    } else {
        startDate = start.toISOString().substring(0, start.toISOString().indexOf("T"));
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
 * @description returns the upcoming session from a list of sessions
 * @param {Array} sessions - list of sessions to search through
 * @param {Number} courseID - id of the course we want to look at
 * @returns {Object} "session" that's upcoming relative to today's date
 */
export const upcomingSession = (sessions, courseID) => sessions.filter((session) => ((session.course == courseID) &&
    dateTimeToDate(new Date(session.start_datetime)) >= dateTimeToDate(new Date())))
    .sort((sessionA, sessionB) => (sessionA - sessionB))[0];


/**
 * @description calculate amount paid towards enrollment
 * @param {Object}  courseObject- course object that has schedule
 * @param {Number} numSessions- Total number of session
 * @returns "Amount paid per enrollment"
 */

export const tuitionAmount = (courseObject, numSessions) => {
    let { schedule, hourly_tuition } = courseObject;
    let { end_time, start_date, start_time } = schedule;
    const HOUR = 36e5;

    // Turns string object into Date string
    let end = `${start_date}${end_time}:00Z`,
        start = `${start_date}${start_time}:00Z`,
        duration = Math.abs(new Date(end) - new Date(start)) / HOUR;


    return (hourly_tuition * duration * numSessions).toFixed(2)

};


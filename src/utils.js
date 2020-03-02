import React from "react";

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

export const isExistingTutoring = (tutoringCourseID) => String(tutoringCourseID).indexOf("T") === -1;

export const dateFormatter = (date) =>
    new Date(date.replace(/-/ug, "/"))
        .toDateString()
        .substr(3);

export const courseDateFormat = ({schedule, is_confirmed}) => ({
    "days": DayConverter[new Date(schedule.start_date).getDay()],
    "end_date": dateFormatter(schedule.end_date),
    "end_time": new Date(`2020-01-01${schedule.end_time}`)
        .toLocaleTimeString("eng-US", timeOptions),
    is_confirmed,
    "start_date": dateFormatter(schedule.start_date),
    "start_time": new Date(`2020-01-01${schedule.start_time}`)
        .toLocaleTimeString("eng-US", timeOptions),
});

export const sessionPaymentStatus = (session, enrollment) => {
    const session_date = new Date(session.start_datetime),
        last_session = new Date(enrollment.last_paid_session_datetime);

    const sessionIsBeforeLastPaidSession = session_date <= last_session;
    const sessionIsLastPaidSession = session_date == last_session;
    const thereIsPartiallyPaidSession = !Number.isInteger(enrollment.sessions_left);
    const classSessionNotBeforeFirstPayment = session_date >= new Date(enrollment.payment_list[0].created_at);

    if( sessionIsBeforeLastPaidSession && !thereIsPartiallyPaidSession && classSessionNotBeforeFirstPayment){
        return "Paid";
    } else if ( sessionIsLastPaidSession && thereIsPartiallyPaidSession && thereIsPartiallyPaidSession){
        return "Partial";
    } else if (!classSessionNotBeforeFirstPayment ) {
        return "NA"
    } else {
        return "Unpaid";
    }
};

export const courseToRegister = (enrollment, course, student) => ({
    "Enrollment": enrollment.enrollment_id,
    "Course Selection": {
        "Course": {
            label: course.title,
            value: Number(course.course_id),
        },
    },
    "Course Selection_validated": {
        "Course": true,
    },
    "Student": {
        "Student": {
            label: student.name,
            value: student.user_id,
        }
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

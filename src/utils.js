import {DayConverter} from "./components/FeatureViews/Accounts/TabComponents/EnrollmentView";
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

const dateOptions = {
    "day": "numeric",
    "month": "short",
    "year": "numeric",
};

export const dateFormatter = (date) => {
    return new Date(date.replace(/-/g, '\/'))
        .toDateString().substr(3);
};

export const courseDateFormat = (course) => {
    let start_date = dateFormatter(course.schedule.start_date),
        end_date = dateFormatter(course.schedule.end_date),
        start_time = new Date("2020-01-01" + course.schedule.start_time)
            .toLocaleTimeString('eng-US', timeFormat),
        end_time = new Date("2020-01-01" + course.schedule.end_time)
            .toLocaleTimeString('eng-US', timeFormat),
        days = DayConverter[new Date(course.schedule.start_date).getDay()];

    return {
        "end_date": end_date,
        "end_time": end_time,
        "start_date": start_date,
        "start_time": start_time,
        "days": days,
        "is_confirmed": course.is_confirmed,
    };
};

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

const courseToRegister = (enrollment, course, student) => ({
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

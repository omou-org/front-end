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

const dateTimeToDate = (date) => new Date(Date.UTC(date.getFullYear(),date.getMonth(), date.getDate()));

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

const isoStringToUTCDate = (dateString) => {
    let newDate = new Date("2020-01-01");
    console.log(Number(dateString.substring(5,7)));
    newDate.setFullYear(Number(dateString.substring(0,4)));
    newDate.setMonth(Number(dateString.substring(5,7)));
    newDate.setDate(Number(dateString.substring(8,10)));

    let newDateObject = new Date(dateString);
    return newDateObject;
};

export const startAndEndDate = (start, end, pacific) => {
    let startDate, getEndDate, setDate, endDate;

    if(!pacific){
        startDate = start.toString().substr(3, 13);
        getEndDate = end.getDate();
        setDate = end.setDate(getEndDate - 1);
        endDate = new Date(setDate).toString().substr(3, 13);
    } else {
        startDate = start.toISOString().substring(0,start.toISOString().indexOf("T"));
        endDate = end.toISOString().substring(0,end.toISOString().indexOf("T"));
        console.log(isoStringToUTCDate(startDate));
    }

    return `${startDate} - ${endDate}`
};
export const capitalizeString = (string) => {
    return string.replace(/^\w/, lowerCaseString => lowerCaseString.toUpperCase())
}

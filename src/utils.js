import {DayConverter} from "./components/FeatureViews/Accounts/TabComponents/CourseSessionStatus";

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
    "hour12": true,
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
            .toLocaleTimeString('eng-US', timeOptions),
        end_time = new Date("2020-01-01" + course.schedule.end_time)
            .toLocaleTimeString('eng-US', timeOptions),
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


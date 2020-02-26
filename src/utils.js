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

export const isExistingTutoring = (tutoringCourseID) => String(tutoringCourseID).indexOf("T") === -1;

export const dateFormatter = (date) => {
    return new Date(date.replace(/-/g, '\/'))
        .toDateString().substr(3);
}

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


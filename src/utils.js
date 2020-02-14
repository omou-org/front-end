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

export const courseDateFormat = (course) => {
    let start_date = new Date(course.schedule.start_date.replace(/-/g, '\/'))
            .toDateString().substr(3),
        end_date = new Date(course.schedule.end_date.replace(/-/g, '\/'))
            .toDateString().substr(3),
        start_time = new Date("2020-01-01"+course.schedule.start_time)
            .toLocaleTimeString('eng-US', timeOptions),
        end_time = new Date("2020-01-01"+course.schedule.end_time)
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


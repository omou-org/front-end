const timeOptions = {
    "hour": "2-digit",
    "hour12": true,
    "minute": "2-digit",
};

export const DayConverter = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
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

export const truncateStrings = (string, length) => string.length > length
    ? `${string.slice(0, length - 3).trim()}...`
    : string;

const timeOptions = {
    "hour": "2-digit",
    "minute": "2-digit",
};

const dateOptions = {
    "day": "numeric",
    "month": "short",
    "year": "numeric",
};

export const courseDataParser = (course) => {
    const startDate = new Date(
        course.schedule.start_date + course.schedule.start_time
    );
    const endDate = new Date(
        course.schedule.end_date + course.schedule.end_time
    );

    return {
        "days": course.schedule.days,
        "endDate": endDate.toLocaleDateString("en-US", dateOptions),
        "endTime": endDate.toLocaleTimeString("en-US", timeOptions),
        "startDate": startDate.toLocaleDateString("en-US", dateOptions),
        "startTime": startDate.toLocaleTimeString("en-US", timeOptions),
    };
};

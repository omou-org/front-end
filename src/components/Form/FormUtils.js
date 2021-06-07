import { instance } from 'actions/apiActions';
import { isFail } from 'actions/hooks';
import { capitalizeString, DayConverter } from 'utils';

/**
 * @description: parses a form to convert start and end time from a form to a duration
 * */
export const durationParser = ({ start, end }, fieldTitle, field) => {
    const durationString = {
        0.5: '0.5 Hours',
        1: '1 Hour',
        1.5: '1.5 Hours',
        2: '2 Hours',
    };
    if (fieldTitle === 'Duration') {
        const startTime = timeParser(start);
        const endTime = timeParser(end);
        const duration = Math.abs(endTime - startTime) / 3600000;
        // If it's a field, return it in a format where it can be selected, if not, just return the duration string
        return field
            ? {
                  duration: durationString[duration] || '1 Hour',
                  options: ['1 Hour', '1.5 Hours', '0.5 Hours', '2 Hours'],
              }
            : durationString[duration];
    }
    return null;
};

/** *
 * @description: parses a time string to become a date object
 * @param: timeString
 * */
export const timeParser = (timeString) => {
    const time = new Date();
    if (typeof timeString === 'string') {
        let AMPM = timeString.substring(timeString.length - 3);
        AMPM.indexOf('PM') > -1 ? (AMPM = 12) : (AMPM = 0);
        time.setHours(
            AMPM +
                Number(
                    timeString.substring(
                        timeString.indexOf('T') + 1,
                        timeString.indexOf(':')
                    )
                )
        );
        time.setMinutes(
            Number(
                timeString.substring(
                    timeString.indexOf(':') + 1,
                    timeString.indexOf(':') + 3
                )
            )
        );
        time.setSeconds(0);
        return time;
    }
    return timeString;
};

/**
 * @description: parses form to create discount payload
 * */
export const createDiscountPayload = (form) => {
    const discountType = form['Discount Description']['Discount Type'];
    const discountPayload = {
        name: form['Discount Description']['Discount Name'],
        description: form['Discount Description']['Discount Description'],
        amount: form['Discount Amount']['Discount Amount'],
        amount_type: form['Discount Amount']['Discount Type'].toLowerCase(),
        active: true,
    };
    switch (discountType) {
        case 'Bulk Order Discount': {
            return {
                ...discountPayload,
                num_sessions:
                    form['Discount Rules']['Minimum number of sessions'],
            };
        }
        case 'Date Range Discount': {
            const startDate = dateParser(
                form['Discount Rules']['Discount Start Date']
            ).substring(0, 10);
            const endDate = dateParser(
                form['Discount Rules']['Discount End Date']
            ).substring(0, 10);
            return {
                ...discountPayload,
                start_date: startDate,
                end_date: endDate,
            };
        }
        case 'Payment Method Discount': {
            return {
                ...discountPayload,
                payment_method:
                    form['Discount Rules']['Payment Method'].toLowerCase(),
            };
        }
        // no default
    }
};

export const dateParser = (date) => {
    const dateSetting = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(date).toLocaleTimeString('sv-SE', dateSetting);
};

export const dayOfWeek = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
};

export const weeklySessionsParser = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (7 * 24 * 60 * 60 * 1000)) + 1;
};

export const convertTimeStrToDate = (time) =>
    new Date(`01/01/2020 ${time.substr(1, 5)}`);

export const categorySelectObject = (category) => {
    if (category) {
        return {
            value: category.id,
            label: category.name,
        };
    }
    return null;
};

export const gradeConverter = (grade) => {
    if (grade < 6) {
        return 'Elementary School';
    } else if (5 < grade && grade < 9) {
        return 'Middle School';
    } else if (8 < grade && grade < 13) {
        return 'High School';
    }
    return 'College';
};

export const formatDate = (start, end) => {
    const MonthConverter = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
    };

    const date = new Date(start);
    const dateNumber = date.getDate();
    const dayOfWeek = date.getDay();
    const startMonth = date.getMonth();
    // Gets days
    const Days = DayConverter[dayOfWeek];
    // Gets months
    const Month = MonthConverter[startMonth];

    // Start times and end times variable
    const startTime = new Date(start).toTimeString();
    const endTime = new Date(end).toTimeString();
    function timeConverter(time) {
        const Hour = time.substr(0, 2);
        const to12HourTime = Hour % 12 || 12;
        const ampm = Hour < 12 ? ' am' : ' pm';
        time = to12HourTime + time.substr(2, 3) + ampm;
        return time;
    }

    return `${capitalizeString(
        Days
    )}, ${Month} ${dateNumber} <br> ${timeConverter(
        startTime
    )} - ${timeConverter(endTime)}`;
};

export const loadEditCourseState = (course, inst) => ({
    'Course Info': {
        'Course Name': course.title,
        Description: course.description,
        Instructor: inst
            ? {
                  value: course.instructor_id,
                  label: `${inst.name} - ${inst.email}`,
              }
            : null,
        'Grade Level':
            course.academic_level &&
            course.academic_level.charAt(0).toUpperCase() +
                course.academic_level.slice(1),
        Category: categorySelectObject(course.category),
        'Start Date': formatDate(course.schedule.start_date),
        Duration: durationParser(
            {
                start: course.schedule.start_time,
                end: course.schedule.end_time,
            },
            'Duration',
            false
        ),
        'Start Time': convertTimeStrToDate(course.schedule.start_time),
        'Number of Weekly Sessions': weeklySessionsParser(
            course.schedule.start_date,
            course.schedule.end_date
        ),
        Capacity: course.capacity,
    },
    Tuition: {
        'Hourly Tuition': course.hourly_tuition,
        'Total Tuition': course.total_tuition,
    },
    preLoaded: true,
});

export function arr_diff(a1, a2) {
    const a = [],
        diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let j = 0; j < a2.length; j++) {
        if (a[a2[j]]) {
            delete a[a2[j]];
        } else {
            a[a2[j]] = true;
        }
    }

    for (const k in a) {
        diff.push(k);
    }

    return diff;
}

// Function definition with passing two arrays
export const findCommonElement = (array1, array2) =>
    array1.some((item) => array2.includes(item));

/**
 * @description Searches for matching instructors
 * @param {String} input search input
 * @returns {Promise} Resolves to the list of matching instructors
 */
export const loadInstructors = async (input) => {
    const response = await instance.get('/search/account/', {
        params: {
            page: 1,
            profile: 'instructor',
            query: input,
        },
    });
    if (isFail(response.status)) {
        return [];
    }
    return response.data.results.map(
        ({ user: { id, first_name, last_name, email } }) => ({
            label: `${first_name} ${last_name} - ${email}`,
            value: id,
        })
    );
};

import {instance} from "actions/apiActions";
import {isFail} from "actions/hooks";

/**
 * @description: parses a form to convert start and end time from a form to a duration
 * */
export const durationParser = ({start, end}, fieldTitle, field)=> {
    let durationString = {
        0.5:"0.5 Hours",
        1: "1 Hour",
        1.5: "1.5 Hours",
        2: "2 Hours"
    };
    if(fieldTitle === "Duration" ){
        let startTime = timeParser(start);
        let endTime = timeParser(end);
        let duration = Math.abs(endTime - startTime)/3600000;
        // If it's a field, return it in a format where it can be selected, if not, just return the duration string
        return field ? { duration: durationString[duration] || "1 Hour", options: ["1 Hour", "1.5 Hours", "0.5 Hours", "2 Hours"]} :
                durationString[duration]
    } else {
        return null;
    }
};

/***
 * @description: parses a time string to become a date object
 * @param: timeString
 * */
export const timeParser = (timeString) => {
    let time = new Date();
    if(typeof timeString === "string"){
        let AMPM = timeString.substring(timeString.length-3);
        AMPM.indexOf("PM") > -1 ? AMPM = 12 : AMPM = 0;
        time.setHours(AMPM + Number(timeString.substring(timeString.indexOf("T")+1,timeString.indexOf(":"))));
        time.setMinutes(Number(timeString.substring(timeString.indexOf(":")+1,timeString.indexOf(":")+3)));
        time.setSeconds(0);
        return time;
    }
    return timeString;
};

/**
 * @description: parses start and end dates from a form to determine the number of sessions. Does not account for holidays/closed office dates
 * */
export const numSessionsParser = (form, fieldTitle) => {
    if(fieldTitle === "Number of Weekly Sessions" && !form["Number of Weekly Sessions"] && form["Number of Weekly Sessions"] !== ""){
        let startDate = new Date(form["Start Date"]);
        let endDate = new Date(form["End Date"]);
        let dateDifference = Math.abs(startDate - endDate) / (1000*60*60*24);
        return dateDifference / 7;
    } else {
        return form[fieldTitle];
    }
}

/**
 * @description: parses form to create discount payload
 * */
export const createDiscountPayload = (form) => {
    const discountType = form["Discount Description"]["Discount Type"];
    let discountPayload = {
        name: form["Discount Description"]["Discount Name"],
        description: form["Discount Description"]["Discount Description"],
        amount: form["Discount Amount"]["Discount Amount"],
        amount_type: form["Discount Amount"]["Discount Type"].toLowerCase(),
        active: true,
    };
    switch(discountType){
        case "Bulk Order Discount":{
            return {
                ...discountPayload,
                num_sessions: form["Discount Rules"]["Minimum number of sessions"],
            }
        }
        case "Date Range Discount":{
            let startDate = dateParser(form["Discount Rules"]["Discount Start Date"]).substring(0,10);
            let endDate = dateParser(form["Discount Rules"]["Discount End Date"]).substring(0,10);
            return {
                ...discountPayload,
                start_date: startDate,
                end_date: endDate,
            }
        }
        case "Payment Method Discount":{
            return {
                ...discountPayload,
                payment_method: form["Discount Rules"]["Payment Method"],
            }
        }
    }
};

export const dateParser = (date) =>{
    let dateSetting = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    return new Date(date)
        .toLocaleTimeString('sv-SE',dateSetting);
};

export const dayOfWeek = {
                        0: "Sun",
                        1: "Mon",
                        2: "Tue",
                        3: "Wed",
                        4: "Thu",
                        5: "Fri",
                        6: "Sat",
                    };

export const weeklySessionsParser = (startDate, endDate) =>{
    let start = new Date(startDate);
    let end = new Date(endDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 7));
};

export const convertTimeStrToDate = (time) => {
    return new Date("01/01/2020 "+time.substr(1,5));
};

export const categorySelectObject = (category) => {
    if(category){
        return {
            value: category.id,
            label: category.name,
        }
    } else {
        return null;
    }
};

export const gradeConverter = (grade) => {
    if(grade < 6){
        return "Elementary School"
    } else if ( 5 < grade && grade < 9) {
        return "Middle School";
    } else if ( 8 < grade && grade < 13){
        return "High School";
    } else {
        return "College"
    }
};

const numToDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatDate = (date) => {
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
};

const formatTime = (time) => {
    if (!time) {
        return null;
    }
    const [hrs, mins] = time.substring(1).split(":");
    const hours = parseInt(hrs, 10);
    return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${hours >= 12 ? "PM" : "AM"}`
};

export const loadEditCourseState = (course, inst) => ({
    "Course Info": {
        "Course Name": course.title,
        "Description": course.description,
        "Instructor":
            inst
                ? {
                    "value": course.instructor_id,
                    "label": `${inst.name} - ${inst.email}`,
                }
                : null,
        "Grade Level": course.academic_level && course.academic_level.charAt(0).toUpperCase() + course.academic_level.slice(1),
        "Category": categorySelectObject(course.category),
        "Start Date": formatDate(course.schedule.start_date),
        "Duration": durationParser({start:course.schedule.start_time, end: course.schedule.end_time},'Duration', false),
        "Start Time": convertTimeStrToDate(course.schedule.start_time),
        "Number of Weekly Sessions": weeklySessionsParser(course.schedule.start_date, course.schedule.end_date),
        "Capacity": course.capacity,
    },
    "Tuition":{
        "Hourly Tuition": course.hourly_tuition,
        "Total Tuition": course.total_tuition,
    },
    "preLoaded": true,
});

export function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

/**
 * @description Searches for matching instructors
 * @param {String} input search input
 * @param {String} token Authorization Token for request
 * @returns {Promise} Resolves to the list of matching instructors
 */
export const loadInstructors = async (input, token) => {
    const response = await instance.get("/search/account/", {
        "headers": {
            "Authorization": `Token ${token}`,
        },
        "params": {
            "page": 1,
            "profile": "instructor",
            "query": input,
        },
    });
    if (isFail(response.status)) {
        return [];
    }
    return response.data
        .map(({"user": {user_id, first_name, last_name, email}}) => ({
            "label": `${first_name} ${last_name} - ${email}`,
            "value": user_id,
        }));
};

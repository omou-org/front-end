/**
 * @description: parses a form to convert start and end time from a form to a duration
 * */
export const durationParser = (form, fieldTitle)=> {
    let durationString = {
        0.5:"0.5 Hours",
        1: "1 Hour",
        1.5: "1.5 Hours",
        2: "2 Hours"
    };
    if(fieldTitle === "Duration"){
        let startTime = timeParser(form["Start Time"]);
        let endTime = timeParser(form["End Time"]);
        let duration = Math.abs(endTime - startTime)/3600000;
        return { duration: durationString[duration], options: ["1 Hour", "1.5 Hours", "0.5 Hours", "2 Hours"]}
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
        return form["Number of Weekly Sessions"];
    }
}
export const statusColor = {
    "0": "yellow",
    "-1": "yellow",
    "-2": "red",
    "-3": "red",
};

export const initials = (first, last) => {
    if (first) {
        let firstI = first.charAt(0);
        if (firstI.match(/[A-Z]/u)) {
            firstI = first.charAt(0);
        } else {
            firstI = first.charAt(1);
        }
        const lastI = last.charAt(0);
        return firstI + lastI;
    }
};

export const amountDue = (hourlyTuition, sessionLeft, sessionDuration) =>
    hourlyTuition * sessionLeft * sessionDuration;

export const getTime = (time) => {
    const strTime = String(time);
    const minutes = parseInt(strTime.slice(-2), 10) / 60;
    const hours = parseInt(strTime.substring(1), 10);
    return hours + minutes;
};

export const calculateSessionLength = (startTime, endTime) =>
    getTime(endTime) - getTime(startTime);

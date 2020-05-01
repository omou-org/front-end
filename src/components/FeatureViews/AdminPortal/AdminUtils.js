export const statusColor = {
    "0": "yellow",
    "-1": "yellow",
    "-2": "red",
    "-3": "red",
};

export const amountDue = (hourlyTuition, sessionLeft, sessionDuration) =>
    (hourlyTuition * sessionLeft * sessionDuration).toFixed(2);

export const getTime = (time) => {
    const strTime = String(time);
    const minutes = parseInt(strTime.slice(-2), 10) / 60;
    const hours = parseInt(strTime.substring(1), 10);
    return hours + minutes;
};

export const calculateSessionLength = (startTime, endTime) =>
    getTime(endTime) - getTime(startTime);

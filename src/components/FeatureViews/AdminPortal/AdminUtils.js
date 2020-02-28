export const roleColor = {
    "administrator": "red",
    "parent": "#812CD7",
    "student": "#378BFF",
    "instructor": "#1FA18A",
    "receptionist": "#D04E3D"
}

export const statusColor = {
    "0": "red",
    "1": "red",
    "2": "yellow",
    "3": "yellow"
}

export const initials = (first, last) => {
    if (first) {
        let firstI = first.charAt(0);
        if (firstI.match(/[A-Z]/)) {
            firstI = first.charAt(0)
        } else {
            firstI = first.charAt(1)
        }
            const lastI = last.charAt(0)
            return firstI + lastI
    }
}

export const emailCheck = (email) => email || "Email n/a"


//phone number formatting
export const phoneCheck = (textInput) => {
    switch (textInput) {
        case "nan":
        case null:
            return "Phone n/a"
        default:
            textInput = textInput.replace(/\D/g, '');
            textInput = textInput.replace(/(\d{3})(\d{3})(\d{4})/, "($1)-$2-$3")
            return textInput;
    }
}

export const parseDate = (date) => {
    const recordDate = Date.parse(date)
    const today = new Date();
    const ago = (today - recordDate) / 1000;
    if (isNaN(recordDate)) {
        return "n/a"
    } else if (ago<60){
        return `Updated ${Math.round(ago)} seconds ago`;
    } else if (ago<3600){
        return `Updated ${Math.round(ago/60)} minutes ago`;
    } else if (ago<86400){
        return `Updated ${Math.round(ago/3600)} minutes ago`;
    } else if (ago<172800){
        return `Updated 1 day ago`;
    } else {
        return `Updated ${Math.round(ago/86400)} days ago`;
    }
}

export const parseRole = (role) => {
    if (role) {
        return role.replace(/^\w/, c => c.toUpperCase());
    }
}

export const parseStudent = (count) => {
    if (count === 1) {
        return `${count} student`;
    } else {
        return `${count} students`;
    }
}

export const getToday = () => {
    const today = new Date();
    return `${parseDay[today]}, ${parseMonth[today]} ${parseToday(today)}`;
}

export const parseDay = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

export const parseMonth = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

export const parseToday = (date) => date.getDate();
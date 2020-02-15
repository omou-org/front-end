import { isSunday } from "date-fns";

export const roleColor = (string)=>{
    switch(string){
        case "administrator":
            return "red";
        case "parent":
            return "#812CD7";
        case "student":
            return "#378BFF";
        case "instructor":
            return "#1FA18A"
        case "receptionist":
            return "#D04E3D"
        default:
            return "no match"
    }
}

export const initials = (first, last) => {
    if (first) {
        let x = 0;
        let firstI = first.charAt(0);
        if (firstI.match(/[A-Z]/)){
        let firstI = first.charAt(0)
        let lastI = last.charAt(0)
        return firstI + lastI
        }else{
            let firstI = first.charAt(1)
            let lastI = last.charAt(0)
            return firstI + lastI
        }
    }
}

export const emailCheck= (x) => {
    if (x){
        return x
    }
    else {
        return "Email n/a"
    }

}

export const phoneCheck = (y) => {
    switch (y) {
        case ("nan"):
            return "Phone n/a";
        case null:
            return "Phone n/a"
        default:
            y= y.replace(/\D/g,'');
            y = y.replace(/(\d{3})(\d{3})(\d{4})/, "($1)-$2-$3")
            return y;
    }
}

export const parseDate = (date) => {
    let x = Date.parse(date);
    let y = Date.parse(new Date());
    let ago = (y-x)/1000;
    if (isNaN(x)){
        return "n/a"
    }
    else{
        switch (ago) {
            case (ago<60):
                return `Updated ${Math.round(ago)} seconds ago`;
            case (ago<3600):
                return `Updated ${Math.round(ago/60)} minutes ago`;
            case (ago<86400):
                return `Updated ${Math.round(ago/3600)} hours ago`;
            case (ago<172800):
                return `Updated 1 day ago`;
            default:
                return `Updated ${Math.round(ago/86400)} days ago`;
        }
    }
}

export const parseRole = (role) => {
    if(role){
    const upper = role.replace(/^\w/, c => c.toUpperCase());
    return upper;
    }
}

export const parseStudent = (count) => {
    if (count === 1) {
        return `${count} student`;
    }
    else {
        return `${count} students`;
    }
}

export const getToday = () => {
    let today = new Date();
    return `${parseDay(today)}, ${parseMonth(today)} ${parseToday(today)}`;
}

export const parseDay = (x) => {
    let day = x.getDay();

    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Undefined";
    }
}

export const parseMonth = (x) => {
    let month = x.getMonth();

    switch (month){
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
    }
}

export const parseToday = (x) => {
    let date = x.getDate();
    return date;
}
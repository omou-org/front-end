export const roleColor = (string)=>{
    switch(string){
        case "Administrator":
            return "red";
        case "Parent":
            return "#812CD7";
        case "Student":
            return "#378BFF";
        case "Instructor":
            return "#1FA18A"
        case "Receptionist":
            return "#D04E3D"
        default:
            return "no match"
    }
}


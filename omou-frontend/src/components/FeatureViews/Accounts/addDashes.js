export const addDashes=(string)=>{
    if (string.length == 10 && string.match(/^[0-9]+$/) != null) {
    return(
         `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
    }
    else{
        return("error");
    }
}
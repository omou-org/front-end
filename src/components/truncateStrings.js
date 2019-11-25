export const truncateStrings=(string, length)=>{
    //NOT TOURNIQUET!
   if(string.length>length){
       return(string.slice(0, length-3).trim()+"...");
   }
   else{
       return (string);
   }
};
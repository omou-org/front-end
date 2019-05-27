/*Validations for various text inputs*/

export let InputValidation = (input, type) => {
  switch(type){
      case "number":
          return NumberValidation(input);
      case "phone number":
          return PhoneValidation(input);
      case "email":
          return EmailValidation(input);
      case "short text":
          return ShortTextValidation(input);
      case "address":
          return AddressValidation(input);
      default:
          return false;
  }
};

// Simple Numbers (i.e. grade, age, etc.)
export let NumberValidation = (input) =>{
  return !!input.match(/^[0-9]{1,3}$/);
};

let PhoneValidation = (input) =>{
    return !!input.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/);
};

let EmailValidation = (input) =>{
    return !!input.match(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/);
};

// Short input fields (i.e. name, school, city etc.)
let ShortTextValidation = (input)=>{
    return !!input.match(/([A-Za-z ]+)(" ")?([A-Za-z ]+)?(" ")?([A-Za-z ]+)?$/)
};

// Address
let AddressValidation = (input) =>{
    return !!input.match(/\d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*\./);
};
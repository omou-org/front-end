/* validations for various text inputs*/

export const InputValidation = (input, type) => {
    switch (type) {
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
        case "zipcode":
            return ZipCodeValidation(input);
        case "birthday":
            return BirthdayValidation(input);
        default:
            return Boolean(input);
    }
};

// simple Numbers (i.e. grade, age, etc.)
export const NumberValidation = (input) =>
    Boolean(String(input).match(/^[0-9]{1,5}$/));

const PhoneValidation = (input) =>
    Boolean(input.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/));

const EmailValidation = (input) =>
    Boolean(input.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))

// short input fields (i.e. name, school, city etc.)
const ShortTextValidation = (input) =>
    Boolean(input.match(/([A-Za-z ]+)(" ")?([A-Za-z ]+)?(" ")?([A-Za-z ]+)?$/));

// address
const AddressValidation = (input) =>
    Boolean(input.match(/\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+/));

// zip Code
const ZipCodeValidation = (input) =>
    Boolean(input.match(/^\d{5}(?:[-\s]\d{4})?$/));

// birthday format to MM/DD/YYYY
const BirthdayValidation = (input) =>
    Boolean(input.match(/^((0|1)\d{1})\/((0|1|2|3)\d{1})\/((19|20)\d{2})/));

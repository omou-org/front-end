/* eslint-disable no-control-regex */
/* Validations for various text inputs */

export let InputValidation = (input, type) => {
    switch (type) {
        case 'number':
            return NumberValidation(input);
        case 'phone number':
            return PhoneValidation(input);
        case 'email':
            return EmailValidation(input);
        case 'short text':
            return ShortTextValidation(input);
        case 'address':
            return AddressValidation(input);
        case 'zipcode':
            return ZipCodeValidation(input);
        case 'date':
            return DateValidation(input);
        case 'time':
            return timeValidation(input);
        case 'password':
            return passwordValidation(input);
        case 'name':
            return nameValidation(input);
        default:
            return Boolean(input);
    }
};

// Simple Numbers (i.e. grade, age, etc.)
export let NumberValidation = (input) => {
    return !!String(input).match(/^[0-9]{1,5}$/);
};

let PhoneValidation = (input) => {
    return !!input.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/);
};

let EmailValidation = (input) => {
    return !!input.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Short input fields (i.e. name, school, city etc.)
let ShortTextValidation = (input) => {
    return !!input.match(/[a-zA-Z][^#&<>\"~;$^%{}?]{1,500}$/);
};

// Address
let AddressValidation = (input) => {
    // Old regex /\d{1,5}\s\w\s(\b\w*\b\s){1,2}?.\w*/
    return !!input.match(/^[a-zA-Z0-9\s,.'-]{3,}$/);
};

// Zip Code
let ZipCodeValidation = (input) => {
    return !!input.match(/^\d{5}(?:[-\s]\d{4})?$/);
};

// Birthday format to MM/DD/YYYY
let DateValidation = (input) => {
    // TODO: proper date validation
    // return !!input.match(/^((0|1)\d{1})\/((0|1|2|3)\d{1})\/((19|20)\d{2})/)
    return true;
};

// Time format of HH:MM TODO: make actual time validation
const timeValidation = (input) => {
    // (/^(1[0-2]|0?[1-9]):[0-5][0-9] (a|A|p|P)(m|M)$/u).test(input);
    return true;
};

// Password validation
const passwordValidation = (input) => {
    return true;
};

// Name validation
let nameValidation = (input) => {
    return !!input.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);
};

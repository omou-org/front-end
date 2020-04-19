import * as types from "actions/actionTypes";
import {instance} from "actions/apiActions";
import {useSelector, useDispatch} from "react-redux";
import React from "react";
import {FORM_ERROR} from "final-form";
import * as Fields from "./Fields";
import * as Yup from "yup";

const parseGender = {
    "F": "female",
    "M": "male",
    "U": "unspecified",
};
const mapFunc = (parser, data) => {
    let res = {};
    Object.entries(data).forEach(([key, message]) => {
        let match;
        if (Array.isArray(message)) {
            match = parser[key];
            res[match[0]] = res[match[0]] || {};
            res[match[0]][match[1]] = message.join();
        } else {
            // object of errors, recursion time
            Object.entries(mapFunc(parser[key], message)).forEach(([k2, obj]) => {
                res[k2] = {
                    ...(res[k2] || {}),
                    ...obj,
                };
            });
        }
    });
    return res;
};

const parseDate = (date) => {
    if (!date) {
        return null;
    }
    if (typeof date === "string") {
        return date.substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
};

const formToRequest = (parser, data) => {
    let body = {};
    Object.entries(parser).forEach(([key, path]) => {
        console.log(parser, key, path)
        if (Array.isArray(path)) {
            body[key] = data[path[0]][path[1]];
        } else {
            // object, recursion time
            body[key] = formToRequest(parser[key], data);
        }
    });
    return body;
};

const stringField = (label) => ({
    "component": <Fields.TextField />,
    "validator": Yup.string().matches(/[a-zA-Z][^#&<>"~;$^%{}?]+$/u,
        `Invalid ${label}`),
});

const selectField = (options) => ({
    "component": <Fields.Select data={options} />,
    "validator": Yup.mixed().oneOf(options.map(({value}) => value)),
});

const STATE_OPTIONS = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
    "WY",
];

const ADDRESS_FIELD = {
        "name": "address",
        "label": "Address",
        ...stringField("Address"),
    },
    BIRTHDAY_FIELD = {
        "name": "birthday",
        "label": "Birth Date",
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
        "validator": Yup.date().min(new Date("1900")).max(new Date()),
    },
    CITY_FIELD = {
        "name": "city",
        "label": "City",
        ...stringField("City"),
    },
    EMAIL_FIELD = {
        "name": "email",
        "label": "Email",
        "component": <Fields.TextField />,
        "validator": Yup.string().email(),
        "required": true,
    },
    GENDER_FIELD = {
        "name": "gender",
        "label": "Gender",
        ...selectField([
            {"label": "Do Not Disclose", "value": "U"},
            {"label": "Male", "value": "M"},
            {"label": "Female", "value": "F"},
        ]),
    },
    NAME_FIELDS = [
        {
            "name": "first_name",
            "label": "First Name",
            ...stringField("First Name"),
            "required": true,
        },
        {
            "name": "last_name",
            "label": "Last Name",
            ...stringField("Last Name"),
            "required": true,
        },
    ],
    PHONE_NUMBER_FIELD = {
        "name": "phone_number",
        "label": "Phone Number",
        "component": <Fields.TextField />,
        "validator": Yup.string().matches(/\d{3}-?\d{3}-?\d{4}?/u,
            "Invalid phone number"),
    },
    STATE_FIELD = {
        "name": "state",
        "label": "State",
        "component": <Fields.Autocomplete options={STATE_OPTIONS} />,
        "validator": Yup.mixed().oneOf(STATE_OPTIONS, "Invalid state"),
    },
    ZIPCODE_FIELD = {
        "name": "zipcode",
        "label": "Zip Code",
        "component": <Fields.TextField />,
        "validator": Yup.string().matches(/^\d{5}(?:[-\s]\d{4})?$/u,
            "Invalid zipcode"),
    };


export default {
    "student": {
        "form": [
            {
                "name": "student",
                "label": "Student Information",
                "fields": [
                    ...NAME_FIELDS,
                    GENDER_FIELD,
                    {
                        "name": "grade",
                        "label": "Grade",
                        "component": <Fields.TextField />,
                        "validator": Yup.number()
                            .typeError("Grade must be a number.").integer()
                            .min(1).max(13),
                    },
                    BIRTHDAY_FIELD,
                    {
                        "name": "school",
                        "label": "School",
                        ...stringField("School"),
                    },
                    PHONE_NUMBER_FIELD,
                ],
            },
            {
                "name": "parent",
                "label": "Parent Information",
                "fields": [
                    ...NAME_FIELDS,
                    {
                        "name": "relationship",
                        "label": "Relationship to Student",
                        ...selectField([
                            {"label": "Mother", "value": "mother"},
                            {"label": "Father", "value": "father"},
                            {"label": "Guardian", "value": "guardian"},
                            {"label": "Other", "value": "other"},
                        ]),
                        "required": true,
                    },
                    GENDER_FIELD,
                    EMAIL_FIELD,
                    PHONE_NUMBER_FIELD,
                    BIRTHDAY_FIELD,
                    ADDRESS_FIELD,
                    CITY_FIELD,
                    STATE_FIELD,
                    ZIPCODE_FIELD,
                ],
            },
        ],
        "load": function useLoad() {
            return {};
        },
        "submit": () => {},
    },
    "admin": {
        "form": [
            {
                "name": "login",
                "label": "Login Details",
                "fields": [
                    EMAIL_FIELD,
                    {
                        "name": "password",
                        "label": "Password",
                        "component": <Fields.TextField type="password" />,
                        "validator": Yup.mixed(),
                        "required": true,
                    },
                    ...NAME_FIELDS,
                ],
            },
            {
                "name": "user",
                "label": "User Information",
                "fields": [
                    {
                        "name": "admin_type",
                        "label": "Admin Type",
                        ...selectField([
                            {"label": "Owner", "value": "owner"},
                            {"label": "Receptionist", "value": "receptionist"},
                            {"label": "Assistant", "value": "assistant"},
                        ]),
                        "required": true,
                    },
                    GENDER_FIELD,
                    BIRTHDAY_FIELD,
                    ADDRESS_FIELD,
                    CITY_FIELD,
                    PHONE_NUMBER_FIELD,
                    STATE_FIELD,
                    ZIPCODE_FIELD,
                ],
            },
        ],
        "load": (id) => {
            // TODO: add admin fetching
        },
        "submit": async (dispatch, formData, id) => {
            const responseToFormKey = {
                "gender": ["user", "gender"],
                "admin_type": ["user", "admin_type"],
                "birth_date": ["user", "birthday"],
                "address": ["user", "address"],
                "city": ["user", "city"],
                "phone_number": ["user", "phone_number"],
                "state": ["user", "state"],
                "zipcode": ["user", "zipcode"],
                "user": {
                    "first_name": ["login", "first_name"],
                    "last_name": ["login", "last_name"],
                    "password": ["login", "password"],
                    "email": ["login", "email"],
                },
            };
            const admin = formToRequest(responseToFormKey, formData);
            admin.gender = parseGender[admin.gender];
            admin.birth_date = parseDate(admin.birth_date);
            try {
                const response = await instance.post("/account/admin/", admin);
                // TODO: add admin storage in redux
                // dispatch({
                //     "type": types.POST_ADMIN_SUCCESSFUL,
                //     "payload": response,
                // });
            } catch ({response}) {
                console.log(response);
                console.log(mapFunc(responseToFormKey, response.data))
                return {
                    ...mapFunc(responseToFormKey, response.data),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
};

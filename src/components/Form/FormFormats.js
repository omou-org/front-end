/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable func-name-matching */
/* eslint-disable no-magic-numbers */
/* eslint-disable newline-per-chained-call */
/* eslint-disable array-element-newline */
/* eslint-disable sort-keys */
/* eslint-disable object-property-newline */
import * as types from "actions/actionTypes";
import {instance} from "actions/apiActions";
import {useSelector} from "react-redux";
import React from "react";
import {FORM_ERROR} from "final-form";
import * as Fields from "./Fields";
import * as Yup from "yup";
import * as hooks from "actions/hooks";
import * as moment from 'moment';

export const responseToForm = (parser, data) => {
    const res = {};
    Object.entries(data).forEach(([key, message]) => {
        if (parser.hasOwnProperty(key)) {
            let match;
            if (Array.isArray(message)) {
                match = parser[key];
                res[match[0]] = res[match[0]] || {};
                res[match[0]][match[1]] = message.join();
            } else {
                // Object of errors, recursion time
                Object.entries(responseToForm(parser[key], message)).forEach(([k2, obj]) => {
                    res[k2] = {
                        ...res[k2] || {},
                        ...obj,
                    };
                });
            }
        }
    });
    return res;
};

// eslint-disable-next-line no-confusing-arrow
export const submitToApi = (endpoint, data, id) => id ?
    instance.patch(`${endpoint}${id}/`, data) :
    instance.post(endpoint, data);

export const parseDate = (date) => {
    if (!date) {
        return null;
    }
    if (typeof date === "string") {
        return date.substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
};

export const formToRequest = (parser, data) => {
    const body = {};
    Object.entries(parser).forEach(([key, path]) => {
        if (Array.isArray(path)) {
            body[key] = data[path[0]][path[1]];
        } else {
            // Object, recursion time
            body[key] = formToRequest(parser[key], data);
        }
    });
    return body;
};

export const selectField = (options) => ({
    "component": <Fields.Select data={options} />,
    "validator": Yup.mixed().oneOf(options.map(({value}) => value)),
}),
    stringField = (label) => ({
        "component": <Fields.TextField />,
        label,
        "validator": Yup.string().matches(/[a-zA-Z][^#&<>"~;$^%{}?]+$/u,
            `Invalid ${label}`),
    });

const STATE_OPTIONS = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
    "WY",
];

export const ACADEMIC_LVL_FIELD = {
        "name": "academic_level",
        "label": "Grade",
        ...selectField([
            {"label": "Elementary School", "value": "elementary_lvl"},
            {"label": "Middle School", "value": "middle_lvl"},
            {"label": "High School", "value": "high_lvl"},
            {"label": "College", "value": "college_lvl"},
        ]),
    },
    ADDRESS_FIELD = {
        "name": "address",
        ...stringField("Address"),
    },
    BIRTHDAY_FIELD = {
        "name": "birthday",
        "label": "Birth Date",
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
        "validator": Yup.date().max(moment()),
    },
    CITY_FIELD = {
        "name": "city",
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
            {"label": "Do Not Disclose", "value": "unspecified"},
            {"label": "Male", "value": "male"},
            {"label": "Female", "value": "female"},
        ]),
    },
    HOURLY_TUITION_FIELD = {
        "component": <Fields.TextField />,
        "validator": Yup.number().min(0),
    },
    INSTRUCTOR_CONFIRM_FIELD = {
        // TODO: refine
        "name": "is_confirmed",
        "label": "",
        "component": <Fields.Checkboxes
            data={[{"label": "Did Instructor Confirm?", "value": false}]} />,
        "validator": Yup.boolean(),
        "required": true,
    },
    NAME_FIELDS = [
        {
            "name": "first_name",
            ...stringField("First Name"),
            "required": true,
        },
        {
            "name": "last_name",
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
    START_DATE_FIELD = {
        "name": "start_date",
        "label": "Start Date",
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
        "validator": Yup.date(),
    },
    START_TIME_FIELD = {
        // TODO: time picker
        "name": "start_time",
        "label": "Start Time",
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
        "validator": Yup.date(),
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

const PARENT_FIELDS = {
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
};

const STUDENT_INFO_FIELDS = {
    "name": "student_info",
    "label": "Student Information",
    "fields": [
        {
            "name": "current_instructor",
            ...stringField("Current Instructor in School")
        },
        {
            "name": "textbook",
            ...stringField("Textbook Used"),
        },
        {
            "name": "current_grade",
            ...stringField("Current Grade in Class"),
        },
        {
            "name": "topic",
            ...stringField("Current Topic in School / Topic of Interest"),
        },
        {
            "name": "strength",
            ...stringField("Student Strengths"),
        },
        {
            "name": "weakness",
            ...stringField("Student Weaknesses"),
        },
    ],
};

export default {
    "student": {
        "title": "Student",
        // "conditionals": {
        //     "parent": (student) => student.name === Joe
        // }
        "form": [
            {
                "name": "student",
                "label": "Student Information",
                // "showIf": (student) => student.name === Joe
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
                        // "conditional": showParent if grade = 10
                    },
                    BIRTHDAY_FIELD,
                    {
                        "name": "school",
                        ...stringField("School"),
                    },
                    PHONE_NUMBER_FIELD,
                ],
            },
            PARENT_FIELDS,
        ],
        "load": (id) => {
            const studentStatus = hooks.useStudent(id);
            const {parent_id, ...student} = useSelector(({Users}) => Users.StudentList[id]) || {};
            hooks.useParent(parent_id);
            const {relationship, ...parent} = useSelector(({Users}) => Users.ParentList[parent_id]) || {};
            if (hooks.isFail(studentStatus)) {
                return null;
            }
            return {
                student,
                "parent": {
                    ...parent,
                    "relationship": (relationship || "").toLowerCase(),
                },
            };
        },
        "submit": async (dispatch, formData, id) => {
            const studentResponseToFormKey = {
                "gender": ["student", "gender"],
                "birth_date": ["student", "birthday"],
                "address": ["parent", "address"],
                "city": ["parent", "city"],
                "phone_number": ["student", "phone_number"],
                "state": ["parent", "state"],
                "zipcode": ["parent", "zipcode"],
                "grade": ["student", "grade"],
                "school": ["student", "school"],
                "user": {
                    "first_name": ["student", "first_name"],
                    "last_name": ["student", "last_name"],
                    "email": ["student", "email"],
                },
            };
            const parentResponseToFormKey = {
                "gender": ["parent", "gender"],
                "birth_date": ["parent", "birthday"],
                "address": ["parent", "address"],
                "city": ["parent", "city"],
                "phone_number": ["student", "phone_number"],
                "state": ["parent", "state"],
                "zipcode": ["parent", "zipcode"],
                "relationship": ["parent", "relationship"],
                "user": {
                    "first_name": ["parent", "first_name"],
                    "last_name": ["parent", "last_name"],
                    "email": ["parent", "email"],
                },
            };
            const parent = formToRequest(parentResponseToFormKey, formData);
            parent.birth_date = parseDate(parent.birth_date);
            const student = formToRequest(studentResponseToFormKey, formData);
            // Student.birth_date = parseDate(student.birth_date);
            try {
                const parentResponse = await instance.post("/account/parent/",
                    parent);
                dispatch({
                    "type": types.POST_PARENT_SUCCESSFUL,
                    "payload": parentResponse,
                });
                student.primary_parent = parentResponse.id;
                const studentResponse = await submitToApi("/account/student/", student, id);
                dispatch({
                    "type": types.POST_STUDENT_SUCCESSFUL,
                    "payload": studentResponse,
                });
            } catch ({response}) {
                return {
                    ...responseToForm(studentResponseToFormKey, response.data),
                    ...responseToForm(parentResponseToFormKey, response.data),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
    "parent": {
        "title": "Parent",
        "form": [PARENT_FIELDS],
        // TODO: loading and submitting with GraphQL
        "load": (id) => {},
        "submit": async (dispatch, formData, id) => {},
    },
    "admin": {
        "title": "Administrator",
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
                        "onChange": (params) => {
                            console.log(params);
                        }
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
        // TODO: add administrator loading
        "load": () => {},
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
            admin.birth_date = parseDate(admin.birth_date);
            try {
                const response = await submitToApi("/account/admin/", admin, id);

                /*
                 * TODO: add admin storage in redux
                 * dispatch({
                 *     "type": types.POST_ADMIN_SUCCESSFUL,
                 *     "payload": response,
                 * });
                 */
            } catch ({response}) {
                return {
                    ...responseToForm(responseToFormKey, response.data),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
    "pricing": {
        "title": "Pricing",
        "form": [
            {
                "name": "pricing",
                "label": "Pricing",
                "fields": [
                    {
                        "name": "name",
                        ...stringField("Name"),
                        "required": true,
                    },
                    {
                        "name": "category",
                        "label": "Category",
                        "required": true,
                        // TODO: category selector
                        "component": <Fields.TextField />,
                        "validator": Yup.mixed(),
                    },
                    {
                        ...ACADEMIC_LVL_FIELD,
                        "required": true,
                    },
                    {
                        "name": "course_type",
                        "label": "Course Size",
                        "required": true,
                        ...selectField([
                            {"label": "Tutoring", "value": "tutoring"},
                            {"label": "Small Group", "value": "small_group"},
                            {"label": "Class", "value": "class"},
                        ]),
                    },
                    {
                        "name": "hourly_tuition",
                        "label": "Hourly Tuition ($)",
                        "required": true,
                        ...HOURLY_TUITION_FIELD,
                    },
                ],
            },
        ],
        // this form does not support edits at the moment
        "load": () => {},
        "submit": async (dispatch, {pricing}, id) => {
            try {
                const response = await submitToApi("/pricing/rule/", pricing, id);
                dispatch({
                    "type": types.POST_PRICE_RULE_SUCCESS,
                    "payload": response,
                });
            } catch ({response}) {
                return {
                    "pricing": Object.entries(response.data)
                        .reduce((obj, [key, error]) => ({
                            ...obj,
                            [key]: error[0],
                        }), {}),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
    "course_details": {
        "title": "Course Information",
        "form": [
            {
                "name": "courseInfo",
                "label": "Course Info",
                "fields": [
                    {
                        // "handleConditional": () => {
                        //     if (value === x) toggleConditional()
                        // }
                        // "onChange": (value) => {
                        //     if (value === "new")
                        //         variables.newObj = true
                        // }
                        "name": "subject",
                        "required": true,
                        ...stringField("Course Name"),
                    },
                    {
                        "name": "description",
                        ...stringField("Description"),
                    },
                    {
                        // TODO: instructor select
                        "name": "instructor",
                        "label": "Instructor",
                        "component": <Fields.TextField />,
                        "validator": Yup.mixed(),
                    },
                    INSTRUCTOR_CONFIRM_FIELD,
                    // START_DATE,
                    // START_TIME,
                    {
                        "name": "max_capacity",
                        "label": "Capacity",
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(1).integer(),
                    },
                ],
                "next": "tuition"
            },
            {
                // showIf: variables.newObj === true,
                "name": "tuition",
                "label": "Tuition",
                "fields": [
                    // TODO: category select
                    {
                        "name": "course_category",
                        "label": "Category",
                        "required": "true",
                        "component": <Fields.TextField />,
                        "validator": Yup.mixed(),
                    },
                    {
                        ...ACADEMIC_LVL_FIELD,
                        "label": "Grade Level",
                        "required": true,
                    },
                    {
                        "name": "duration",
                        "label": "Duration",
                        "required": "true",
                        ...selectField([
                            {"label": "0.5 Hours", "value": "0.5 Hours"},
                            {"label": "1 Hour", "value": "1 Hour"},
                            {"label": "1.5 Hours", "value": "1.5 Hours"},
                            {"label": "2 Hours", "value": "2 Hours"},
                        ]),
                    },
                    {
                        "name": "hourly_tuition",
                        "label": "Hourly Tuition",
                        "required": true,
                        ...HOURLY_TUITION_FIELD,
                    },
                    {
                        "name": "num_sessions",
                        "label": "# of Weekly Sessions",
                        "required": true,
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(1).integer(),
                    },
                    {
                        "name": "total_tuition",
                        "label": "Total Tuition",
                        "required": true,
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(0),
                    },
                ],
            },
        ],
        // TODO: loading and submitting with GraphQL
        "load": (id) => {},
        "submit": async (dispatch, formData, id) => {},
    },
    "instructor": {
        "title": "Instructor",
        "form": [
            {
                "name": "basic_info",
                "label": "Basic Information",
                "fields": [
                    ...NAME_FIELDS,
                    EMAIL_FIELD,
                    PHONE_NUMBER_FIELD,
                    GENDER_FIELD,
                    ADDRESS_FIELD,
                    CITY_FIELD,
                    ZIPCODE_FIELD,
                    STATE_FIELD,
                    BIRTHDAY_FIELD,
                ],
            },
            {
                "name": "experience",
                "label": "Experience",
                "fields": [
                    {
                        "name": "subjects",
                        ...stringField("Subjects Tutor Can Teach")
                    },
                    {
                        "name": "experience",
                        ...stringField("Teaching Experience (Years)")
                    },
                    {
                        "name": "background",
                        ...stringField("Background"),
                    },
                    {
                        "name": "language",
                        ...stringField("Languages"),
                    },
                ],
            },
        ],
        // TODO: loading and submitting with GraphQL
        "load": (id) => {},
        "submit": async (dispatch, formData, id) => {},
    },
    "course": {
        "title": "Course",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [{
                    "name": "student",
                    // TODO: student select field
                    ...stringField("Student")
                }]
            },
            STUDENT_INFO_FIELDS,
            {
                "name": "course",
                "label": "Course",
                "fields": [{
                    "name": "course",
                    // TODO: course select field
                    ...stringField("Course"),
                }]
            }
        ]
    },
    "tutoring": {
        "title": "tutoring",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [{
                    "name": "student",
                    // TODO: student select field
                    ...stringField("Student"),
                }]
            },
            STUDENT_INFO_FIELDS,
            {
                "name": "instructor",
                "label": "Tutor Selection",
                "fields": [
                    {
                        "name": "instructor",
                        // TODO: instructor select field
                        ...stringField("Instructor"),
                    },
                    {
                        "name": "course",
                        ...stringField("Course Name"),
                    },
                    INSTRUCTOR_CONFIRM_FIELD,
                ],
            },
            {
                "name": "schedule",
                "label": "Schedule",
                "fields": [
                    {
                        ...START_DATE_FIELD,
                        "required": true,
                    },
                    {
                        ...START_TIME_FIELD,
                        "required": true,
                    },
                ],
            },
            {
                "name": "tuition",
                "label": "Tuition Quote Tool",
                "fields": [{
                    // TODO: price quote tool
                    "name": "price",
                    ...stringField("Price Quote"),
                }],
            },
        ],
    },
    "course_category": {
        "title": "Course",
        "form": [
            {
                "name": "category",
                "label": "Category Details",
                "fields": [
                    {
                        "name": "name",
                        ...stringField("Category Name"),
                        "required": true,
                    },
                    {
                        "name": "description",
                        ...stringField("Description"),
                    },
                ],
            },
        ],
    },
    // "discount"
};

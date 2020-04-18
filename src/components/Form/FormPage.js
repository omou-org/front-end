import React, {useState} from "react";
import Form from "./Form";
import Forms from "./FormFormats";
import {makeStyles} from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";

import {Redirect, useParams, useHistory} from "react-router-dom";
import {Autocomplete, KeyboardDatePicker, Select, TextField} from "./Fields";
import BackButton from "../BackButton.js";
import {makeValidate} from "mui-rff";
import {useSelector, useDispatch} from "react-redux";
import {Button} from "@material-ui/core";
import * as Yup from "yup";
import * as hooks from "actions/hooks";
import * as userActions from "actions/userActions";
import {removeDashes} from "utils";

const GENDER_OPTIONS = [
    {
        "label": "Do Not Disclose",
        "value": "other",
    },
    {
        "label": "Male",
        "value": "male",
    },
    {
        "label": "Female",
        "value": "female",
    },
];

const base = [
    {
        "name": "student",
        "label": "Student Information",
        "fields": [
            {
                "name": "first_name",
                "label": "First Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "last_name",
                "label": "Last Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "gender",
                "label": "Gender",
                "type": "select",
                "options": GENDER_OPTIONS,
            },
            {
                "name": "grade",
                "label": "Grade",
                "type": "number",
                "min": 1,
                "max": 13,
                "integer": true,
            },
            {
                "name": "birth_date",
                "label": "Birth Date",
                "type": "date",
                "min": new Date("1900"),
                "max": new Date(),
            },
            {
                "name": "school",
                "label": "School",
                "type": "string",
            },
            {
                "name": "phone_number",
                "label": "Phone Number",
                "type": "phone",
            },
        ],
    },
    {
        "name": "parent",
        "label": "Parent Information",
        "fields": [
            {
                "name": "first_name",
                "label": "First Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "last_name",
                "label": "Last Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "relationship",
                "label": "Relationship to Student",
                "type": "select",
                "required": true,
                "options": [
                    {
                        "label": "Mother",
                        "value": "mother",
                    },
                    {
                        "label": "Father",
                        "value": "father",
                    },
                    {
                        "label": "Guardian",
                        "value": "guardian",
                    },
                    {
                        "label": "Other",
                        "value": "other",
                    },
                ],
            },
            {
                "name": "gender",
                "label": "Gender",
                "type": "select",
                "options": GENDER_OPTIONS,
            },
            {
                "name": "email",
                "label": "Parent Email",
                "type": "email",
                "required": true,
            },
            {
                "name": "phone_number",
                "label": "Phone Number",
                "type": "phone",
                "required": true,
            },
            {
                "name": "birth_date",
                "label": "Birth Date",
                "type": "date",
                "min": new Date("1900"),
                "max": new Date(),
            },
            {
                "name": "address",
                "label": "Address",
                "type": "address",
            },
            {
                "name": "city",
                "label": "City",
                "type": "string",
            },
            {
                "name": "state",
                "label": "State",
                "type": "autocomplete",
                "options": [
                    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
                    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
                    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
                    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
                    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
                    "WY",
                ],
            },
            {
                "name": "zipcode",
                "label": "Zip Code",
                "type": "zipcode",
            },
        ],
    },
];

const useStyles = makeStyles({
    "stepLabel": {
        "textAlign": "left",
    },
    "root": {
        "& .MuiSelect-select-root": {
            "width": 200,
        },
    },
});

const fieldToBaseValidator = ({label, type, ...options}) => {
    switch (type) {
        case "address": return Yup.string().matches(
            /^[a-zA-Z0-9\s,.'-]{3,}$/u, "Invalid address"
        );
        case "date": {
            let dateValidator = Yup.date();
            if (options.min) {
                dateValidator = dateValidator.min(options.min);
            }
            if (options.max) {
                dateValidator = dateValidator.max(options.max);
            }
            return dateValidator;
        }
        case "email": return Yup.string().email();
        case "name": return Yup.string().matches(
            /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/u, "Invalid name"
        );
        case "number": {
            let numValidator = Yup.number()
                .typeError(`${label} must be a number.`);
            if (options.min) {
                numValidator = numValidator.min(options.min);
            }
            if (options.max) {
                numValidator = numValidator.max(options.max);
            }
            if (options.integer) {
                numValidator = numValidator.integer();
            }
            return numValidator;
        }
        case "phone": return Yup.string().matches(
            /\d{3}-?\d{3}-?\d{4}?/u, "Invalid phone number"
        );
        case "select": return Yup.mixed().oneOf(
            options.options.map(({value}) => value)
        );
        case "autocomplete": case "string": return Yup.string().matches(
            /[a-zA-Z][^#&<>"~;$^%{}?]+$/u, `Invalid ${label}`
        );
        case "zipcode": return Yup.string().matches(
            /^\d{5}(?:[-\s]\d{4})?$/u, "Invalid zipcode"
        );
        default: return Yup.mixed();
    }
};

const fieldToBaseField = ({type, ...options}) => {
    switch (type) {
        case "autocomplete": return <Autocomplete options={options.options} />;
        case "date": return <KeyboardDatePicker format="MM/dd/yyyy" />;
        case "select": return <Select data={options.options} />;
        // setting type="number" causes Yup validation to not work
        case "number": return <TextField />;
        case "address": case "phone": case "string":
        default: return <TextField />;
    }
};

const generateFields = (format) => {
    const sections = format.map(({fields, ...settings}) => ({
        ...settings,
        "fields": fields.map((field) => {
            let jsField = fieldToBaseField(field);
            jsField = React.cloneElement(jsField, {
                "required": Boolean(field.required),
                "key": field.name,
                "label": field.label,
                "name": field.name,
            });
            return jsField;
        }),
    }));

    const schema = Yup.object().shape(format.reduce((allValidators, section) => {
        const sectionObj = section.fields.reduce((fieldValidators, field) => {
            const {name, label, required, options} = field;
            let validator = fieldToBaseValidator(field);
            if (options) {
                validator = validator.oneOf(options, `Invalid ${label}`);
            }
            if (required) {
                validator = validator.required();
            }
            validator = validator.label(label);
            return {
                ...fieldValidators,
                [name]: validator,
            };
        }, {});
        return {
            ...allValidators,
            [section.name]: Yup.object().shape(sectionObj)
                .label(section.label),
        };
    }, {}));

    return [schema, sections];
};

const [schema, sections] = generateFields(base);
const validate = makeValidate(schema);

const FormPage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {type, id} = useParams();
    const {form, load, submit} = Forms[type];
    hooks.useStudent();
    const user = useSelector(({Users}) => Users.StudentList[id]) || {};
    const onSubmit = (formData) => submit(dispatch, formData, id);

    if (!form) {
        return <Redirect to="/PageNotFound" />;
    }

    return (
        <Form base={form} initialData={id ? load(id) : {}} onSubmit={onSubmit} />
    );
};

export default FormPage;

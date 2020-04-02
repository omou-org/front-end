import React, {useCallback, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Form as ReactForm} from "react-final-form";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";

import {Autocomplete, KeyboardDatePicker, Select, TextField} from "./Fields";
import BackButton from "../BackButton.js";
import {makeValidate} from "mui-rff";
import {Button} from "@material-ui/core";
import * as Yup from "yup";


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


const Form = ({base, initialData}) => {
    const [activeStep, setActiveStep] = useState(0);
    const classes = useStyles();

    const [schema, sections] = generateFields(base);
    const validate = makeValidate(schema);

    const handleNext = useCallback(() => {
        setActiveStep((prevStep) => prevStep + 1);
    }, []);

    const renderStep = useCallback(({label, name, fields}, errors) => (
        <Step key={label}>
            <StepLabel className={classes.stepLabel}>{label}</StepLabel>
            <StepContent>
                {fields.map((field) => React.cloneElement(
                    field,
                    {
                        "SelectDisplayProps": {
                            "data-cy": `${name}-${field.props.name}-select`,
                        },
                        "data-cy": `${name}-${field.props.name}`,
                        "inputProps": {
                            "data-cy": `${name}-${field.props.name}-input`,
                        },
                        "name": `${name}.${field.props.name}`,
                    }
                ))}
                <Button data-cy="nextButton" disabled={Boolean(errors[name])}
                    onClick={handleNext}>
                    Next
                </Button>
            </StepContent>
        </Step>
    ), [classes.stepLabel, handleNext]);

    const render = useCallback(({handleSubmit, errors}) => (
        <form noValidate onSubmit={handleSubmit} initialValues={initialData}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {sections.map((section) => renderStep(section, errors))}
            </Stepper>
        </form>
    ), [activeStep, renderStep, initialData, sections]);

    return (
        <Paper className={`registration-form ${classes.root}`}>
            <BackButton />
            <Typography align="left" className="heading" data-cy="formTitle"
                variant="h3">
                Course Category
            </Typography>
            <ReactForm onSubmit={() => {}} render={render}
                validate={validate} />
        </Paper>
    );
};

export default Form;

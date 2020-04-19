import React, {useCallback, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Form as ReactForm} from "react-final-form";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import FormReceipt from "./FormReceipt";

import {Autocomplete, KeyboardDatePicker, Select, TextField} from "./Fields";
import BackButton from "../BackButton.js";
import {Debug, makeValidate} from "mui-rff";
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

const generateFields = (format) => {
    const sections = format.map(({fields, ...settings}) => ({
        ...settings,
        "fields": fields.map((field) => {
            let jsField = field.component;
            jsField = React.cloneElement(jsField, {
                "key": field.name,
                "label": field.label,
                "name": field.name,
                "required": Boolean(field.required),
            });
            return jsField;
        }),
    }));

    const schema = Yup.object().shape(format.reduce((allValidators, section) => {
        const sectionObj = section.fields.reduce((fieldValidators, field) => {
            const {name, label, required} = field;
            let {validator} = field;
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

const Form = ({base, initialData, onSubmit, "receipt": Receipt = FormReceipt}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const classes = useStyles();

    const [schema, sections] = generateFields(base);
    const validate = makeValidate(schema);

    const handleNext = useCallback(() => {
        setActiveStep((prevStep) => prevStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevStep) => prevStep - 1);
    }, []);

    const submit = useCallback(async (formData) => {
        const errors = await onSubmit(formData);
        if (!errors) {
            setSubmittedData(formData);
            setShowReceipt(true);
        }
        return errors;
    }, [onSubmit]);

    const renderStep = useCallback((index, {label, name, fields}, errors, submitting) => (
        <Step key={label}>
            <StepLabel className={classes.stepLabel}>{label}</StepLabel>
            <StepContent>
                {fields.map((field) => React.cloneElement(field,
                    {
                        "SelectDisplayProps": {
                            "data-cy": `${name}-${field.props.name}-select`,
                        },
                        "data-cy": `${name}-${field.props.name}`,
                        "inputProps": {
                            "data-cy": `${name}-${field.props.name}-input`,
                        },
                        "name": `${name}.${field.props.name}`,
                    }))}
                {index > 0 && index < sections.length &&
                    <Button data-cy="backButton" onClick={handleBack}>
                        Back
                    </Button>}
                {index < sections.length - 1 &&
                    <Button data-cy="nextButton"
                        disabled={Boolean(errors[name])} onClick={handleNext}>
                        Next
                    </Button>}
                {index === sections.length - 1 &&
                    <Button data-cy="submitButton"
                        disabled={Boolean(errors[name]) || submitting}
                        type="submit">
                        {submitting ? "Submitting" : "Submit"}
                    </Button>}
            </StepContent>
        </Step>
    ), [classes.stepLabel, sections.length, handleBack, handleNext]);

    const render = useCallback(({handleSubmit, errors, submitError, submitting}) => (
        <form noValidate onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {sections.map((section, index) =>
                    renderStep(index, section, errors, submitting))}
            </Stepper>
            {submitError &&
                <div className="error">
                    An error occured while submitting. Try again.
                </div>}
            <Debug />
        </form>
    ), [activeStep, renderStep, sections]);

    return (
        <Paper className={`registration-form ${classes.root}`}>
            <BackButton />
            <Typography align="left" className="heading" data-cy="formTitle"
                variant="h3">
                Course Category
            </Typography>
            {showReceipt ?
                <Receipt formData={submittedData} /> :
                <ReactForm initialValues={initialData} onSubmit={submit}
                    render={render} validate={validate} />}
        </Paper>
    );
};

export default Form;

import React, {useCallback, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Form as ReactForm} from "react-final-form";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import FormReceipt from "./FormReceipt";

import {makeValidate} from "mui-rff";
import {Button} from "@material-ui/core";
import * as Yup from "yup";


const useStyles = makeStyles({
    "buttons": {
        "& Button": {
            "margin": "10px",
        },
        "textAlign": "right",
    },
    "root": {
        "& .MuiSelect-select-root": {
            "width": 200,
        },
    },
    "step": {
        "textAlign": "left",
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

const Form = ({base, initialData, title, onSubmit, "receipt": Receipt = FormReceipt, stepperOrientation = "vertical"}) => {
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

    const renderStepContent = useCallback((index, {name, fields}, errors, submitting) => {
        const content = (
            <>
                {fields.map((field) => React.cloneElement(field,
                    {
                        "SelectDisplayProps": {
                            "data-cy": `${name}-${field.props.name}-select`,
                        },
                        "data-cy": `${name}-${field.props.name}`,
                        "inputProps": {
                            "data-cy": `${name}-${field.props.name}-input`,
                        },
                        "margin": "normal",
                        "name": `${name}.${field.props.name}`,
                    }))}
                <div className={classes.buttons}>
                    {index > 0 && index < sections.length &&
                    <Button data-cy="backButton" onClick={handleBack}
                        variant="outlined">
                        Back
                    </Button>}
                    {index < sections.length - 1 &&
                    <Button data-cy="nextButton"
                        disabled={Boolean(errors[name])}
                        onClick={handleNext}
                        variant="outlined">
                        Next
                    </Button>}
                    {index === sections.length - 1 &&
                    <Button data-cy="submitButton"
                        disabled={Boolean(errors[name]) || submitting}
                        type="submit"
                        variant="outlined">
                        {submitting ? "Submitting" : "Submit"}
                    </Button>}
                </div>
            </>
        );

        return content;
    }, [classes.buttons, sections.length, handleBack, handleNext]);

    const renderVertical = useCallback(({handleSubmit, errors, submitError, submitting}) => (
        <form noValidate onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation={stepperOrientation}>
                {sections.map((section, index) => (
                    <Step className={classes.step} key={section.label}>
                        <StepLabel>{section.label}</StepLabel>
                        <StepContent>
                            {renderStepContent(
                                index, section, errors, submitting,
                            )}
                        </StepContent>
                    </Step>))}
            </Stepper>
            {submitError &&
                <div className="error">
                    An error occured while submitting. Try again.
                </div>}
        </form>
    ), [activeStep, renderStepContent, sections, stepperOrientation, classes.step]);

    const renderHorizontal = useCallback(({handleSubmit, errors, submitError, submitting}) => (
        <form noValidate onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation={stepperOrientation}>
                {sections.map(({label}) => (
                    <Step className={classes.step} key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {renderStepContent(
                activeStep, sections[activeStep], errors, submitting,
            )}
            {submitError &&
                <div className="error">
                    An error occured while submitting. Try again.
                </div>}
        </form>
    ), [activeStep, renderStepContent, sections, stepperOrientation, classes.step]);

    return (
        <div className={classes.root}>
            <Typography align="left" className="heading" data-cy="formTitle"
                variant="h3">
                {title}
            </Typography>
            {showReceipt ?
                <Receipt formData={submittedData} format={base} /> :
                <ReactForm initialValues={initialData} onSubmit={submit}
                    render={stepperOrientation === "horizontal" ?
                        renderHorizontal :
                        renderVertical} validate={validate} />}
        </div>
    );
};

export default Form;
